import type { BibleApiClient } from '../../lib/api/BibleApiClient';
import type { DataBook } from '../../lib/api/types';
import { el } from '../ui';
import { getLangByVersion } from '../../lib/domain/canon';

export async function renderBooksPage(
  root: HTMLElement,
  api: BibleApiClient,
  translationId: string,
  onSelectBook: (bookId: string, bookName: string) => void,
): Promise<void> {
  // Detectar idioma da versão
  const languageCode = getLangByVersion(translationId);
  
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
  // Header com título e pesquisa
  const header = el('div', { className: 'booksHeader' });
  
  const title = el('h2', { className: 'pageTitle', textContent: 'Livros' });
  
  // Container da pesquisa
  const searchContainer = el('div', { className: 'searchContainer' });
  const searchInput = el('input', {
    type: 'text',
    className: 'searchInput',
    placeholder: 'Pesquisar livro...',
    autocomplete: 'off',
  });
  
  searchContainer.appendChild(searchInput);
  header.appendChild(title);
  header.appendChild(searchContainer);
  
  // Container principal dos livros
  const mainContainer = el('div', { className: 'booksMainContainer' });
  
  // Seção Antigo Testamento
  const oldTestamentSection = el('div', { className: 'testamentSection' });
  const oldTestamentHeader = el('div', { className: 'testamentHeader' });
  const oldTestamentTitle = el('h3', { className: 'testamentTitle', textContent: 'Antigo Testamento' });
  const oldTestamentLine = el('div', { className: 'testamentDivider' });
  oldTestamentHeader.appendChild(oldTestamentTitle);
  oldTestamentHeader.appendChild(oldTestamentLine);
  
  const oldTestamentGrid = el('div', { className: 'booksGrid testamentGrid' });
  oldTestamentSection.appendChild(oldTestamentHeader);
  oldTestamentSection.appendChild(oldTestamentGrid);
  
  // Seção Novo Testamento
  const newTestamentSection = el('div', { className: 'testamentSection' });
  const newTestamentHeader = el('div', { className: 'testamentHeader' });
  const newTestamentTitle = el('h3', { className: 'testamentTitle', textContent: 'Novo Testamento' });
  const newTestamentLine = el('div', { className: 'testamentDivider' });
  newTestamentHeader.appendChild(newTestamentTitle);
  newTestamentHeader.appendChild(newTestamentLine);
  
  const newTestamentGrid = el('div', { className: 'booksGrid testamentGrid' });
  newTestamentSection.appendChild(newTestamentHeader);
  newTestamentSection.appendChild(newTestamentGrid);
  
  mainContainer.appendChild(oldTestamentSection);
  mainContainer.appendChild(newTestamentSection);
  
  // Montar a página
  root.appendChild(header);
  root.appendChild(mainContainer);

  // Adicionar rodapé com assinatura
  const footer = el('div', { className: 'appFooter', textContent: 'Desenvolvida por Guilherme Rampazo®' });
  root.appendChild(footer);

  function renderSkeleton(): void {
    oldTestamentGrid.innerHTML = '';
    newTestamentGrid.innerHTML = '';
    
    // Skeleton para Antigo Testamento
    for (let i = 0; i < 20; i++) {
      const sk = el('div', { className: 'bookBtn skeleton' });
      sk.style.height = '64px';
      oldTestamentGrid.appendChild(sk);
    }
    
    // Skeleton para Novo Testamento
    for (let i = 0; i < 10; i++) {
      const sk = el('div', { className: 'bookBtn skeleton' });
      sk.style.height = '64px';
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

  // Separar livros por testamento - usando IDs fixos da API
  console.log('=== DIVISÃO DIRETA PELOS IDS ===');
  console.log('Livros da API:', books.length);
  
  // Novo Testamento: Mateus até Apocalipse (IDs exatos da API)
  const newTestamentIds = [
    'mat', 'mrk', 'luk', 'jhn', 'act',
    'rom', '1co', '2co', 'gal', 'eph', 'php', 'col', '1th', '2th', '1ti', '2ti', 'tit', 'phm',
    'heb', 'jas', '1pe', '2pe', '1jn', '2jn', '3jn', 'jud', 'rev'
  ];
  
  const oldTestamentBooks: DataBook[] = [];
  const newTestamentBooks: DataBook[] = [];
  
  for (const book of books) {
    const bookIdLower = book.id.toLowerCase();
    
    if (newTestamentIds.includes(bookIdLower)) {
      newTestamentBooks.push(book);
      console.log(`Novo Testamento: ${book.id} (${book.name})`);
    } else {
      oldTestamentBooks.push(book);
      console.log(`Antigo Testamento: ${book.id} (${book.name})`);
    }
  }
  
  console.log(`RESULTADO: ${oldTestamentBooks.length} livros no Antigo, ${newTestamentBooks.length} livros no Novo`);

  // Renderizar inicialmente
  await renderBooks(oldTestamentBooks, oldTestamentGrid);
  await renderBooks(newTestamentBooks, newTestamentGrid);

  // Função para renderizar livros
  async function renderBooks(booksToRender: DataBook[], container: HTMLElement): Promise<void> {
    for (const book of booksToRender) {
      // Usar mapeamento visual fixo
      const label = getBookVisualName(book.id);
      
      const btn = el('button', {
        className: 'bookBtn',
        type: 'button',
      });

      const name = el('div', { className: 'bookName', textContent: label });
      btn.appendChild(name);

      btn.addEventListener('click', () => onSelectBook(book.id, label));
      container.appendChild(btn);
    }
  }

  // Função para remover acentos e normalizar texto
  function normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais exceto espaços
      .trim();
  }

  // Função para buscar livros
  function searchBooks(books: DataBook[], searchTerm: string): DataBook[] {
    if (!searchTerm) return books;
    
    const normalizedSearch = normalizeText(searchTerm);
    const searchTerms = normalizedSearch.split(/\s+/).filter(term => term.length > 0);
    
    const booksWithLocalizedNames: Array<{book: DataBook, localName: string}> = [];
    
    for (const book of books) {
      const localName = getBookVisualName(book.id);
      booksWithLocalizedNames.push({ book, localName });
    }
    
    const filteredBooks = booksWithLocalizedNames
      .filter(({ localName }) => {
        const normalizedLocalName = normalizeText(localName);
        const matches = searchTerms.every(term => normalizedLocalName.includes(term));
        return matches;
      })
      .map(({ book }) => book);
    
    return filteredBooks;
  }

  // Funcionalidade de pesquisa
  searchInput.addEventListener('input', async (e) => {
    const searchTerm = (e.target as HTMLInputElement).value.trim();
    
    // Limpar grids
    oldTestamentGrid.innerHTML = '';
    newTestamentGrid.innerHTML = '';
    
    if (searchTerm === '') {
      // Se não há termo de pesquisa, mostrar todos
      await renderBooks(oldTestamentBooks, oldTestamentGrid);
      await renderBooks(newTestamentBooks, newTestamentGrid);
    } else {
      // Filtrar livros com busca melhorada
      const filteredOld = searchBooks(oldTestamentBooks, searchTerm);
      const filteredNew = searchBooks(newTestamentBooks, searchTerm);
      
      await renderBooks(filteredOld, oldTestamentGrid);
      await renderBooks(filteredNew, newTestamentGrid);
    }
  });
}
