export type CopiedVerse = {
  verse: number;
  text: string;
};

export type CopyInput = {
  book: string;
  chapter: number;
  /** Short version label, e.g. "JFA". */
  version: string;
  verses: CopiedVerse[];
};

/** Collapses sorted verse numbers into ranges: [16, 17, 18, 20] -> "16–18, 20". */
export function formatVerseRanges(verseNumbers: number[]): string {
  const sorted = [...new Set(verseNumbers)].sort((a, b) => a - b);
  const parts: string[] = [];
  let start = 0;

  while (start < sorted.length) {
    let end = start;
    while (end + 1 < sorted.length && sorted[end + 1] === sorted[end] + 1) end += 1;
    parts.push(end === start ? String(sorted[start]) : `${sorted[start]}–${sorted[end]}`);
    start = end + 1;
  }

  return parts.join(', ');
}

/** Builds the clipboard text: quoted verse text followed by "Book C:V (Version)". */
export function formatCopyPayload(input: CopyInput): string {
  const verses = [...input.verses].sort((a, b) => a.verse - b.verse);
  const text = verses
    .map((v) => v.text.trim())
    .filter(Boolean)
    .join(' ');
  const ref = `${input.book} ${input.chapter}:${formatVerseRanges(verses.map((v) => v.verse))} (${input.version})`;
  return `"${text}"\n${ref}`;
}
