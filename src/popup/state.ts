import { settingsGet, settingsSet } from '../lib/storage/storage';
import type { RouteState } from './router';

export type Preferences = {
  darkMode: boolean;
  fontSizeLevel: 1 | 2 | 3;
};

export const DEFAULT_PREFERENCES: Preferences = {
  darkMode: true,
  fontSizeLevel: 2,
};

export const DEFAULT_ROUTE_STATE: RouteState = {
  view: 'books',
  version: 'almeida',
};

const ROUTE_KEY = 'state.route';
const PREFS_KEY = 'state.prefs';
const TOKEN_KEY = 'settings.apiToken';

export async function loadRouteState(): Promise<RouteState> {
  const saved = await settingsGet<RouteState>(ROUTE_KEY);
  return saved ? { ...DEFAULT_ROUTE_STATE, ...saved } : DEFAULT_ROUTE_STATE;
}

export async function saveRouteState(state: RouteState): Promise<void> {
  await settingsSet<RouteState>(ROUTE_KEY, state);
}

export async function loadPreferences(): Promise<Preferences> {
  const saved = await settingsGet<Preferences>(PREFS_KEY);
  const prefs = saved ? { ...DEFAULT_PREFERENCES, ...saved } : DEFAULT_PREFERENCES;
  return {
    darkMode: !!prefs.darkMode,
    fontSizeLevel: prefs.fontSizeLevel === 1 || prefs.fontSizeLevel === 3 ? prefs.fontSizeLevel : 2,
  };
}

export async function savePreferences(prefs: Preferences): Promise<void> {
  await settingsSet<Preferences>(PREFS_KEY, prefs);
}

export async function loadApiToken(): Promise<string> {
  const token = await settingsGet<string>(TOKEN_KEY);
  return token ?? '';
}

export async function saveApiToken(token: string): Promise<void> {
  await settingsSet<string>(TOKEN_KEY, token);
}
