import { formatCopyPayload, type CopyInput } from '../lib/domain/reference';

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

export async function copyVerses(input: CopyInput): Promise<void> {
  await copyToClipboard(formatCopyPayload(input));
}

export function showToast(message: string): void {
  const toast = el('div', { className: 'toast', textContent: message });
  toast.setAttribute('role', 'status');
  const target = document.querySelector('.shell') ?? document.body;
  target.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 1600);
  setTimeout(() => toast.remove(), 2000);
}
