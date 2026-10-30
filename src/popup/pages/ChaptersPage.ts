import type { BibleApiClient } from '../../lib/api/BibleApiClient';
import { el } from '../ui';
import { getBookName, getLangByVersion } from '../../lib/domain/canon';

const SVG_BACK =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M15 18l-6-6 6-6"/>' +
  '</svg>';

export async function renderChaptersPage(
  root: HTMLElement,
  api: BibleApiClient,
  translationId: string,
  bookId: string,
  currentChapter: number | undefined,
  onBack: () => void,
  onSelectChapter: (chapter: number) => void,
): Promise<void> {
  const languageCode = getLangByVersion(translationId);

  function getBookVisualName(id: string): string {
    return getBookName(id, languageCode);
  }

  const localizedBookName = getBookVisualName(bookId);

  const header = el('div', { className: 'pageHeader' });
  const backBtn = el('button', { className: 'linkBtn', type: 'button' });
  backBtn.innerHTML = SVG_BACK;
  backBtn.setAttribute('aria-label', 'Voltar');
  backBtn.addEventListener('click', onBack);

  const title = el('h2', { className: 'pageTitle', textContent: localizedBookName });
  header.appendChild(backBtn);
  header.appendChild(title);
  root.appendChild(header);

  const grid = el('div', { className: 'chaptersGrid' });
  root.appendChild(grid);

  function renderSkeleton(): void {
    grid.innerHTML = '';
    for (let i = 0; i < 24; i += 1) {
      grid.appendChild(el('div', { className: 'chapterBtn skeleton' }));
    }
  }

  async function load(): Promise<void> {
    renderSkeleton();

    let chapterNumbers: number[] = [];
    try {
      const res = await api.getChapters(translationId, bookId);
      chapterNumbers = res.chapters.map((c) => c.chapter);
    } catch {
      chapterNumbers = [];
    }

    grid.innerHTML = '';

    if (chapterNumbers.length === 0) {
      const retryBtn = el('button', { className: 'retryBtn', type: 'button', textContent: 'Tentar novamente' });
      retryBtn.addEventListener('click', load);
      grid.appendChild(
        el('div', {
          className: 'placeholder chaptersError',
          textContent: 'Não foi possível carregar os capítulos.',
        }),
      );
      grid.appendChild(retryBtn);
      return;
    }

    for (const ch of chapterNumbers) {
      const btn = el('button', {
        className: `chapterBtn${currentChapter === ch ? ' active' : ''}`,
        type: 'button',
        textContent: String(ch),
      });
      btn.addEventListener('click', () => onSelectChapter(ch));
      grid.appendChild(btn);
    }
  }

  await load();
}
