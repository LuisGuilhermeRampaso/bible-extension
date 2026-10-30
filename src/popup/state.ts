import { settingsGet, settingsSet } from '../lib/storage/storage';
import type { RouteState } from './router';

export type Preferences = {
  darkMode: boolean;
  fontSizeLevel: 1 | 2 | 3;
};

function systemPrefersDark(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
}

export const DEFAULT_ROUTE_STATE: RouteState = {
  view: 'books',
  version: 'almeida',
};

const ROUTE_KEY = 'state.route';
const PREFS_KEY = 'state.prefs';

export async function loadRouteState(): Promise<RouteState> {
  const saved = await settingsGet<RouteState>(ROUTE_KEY);
  return saved ? { ...DEFAULT_ROUTE_STATE, ...saved } : DEFAULT_ROUTE_STATE;
}

export async function saveRouteState(state: RouteState): Promise<void> {
  await settingsSet<RouteState>(ROUTE_KEY, state);
}

export async function loadPreferences(): Promise<Preferences> {
  const saved = await settingsGet<Partial<Preferences>>(PREFS_KEY);
  return {
    darkMode: typeof saved?.darkMode === 'boolean' ? saved.darkMode : systemPrefersDark(),
    fontSizeLevel: saved?.fontSizeLevel === 1 || saved?.fontSizeLevel === 3 ? saved.fontSizeLevel : 2,
  };
}

export async function savePreferences(prefs: Preferences): Promise<void> {
  await settingsSet<Preferences>(PREFS_KEY, prefs);
}
