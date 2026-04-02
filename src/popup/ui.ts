export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> & { className?: string } = {},
  children: Array<HTMLElement | string> = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  Object.assign(node, props);
  if (props.className) node.className = props.className;
  for (const ch of children) {
    if (typeof ch === 'string') node.appendChild(document.createTextNode(ch));
    else node.appendChild(ch);
  }
  return node;
}

export function clear(node: HTMLElement): void {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export function formatRef(abbrev: string, chapter: number, verse: number, version: string): string {
  return `${abbrev} ${chapter}:${verse} (${version.toUpperCase()})`;
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // fallback for restricted clipboard contexts
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.left = '-1000px';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand('copy');
    ta.remove();
    if (!ok) throw new Error('COPY_FAILED');
  }
}

export type CopyVerseInput = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  version: string;
};

function toTitleCaseId(id: string): string {
  const cleaned = id.trim();
  if (!cleaned) return id;
  if (cleaned.length <= 3) return cleaned.toUpperCase();
  return cleaned[0].toUpperCase() + cleaned.slice(1);
}

export function formatVerseCopyPayload(input: CopyVerseInput): string {
  const verseText = input.text.trim();
  const versionLabel = toTitleCaseId(input.version);
  const ref = `${input.book} ${input.chapter}:${input.verse} (${versionLabel})`;
  return `"${verseText}"\n${ref}`;
}

export async function copyVerse(input: CopyVerseInput): Promise<void> {
  await copyToClipboard(formatVerseCopyPayload(input));
}

export function showToast(message: string): void {
  const toast = el('div', { className: 'toast', textContent: message });
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 1600);
  setTimeout(() => toast.remove(), 2000);
}
