import './styles.css';

import { BibleApiClient } from '../lib/api/BibleApiClient';
import { VERSIONS } from '../lib/domain/versions';
import { clear, el } from './ui';
import { Router } from './router';
import { loadRouteState, loadPreferences, savePreferences, saveRouteState, type Preferences } from './state';
import { renderBooksPage } from './pages/BooksPage';
import { renderChaptersPage } from './pages/ChaptersPage';
import { renderReaderPage } from './pages/ReaderPage';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Missing #app root element');
}

const api = new BibleApiClient();

const shell = el('div', { className: 'shell' });
const topbar = el('header', { className: 'topbar' });
const brand = el('div', { className: 'brand', textContent: 'Bíblia' });

const controls = el('div', { className: 'controls' });

const fontMinusBtn = el('button', { className: 'iconBtn', type: 'button' });
fontMinusBtn.setAttribute('aria-label', 'Diminuir fonte');
fontMinusBtn.innerHTML =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><text x="4" y="17" font-size="13" font-family="sans-serif" stroke="none" fill="currentColor">A</text><line x1="14" y1="17" x2="21" y2="17"/></svg>';

const fontPlusBtn = el('button', { className: 'iconBtn', type: 'button' });
fontPlusBtn.setAttribute('aria-label', 'Aumentar fonte');
fontPlusBtn.innerHTML =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><text x="2" y="19" font-size="17" font-family="sans-serif" stroke="none" fill="currentColor">A</text><line x1="16" y1="10" x2="22" y2="10"/><line x1="19" y1="7" x2="19" y2="13"/></svg>';

const themeBtn = el('button', { className: 'iconBtn', type: 'button' });
themeBtn.setAttribute('aria-label', 'Alternar modo escuro');

function setThemeIcon(isDark: boolean): void {
  if (isDark) {
    themeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="12" r="4"/>' +
      '<line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>' +
      '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>' +
      '<line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>' +
      '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>' +
      '</svg>';
  } else {
    themeBtn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>' +
      '</svg>';
  }
}

const versionSelect = el('select', { className: 'version' });
versionSelect.id = 'version-select';
versionSelect.name = 'version';
versionSelect.setAttribute('aria-label', 'Versão');
versionSelect.disabled = true;

const offlineBadge = el('span', { className: 'offlineBadge', textContent: 'Offline' });
offlineBadge.hidden = navigator.onLine;
window.addEventListener('online', () => { offlineBadge.hidden = true; });
window.addEventListener('offline', () => { offlineBadge.hidden = false; });

topbar.appendChild(brand);
topbar.appendChild(offlineBadge);
controls.appendChild(fontMinusBtn);
controls.appendChild(fontPlusBtn);
controls.appendChild(themeBtn);
controls.appendChild(versionSelect);
topbar.appendChild(controls);

const contentWrapper = el('div', { className: 'contentWrapper' });
const content = el('main', { className: 'content' });

contentWrapper.appendChild(content);
shell.appendChild(topbar);
shell.appendChild(contentWrapper);
app.appendChild(shell);

function animatePageEnter(el: HTMLElement): void {
  el.classList.remove('page-enter');
  void el.offsetWidth; // force reflow so animation restarts
  el.classList.add('page-enter');
}

function setLoading(isLoading: boolean): void {
  versionSelect.disabled = isLoading;
}

function renderVersions(selected: string): void {
  clear(versionSelect);
  for (const v of VERSIONS) {
    versionSelect.appendChild(
      el('option', { value: v.id, textContent: v.label, selected: v.id === selected }),
    );
  }
}

