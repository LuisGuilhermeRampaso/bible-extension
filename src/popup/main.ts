import './styles.css';

import { BibleApiClient } from '../lib/api/BibleApiClient';
import type { Translation } from '../lib/api/types';
import { clear, el } from './ui';
import { Router } from './router';
import { loadRouteState, loadPreferences, savePreferences, saveRouteState } from './state';
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
const fontMinusBtn = el('button', { className: 'iconBtn', type: 'button', textContent: 'A−' });
fontMinusBtn.setAttribute('aria-label', 'Diminuir fonte');
const fontPlusBtn = el('button', { className: 'iconBtn', type: 'button', textContent: 'A+' });
fontPlusBtn.setAttribute('aria-label', 'Aumentar fonte');
const themeBtn = el('button', { className: 'iconBtn', type: 'button', textContent: '☾' });
themeBtn.setAttribute('aria-label', 'Alternar modo escuro');

const versionSelect = el('select', { className: 'version' });
versionSelect.setAttribute('aria-label', 'Versão');
versionSelect.disabled = true;

topbar.appendChild(brand);
controls.appendChild(fontMinusBtn);
controls.appendChild(fontPlusBtn);
controls.appendChild(themeBtn);
controls.appendChild(versionSelect);
topbar.appendChild(controls);

const content = el('main', { className: 'content' });

shell.appendChild(topbar);
shell.appendChild(content);
app.appendChild(shell);

function setLoading(isLoading: boolean): void {
  versionSelect.disabled = isLoading;
}

async function loadTranslations(): Promise<Translation[]> {
  return [
    {
      identifier: 'almeida',
      name: 'João Ferreira de Almeida',
      language: 'Português',
      language_code: 'pt-br',
      license: 'Public Domain',
      url: ''
    },
    {
      identifier: 'kjv',
      name: 'King James Version',
      language: 'English',
      language_code: 'en',
      license: 'Public Domain',
      url: ''
    }
  ];
}

function renderTranslations(translations: Translation[], selected: string): void {
  clear(versionSelect);
  const sorted = [...translations].sort((a, b) => a.language.localeCompare(b.language));
  for (const t of sorted) {
    const friendlyNames: Record<string, string> = {
      'almeida': 'Português - JFA',
      'kjv': 'English - KJV'
    };
    const label = friendlyNames[t.identifier] || t.name;
    const opt = el('option', {
      value: t.identifier,
      textContent: label,
      selected: t.identifier === selected,
    });
    versionSelect.appendChild(opt);
  }
}

async function main(): Promise<void> {
  setLoading(true);
  const [routeState, prefs] = await Promise.all([loadRouteState(), loadPreferences()]);

  document.documentElement.dataset.theme = prefs.darkMode ? 'dark' : 'light';
  document.documentElement.dataset.font = String(prefs.fontSizeLevel);

  function applyPrefs(next: { darkMode: boolean; fontSizeLevel: 1 | 2 | 3 }): void {
    document.documentElement.dataset.theme = next.darkMode ? 'dark' : 'light';
    document.documentElement.dataset.font = String(next.fontSizeLevel);
    void savePreferences(next);
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

  const translations = await loadTranslations();
  const defaultId = translations.find((t) => t.identifier === router.getState().version)
    ? router.getState().version
    : (translations.find((t) => t.identifier === 'almeida')?.identifier ?? translations[0]?.identifier ?? 'almeida');

  if (defaultId !== router.getState().version) {
    router.patch({ version: defaultId });
  }

  renderTranslations(translations, defaultId);
  setLoading(false);

  versionSelect.addEventListener('change', () => {
    router.patch({ version: versionSelect.value });
  });

  router.subscribe(async (state) => {
    await saveRouteState(state);
    if (versionSelect.value !== state.version) {
      versionSelect.value = state.version;
    }

    clear(content);

    if (state.view === 'books') {
      await renderBooksPage(content, api, state.version, (bookId, bookName) => {
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
        content,
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
        content,
        api,
        state.version,
        state.bookAbbrev,
        state.chapter,
        () => router.setState({ ...state, view: 'chapters' }),
        (chapter: number) => router.setState({ ...state, chapter }),
        (bookId: string, bookName: string) => router.setState({ ...state, bookAbbrev: bookId, bookName, chapter: 1 }),
        () => router.setState({ ...state, view: 'books', bookAbbrev: undefined, bookName: undefined, chapter: undefined }),
      );
      return;
    }

    router.setState({ view: 'books', version: state.version });
  });
}

void main();
