import type { BibleApiClient } from '../../lib/api/BibleApiClient';
import { el } from '../ui';
import { getLangByVersion } from '../../lib/domain/canon';

export async function renderChaptersPage(
  root: HTMLElement,
  api: BibleApiClient,
  translationId: string,
  bookId: string,
  currentChapter: number | undefined,
  onBack: () => void,
  onSelectChapter: (chapter: number) => void,
): Promise<void> {
  // Detectar idioma da versão
  const languageCode = getLangByVersion(translationId);
  
  // Mapeamento visual fixo dos IDs para nomes em português
  const bookNamesPT: Record<string, string> = {
    // Antigo Testamento
    'GEN': 'Gênesis', 'EXO': 'Êxodo', 'LEV': 'Levítico', 'NUM': 'Números', 'DEU': 'Deuteronômio',
    'JOS': 'Josué', 'JDG': 'Juízes', 'RUT': 'Rute', '1SA': '1 Samuel', '2SA': '2 Samuel',
    '1KI': '1 Reis', '2KI': '2 Reis', '1CH': '1 Crônicas', '2CH': '2 Crônicas', 'EZR': 'Esdras',
    'NEH': 'Neemias', 'EST': 'Ester', 'JOB': 'Jó', 'PSA': 'Salmos', 'PRO': 'Provérbios',
    'ECC': 'Eclesiastes', 'SNG': 'Cânticos', 'ISA': 'Isaías', 'JER': 'Jeremias', 'LAM': 'Lamentações',
    'EZK': 'Ezequiel', 'DAN': 'Daniel', 'HOS': 'Oséias', 'JOL': 'Joel', 'AMO': 'Amós',
    'OBA': 'Obadias', 'JON': 'Jonas', 'MIC': 'Miqueias', 'NAM': 'Naum', 'HAB': 'Habacuque',
    'ZEP': 'Sofonias', 'HAG': 'Ageu', 'ZEC': 'Zacarias', 'MAL': 'Malaquias',
    
    // Novo Testamento
    'MAT': 'Mateus', 'MRK': 'Marcos', 'LUK': 'Lucas', 'JHN': 'João', 'ACT': 'Atos',
    'ROM': 'Romanos', '1CO': '1 Coríntios', '2CO': '2 Coríntios', 'GAL': 'Gálatas', 'EPH': 'Efésios',
    'PHP': 'Filipenses', 'COL': 'Colossenses', '1TH': '1 Tessalonicenses', '2TH': '2 Tessalonicenses',
    '1TI': '1 Timóteo', '2TI': '2 Timóteo', 'TIT': 'Tito', 'PHM': 'Filemom', 'HEB': 'Hebreus',
    'JAS': 'Tiago', '1PE': '1 Pedro', '2PE': '2 Pedro', '1JN': '1 João', '2JN': '2 João',
    '3JN': '3 João', 'JUD': 'Judas', 'REV': 'Apocalipse'
  };

  // Mapeamento visual fixo dos IDs para nomes em inglês
  const bookNamesEN: Record<string, string> = {
    // Antigo Testamento
    'GEN': 'Genesis', 'EXO': 'Exodus', 'LEV': 'Leviticus', 'NUM': 'Numbers', 'DEU': 'Deuteronomy',
    'JOS': 'Joshua', 'JDG': 'Judges', 'RUT': 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel',
    '1KI': '1 Kings', '2KI': '2 Kings', '1CH': '1 Chronicles', '2CH': '2 Chronicles', 'EZR': 'Ezra',
    'NEH': 'Nehemiah', 'EST': 'Esther', 'JOB': 'Job', 'PSA': 'Psalms', 'PRO': 'Proverbs',
    'ECC': 'Ecclesiastes', 'SNG': 'Song of Songs', 'ISA': 'Isaiah', 'JER': 'Jeremiah', 'LAM': 'Lamentations',
    'EZK': 'Ezekiel', 'DAN': 'Daniel', 'HOS': 'Hosea', 'JOL': 'Joel', 'AMO': 'Amos',
    'OBA': 'Obadiah', 'JON': 'Jonah', 'MIC': 'Micah', 'NAM': 'Nahum', 'HAB': 'Habakkuk',
    'ZEP': 'Zephaniah', 'HAG': 'Haggai', 'ZEC': 'Zechariah', 'MAL': 'Malachi',
    
    // Novo Testamento
    'MAT': 'Matthew', 'MRK': 'Mark', 'LUK': 'Luke', 'JHN': 'John', 'ACT': 'Acts',
    'ROM': 'Romans', '1CO': '1 Corinthians', '2CO': '2 Corinthians', 'GAL': 'Galatians', 'EPH': 'Ephesians',
    'PHP': 'Philippians', 'COL': 'Colossians', '1TH': '1 Thessalonians', '2TH': '2 Thessalonians',
    '1TI': '1 Timothy', '2TI': '2 Timothy', 'TIT': 'Titus', 'PHM': 'Philemon', 'HEB': 'Hebrews',
    'JAS': 'James', '1PE': '1 Peter', '2PE': '2 Peter', '1JN': '1 John', '2JN': '2 John',
    '3JN': '3 John', 'JUD': 'Jude', 'REV': 'Revelation'
  };

  // Selecionar mapeamento baseado no idioma
  const bookNamesMap = (languageCode === 'en') ? bookNamesEN : bookNamesPT;

  // Função para obter nome visual do livro
  function getBookVisualName(bookId: string): string {
    return bookNamesMap[bookId] || bookId; // Fallback para o ID se não encontrar
  }

  const localizedBookName = getBookVisualName(bookId);

  const header = el('div', { className: 'pageHeader' });
  const backBtn = el('button', { className: 'linkBtn', type: 'button' });
  backBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
  backBtn.addEventListener('click', onBack);

  const title = el('h2', { className: 'pageTitle', textContent: localizedBookName });
  header.appendChild(backBtn);
  header.appendChild(title);
  root.appendChild(header);

  const grid = el('div', { className: 'chaptersGrid' });
  root.appendChild(grid);

  function renderSkeleton(): void {
    grid.innerHTML = '';
    for (let i = 0; i < 24; i += 1) {
      const sk = el('div', { className: 'chapterBtn skeleton' });
      grid.appendChild(sk);
    }
  }

  renderSkeleton();

  let chapterNumbers: number[] = [];
  try {
    const res = await api.getChapters(translationId, bookId);
    chapterNumbers = res.chapters.map((c) => c.chapter);
  } catch {
    chapterNumbers = [];
  }

  if (chapterNumbers.length === 0) {
    grid.innerHTML = '';
    root.appendChild(
      el('div', {
        className: 'placeholder',
        textContent: 'Não foi possível carregar os capítulos. Tente novamente.',
      }),
    );
    return;
  }

  grid.innerHTML = '';

  for (const ch of chapterNumbers) {
    const btn = el('button', {
      className: `chapterBtn${currentChapter === ch ? ' active' : ''}`,
      type: 'button',
      textContent: String(ch),
    });
    btn.addEventListener('click', () => onSelectChapter(ch));
    grid.appendChild(btn);
  }
}