async function main(): Promise<void> {
  setLoading(true);
  const [routeState, prefs] = await Promise.all([loadRouteState(), loadPreferences()]);

  document.documentElement.dataset.theme = prefs.darkMode ? 'dark' : 'light';
  document.documentElement.dataset.font = String(prefs.fontSizeLevel);
  setThemeIcon(prefs.darkMode);

  function applyPrefs(next: Preferences): void {
    document.documentElement.dataset.theme = next.darkMode ? 'dark' : 'light';
    document.documentElement.dataset.font = String(next.fontSizeLevel);
    setThemeIcon(next.darkMode);
    savePreferences(next).catch(() => undefined);
  }

  fontMinusBtn.addEventListener('click', () => {
    const current = document.documentElement.dataset.font;
    const level = current === '1' ? 1 : current === '3' ? 3 : 2;
    const nextLevel = (level === 1 ? 1 : (level - 1)) as 1 | 2 | 3;
    const isDark = document.documentElement.dataset.theme === 'dark';
    applyPrefs({ darkMode: isDark, fontSizeLevel: nextLevel });
  });

  fontPlusBtn.addEventListener('click', () => {
    const current = document.documentElement.dataset.font;
    const level = current === '1' ? 1 : current === '3' ? 3 : 2;
    const nextLevel = (level === 3 ? 3 : (level + 1)) as 1 | 2 | 3;
    const isDark = document.documentElement.dataset.theme === 'dark';
    applyPrefs({ darkMode: isDark, fontSizeLevel: nextLevel });
  });

  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.dataset.font;
    const level = current === '1' ? 1 : current === '3' ? 3 : 2;
    const isDark = document.documentElement.dataset.theme === 'dark';
    applyPrefs({ darkMode: !isDark, fontSizeLevel: level as 1 | 2 | 3 });
  });

  const router = new Router(routeState);

  const defaultId = VERSIONS.some((v) => v.id === router.getState().version)
    ? router.getState().version
    : VERSIONS[0].id;

  if (defaultId !== router.getState().version) {
    router.patch({ version: defaultId });
  }

  renderVersions(defaultId);
  setLoading(false);

  versionSelect.addEventListener('change', () => {
    router.patch({ version: versionSelect.value });
  });

  let renderToken = 0;

  router.subscribe(async (state) => {
    const token = ++renderToken;
    saveRouteState(state).catch(() => undefined);
    if (versionSelect.value !== state.version) {
      versionSelect.value = state.version;
    }

    // Remove reader overlays mounted on .shell before each page render
    shell.querySelectorAll('.navArrows, .bottomMenu').forEach(n => n.remove());
    clear(content);
    content.scrollTop = 0;
    animatePageEnter(content);

    // Each render owns its container, so a slow render that finishes after the
    // user navigated away writes into a detached node instead of the new page.
    const page = el('div', { className: 'page' });
    content.appendChild(page);

    if (state.view === 'books') {
      await renderBooksPage(page, api, state.version, (bookId, bookName) => {
        router.setState({
          ...state,
          view: 'chapters',
          bookAbbrev: bookId,
          bookName,
          chapter: undefined,
        });
      });
      return;
    }

    if (state.view === 'chapters' && state.bookAbbrev) {
      await renderChaptersPage(
        page,
        api,
        state.version,
        state.bookAbbrev,
        state.chapter,
        () => router.setState({ ...state, view: 'books', bookAbbrev: undefined, bookName: undefined, chapter: undefined }),
        (chapter) => router.setState({ ...state, view: 'reader', chapter }),
      );
      return;
    }

    if (state.view === 'reader' && state.bookAbbrev && typeof state.chapter === 'number') {
      await renderReaderPage(
        page,
        api,
        state.version,
        state.bookAbbrev,
        state.chapter,
        () => router.setState({ ...state, view: 'chapters' }),
        (chapter: number) => router.setState({ ...state, chapter }),
        (bookId: string, bookName: string, chapter = 1) => router.setState({ ...state, bookAbbrev: bookId, bookName, chapter }),
        () => router.setState({ ...state, view: 'books', bookAbbrev: undefined, bookName: undefined, chapter: undefined }),
      );
      return;
    }

    if (token === renderToken) router.setState({ view: 'books', version: state.version });
  });
}

void main();
