import type {
  BooksResponse,
  ChaptersResponse,
  TranslationsResponse,
  VersesResponse,
} from './types';
import { cacheGet, cacheSet } from '../storage/storage';

export type BibleApiClientOptions = {
  baseUrl?: string;
  timeoutMs?: number;
  retries?: number;
};

export class BibleApiClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly retries: number;

  constructor(options: BibleApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? 'https://bible-api.com';
    this.timeoutMs = options.timeoutMs ?? 10_000;
    this.retries = options.retries ?? 1;
  }

  async getTranslations(): Promise<TranslationsResponse> {
    return this.getJson<TranslationsResponse>('/data', {
      cacheKey: 'bible_api:translations',
      cacheMaxAgeMs: 1000 * 60 * 60 * 24 * 7,
    });
  }

  async getBooks(translationId: string): Promise<BooksResponse> {
    return this.getJson<BooksResponse>(`/data/${encodeURIComponent(translationId)}`, {
      cacheKey: `bible_api:books:${translationId}`,
      cacheMaxAgeMs: 1000 * 60 * 60 * 24 * 30,
    });
  }

  async getChapters(translationId: string, bookId: string): Promise<ChaptersResponse> {
    return this.getJson<ChaptersResponse>(
      `/data/${encodeURIComponent(translationId)}/${encodeURIComponent(bookId)}`,
      {
        cacheKey: `bible_api:chapters:${translationId}:${bookId}`,
        cacheMaxAgeMs: 1000 * 60 * 60 * 24 * 30,
      },
    );
  }

  async getChapterVerses(translationId: string, bookId: string, chapter: number): Promise<VersesResponse> {
    return this.getJson<VersesResponse>(
      `/data/${encodeURIComponent(translationId)}/${encodeURIComponent(bookId)}/${chapter}`,
      {
        cacheKey: `bible_api:verses:${translationId}:${bookId}:${chapter}`,
        cacheMaxAgeMs: 1000 * 60 * 60 * 24 * 365,
      },
    );
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
          const contentType = res.headers.get('content-type') ?? '';
          const raw = await res.text();

          let parsed: unknown = undefined;
          if (contentType.includes('application/json')) {
            try {
              parsed = JSON.parse(raw);
            } catch {
              parsed = undefined;
            }
          }

          console.error('[BibleApiClient] HTTP error', {
            url,
            status: res.status,
            contentType,
            raw,
            parsed,
          });

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
          isAbort || message === 'RATE_LIMIT' || message.startsWith('SERVER_ERROR:') || message.startsWith('TypeError');

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
