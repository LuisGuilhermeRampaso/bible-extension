import { BOOK_ORDER, CHAPTER_COUNTS, getBookName, type LanguageCode } from './canon';

/**
 * Lowercases and strips accents one character at a time, so indexes in the folded
 * string line up with the original text (needed to highlight matches).
 */
export function fold(text: string): string {
  return text.replace(/[À-ſ]/g, (c) => c.normalize('NFD')[0]).toLowerCase();
}

// Abbreviations per book, aligned with BOOK_ORDER. Portuguese first: on a clash
// ("jn", "ez") the first book listed wins.
const ABBREVIATIONS: readonly (readonly string[])[] = [
  ['gn', 'gen'], ['ex', 'exo', 'exod'], ['lv', 'lev'], ['nm', 'num'], ['dt', 'deut'],
  ['js', 'josh'], ['jz', 'judg'], ['rt', 'ru'], ['1sm', '1sam'], ['2sm', '2sam'],
  ['1rs', '1kgs'], ['2rs', '2kgs'], ['1cr', '1chr'], ['2cr', '2chr'], ['ed', 'ezra'],
  ['ne', 'neh'], ['et', 'esth'], ['job'], ['sl', 'ps', 'psalm'], ['pv', 'pr', 'prov'],
  ['ec', 'eccl'], ['ct', 'cant', 'song'], ['is'], ['jr'], ['lm'], ['ez', 'ezek'],
  ['dn'], ['os'], ['jl'], ['am'], ['ob', 'obad'], ['jn', 'jonah'], ['mq'], ['na'],
  ['hc'], ['sf', 'zeph'], ['ag'], ['zc', 'zech'], ['ml'], ['mt', 'matt'],
  ['mc', 'mk'], ['lc', 'lk'], ['jo', 'jn'], ['at', 'ac'], ['rm', 'ro'],
  ['1co', '1cor'], ['2co', '2cor'], ['gl'], ['ef'], ['fp', 'phil'], ['cl'],
  ['1ts', '1thess'], ['2ts', '2thess'], ['1tm', '1tim'], ['2tm', '2tim'], ['tt'],
  ['fm', 'phlm'], ['hb'], ['tg'], ['1pe', '1pet'], ['2pe', '2pet'],
  ['1jo', '1john'], ['2jo', '2john'], ['3jo', '3john'], ['jd'], ['ap'],
];

const LANGUAGES: readonly LanguageCode[] = ['pt-br', 'en', 'es'];

function compact(text: string): string {
  return fold(text).replace(/[^a-z0-9]/g, '');
}

const exactAliases = new Map<string, number>();
const prefixNames: Array<[string, number]> = [];

function addAlias(key: string, index: number): void {
  if (key && !exactAliases.has(key)) exactAliases.set(key, index);
}

ABBREVIATIONS.forEach((abbrs, index) => {
  for (const abbr of abbrs) addAlias(abbr, index);
});
BOOK_ORDER.forEach((id, index) => addAlias(id.toLowerCase(), index));
BOOK_ORDER.forEach((id, index) => {
  for (const language of LANGUAGES) {
    const name = compact(getBookName(id, language));
    addAlias(name, index);
    prefixNames.push([name, index]);
  }
});

function findBook(key: string): number {
  const exact = exactAliases.get(key);
  if (exact !== undefined) return exact;
  if (key.length < 3) return -1;

  const matches = new Set<number>();
  for (const [name, index] of prefixNames) {
    if (name.startsWith(key)) matches.add(index);
  }
  return matches.size === 1 ? [...matches][0] : -1;
}

export type ParsedReference = {
  bookId: string;
  chapter?: number;
  verseStart?: number;
  verseEnd?: number;
};

