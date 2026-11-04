import type { BibleApiClient } from '../../lib/api/BibleApiClient';
import type { DataBook } from '../../lib/api/types';
import { el } from '../ui';
import { getBookName, getLangByVersion, isNewTestament } from '../../lib/domain/canon';

export async function renderBooksPage(
  root: HTMLElement,
  api: BibleApiClient,
  translationId: string,
  onSelectBook: (bookId: string, bookName: string) => void,
): Promise<void> {
  const languageCode = getLangByVersion(translationId);

  function getBookVisualName(bookId: string): string {
    return getBookName(bookId, languageCode);
  }

  const header = el('div', { className: 'booksHeader' });
  const title = el('h2', { className: 'pageTitle', textContent: 'Livros' });

  const searchContainer = el('div', { className: 'searchContainer' });
  const searchInput = el('input', {
    type: 'text',
    className: 'searchInput',
    placeholder: 'Pesquisar...',
    autocomplete: 'off',
  });
  searchInput.id = 'book-search';
  searchInput.name = 'book-search';
  searchInput.setAttribute('aria-label', 'Pesquisar livro');
  searchContainer.appendChild(searchInput);
  header.appendChild(title);
  header.appendChild(searchContainer);

  const mainContainer = el('div', { className: 'booksMainContainer' });

  const oldTestamentSection = el('div', { className: 'testamentSection' });
  const oldTestamentHeader = el('div', { className: 'testamentHeader' });
  const oldTestamentTitle = el('h3', { className: 'testamentTitle', textContent: 'Antigo Testamento' });
  const oldTestamentLine = el('div', { className: 'testamentDivider' });
  oldTestamentHeader.appendChild(oldTestamentTitle);
  oldTestamentHeader.appendChild(oldTestamentLine);

  const oldTestamentGrid = el('div', { className: 'booksGrid testamentGrid' });
  oldTestamentSection.appendChild(oldTestamentHeader);
  oldTestamentSection.appendChild(oldTestamentGrid);

  const newTestamentSection = el('div', { className: 'testamentSection' });
  const newTestamentHeader = el('div', { className: 'testamentHeader' });
  const newTestamentTitle = el('h3', { className: 'testamentTitle', textContent: 'Novo Testamento' });
  const newTestamentLine = el('div', { className: 'testamentDivider' });
  newTestamentHeader.appendChild(newTestamentTitle);
  newTestamentHeader.appendChild(newTestamentLine);

  const newTestamentGrid = el('div', { className: 'booksGrid testamentGrid' });
  newTestamentSection.appendChild(newTestamentHeader);
  newTestamentSection.appendChild(newTestamentGrid);

  const noResults = el('div', { className: 'placeholder', textContent: 'Nenhum livro encontrado.' });
  noResults.hidden = true;

  mainContainer.appendChild(oldTestamentSection);
  mainContainer.appendChild(newTestamentSection);
  mainContainer.appendChild(noResults);

  root.appendChild(header);
  root.appendChild(mainContainer);

  const footer = el('div', { className: 'appFooter', textContent: 'Desenvolvida por Luis Guilherme Rampaso®' });
  // CC BY 3.0 BR requires crediting the Bíblia Livre; the other texts are credited for transparency.
  footer.appendChild(
    el('div', {
      className: 'appCredits',
      textContent: 'Textos: Almeida (1911), Bíblia Livre (CC BY 3.0 BR) e King James Version.',
    }),
  );
  root.appendChild(footer);

  function renderSkeleton(): void {
    oldTestamentGrid.innerHTML = '';
    newTestamentGrid.innerHTML = '';
    for (let i = 0; i < 20; i++) {
      const sk = el('div', { className: 'bookBtn skeleton' });
      sk.style.height = '40px';
      oldTestamentGrid.appendChild(sk);
    }
    for (let i = 0; i < 10; i++) {
      const sk = el('div', { className: 'bookBtn skeleton' });
      sk.style.height = '40px';
      newTestamentGrid.appendChild(sk);
    }
  }

  renderSkeleton();

  let books: DataBook[] | undefined;
  try {
    const res = await api.getBooks(translationId);
    books = res.books;
  } catch {
    books = undefined;
  }

  if (!books) {
    mainContainer.innerHTML = '';
    mainContainer.appendChild(
      el('div', {
        className: 'placeholder',
        textContent: 'Não foi possível carregar os livros. Verifique sua internet e tente novamente.',
      }),
    );
    return;
  }

  oldTestamentGrid.innerHTML = '';
  newTestamentGrid.innerHTML = '';

  if (books.length === 0) {
    mainContainer.innerHTML = '';
    mainContainer.appendChild(
      el('div', {
        className: 'placeholder',
        textContent: 'Nenhum livro encontrado para esta tradução.',
      }),
    );
    return;
  }

  const oldTestamentBooks: DataBook[] = [];
  const newTestamentBooks: DataBook[] = [];

  for (const book of books) {
    if (isNewTestament(book.id)) {
      newTestamentBooks.push(book);
    } else {
      oldTestamentBooks.push(book);
    }
  }

  await renderBooks(oldTestamentBooks, oldTestamentGrid);
  await renderBooks(newTestamentBooks, newTestamentGrid);

  function renderBooks(booksToRender: DataBook[], container: HTMLElement): void {
    for (const book of booksToRender) {
      const label = getBookVisualName(book.id);
      const btn = el('button', { className: 'bookBtn', type: 'button' });
      const name = el('div', { className: 'bookName', textContent: label });
      btn.appendChild(name);
      btn.addEventListener('click', () => onSelectBook(book.id, label));
      container.appendChild(btn);
    }
  }

  function normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  }

  function searchBooks(booksToSearch: DataBook[], searchTerm: string): DataBook[] {
    if (!searchTerm) return booksToSearch;
    const normalizedSearch = normalizeText(searchTerm);
    const terms = normalizedSearch.split(/\s+/).filter(t => t.length > 0);
    return booksToSearch.filter(book => {
      const localName = normalizeText(getBookVisualName(book.id));
      return terms.every(term => localName.includes(term));
    });
  }

  searchInput.addEventListener('input', (e) => {
    const searchTerm = (e.target as HTMLInputElement).value.trim();
    oldTestamentGrid.innerHTML = '';
    newTestamentGrid.innerHTML = '';
    const oldMatches = searchBooks(oldTestamentBooks, searchTerm);
    const newMatches = searchBooks(newTestamentBooks, searchTerm);
    renderBooks(oldMatches, oldTestamentGrid);
    renderBooks(newMatches, newTestamentGrid);
    oldTestamentSection.hidden = oldMatches.length === 0;
    newTestamentSection.hidden = newMatches.length === 0;
    noResults.hidden = oldMatches.length + newMatches.length > 0;
  });
}
