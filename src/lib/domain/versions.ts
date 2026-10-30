import type { LanguageCode } from './canon';

export type BibleVersion = {
  id: string;
  /** Label shown in the version selector. */
  label: string;
  /** Short label used in copied references. */
  shortLabel: string;
  language: LanguageCode;
  name: string;
  license: string;
  /** Where the text comes from, shown on the credits screen. */
  source: string;
  /** True when the full text ships inside the extension package (public/data). */
  bundled: boolean;
};

export const VERSIONS: readonly BibleVersion[] = [
  {
    id: 'almeida',
    label: 'Português - JFA',
    shortLabel: 'JFA',
    language: 'pt-br',
    name: 'João Ferreira de Almeida (edição de 1911)',
    license: 'GPL (digitalização; texto original de domínio público)',
    source: 'https://sites.google.com/site/manuscript4u/download',
    bundled: true,
  },
  {
    id: 'livre',
    label: 'Português - Bíblia Livre',
    shortLabel: 'Bíblia Livre',
    language: 'pt-br',
    name: 'Bíblia Livre',
    license: 'CC BY 3.0 BR',
    source: 'https://sites.google.com/site/biblialivre',
    bundled: true,
  },
  {
    id: 'kjv',
    label: 'English - KJV',
    shortLabel: 'KJV',
    language: 'en',
    name: 'King James Version',
    license: 'GPL (CrossWire; texto de domínio público fora do Reino Unido)',
    source: 'https://gitlab.com/crosswire-bible-society/kjv',
    bundled: true,
  },
];

export function getVersionShortLabel(versionId: string): string {
  return VERSIONS.find((v) => v.id === versionId)?.shortLabel ?? versionId.toUpperCase();
}
