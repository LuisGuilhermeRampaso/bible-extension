import type { BibleApiClient } from '../../lib/api/BibleApiClient';
import { getBookName, getLangByVersion } from '../../lib/domain/canon';
import {
  chapterCount,
  parseReference,
  searchTerms,
  searchVerses,
  type ParsedReference,
  type SearchCorpus,
  type VerseHit,
} from '../../lib/domain/search';
import { clear, el } from '../ui';

const SVG_BACK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M15 18l-6-6 6-6"/>' +
  '</svg>';

const RESULT_LIMIT = 100;
const SNIPPET_BEFORE = 50;
const SNIPPET_LENGTH = 170;
const DEBOUNCE_MS = 150;

export function renderSearchPage(
  root: HTMLElement,
  api: BibleApiClient,
  version: string,
  onBack: () => void,
  onOpenVerse: (bookId: string, chapter: number, verse?: number) => void,
  onOpenBook: (bookId: string) => void,
): void {
  const language = getLangByVersion(version);

  const header = el('div', { className: 'pageHeader' });
  const backBtn = el('button', { className: 'linkBtn', type: 'button' });
  backBtn.innerHTML = SVG_BACK;
  backBtn.setAttribute('aria-label', 'Voltar');
  backBtn.addEventListener('click', onBack);

  const searchContainer = el('div', { className: 'searchContainer searchContainerWide' });
  const input = el('input', {
    type: 'search',
    className: 'searchInput',
    placeholder: 'Jo 3:16 ou uma palavra',
    autocomplete: 'off',
  });
  input.id = 'global-search';
  input.name = 'global-search';
  input.setAttribute('aria-label', 'Buscar na Bíblia');
  searchContainer.appendChild(input);

  header.appendChild(backBtn);
  header.appendChild(searchContainer);

  const status = el('div', { className: 'searchStatus' });
  status.setAttribute('role', 'status');
  const results = el('div', { className: 'searchResults' });

  root.appendChild(header);
  root.appendChild(status);
  root.appendChild(results);

  // Starts loading the whole-Bible text while the user is still typing.
  const corpusPromise: Promise<SearchCorpus> = api.getSearchCorpus(version);
  corpusPromise.catch(() => undefined);

  function bookName(bookId: string): string {
    return getBookName(bookId, language);
  }

  function referenceLabel(ref: ParsedReference): string {
    let label = bookName(ref.bookId);
    if (ref.chapter !== undefined) label += ` ${ref.chapter}`;
    if (ref.verseStart !== undefined) {
      label += `:${ref.verseStart}`;
      if (ref.verseEnd !== undefined) label += `–${ref.verseEnd}`;
    }
    return label;
  }

  function referenceItem(ref: ParsedReference): HTMLElement | null {
    const max = chapterCount(ref.bookId);

    if (ref.chapter === undefined) {
      const btn = el('button', { className: 'searchResult searchGoto', type: 'button' });
      btn.appendChild(el('span', { className: 'searchRef', textContent: `Abrir ${bookName(ref.bookId)}` }));
      btn.addEventListener('click', () => onOpenBook(ref.bookId));
      return btn;
    }

    if (ref.chapter < 1 || ref.chapter > max) {
      return el('div', {
        className: 'placeholder',
        textContent: `${bookName(ref.bookId)} tem ${max} ${max === 1 ? 'capítulo' : 'capítulos'}.`,
      });
    }

    const chapter = ref.chapter;
    const btn = el('button', { className: 'searchResult searchGoto', type: 'button' });
    btn.appendChild(el('span', { className: 'searchRef', textContent: `Ir para ${referenceLabel(ref)}` }));
    btn.addEventListener('click', () => onOpenVerse(ref.bookId, chapter, ref.verseStart));
    return btn;
  }

  /** Text around the first match, with every match wrapped in <mark>. */
  function snippet(hit: VerseHit): HTMLElement {
    const box = el('span', { className: 'searchText' });
    const first = hit.ranges[0]?.[0] ?? 0;
    const start = first > SNIPPET_BEFORE + 10 ? first - SNIPPET_BEFORE : 0;
    const end = Math.min(hit.text.length, start + SNIPPET_LENGTH);

    if (start > 0) box.append('… ');
    let cursor = start;
    for (const [from, to] of hit.ranges) {
      if (to <= cursor || from >= end) continue;
      const markFrom = Math.max(from, cursor);
      const markTo = Math.min(to, end);
      if (markFrom > cursor) box.append(hit.text.slice(cursor, markFrom));
      box.appendChild(el('mark', { textContent: hit.text.slice(markFrom, markTo) }));
      cursor = markTo;
    }
    if (cursor < end) box.append(hit.text.slice(cursor, end));
    if (end < hit.text.length) box.append(' …');
    return box;
  }

  function resultItem(hit: VerseHit): HTMLElement {
    const btn = el('button', { className: 'searchResult', type: 'button' });
    btn.appendChild(
      el('span', { className: 'searchRef', textContent: `${bookName(hit.bookId)} ${hit.chapter}:${hit.verse}` }),
    );
    btn.appendChild(snippet(hit));
    btn.addEventListener('click', () => onOpenVerse(hit.bookId, hit.chapter, hit.verse));
    return btn;
  }

  function setStatus(text: string): void {
    status.textContent = text;
  }

  let requestId = 0;

  async function runSearch(): Promise<void> {
    const id = ++requestId;
    // Untrimmed for the search itself: a trailing space tells it the last word is finished.
    const raw = input.value;
    const query = raw.trim();
    clear(results);

    if (!query) {
      setStatus('Digite uma referência (Jo 3:16, 1co 13, sl 23) ou uma palavra.');
      return;
    }

    const ref = parseReference(query);
    if (ref) {
      const item = referenceItem(ref);
      if (item) results.appendChild(item);
      if (ref.chapter !== undefined) {
        setStatus('');
        return;
      }
    }

    if (searchTerms(query).length === 0) {
      setStatus(ref ? '' : 'Digite ao menos 2 letras.');
      return;
    }

    setStatus('Buscando…');
    let corpus: SearchCorpus;
    try {
      corpus = await corpusPromise;
    } catch {
      if (id !== requestId) return;
      setStatus('A busca por palavra só está disponível para as versões embutidas.');
      return;
    }
    if (id !== requestId) return;

    const { hits, total } = searchVerses(corpus, raw, RESULT_LIMIT);
    for (const hit of hits) results.appendChild(resultItem(hit));

    if (total === 0) setStatus('Nenhum versículo encontrado.');
    else if (total > hits.length) setStatus(`${total} versículos. Mostrando os ${hits.length} primeiros; refine a busca.`);
    else setStatus(`${total} ${total === 1 ? 'versículo' : 'versículos'}.`);
  }

  let timer: number | undefined;
  input.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => void runSearch(), DEBOUNCE_MS);
  });

  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      window.clearTimeout(timer);
      void runSearch().then(() => results.querySelector<HTMLButtonElement>('button.searchResult')?.click());
    }
  });

  setStatus('Digite uma referência (Jo 3:16, 1co 13, sl 23) ou uma palavra.');
  input.focus();
}