const REFERENCE_PATTERN =
  /^(\d?\s*[a-z]+(?:\s+(?:de|of|dos|das|do)\s+[a-z]+)*)\s*(?:(\d{1,3})(?:\s*[:.,]\s*|\s+|v)(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?|(\d{1,3}))?$/;

/** Parses "Jo 3:16", "1co 13", "sl 23", "gn 1:1-5", "Song of Songs 2". Returns null when the input is not a reference. */
export function parseReference(input: string): ParsedReference | null {
  // "Jó" and "João" fold to the same "jo"; the accent is the only thing telling them apart.
  const withJob = input.trim().replace(/^jó(?![\p{L}])/iu, 'job');
  const match = REFERENCE_PATTERN.exec(fold(withJob));
  if (!match) return null;

  const index = findBook(match[1].replace(/\s+/g, ''));
  if (index < 0) return null;

  const chapter = match[2] ?? match[5];
  const result: ParsedReference = { bookId: BOOK_ORDER[index] };
  if (chapter) result.chapter = Number(chapter);
  if (match[3]) result.verseStart = Number(match[3]);
  if (match[4]) result.verseEnd = Number(match[4]);
  return result;
}

/** Highest chapter of a book, or 0 for an unknown one. */
export function chapterCount(bookId: string): number {
  return CHAPTER_COUNTS[bookId.toUpperCase()] ?? 0;
}

export type BookText = {
  id: string;
  /** chapters[chapter - 1][verse - 1]; an empty string marks a verse missing in the source. */
  chapters: string[][];
};

export type SearchCorpus = {
  books: Array<BookText & { folded: string[][] }>;
};

export function buildCorpus(books: BookText[]): SearchCorpus {
  return {
    books: books.map((book) => ({ ...book, folded: book.chapters.map((verses) => verses.map(fold)) })),
  };
}

export type VerseHit = {
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  /** [start, end) offsets into text, sorted and non-overlapping. */
  ranges: Array<[number, number]>;
};

export type SearchResult = {
  hits: VerseHit[];
  /** Verses that match, even when only the first `limit` are returned. */
  total: number;
};

export function searchTerms(query: string): string[] {
  return fold(query)
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length >= 2);
}

function mergeRanges(ranges: Array<[number, number]>): Array<[number, number]> {
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([range[0], range[1]]);
  }
  return merged;
}

const WORD_CHAR = /[a-z0-9]/;
const WHOLE_WORD_MAX = 2;

/**
 * Offsets where `term` starts a word in `folded` ("amor" matches "amores", not "clamaram").
 * With `wholeWord`, the term must also end the word.
 */
function wordStarts(folded: string, term: string, wholeWord: boolean): number[] {
  const starts: number[] = [];
  for (let at = folded.indexOf(term); at >= 0; at = folded.indexOf(term, at + 1)) {
    if (at > 0 && WORD_CHAR.test(folded[at - 1])) continue;
    const next = folded[at + term.length];
    if (wholeWord && next !== undefined && WORD_CHAR.test(next)) continue;
    starts.push(at);
  }
  return starts;
}

/**
 * Verses containing every term as a word or word prefix (accent- and case-insensitive), in Bible order.
 * A short term ("de", "da") must be a whole word, or it would match half the Bible — except the one
 * still being typed (no space after it yet), which is always a prefix so "Deus am" finds "amou".
 */
export function searchVerses(corpus: SearchCorpus, query: string, limit = 100): SearchResult {
  const terms = searchTerms(query);
  const lastIsPartial = !/\s$/.test(query);
  const wholeWord = terms.map((term, i) => term.length <= WHOLE_WORD_MAX && !(lastIsPartial && i === terms.length - 1));
  const hits: VerseHit[] = [];
  let total = 0;
  if (terms.length === 0) return { hits, total };

  for (const book of corpus.books) {
    book.folded.forEach((verses, ci) => {
      verses.forEach((folded, vi) => {
        const found = terms.map((term, i) => wordStarts(folded, term, wholeWord[i]));
        if (found.some((starts) => starts.length === 0)) return;
        total += 1;
        if (hits.length >= limit) return;

        const ranges: Array<[number, number]> = [];
        terms.forEach((term, i) => {
          for (const at of found[i]) ranges.push([at, at + term.length]);
        });
        hits.push({
          bookId: book.id,
          chapter: ci + 1,
          verse: vi + 1,
          text: book.chapters[ci][vi],
          ranges: mergeRanges(ranges),
        });
      });
    });
  }

  return { hits, total };
}
