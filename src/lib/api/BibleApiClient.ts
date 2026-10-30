import type {
  BooksResponse,
  ChaptersResponse,
  DataVerse,
  TranslationInfo,
  VersesResponse,
} from './types';
import { LocalBibleSource } from './LocalBibleSource';
import { cacheGet, cacheSet } from '../storage/storage';
import { BOOK_ORDER, CHAPTER_COUNTS } from '../domain/canon';
import { VERSIONS } from '../domain/versions';

export type BibleApiClientOptions = {
  baseUrl?: string;
  timeoutMs?: number;
  retries?: number;
};

export class BibleApiClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly retries: number;

  private static readonly GET_BIBLE_IDS = new Set(['livre', 'livretr']);

  private readonly local = new LocalBibleSource();

  constructor(options: BibleApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? 'https://bible-api.com';
    this.timeoutMs = options.timeoutMs ?? 10_000;
    this.retries = options.retries ?? 1;
  }

  private isGetBible(id: string): boolean {
    return BibleApiClient.GET_BIBLE_IDS.has(id.toLowerCase());
  }

  private getGetBibleTranslationInfo(translationId: string): TranslationInfo {
    return {
      identifier: translationId,
      name: 'Bíblia Livre',
      language: 'Portuguese',
      language_code: 'pt-br',
      license: 'CC-BY-3.0-BR',
    };
  }

  private getLocalTranslationInfo(translationId: string): TranslationInfo {
    const version = VERSIONS.find((v) => v.id === translationId);
    return {
      identifier: translationId,
      name: version?.name ?? translationId,
      language: version?.language ?? '',
      language_code: version?.language ?? '',
      license: version?.license ?? '',
    };
  }

  async getBooks(translationId: string): Promise<BooksResponse> {
    if (this.local.isBundled(translationId)) {
      return {
        translation: this.getLocalTranslationInfo(translationId),
        books: BOOK_ORDER.map((id) => ({ id, name: id, url: '' })),
      };
    }
    if (this.isGetBible(translationId)) {
      return {
        translation: this.getGetBibleTranslationInfo(translationId),
        books: BOOK_ORDER.map((id) => ({ id, name: id, url: '' })),
      };
    }
    return this.getJson<BooksResponse>(`/data/${encodeURIComponent(translationId)}`, {
      cacheKey: `bible_api:books:${translationId}`,
      cacheMaxAgeMs: 1000 * 60 * 60 * 24 * 30,
    });
  }

  async getChapters(translationId: string, bookId: string): Promise<ChaptersResponse> {
    if (this.local.isBundled(translationId)) {
      const count = CHAPTER_COUNTS[bookId.toUpperCase()] ?? 1;
      return {
        translation: this.getLocalTranslationInfo(translationId),
        chapters: Array.from({ length: count }, (_, i) => ({
          book_id: bookId,
          book: bookId,
          chapter: i + 1,
          url: '',
        })),
      };
    }
    if (this.isGetBible(translationId)) {
      const count = CHAPTER_COUNTS[bookId.toUpperCase()] ?? 1;
      return {
        translation: this.getGetBibleTranslationInfo(translationId),
        chapters: Array.from({ length: count }, (_, i) => ({
          book_id: bookId,
          book: bookId,
          chapter: i + 1,
          url: '',
        })),
      };
    }
    return this.getJson<ChaptersResponse>(
      `/data/${encodeURIComponent(translationId)}/${encodeURIComponent(bookId)}`,
      {
        cacheKey: `bible_api:chapters:${translationId}:${bookId}`,
        cacheMaxAgeMs: 1000 * 60 * 60 * 24 * 30,
      },
    );
  }

  async getChapterVerses(translationId: string, bookId: string, chapter: number): Promise<VersesResponse> {
    if (this.local.isBundled(translationId)) {
      try {
        const book = await this.local.loadBook(translationId, bookId);
        const texts = book[chapter - 1];
        if (texts) {
          const verses: DataVerse[] = [];
          texts.forEach((text, i) => {
            if (text) verses.push({ book_id: bookId, book: bookId, chapter, verse: i + 1, text });
          });
          return { translation: this.getLocalTranslationInfo(translationId), verses };
        }
      } catch {
        // Bundled file unreadable: fall back to the network below.
      }
    }
    if (this.isGetBible(translationId)) {
      return this.getChapterVersesGetBible(translationId, bookId, chapter);
    }
    return this.getJson<VersesResponse>(
      `/data/${encodeURIComponent(translationId)}/${encodeURIComponent(bookId)}/${chapter}`,
      {
        cacheKey: `bible_api:verses:${translationId}:${bookId}:${chapter}`,
        cacheMaxAgeMs: 1000 * 60 * 60 * 24 * 365,
      },
    );
  }

  private async getChapterVersesGetBible(
    translationId: string,
    bookId: string,
    chapter: number,
  ): Promise<VersesResponse> {
    const cacheKey = `getbible:verses:${translationId}:${bookId}:${chapter}`;
    const cached = await cacheGet<VersesResponse>(cacheKey, { maxAgeMs: 1000 * 60 * 60 * 24 * 365 });
    if (cached) return cached;

    const bookNumber = BOOK_ORDER.indexOf(bookId.toUpperCase()) + 1;
    if (bookNumber === 0) throw new Error(`Livro desconhecido: ${bookId}`);

    const url = `https://api.getbible.net/v2/${encodeURIComponent(translationId)}/${bookNumber}/${chapter}.json`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    let raw: unknown;
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' }, signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP_${res.status}`);
      raw = await res.json();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('Tempo esgotado ao conectar na api.getbible.net. Verifique sua internet e tente novamente.');
      }
      throw new Error(`Falha ao carregar dados da Bíblia Livre. (${msg})`);
    } finally {
      clearTimeout(timeout);
    }

    type GetBibleVerse = { verse: number; text: string; chapter: number };
    type GetBibleChapter = { verses: Record<string, GetBibleVerse> };
    const data = raw as GetBibleChapter;

    const verses: DataVerse[] = Object.values(data.verses).map((v) => ({
      book_id: bookId,
      book: bookId,
      chapter,
      verse: v.verse,
      text: v.text,
    }));

    const result: VersesResponse = {
      translation: this.getGetBibleTranslationInfo(translationId),
      verses,
    };

    await cacheSet(cacheKey, result);
    return result;
  }

  private async getJson<T>(path: string, options: { cacheKey: string; cacheMaxAgeMs: number }): Promise<T> {
    const cached = await cacheGet<T>(options.cacheKey, { maxAgeMs: options.cacheMaxAgeMs });
    if (cached) return cached;

    const data = await this.requestJson<T>(path, { method: 'GET' });
    await cacheSet(options.cacheKey, data);
    return data;
  }

  private async requestJson<T>(
    path: string,
    init: { method: 'GET' | 'POST'; body?: unknown },
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    let attempt = 0;
    const maxAttempts = 1 + this.retries;

    while (true) {
      attempt += 1;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const headers: Record<string, string> = {
          Accept: 'application/json',
        };

        if (init.method === 'POST') {
          headers['Content-Type'] = 'application/json';
        }

        const res = await fetch(url, {
          method: init.method,
          headers,
          body: init.method === 'POST' ? JSON.stringify(init.body ?? {}) : undefined,
          signal: controller.signal,
        });

        if (res.status === 429) {
          throw new Error('RATE_LIMIT');
        }

        if (!res.ok) {
          const raw = await res.text();

          if (res.status >= 500) {
            throw new Error(`SERVER_ERROR:${res.status}:${raw}`);
          }

          throw new Error(`HTTP_${res.status}:${raw}`);
        }

        return (await res.json()) as T;
      } catch (err) {
        const isAbort = err instanceof DOMException && err.name === 'AbortError';
        const message = err instanceof Error ? err.message : String(err);

        const isTransient =
          isAbort || err instanceof TypeError || message === 'RATE_LIMIT' || message.startsWith('SERVER_ERROR:');

        if (attempt >= maxAttempts || !isTransient) {
          if (message === 'RATE_LIMIT') {
            throw new Error('Limite de requisições atingido. Aguarde alguns segundos e tente novamente.');
          }

          if (message.startsWith('SERVER_ERROR:')) {
            const parts = message.split(':');
            const status = parts[1] ?? '500';
            const raw = parts.slice(2).join(':');
            let detail = '';
            try {
              const parsed = JSON.parse(raw) as { error?: string; message?: string };
              const msg = parsed.message ?? parsed.error;
              detail = msg ? `msg=${msg}` : '';
            } catch {
              detail = '';
            }

            throw new Error(
              `bible-api.com retornou erro ${status}. ${detail ? `(${detail}) ` : ''}Tente novamente em instantes.`,
            );
          }

          if (isAbort) {
            throw new Error('Tempo esgotado ao conectar na bible-api.com. Verifique sua internet e tente novamente.');
          }

          throw new Error('Falha ao carregar dados da Bíblia. Tente novamente.');
        }

        await new Promise((r) => setTimeout(r, 500 * attempt));
      } finally {
        clearTimeout(timeout);
      }
    }
  }
}
