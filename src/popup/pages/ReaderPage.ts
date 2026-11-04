import type { BibleApiClient } from '../../lib/api/BibleApiClient';
import type { VersesResponse, DataBook } from '../../lib/api/types';
import { copyVerses, el, showToast } from '../ui';
import { settingsGet, settingsRemove, settingsSet } from '../../lib/storage/storage';
import { CHAPTER_COUNTS, getBookName, getLangByVersion } from '../../lib/domain/canon';
import { getVersionShortLabel } from '../../lib/domain/versions';
import { headingsService } from '../../lib/domain/headings';

const SVG_BACK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M15 18l-6-6 6-6"/>' +
  '</svg>';

const SVG_COPY =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
  '<rect x="9" y="9" width="11" height="11" rx="2"/>' +
  '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' +
  '</svg>';

const SVG_PREV =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M15 18l-6-6 6-6"/>' +
  '</svg>';

const SVG_NEXT =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M9 18l6-6-6-6"/>' +
  '</svg>';

type Mark = 'yellow' | 'green' | 'blue' | 'pink';
type PaletteId = Mark | 'none';

const MARK_COLORS: readonly Mark[] = ['yellow', 'green', 'blue', 'pink'];

export async function renderReaderPage(
  root: HTMLElement,
  api: BibleApiClient,
  version: string,
  bookAbbrev: string,
  chapter: number,
  onBack: () => void,
  onNavigateToChapter?: (chapter: number) => void,
  onNavigateToBook?: (bookId: string, bookName: string, chapter?: number) => void,
  onNavigateToBooks?: () => void,
  highlightVerse?: number,
  restoreVerse?: number,
): Promise<void> {
  const languageCode = getLangByVersion(version);
  const versionLabel = getVersionShortLabel(version);

  const selected = new Set<number>();
  const verseTextByNumber = new Map<number, string>();

  const localizedBookName = getBookName(bookAbbrev, languageCode);

  const header = el('div', { className: 'pageHeader' });

  const backBtn = el('button', { className: 'linkBtn', type: 'button' });
  backBtn.innerHTML = SVG_BACK;
  backBtn.setAttribute('aria-label', 'Voltar');
  backBtn.addEventListener('click', onBack);

  const titleContainer = el('div', { className: 'titleContainer' });

  const bookTitle = el('button', {
    className: 'bookTitle',
    type: 'button',
    textContent: localizedBookName,
  });
  bookTitle.setAttribute('aria-label', `${localizedBookName}: ir para a lista de livros`);
  bookTitle.addEventListener('click', () => {
    if (onNavigateToBooks) onNavigateToBooks();
  });

  const chapterNumber = el('button', {
    className: 'chapterNumber',
    type: 'button',
    textContent: String(chapter),
  });
  chapterNumber.setAttribute('aria-label', `Capítulo ${chapter}: ir para a lista de capítulos`);
  chapterNumber.addEventListener('click', onBack);

  titleContainer.appendChild(bookTitle);
  titleContainer.appendChild(chapterNumber);

  header.appendChild(backBtn);
  header.appendChild(titleContainer);
  root.appendChild(header);

  const navArrows = el('div', { className: 'navArrows' });
  const prevChapterBtn = el('button', { className: 'navArrow', type: 'button' });
  prevChapterBtn.setAttribute('aria-label', 'Capítulo anterior');
  prevChapterBtn.innerHTML = SVG_PREV;

  const nextChapterBtn = el('button', { className: 'navArrow', type: 'button' });
  nextChapterBtn.setAttribute('aria-label', 'Próximo capítulo');
  nextChapterBtn.innerHTML = SVG_NEXT;

  navArrows.appendChild(prevChapterBtn);
  navArrows.appendChild(nextChapterBtn);

  const card = el('div', { className: 'readerCard' });
  const container = el('div', { className: 'reader' });
  card.appendChild(container);
  root.appendChild(card);

  const menu = el('div', { className: 'bottomMenu' });
  const palette = el('div', { className: 'bottomPalette' });
  const copyBtn = el('button', { className: 'menuBtn menuBtnPrimary', type: 'button', textContent: 'Copiar' });
  copyBtn.setAttribute('aria-label', 'Copiar seleção ou versículo focado');

  const paletteColors: Array<{ id: PaletteId; label: string }> = [
    { id: 'yellow', label: 'Amarelo' },
    { id: 'green', label: 'Verde' },
    { id: 'blue', label: 'Azul' },
    { id: 'pink', label: 'Rosa' },
    { id: 'none', label: 'Remover' },
  ];

  for (const c of paletteColors) {
    const btn = el('button', { className: `swatch swatch-${c.id}`, type: 'button' });
    btn.setAttribute('aria-label', c.id === 'none' ? 'Remover cor' : `Pintar ${c.label}`);
    palette.appendChild(btn);
  }

  menu.appendChild(palette);
  menu.appendChild(copyBtn);

  // Mount overlays on .contentWrapper — fixed-size containing block for
  // position:absolute, sitting outside the scrollable .content area.
  const wrapper = root.closest('.contentWrapper') as HTMLElement ?? root.closest('.shell') as HTMLElement ?? document.body;
  wrapper.appendChild(navArrows);
  wrapper.appendChild(menu);

  const marks = new Map<number, Mark>();
  const marksKey = `marks:${version}:${bookAbbrev}:${chapter}`;

  let focusedVerse: number | null = null;
  let menuOpen = false;

  function clearSelection(): void {
    for (const n of selected) {
      container.querySelector<HTMLElement>(`#v-${n}`)?.classList.remove('selected');
    }
    selected.clear();
  }

  function applyFocusedVisual(): void {
    container.querySelector<HTMLElement>('.verseRow.focused')?.classList.remove('focused');
    if (focusedVerse == null) return;
    container.querySelector<HTMLElement>(`#v-${focusedVerse}`)?.classList.add('focused');
  }

  function setToolbarVisible(): void {
    if (menuOpen) menu.classList.add('show');
    else menu.classList.remove('show');
  }

  function closeMenu(): void {
    clearSelection();
    menuOpen = false;
    setToolbarVisible();
  }

  function currentTargets(): number[] {
    if (selected.size > 0) return Array.from(selected).sort((a, b) => a - b);
    return focusedVerse == null ? [] : [focusedVerse];
  }

  async function copyTargets(targets: number[]): Promise<void> {
    await copyVerses({
      book: localizedBookName,
      chapter,
      version: versionLabel,
      verses: targets.map((n) => ({ verse: n, text: verseTextByNumber.get(n) ?? '' })),
    });
  }

  async function persistMarks(): Promise<void> {
    if (marks.size === 0) {
      await settingsRemove(marksKey);
      return;
    }
    const obj: Record<string, Mark> = {};
    for (const [k, v] of marks.entries()) {
      obj[String(k)] = v;
    }
    await settingsSet(marksKey, obj);
  }

  async function applyHighlight(targetVerses: number[], color: PaletteId): Promise<void> {
    for (const n of targetVerses) {
      const row = container.querySelector<HTMLElement>(`#v-${n}`);
      if (color === 'none') {
        marks.delete(n);
        row?.removeAttribute('data-mark');
      } else {
        marks.set(n, color);
        row?.setAttribute('data-mark', color);
      }
    }
    await persistMarks();
  }

  palette.querySelectorAll<HTMLButtonElement>('button.swatch').forEach((btn, idx) => {
    const c = paletteColors[idx];
    btn.addEventListener('click', async () => {
      const targets = currentTargets();
      if (targets.length === 0) {
        showToast('Selecione um versículo');
        return;
      }
      try {
        await applyHighlight(targets, c.id);
        closeMenu();
      } catch {
        showToast('Não foi possível salvar a marcação');
      }
    });
  });

  copyBtn.addEventListener('click', async () => {
    const targets = currentTargets();
    if (targets.length === 0) {
      showToast('Selecione um versículo');
      return;
    }
    try {
      await copyTargets(targets);
      showToast('Copiado!');
      closeMenu();
    } catch {
      showToast('Não foi possível copiar');
    }
  });

  async function loadMarks(): Promise<void> {
    const saved = await settingsGet<Record<string, string>>(marksKey);
    marks.clear();
    if (!saved) return;
    for (const [k, v] of Object.entries(saved)) {
      const n = Number(k);
      if (!Number.isFinite(n)) continue;
      if ((MARK_COLORS as readonly string[]).includes(v)) {
        marks.set(n, v as Mark);
      }
    }
  }

  function renderSkeleton(): void {
    container.innerHTML = '';
    for (let i = 0; i < 10; i += 1) {
      const row = el('div', { className: 'verseRow' });
      row.appendChild(el('div', { className: 'skeleton skeletonLine sm' }));
      row.appendChild(el('div', { className: 'skeleton skeletonLine' }));
      container.appendChild(row);
    }
  }

  async function lastChapterOf(bookId: string): Promise<number> {
    try {
      const res = await api.getChapters(version, bookId);
      return res.chapters.length || (CHAPTER_COUNTS[bookId.toUpperCase()] ?? 1);
    } catch {
      return CHAPTER_COUNTS[bookId.toUpperCase()] ?? 1;
    }
  }

  async function load(): Promise<void> {
    const marksPromise = loadMarks().catch(() => undefined);
    renderSkeleton();

    let data: VersesResponse;
    try {
      data = await api.getChapterVerses(version, bookAbbrev, chapter);
    } catch (e) {
      container.innerHTML = '';
      container.appendChild(
        el('div', {
          className: 'errorBox',
          textContent: e instanceof Error ? e.message : 'Falha ao carregar capítulo.',
        }),
      );
      const retryBtn = el('button', { className: 'retryBtn', type: 'button', textContent: 'Tentar novamente' });
      retryBtn.addEventListener('click', load);
      container.appendChild(retryBtn);
      return;
    }

    container.innerHTML = '';
    await marksPromise;
    selected.clear();
    verseTextByNumber.clear();
    focusedVerse = null;
    menuOpen = false;
    setToolbarVisible();

    let totalChapters = 0;
    try {
      const chaptersResponse = await api.getChapters(version, bookAbbrev);
      totalChapters = chaptersResponse.chapters.length;
    } catch {
      // navigation disabled if chapters fail to load
    }

    if (onNavigateToChapter && totalChapters > 0) {
      if (chapter > 1) {
        prevChapterBtn.disabled = false;
        prevChapterBtn.addEventListener('click', () => onNavigateToChapter(chapter - 1));
      } else {
        prevChapterBtn.disabled = true;
      }

      if (chapter < totalChapters) {
        nextChapterBtn.disabled = false;
        nextChapterBtn.addEventListener('click', () => onNavigateToChapter(chapter + 1));
      } else {
        nextChapterBtn.disabled = true;
      }
    } else {
      prevChapterBtn.disabled = true;
      nextChapterBtn.disabled = true;
    }

    let allBooks: DataBook[] = [];
    try {
      const booksResponse = await api.getBooks(version);
      allBooks = booksResponse.books;
    } catch {
      allBooks = [];
    }

    if (onNavigateToBook && allBooks.length > 0) {
      const currentIndex = allBooks.findIndex((b) => b.id === bookAbbrev);

      if (chapter === 1 && currentIndex > 0) {
        const prevBook = allBooks[currentIndex - 1];
        prevChapterBtn.disabled = false;
        prevChapterBtn.setAttribute('aria-label', 'Livro anterior');
        prevChapterBtn.addEventListener('click', async () => {
          onNavigateToBook(prevBook.id, prevBook.name, await lastChapterOf(prevBook.id));
        });
      }

      if (chapter === totalChapters && currentIndex < allBooks.length - 1) {
        const nextBook = allBooks[currentIndex + 1];
        nextChapterBtn.disabled = false;
        nextChapterBtn.setAttribute('aria-label', 'Próximo livro');
        nextChapterBtn.addEventListener('click', () => {
          onNavigateToBook(nextBook.id, nextBook.name);
        });
      }
    }

    await headingsService.loadHeadings();
    const langCode = languageCode === 'pt-br' ? 'pt' : languageCode;
    const allHeadings = headingsService.getAllHeadingsForChapter(bookAbbrev, chapter, langCode as 'pt' | 'en');
    const processedHeadings = new Set<number>();

    if (!data.verses || data.verses.length === 0) {
      container.appendChild(
        el('div', {
          className: 'placeholder',
          textContent: 'Nenhum versículo encontrado para este capítulo.',
        }),
      );
      return;
    }

    for (const v of data.verses) {
      const heading = allHeadings.find((h) => h.verse === v.verse);
      if (heading && !processedHeadings.has(v.verse)) {
        processedHeadings.add(v.verse);
        container.appendChild(el('div', { className: 'subtitleRow', textContent: heading.title }));
      }

      const row = el('div', { className: 'verseRow', id: `v-${v.verse}` });
      row.tabIndex = 0;
      const numBtn = el('button', { className: 'verseNum', type: 'button', textContent: String(v.verse) });
      numBtn.tabIndex = -1;
      numBtn.setAttribute('aria-label', `Copiar versículo ${v.verse}`);
      const mid = el('div', { className: 'verseMid' });
      const text = el('div', { className: 'verseText', textContent: v.text.trim() });
      const cpBtn = el('button', { className: 'copyBtn', type: 'button' });
      cpBtn.tabIndex = -1;

      verseTextByNumber.set(v.verse, v.text);
      cpBtn.innerHTML = SVG_COPY;
      cpBtn.setAttribute('aria-label', `Copiar versículo ${localizedBookName} ${chapter}:${v.verse}`);

      async function copySingle(ev: Event): Promise<void> {
        ev.stopPropagation();
        try {
          await copyTargets([v.verse]);
          showToast('Copiado!');
        } catch {
          showToast('Não foi possível copiar');
        }
      }

      numBtn.addEventListener('click', copySingle);
      cpBtn.addEventListener('click', copySingle);

      function toggleRow(): void {
        focusedVerse = v.verse;
        applyFocusedVisual();

        if (row.classList.contains('selected')) {
          row.classList.remove('selected');
          selected.delete(v.verse);
          if (selected.size === 0) {
            menuOpen = false;
            setToolbarVisible();
          }
        } else {
          row.classList.add('selected');
          selected.add(v.verse);
          menuOpen = true;
          setToolbarVisible();
        }
      }

      row.addEventListener('click', toggleRow);
      row.addEventListener('keydown', (ev) => {
        if (ev.target !== row) return;
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          toggleRow();
        }
      });

      const existingMark = marks.get(v.verse);
      if (existingMark) {
        row.setAttribute('data-mark', existingMark);
      }

      mid.appendChild(text);
      row.appendChild(numBtn);
      row.appendChild(mid);
      row.appendChild(cpBtn);
      container.appendChild(row);
    }

    setToolbarVisible();

    // Coming from search: bring the verse into view and mark it.
    if (highlightVerse !== undefined) {
      const target = container.querySelector<HTMLElement>(`#v-${highlightVerse}`);
      if (target) {
        focusedVerse = highlightVerse;
        applyFocusedVisual();
        target.classList.add('flash');
        target.scrollIntoView({ block: 'center' });
      }
    } else if (restoreVerse !== undefined) {
      // Reopened where the reader left off: put that verse back at the top, no highlight.
      container.querySelector<HTMLElement>(`#v-${restoreVerse}`)?.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }

  await load();
}
