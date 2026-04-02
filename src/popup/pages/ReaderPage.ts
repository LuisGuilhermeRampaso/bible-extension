import type { BibleApiClient } from '../../lib/api/BibleApiClient';
import type { VersesResponse, DataBook } from '../../lib/api/types';
import { copyToClipboard, copyVerse, el, formatRef, showToast } from '../ui';
import { settingsGet, settingsSet } from '../../lib/storage/storage';
import { getLangByVersion } from '../../lib/domain/canon';
import { headingsService } from '../../lib/domain/headings';

export async function renderReaderPage(
  root: HTMLElement,
  api: BibleApiClient,
  version: string,
  bookAbbrev: string,
  chapter: number,
  onBack: () => void,
  onNavigateToChapter?: (chapter: number) => void,
  onNavigateToBook?: (bookId: string, bookName: string) => void,
  onNavigateToBooks?: () => void,
): Promise<void> {
  console.log('renderReaderPage called with:', { version, bookAbbrev, chapter });
  
  // Detectar idioma da versão
  const languageCode = getLangByVersion(version);
  
  // Mapeamento visual fixo dos IDs para nomes em português
  const bookNamesPT: Record<string, string> = {
    // Antigo Testamento
    'GEN': 'Gênesis', 'EXO': 'Êxodo', 'LEV': 'Levítico', 'NUM': 'Números', 'DEU': 'Deuteronômio',
    'JOS': 'Josué', 'JDG': 'Juízes', 'RUT': 'Rute', '1SA': '1 Samuel', '2SA': '2 Samuel',
    '1KI': '1 Reis', '2KI': '2 Reis', '1CH': '1 Crônicas', '2CH': '2 Crônicas', 'EZR': 'Esdras',
    'NEH': 'Neemias', 'EST': 'Ester', 'JOB': 'Jó', 'PSA': 'Salmos', 'PRO': 'Provérbios',
    'ECC': 'Eclesiastes', 'SNG': 'Cânticos', 'ISA': 'Isaías', 'JER': 'Jeremias', 'LAM': 'Lamentações',
    'EZK': 'Ezequiel', 'DAN': 'Daniel', 'HOS': 'Oséias', 'JOL': 'Joel', 'AMO': 'Amós',
    'OBA': 'Obadias', 'JON': 'Jonas', 'MIC': 'Miqueias', 'NAM': 'Naum', 'HAB': 'Habacuque',
    'ZEP': 'Sofonias', 'HAG': 'Ageu', 'ZEC': 'Zacarias', 'MAL': 'Malaquias',
    
    // Novo Testamento
    'MAT': 'Mateus', 'MRK': 'Marcos', 'LUK': 'Lucas', 'JHN': 'João', 'ACT': 'Atos',
    'ROM': 'Romanos', '1CO': '1 Coríntios', '2CO': '2 Coríntios', 'GAL': 'Gálatas', 'EPH': 'Efésios',
    'PHP': 'Filipenses', 'COL': 'Colossenses', '1TH': '1 Tessalonicenses', '2TH': '2 Tessalonicenses',
    '1TI': '1 Timóteo', '2TI': '2 Timóteo', 'TIT': 'Tito', 'PHM': 'Filemom', 'HEB': 'Hebreus',
    'JAS': 'Tiago', '1PE': '1 Pedro', '2PE': '2 Pedro', '1JN': '1 João', '2JN': '2 João',
    '3JN': '3 João', 'JUD': 'Judas', 'REV': 'Apocalipse'
  };

  // Mapeamento visual fixo dos IDs para nomes em inglês
  const bookNamesEN: Record<string, string> = {
    // Antigo Testamento
    'GEN': 'Genesis', 'EXO': 'Exodus', 'LEV': 'Leviticus', 'NUM': 'Numbers', 'DEU': 'Deuteronomy',
    'JOS': 'Joshua', 'JDG': 'Judges', 'RUT': 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel',
    '1KI': '1 Kings', '2KI': '2 Kings', '1CH': '1 Chronicles', '2CH': '2 Chronicles', 'EZR': 'Ezra',
    'NEH': 'Nehemiah', 'EST': 'Esther', 'JOB': 'Job', 'PSA': 'Psalms', 'PRO': 'Proverbs',
    'ECC': 'Ecclesiastes', 'SNG': 'Song of Songs', 'ISA': 'Isaiah', 'JER': 'Jeremiah', 'LAM': 'Lamentations',
    'EZK': 'Ezekiel', 'DAN': 'Daniel', 'HOS': 'Hosea', 'JOL': 'Joel', 'AMO': 'Amos',
    'OBA': 'Obadiah', 'JON': 'Jonah', 'MIC': 'Micah', 'NAM': 'Nahum', 'HAB': 'Habakkuk',
    'ZEP': 'Zephaniah', 'HAG': 'Haggai', 'ZEC': 'Zechariah', 'MAL': 'Malachi',
    
    // Novo Testamento
    'MAT': 'Matthew', 'MRK': 'Mark', 'LUK': 'Luke', 'JHN': 'John', 'ACT': 'Acts',
    'ROM': 'Romans', '1CO': '1 Corinthians', '2CO': '2 Corinthians', 'GAL': 'Galatians', 'EPH': 'Ephesians',
    'PHP': 'Philippians', 'COL': 'Colossians', '1TH': '1 Thessalonians', '2TH': '2 Thessalonians',
    '1TI': '1 Timothy', '2TI': '2 Timothy', 'TIT': 'Titus', 'PHM': 'Philemon', 'HEB': 'Hebrews',
    'JAS': 'James', '1PE': '1 Peter', '2PE': '2 Peter', '1JN': '1 John', '2JN': '2 John',
    '3JN': '3 John', 'JUD': 'Jude', 'REV': 'Revelation'
  };

  // Selecionar mapeamento baseado no idioma
  const bookNamesMap = (languageCode === 'en') ? bookNamesEN : bookNamesPT;

  // Função para obter nome visual do livro
  function getBookVisualName(bookId: string): string {
    return bookNamesMap[bookId] || bookId; // Fallback para o ID se não encontrar
  }

  const selected = new Set<number>();
  const verseTextByNumber = new Map<number, string>();

  const localizedBookName = getBookVisualName(bookAbbrev);
  const localizedBookAbbrev = bookAbbrev; // Usar ID como abreviação

  const header = el('div', { className: 'pageHeader' });
  
  // Back button on the left
  const backBtn = el('button', { className: 'linkBtn', type: 'button' });
  backBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
  backBtn.addEventListener('click', onBack);

  // Center container for book name and chapter
  const titleContainer = el('div', { className: 'titleContainer' });
  
  // Book name - clickable to go to books list
  const bookTitle = el('button', { 
    className: 'bookTitle', 
    type: 'button',
    textContent: localizedBookName
  });
  bookTitle.addEventListener('click', () => {
    if (onNavigateToBooks) {
      onNavigateToBooks();
    }
  });

  // Chapter number - clickable to go to chapters list
  const chapterNumber = el('button', { 
    className: 'chapterNumber', 
    type: 'button',
    textContent: String(chapter)
  });
  chapterNumber.addEventListener('click', onBack);

  titleContainer.appendChild(bookTitle);
  titleContainer.appendChild(chapterNumber);

  header.appendChild(backBtn);
  header.appendChild(titleContainer);
  root.appendChild(header);

  // Navigation arrows for chapter navigation
  const navArrows = el('div', { className: 'navArrows' });
  
  const prevChapterBtn = el('button', { className: 'navArrow', type: 'button' });
  prevChapterBtn.setAttribute('aria-label', 'Capítulo anterior');
  prevChapterBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
  
  const nextChapterBtn = el('button', { className: 'navArrow', type: 'button' });
  nextChapterBtn.setAttribute('aria-label', 'Próximo capítulo');
  nextChapterBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  
  navArrows.appendChild(prevChapterBtn);
  navArrows.appendChild(nextChapterBtn);
  root.appendChild(navArrows);

  const card = el('div', { className: 'readerCard' });
  const container = el('div', { className: 'reader' });
  card.appendChild(container);
  root.appendChild(card);

  type Mark = 'yellow' | 'green' | 'blue' | 'pink' | 'none';

  const menu = el('div', { className: 'bottomMenu' });
  const palette = el('div', { className: 'bottomPalette' });
  const copyBtn = el('button', { className: 'menuBtn menuBtnPrimary', type: 'button', textContent: 'Copiar' });
  copyBtn.setAttribute('aria-label', 'Copiar seleção ou versículo focado');

  const paletteColors: Array<{ id: Mark; label: string }> = [
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
  root.appendChild(menu);

  const marks = new Map<number, Mark>();
  const marksKey = `marks:${version}:${bookAbbrev}:${chapter}`;

  let focusedVerse: number | null = null;
  let menuOpen = false;

  function clearSelection(): void {
    for (const n of selected) {
      const row = container.querySelector<HTMLElement>(`#v-${n}`);
      row?.classList.remove('selected');
    }
    selected.clear();
  }

  function applyFocusedVisual(): void {
    const prev = container.querySelector<HTMLElement>('.verseRow.focused');
    prev?.classList.remove('focused');
    if (focusedVerse == null) return;
    const row = container.querySelector<HTMLElement>(`#v-${focusedVerse}`);
    row?.classList.add('focused');
  }

  function setToolbarVisible(): void {
    if (menuOpen) menu.classList.add('show');
    else menu.classList.remove('show');
  }

  async function applyHighlight(targetVerses: number[], color: Mark): Promise<void> {
    for (const n of targetVerses) {
      marks.set(n, color);
      const row = container.querySelector<HTMLElement>(`#v-${n}`);
      if (color === 'none') row?.removeAttribute('data-mark');
      else row?.setAttribute('data-mark', color);
    }
    await persistMarks();
    setToolbarVisible();
  }

  palette.querySelectorAll<HTMLButtonElement>('button.swatch').forEach((btn, idx) => {
    const c = paletteColors[idx];
    btn.addEventListener('click', async () => {
      const targets = selected.size > 0 ? Array.from(selected).sort((a, b) => a - b) : (focusedVerse == null ? [] : [focusedVerse]);
      if (targets.length === 0) {
        showToast('Selecione um versículo');
        return;
      }
      try {
        await applyHighlight(targets, c.id);
        clearSelection();
        menuOpen = false;
        setToolbarVisible();
      } catch {
        showToast('Não foi possível pintar');
      }
    });
  });

  function isContiguous(sorted: number[]): boolean {
    for (let i = 1; i < sorted.length; i += 1) {
      if (sorted[i] !== sorted[i - 1] + 1) return false;
    }
    return true;
  }

  copyBtn.addEventListener('click', async () => {
    const refBook = localizedBookName;
    const verses = Array.from(selected.values()).sort((a, b) => a - b);
    const targetSingle = focusedVerse;

    try {
      if (verses.length > 0) {
        const start = verses[0];
        const end = verses[verses.length - 1];
        const textLines = verses.map((n) => (verseTextByNumber.get(n) ?? '').trim()).filter(Boolean);
        const range = start === end ? `${chapter}:${start}` : `${chapter}:${start}–${end}`;
        const baseRef = `${refBook} ${range} (${version})`;

        const payload = (() => {
          if (isContiguous(verses)) {
            return `${textLines.join('\n')}\n\n${baseRef}`;
          }
          const refs = verses.map((n) => `${refBook} ${chapter}:${n}`).join(', ');
          return `${textLines.join('\n')}\n\n${baseRef}\n${refs}`;
        })();

        await copyToClipboard(payload);
        showToast('Copiado!');
        clearSelection();
        menuOpen = false;
        setToolbarVisible();
        return;
      }

      if (targetSingle != null) {
        await copyVerse({
          book: refBook,
          chapter,
          verse: targetSingle,
          text: verseTextByNumber.get(targetSingle) ?? '',
          version,
        });
        showToast('Copiado!');
        clearSelection();
        menuOpen = false;
        setToolbarVisible();
        return;
      }

      showToast('Selecione um versículo');
    } catch {
      showToast('Não foi possível copiar');
    }
  });

  async function loadMarks(): Promise<void> {
    const saved = await settingsGet<Record<string, Mark>>(marksKey);
    marks.clear();
    if (!saved) return;
    for (const [k, v] of Object.entries(saved)) {
      const n = Number(k);
      if (!Number.isFinite(n)) continue;
      if (v === 'yellow' || v === 'green' || v === 'blue' || v === 'pink' || v === 'none') {
        marks.set(n, v);
      }
    }
  }

  async function persistMarks(): Promise<void> {
    const obj: Record<string, Mark> = {};
    for (const [k, v] of marks.entries()) {
      obj[String(k)] = v;
    }
    await settingsSet(marksKey, obj);
  }

  function renderSkeleton(): void {
    container.innerHTML = '';
    for (let i = 0; i < 10; i += 1) {
      const row = el('div', { className: 'verseRow' });
      const num = el('div', { className: 'skeleton skeletonLine sm' });
      const line = el('div', { className: 'skeleton skeletonLine' });
      const icon = el('div', { className: 'skeleton skeletonLine sm' });
      row.appendChild(num);
      row.appendChild(line);
      row.appendChild(icon);
      container.appendChild(row);
    }
  }

  async function load(): Promise<void> {
    const marksPromise = loadMarks().catch(() => undefined);
    renderSkeleton();
    let data: VersesResponse;
    try {
      data = await api.getChapterVerses(version, bookAbbrev, chapter);
    } catch (e) {
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

    // Load chapters for navigation
    let totalChapters = 0;
    try {
      const chaptersResponse = await api.getChapters(version, bookAbbrev);
      totalChapters = chaptersResponse.chapters.length;
    } catch (e) {
      console.error('Failed to load chapters for navigation:', e);
    }

    // Setup navigation handlers
    if (onNavigateToChapter && totalChapters > 0) {
      if (chapter > 1) {
        prevChapterBtn.disabled = false;
        prevChapterBtn.addEventListener('click', () => {
          onNavigateToChapter(chapter - 1);
          // Force scroll to top immediately
          window.scrollTo(0, 0);
          container.scrollTop = 0;
        });
      } else {
        prevChapterBtn.disabled = true;
      }

      if (chapter < totalChapters) {
        nextChapterBtn.disabled = false;
        nextChapterBtn.addEventListener('click', () => {
          onNavigateToChapter(chapter + 1);
          // Force scroll to top immediately
          window.scrollTo(0, 0);
          container.scrollTop = 0;
        });
      } else {
        nextChapterBtn.disabled = true;
      }
    } else {
      prevChapterBtn.disabled = true;
      nextChapterBtn.disabled = true;
    }

    // Load books for book navigation
    let allBooks: DataBook[] = [];
    try {
      const booksResponse = await api.getBooks(version);
      allBooks = booksResponse.books;
    } catch {
      allBooks = [];
    }

    // Setup cross-book navigation
    if (onNavigateToBook && allBooks.length > 0) {
      const currentIndex = allBooks.findIndex(b => b.id === bookAbbrev);
      
      // Change prevChapterBtn to navigate to previous book when at chapter 1
      if (chapter === 1 && currentIndex > 0) {
        const prevBook = allBooks[currentIndex - 1];
        prevChapterBtn.disabled = false;
        prevChapterBtn.setAttribute('aria-label', 'Livro anterior');
        prevChapterBtn.addEventListener('click', () => {
          onNavigateToBook(prevBook.id, prevBook.name);
        });
      }
      
      // Change nextChapterBtn to navigate to next book when at last chapter
      if (chapter === totalChapters && currentIndex < allBooks.length - 1) {
        const nextBook = allBooks[currentIndex + 1];
        nextChapterBtn.disabled = false;
        nextChapterBtn.setAttribute('aria-label', 'Próximo livro');
        nextChapterBtn.addEventListener('click', () => {
          onNavigateToBook(nextBook.id, nextBook.name);
        });
      }
    }

    // Carregar headings para subtítulos
    await headingsService.loadHeadings();
    
    // Debug: verificar se o livro tem headings
    console.log('Book:', bookAbbrev, 'Chapter:', chapter, 'Language:', languageCode);
    console.log('Has headings for book:', headingsService.hasHeadingsForBook(bookAbbrev));
    console.log('Has headings for chapter:', headingsService.hasHeadingsForChapter(bookAbbrev, chapter));
    
    // Obter todos os headings para este capítulo
    // Converter pt-br para pt para o JSON
    const langCode = languageCode === 'pt-br' ? 'pt' : languageCode;
    const allHeadings = headingsService.getAllHeadingsForChapter(bookAbbrev, chapter, langCode as 'pt' | 'en');
    console.log('All headings:', allHeadings);
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
      // Verificar se há um heading para este versículo
      const heading = allHeadings.find(h => h.verse === v.verse);
      if (heading && !processedHeadings.has(v.verse)) {
        processedHeadings.add(v.verse);
        
        // Criar elemento de subtítulo
        const subtitleRow = el('div', { 
          className: 'subtitleRow',
          textContent: heading.title
        });
        container.appendChild(subtitleRow);
        console.log('Added subtitle:', heading.title, 'for verse', v.verse);
      }

      const row = el('div', { className: 'verseRow', id: `v-${v.verse}` });
      const numBtn = el('button', { className: 'verseNum', type: 'button', textContent: String(v.verse) });
      const mid = el('div', { className: 'verseMid' });
      const text = el('div', { className: 'verseText', textContent: v.text.trim() });
      const copyBtn = el('button', { className: 'copyBtn', type: 'button' });

      verseTextByNumber.set(v.verse, v.text);
      copyBtn.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<rect x="9" y="9" width="12" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="2" />' +
        '<rect x="3" y="3" width="12" height="12" rx="3" fill="none" stroke="currentColor" stroke-width="2" opacity="0.9" />' +
        '</svg>';
      copyBtn.setAttribute(
        'aria-label',
        `Copiar versículo ${localizedBookName} ${chapter}:${v.verse}`,
      );

      numBtn.addEventListener('click', async (ev) => {
        // keep existing behavior (copy ref) without toggling selection
        ev.stopPropagation();
        const ref = formatRef(localizedBookAbbrev, chapter, v.verse, version);
        await copyToClipboard(`${ref} — ${v.text.trim()}`);
        showToast('Copiado');
      });

      copyBtn.addEventListener('click', async (ev) => {
        ev.stopPropagation();
        try {
          await copyVerse({
            book: localizedBookName,
            chapter,
            verse: v.verse,
            text: v.text,
            version,
          });
          showToast('Copiado!');
        } catch {
          showToast('Não foi possível copiar');
        }
      });
      row.addEventListener('click', () => {
        focusedVerse = v.verse;
        applyFocusedVisual();

        const isSel = row.classList.contains('selected');
        if (isSel) {
          row.classList.remove('selected');
          selected.delete(v.verse);
          
          // Close menu if no verses are selected
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
      });

      const existingMark = marks.get(v.verse);
      if (existingMark && existingMark !== 'none') {
        row.setAttribute('data-mark', existingMark);
      }

      mid.appendChild(text);

      row.appendChild(numBtn);
      row.appendChild(mid);
      row.appendChild(copyBtn);
      container.appendChild(row);
    }

    setToolbarVisible();
  }

  await load();
}
