import type { DataBook } from '../api/types';

export interface BookInfo {
  id: string;
  order: number;
  testament: 'old' | 'new';
  names: {
    pt: string;
    en: string;
    es: string;
  };
  abbrev?: {
    pt: string;
    en: string;
    es: string;
  };
}

export interface BooksCanon {
  books: BookInfo[];
}

// Carregar o JSON canônico dos livros
let booksCanon: BooksCanon | null = null;

async function loadBooksCanon(): Promise<BooksCanon> {
  if (booksCanon) {
    return booksCanon;
  }

  try {
    const response = await fetch('/icons/livros.json');
    if (!response.ok) {
      throw new Error('Failed to load books canon');
    }
    const data = await response.json();
    booksCanon = data;
    return data;
  } catch (error) {
    console.error('Error loading books canon:', error);
    // Fallback para um canônico básico em caso de erro
    const fallbackCanon: BooksCanon = {
      books: [
        { id: 'GEN', order: 1, testament: 'old', names: { pt: 'Gênesis', en: 'Genesis', es: 'Génesis' } },
        { id: 'MAT', order: 40, testament: 'new', names: { pt: 'Mateus', en: 'Matthew', es: 'Mateo' } },
        // ... outros livros essenciais como fallback
      ]
    };
    booksCanon = fallbackCanon;
    return fallbackCanon;
  }
}

export async function getBooksCanon(): Promise<BooksCanon> {
  return await loadBooksCanon();
}

export async function getBookById(bookId: string): Promise<BookInfo | null> {
  const canon = await getBooksCanon();
  return canon.books.find(book => book.id === bookId) || null;
}

export async function getBooksByTestament(testament: 'old' | 'new'): Promise<BookInfo[]> {
  const canon = await getBooksCanon();
  return canon.books
    .filter(book => book.testament === testament)
    .sort((a, b) => a.order - b.order);
}

export async function getAllBooks(): Promise<BookInfo[]> {
  const canon = await getBooksCanon();
  return canon.books.sort((a, b) => a.order - b.order);
}

export async function getLocalizedBookName(bookId: string, languageCode: string): Promise<string> {
  const book = await getBookById(bookId);
  if (!book) {
    return bookId; // Fallback para o ID se não encontrar
  }

  // Mapear códigos de idioma para as chaves do nosso JSON
  const langKey = languageCode === 'pt-br' || languageCode === 'por' ? 'pt' :
                  languageCode === 'en' ? 'en' :
                  languageCode === 'es' ? 'es' : 'pt'; // Default para português

  return book.names[langKey] || book.names.pt || bookId;
}

export async function getLocalizedBookAbbrev(bookId: string, languageCode: string): Promise<string> {
  const book = await getBookById(bookId);
  if (!book || !book.abbrev) {
    return bookId; // Fallback para o ID se não encontrar ou não tiver abreviação
  }

  // Mapear códigos de idioma para as chaves do nosso JSON
  const langKey = languageCode === 'pt-br' || languageCode === 'por' ? 'pt' :
                  languageCode === 'en' ? 'en' :
                  languageCode === 'es' ? 'es' : 'pt'; // Default para português

  return book.abbrev[langKey] || book.abbrev.pt || bookId;
}

export async function isNewTestament(bookId: string): Promise<boolean> {
  const book = await getBookById(bookId);
  return book ? book.testament === 'new' : false;
}

export async function mapApiBooksToCanonical(apiBooks: DataBook[]): Promise<BookInfo[]> {
  const canon = await getBooksCanon();
  const canonicalBooks: BookInfo[] = [];

  for (const apiBook of apiBooks) {
    const canonicalBook = canon.books.find(book => book.id === apiBook.id);
    if (canonicalBook) {
      canonicalBooks.push(canonicalBook);
    } else {
      // Se não encontrar no canônico, criar um básico com o ID da API
      // Mas não definir testamento padrão - vamos inferir pelo ID
      console.warn(`Book ID ${apiBook.id} not found in canon, using API data`);
      
      // Inferir testamento pelo ID
      let inferredTestament: 'old' | 'new' = 'old';
      const bookIdLower = apiBook.id.toLowerCase();
      
      // Novo Testamento: Mateus até Apocalipse
      const newTestamentIds = [
        'mat', 'mrk', 'luk', 'jhn', 'act',
        'rom', '1co', '2co', 'gal', 'eph', 'php', 'col', '1th', '2th', '1ti', '2ti', 'tit', 'phm',
        'heb', 'jas', '1pe', '2pe', '1jn', '2jn', '3jn', 'jud', 'rev'
      ];
      
      if (newTestamentIds.includes(bookIdLower)) {
        inferredTestament = 'new';
      }
      
      canonicalBooks.push({
        id: apiBook.id,
        order: 999, // Colocar no final
        testament: inferredTestament,
        names: {
          pt: apiBook.name,
          en: apiBook.name,
          es: apiBook.name
        }
      });
    }
  }

  return canonicalBooks.sort((a, b) => a.order - b.order);
}
