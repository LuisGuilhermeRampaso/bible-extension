import { idbGet, idbSet } from './indexedDb';

type CacheRecord<T> = {
  key: string;
  value: T;
  storedAt: number;
};

function hasChromeStorage(): boolean {
  const c = (globalThis as unknown as { chrome?: typeof chrome }).chrome;
  return !!c?.storage?.local;
}

async function chromeGet<T>(key: string): Promise<CacheRecord<T> | undefined> {
  return new Promise((resolve) => {
    const c = (globalThis as unknown as { chrome: typeof chrome }).chrome;
    c.storage.local.get([key], (result: Record<string, unknown>) => {
      resolve(result[key] as CacheRecord<T> | undefined);
    });
  });
}

async function chromeSet<T>(key: string, record: CacheRecord<T>): Promise<void> {
  return new Promise((resolve) => {
    const c = (globalThis as unknown as { chrome: typeof chrome }).chrome;
    c.storage.local.set({ [key]: record }, () => resolve());
  });
}

export type CacheOptions = {
  maxAgeMs?: number;
};

export async function cacheGet<T>(key: string, options: CacheOptions = {}): Promise<T | undefined> {
  const record = await (async () => {
    try {
      return await idbGet<T>(key);
    } catch {
      if (hasChromeStorage()) return chromeGet<T>(key);
      return undefined;
    }
  })();

  if (!record) return undefined;

  if (typeof options.maxAgeMs === 'number') {
    if (Date.now() - record.storedAt > options.maxAgeMs) return undefined;
  }

  return record.value;
}

export async function cacheSet<T>(key: string, value: T): Promise<void> {
  const record: CacheRecord<T> = { key, value, storedAt: Date.now() };

  try {
    await idbSet(key, value);
    return;
  } catch {
    if (hasChromeStorage()) {
      await chromeSet(key, record);
    }
  }
}

export async function settingsGet<T>(key: string): Promise<T | undefined> {
  if (!hasChromeStorage()) return undefined;
  return new Promise((resolve) => {
    const c = (globalThis as unknown as { chrome: typeof chrome }).chrome;
    c.storage.local.get([key], (result: Record<string, unknown>) => resolve(result[key] as T | undefined));
  });
}

export async function settingsSet<T>(key: string, value: T): Promise<void> {
  if (!hasChromeStorage()) return;
  return new Promise((resolve) => {
    const c = (globalThis as unknown as { chrome: typeof chrome }).chrome;
    c.storage.local.set({ [key]: value }, () => resolve());
  });
}
