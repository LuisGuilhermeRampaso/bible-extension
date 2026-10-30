// Downloads full translations from getBible and writes compact per-book files
// to public/data/<version>/<BOOK>.json so the popup can read without any network.
//
// Usage: node scripts/fetch-bibles.mjs [version ...]
// Output format: [[verse1, verse2, ...], ...] — outer index = chapter - 1,
// inner index = verse - 1. A verse missing in the source is stored as "" so the
// numbering stays aligned (Bíblia Livre has no Psalm 46:3).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Ids in getBible book order (book number = index + 1). Keep in sync with src/lib/domain/canon.ts.
const BOOK_ORDER = [
  'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI', '1CH', '2CH',
  'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS',
  'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL', 'MAT', 'MRK', 'LUK',
  'JHN', 'ACT', 'ROM', '1CO', '2CO', 'GAL', 'EPH', 'PHP', 'COL', '1TH', '2TH', '1TI', '2TI', 'TIT',
  'PHM', 'HEB', 'JAS', '1PE', '2PE', '1JN', '2JN', '3JN', 'JUD', 'REV',
];

const DEFAULT_VERSIONS = ['almeida', 'livre', 'kjv'];
const versions = process.argv.length > 2 ? process.argv.slice(2) : DEFAULT_VERSIONS;

function clean(text) {
  return text.replace(/\s+/g, ' ').trim();
}

for (const version of versions) {
  const url = `https://api.getbible.net/v2/${encodeURIComponent(version)}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  const data = await res.json();

  if (data.books.length !== BOOK_ORDER.length) {
    throw new Error(`${version}: expected ${BOOK_ORDER.length} books, got ${data.books.length}`);
  }

  const outDir = resolve(root, 'public', 'data', version);
  mkdirSync(outDir, { recursive: true });

  let verseCount = 0;
  let bytes = 0;

  data.books.forEach((book, i) => {
    if (book.nr !== i + 1) throw new Error(`${version}: book ${book.name} has nr ${book.nr}, expected ${i + 1}`);

    const chapters = book.chapters.map((chapter, ci) => {
      if (chapter.chapter !== ci + 1) {
        throw new Error(`${version} ${book.name}: chapter ${chapter.chapter} at position ${ci + 1}`);
      }
      const texts = [];
      for (const verse of chapter.verses) {
        while (texts.length < verse.verse - 1) {
          texts.push('');
          console.warn(`${version} ${book.name} ${chapter.chapter}: verse ${texts.length} missing in source`);
        }
        if (texts.length !== verse.verse - 1) {
          throw new Error(`${version} ${book.name} ${chapter.chapter}: unexpected verse ${verse.verse}`);
        }
        texts.push(clean(verse.text));
        verseCount += 1;
      }
      return texts;
    });

    const json = JSON.stringify(chapters);
    bytes += Buffer.byteLength(json);
    writeFileSync(resolve(outDir, `${BOOK_ORDER[i]}.json`), json);
  });

  console.log(`${version}: ${data.books.length} books, ${verseCount} verses, ${(bytes / 1024 / 1024).toFixed(2)} MB`);
}
