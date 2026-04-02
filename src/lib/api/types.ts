export type Translation = {
  identifier: string;
  name: string;
  language: string;
  language_code: string;
  license: string;
  url: string;
};

export type TranslationsResponse = {
  translations: Translation[];
};

export type TranslationInfo = {
  identifier: string;
  name: string;
  language: string;
  language_code: string;
  license: string;
};

export type DataBook = {
  id: string;
  name: string;
  url: string;
};

export type BooksResponse = {
  translation: TranslationInfo;
  books: DataBook[];
};

export type DataChapter = {
  book_id: string;
  book: string;
  chapter: number;
  url: string;
};

export type ChaptersResponse = {
  translation: TranslationInfo;
  chapters: DataChapter[];
};

export type DataVerse = {
  book_id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
};

export type VersesResponse = {
  translation: TranslationInfo;
  verses: DataVerse[];
};
