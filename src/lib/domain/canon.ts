export type CanonBook = {
  name: string;
  abbrev: string;
};

export const CANON_PT_66: CanonBook[] = [
  { name: 'Gênesis', abbrev: 'gn' },
  { name: 'Êxodo', abbrev: 'ex' },
  { name: 'Levítico', abbrev: 'lv' },
  { name: 'Números', abbrev: 'nm' },
  { name: 'Deuteronômio', abbrev: 'dt' },
  { name: 'Josué', abbrev: 'js' },
  { name: 'Juízes', abbrev: 'jz' },
  { name: 'Rute', abbrev: 'rt' },
  { name: '1 Samuel', abbrev: '1sm' },
  { name: '2 Samuel', abbrev: '2sm' },
  { name: '1 Reis', abbrev: '1rs' },
  { name: '2 Reis', abbrev: '2rs' },
  { name: '1 Crônicas', abbrev: '1cr' },
  { name: '2 Crônicas', abbrev: '2cr' },
  { name: 'Esdras', abbrev: 'ed' },
  { name: 'Neemias', abbrev: 'ne' },
  { name: 'Ester', abbrev: 'et' },
  { name: 'Jó', abbrev: 'job' },
  { name: 'Salmos', abbrev: 'sl' },
  { name: 'Provérbios', abbrev: 'pv' },
  { name: 'Eclesiastes', abbrev: 'ec' },
  { name: 'Cânticos', abbrev: 'ct' },
  { name: 'Isaías', abbrev: 'is' },
  { name: 'Jeremias', abbrev: 'jr' },
  { name: 'Lamentações', abbrev: 'lm' },
  { name: 'Ezequiel', abbrev: 'ez' },
  { name: 'Daniel', abbrev: 'dn' },
  { name: 'Oséias', abbrev: 'os' },
  { name: 'Joel', abbrev: 'jl' },
  { name: 'Amós', abbrev: 'am' },
  { name: 'Obadias', abbrev: 'ob' },
  { name: 'Jonas', abbrev: 'jn' },
  { name: 'Miquéias', abbrev: 'mq' },
  { name: 'Naum', abbrev: 'na' },
  { name: 'Habacuque', abbrev: 'hc' },
  { name: 'Sofonias', abbrev: 'sf' },
  { name: 'Ageu', abbrev: 'ag' },
  { name: 'Zacarias', abbrev: 'zc' },
  { name: 'Malaquias', abbrev: 'ml' },
  { name: 'Mateus', abbrev: 'mt' },
  { name: 'Marcos', abbrev: 'mc' },
  { name: 'Lucas', abbrev: 'lc' },
  { name: 'João', abbrev: 'jo' },
  { name: 'Atos', abbrev: 'at' },
  { name: 'Romanos', abbrev: 'rm' },
  { name: '1 Coríntios', abbrev: '1co' },
  { name: '2 Coríntios', abbrev: '2co' },
  { name: 'Gálatas', abbrev: 'gl' },
  { name: 'Efésios', abbrev: 'ef' },
  { name: 'Filipenses', abbrev: 'fp' },
  { name: 'Colossenses', abbrev: 'cl' },
  { name: '1 Tessalonicenses', abbrev: '1ts' },
  { name: '2 Tessalonicenses', abbrev: '2ts' },
  { name: '1 Timóteo', abbrev: '1tm' },
  { name: '2 Timóteo', abbrev: '2tm' },
  { name: 'Tito', abbrev: 'tt' },
  { name: 'Filemom', abbrev: 'fm' },
  { name: 'Hebreus', abbrev: 'hb' },
  { name: 'Tiago', abbrev: 'tg' },
  { name: '1 Pedro', abbrev: '1pe' },
  { name: '2 Pedro', abbrev: '2pe' },
  { name: '1 João', abbrev: '1jo' },
  { name: '2 João', abbrev: '2jo' },
  { name: '3 João', abbrev: '3jo' },
  { name: 'Judas', abbrev: 'jd' },
  { name: 'Apocalipse', abbrev: 'ap' },
];

export const CANON_EN_66: CanonBook[] = [
  { name: 'Genesis', abbrev: 'gen' },
  { name: 'Exodus', abbrev: 'exod' },
  { name: 'Leviticus', abbrev: 'lev' },
  { name: 'Numbers', abbrev: 'num' },
  { name: 'Deuteronomy', abbrev: 'deut' },
  { name: 'Joshua', abbrev: 'josh' },
  { name: 'Judges', abbrev: 'judg' },
  { name: 'Ruth', abbrev: 'ruth' },
  { name: '1 Samuel', abbrev: '1sam' },
  { name: '2 Samuel', abbrev: '2sam' },
  { name: '1 Kings', abbrev: '1kgs' },
  { name: '2 Kings', abbrev: '2kgs' },
  { name: '1 Chronicles', abbrev: '1chr' },
  { name: '2 Chronicles', abbrev: '2chr' },
  { name: 'Ezra', abbrev: 'ezra' },
  { name: 'Nehemiah', abbrev: 'neh' },
  { name: 'Esther', abbrev: 'esth' },
  { name: 'Job', abbrev: 'job' },
  { name: 'Psalms', abbrev: 'ps' },
  { name: 'Proverbs', abbrev: 'prov' },
  { name: 'Ecclesiastes', abbrev: 'eccl' },
  { name: 'Song of Solomon', abbrev: 'song' },
  { name: 'Isaiah', abbrev: 'isa' },
  { name: 'Jeremiah', abbrev: 'jer' },
  { name: 'Lamentations', abbrev: 'lam' },
  { name: 'Ezekiel', abbrev: 'ezek' },
  { name: 'Daniel', abbrev: 'dan' },
  { name: 'Hosea', abbrev: 'hos' },
  { name: 'Joel', abbrev: 'joel' },
  { name: 'Amos', abbrev: 'amos' },
  { name: 'Obadiah', abbrev: 'obad' },
  { name: 'Jonah', abbrev: 'jonah' },
  { name: 'Micah', abbrev: 'mic' },
  { name: 'Nahum', abbrev: 'nah' },
  { name: 'Habakkuk', abbrev: 'hab' },
  { name: 'Zephaniah', abbrev: 'zeph' },
  { name: 'Haggai', abbrev: 'hag' },
  { name: 'Zechariah', abbrev: 'zech' },
  { name: 'Malachi', abbrev: 'mal' },
  { name: 'Matthew', abbrev: 'matt' },
  { name: 'Mark', abbrev: 'mark' },
  { name: 'Luke', abbrev: 'luke' },
  { name: 'John', abbrev: 'john' },
  { name: 'Acts', abbrev: 'acts' },
  { name: 'Romans', abbrev: 'rom' },
  { name: '1 Corinthians', abbrev: '1cor' },
  { name: '2 Corinthians', abbrev: '2cor' },
  { name: 'Galatians', abbrev: 'gal' },
  { name: 'Ephesians', abbrev: 'eph' },
  { name: 'Philippians', abbrev: 'phil' },
  { name: 'Colossians', abbrev: 'col' },
  { name: '1 Thessalonians', abbrev: '1thess' },
  { name: '2 Thessalonians', abbrev: '2thess' },
  { name: '1 Timothy', abbrev: '1tim' },
  { name: '2 Timothy', abbrev: '2tim' },
  { name: 'Titus', abbrev: 'titus' },
  { name: 'Philemon', abbrev: 'phlm' },
  { name: 'Hebrews', abbrev: 'heb' },
  { name: 'James', abbrev: 'jas' },
  { name: '1 Peter', abbrev: '1pet' },
  { name: '2 Peter', abbrev: '2pet' },
  { name: '1 John', abbrev: '1john' },
  { name: '2 John', abbrev: '2john' },
  { name: '3 John', abbrev: '3john' },
  { name: 'Jude', abbrev: 'jude' },
  { name: 'Revelation', abbrev: 'rev' },
];

export const CANON_ES_66: CanonBook[] = [
  { name: 'Génesis', abbrev: 'gn' },
  { name: 'Éxodo', abbrev: 'ex' },
  { name: 'Levítico', abbrev: 'lv' },
  { name: 'Números', abbrev: 'nm' },
  { name: 'Deuteronomio', abbrev: 'dt' },
  { name: 'Josué', abbrev: 'js' },
  { name: 'Jueces', abbrev: 'jue' },
  { name: 'Rut', abbrev: 'rt' },
  { name: '1 Samuel', abbrev: '1sm' },
  { name: '2 Samuel', abbrev: '2sm' },
  { name: '1 Reyes', abbrev: '1re' },
  { name: '2 Reyes', abbrev: '2re' },
  { name: '1 Crónicas', abbrev: '1cr' },
  { name: '2 Crónicas', abbrev: '2cr' },
  { name: 'Esdras', abbrev: 'esd' },
  { name: 'Nehemías', abbrev: 'ne' },
  { name: 'Ester', abbrev: 'est' },
  { name: 'Job', abbrev: 'jb' },
  { name: 'Salmos', abbrev: 'sal' },
  { name: 'Proverbios', abbrev: 'pr' },
  { name: 'Eclesiastés', abbrev: 'ec' },
  { name: 'Cantares', abbrev: 'cnt' },
  { name: 'Isaías', abbrev: 'is' },
  { name: 'Jeremías', abbrev: 'jr' },
  { name: 'Lamentaciones', abbrev: 'lm' },
  { name: 'Ezequiel', abbrev: 'ez' },
  { name: 'Daniel', abbrev: 'dn' },
  { name: 'Oseas', abbrev: 'os' },
  { name: 'Joel', abbrev: 'jl' },
  { name: 'Amós', abbrev: 'am' },
  { name: 'Abdías', abbrev: 'ab' },
  { name: 'Jonás', abbrev: 'jn' },
  { name: 'Miqueas', abbrev: 'mq' },
  { name: 'Nahúm', abbrev: 'nh' },
  { name: 'Habacuc', abbrev: 'hb' },
  { name: 'Sofonías', abbrev: 'sf' },
  { name: 'Hageo', abbrev: 'hg' },
  { name: 'Zacarías', abbrev: 'zc' },
  { name: 'Malaquías', abbrev: 'ml' },
  { name: 'Mateo', abbrev: 'mt' },
  { name: 'Marcos', abbrev: 'mr' },
  { name: 'Lucas', abbrev: 'lc' },
  { name: 'Juan', abbrev: 'jn' },
  { name: 'Hechos', abbrev: 'hch' },
  { name: 'Romanos', abbrev: 'ro' },
  { name: '1 Corintios', abbrev: '1co' },
  { name: '2 Corintios', abbrev: '2co' },
  { name: 'Gálatas', abbrev: 'ga' },
  { name: 'Efesios', abbrev: 'ef' },
  { name: 'Filipenses', abbrev: 'fp' },
  { name: 'Colosenses', abbrev: 'cl' },
  { name: '1 Tesalonicenses', abbrev: '1ts' },
  { name: '2 Tesalonicenses', abbrev: '2ts' },
  { name: '1 Timoteo', abbrev: '1tm' },
  { name: '2 Timoteo', abbrev: '2tm' },
  { name: 'Tito', abbrev: 'tt' },
  { name: 'Filemón', abbrev: 'fm' },
  { name: 'Hebreos', abbrev: 'hb' },
  { name: 'Santiago', abbrev: 'stg' },
  { name: '1 Pedro', abbrev: '1pe' },
  { name: '2 Pedro', abbrev: '2pe' },
  { name: '1 Juan', abbrev: '1jn' },
  { name: '2 Juan', abbrev: '2jn' },
  { name: '3 Juan', abbrev: '3jn' },
  { name: 'Judas', abbrev: 'jd' },
  { name: 'Apocalipsis', abbrev: 'ap' },
];

export function getLocalizedBookAbbrev(bookId: string, languageCode: string): string {
  const canon = languageCode === 'por' || languageCode === 'pt-br' ? CANON_PT_66 : 
                languageCode === 'es' ? CANON_ES_66 : CANON_EN_66;
  const book = canon.find(b => b.abbrev === bookId);
  return book ? book.abbrev : bookId;
}

export function getLocalizedBookName(bookId: string, languageCode: string): string {
  const canon = languageCode === 'por' || languageCode === 'pt-br' ? CANON_PT_66 : 
                languageCode === 'es' ? CANON_ES_66 : CANON_EN_66;
  
  // Try to find exact match first
  const book = canon.find(b => b.abbrev === bookId);
  if (book) {
    return book.name;
  }
  
  // Try common variations and partial matches
  const normalizedBookId = bookId.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Map common API abbreviations to local abbreviations
  const abbreviationMap: Record<string, Record<string, string>> = {
    'pt-br': {
      'exod': 'ex',        // Exodus API abbreviation → local 'ex'
      'gen': 'gn',         // Genesis API abbreviation → local 'gn'
      'lev': 'lv',         // Leviticus API abbreviation → local 'lv'
      'num': 'nm',         // Numbers API abbreviation → local 'nm'
      'deut': 'dt',        // Deuteronomy API abbreviation → local 'dt'
      'josh': 'js',        // Joshua API abbreviation → local 'js'
      'judg': 'jz',        // Judges API abbreviation → local 'jz'
      'ruth': 'rt',        // Ruth API abbreviation → local 'rt'
      '1sam': '1sm',       // 1 Samuel API abbreviation → local '1sm'
      '2sam': '2sm',       // 2 Samuel API abbreviation → local '2sm'
      '1kgs': '1rs',       // 1 Kings API abbreviation → local '1rs'
      '2kgs': '2rs',       // 2 Kings API abbreviation → local '2rs'
      '1chr': '1cr',       // 1 Chronicles API abbreviation → local '1cr'
      '2chr': '2cr',       // 2 Chronicles API abbreviation → local '2cr'
      'ezra': 'ed',         // Ezra API abbreviation → local 'ed'
      'neh': 'ne',         // Nehemiah API abbreviation → local 'ne'
      'esth': 'et',        // Esther API abbreviation → local 'et'
      'job': 'job',        // Job API abbreviation → local 'job'
      'ps': 'sl',          // Psalms API abbreviation → local 'sl'
      'prov': 'pv',        // Proverbs API abbreviation → local 'pv'
      'eccl': 'ec',        // Ecclesiastes API abbreviation → local 'ec'
      'song': 'ct',        // Song of Solomon API abbreviation → local 'ct'
      'isa': 'is',         // Isaiah API abbreviation → local 'is'
      'jer': 'jr',         // Jeremiah API abbreviation → local 'jr'
      'lam': 'lm',         // Lamentations API abbreviation → local 'lm'
      'ezek': 'ez',        // Ezekiel API abbreviation → local 'ez'
      'dan': 'dn',         // Daniel API abbreviation → local 'dn'
      'hos': 'os',         // Hosea API abbreviation → local 'os'
      'joel': 'jl',        // Joel API abbreviation → local 'jl'
      'amos': 'am',        // Amos API abbreviation → local 'am'
      'obad': 'ob',        // Obadiah API abbreviation → local 'ob'
      'jonah': 'jn',       // Jonah API abbreviation → local 'jn'
      'mic': 'mq',         // Micah API abbreviation → local 'mq'
      'nah': 'na',         // Nahum API abbreviation → local 'na'
      'hab': 'hc',         // Habakkuk API abbreviation → local 'hc'
      'zeph': 'sf',        // Zephaniah API abbreviation → local 'sf'
      'hag': 'ag',         // Haggai API abbreviation → local 'ag'
      'zech': 'zc',        // Zechariah API abbreviation → local 'zc'
      'mal': 'ml',         // Malachi API abbreviation → local 'ml'
      'matt': 'mt',        // Matthew API abbreviation → local 'mt'
      'mark': 'mc',        // Mark API abbreviation → local 'mc'
      'luke': 'lc',        // Luke API abbreviation → local 'lc'
      'john': 'jo',        // John API abbreviation → local 'jo'
      'acts': 'at',        // Acts API abbreviation → local 'at'
      'rom': 'rm',         // Romans API abbreviation → local 'rm'
      '1cor': '1co',       // 1 Corinthians API abbreviation → local '1co'
      '2cor': '2co',       // 2 Corinthians API abbreviation → local '2co'
      'gal': 'gl',         // Galatians API abbreviation → local 'gl'
      'eph': 'ef',         // Ephesians API abbreviation → local 'ef'
      'phil': 'fp',        // Philippians API abbreviation → local 'fp'
      'col': 'cl',         // Colossians API abbreviation → local 'cl'
      '1thess': '1ts',     // 1 Thessalonians API abbreviation → local '1ts'
      '2thess': '2ts',     // 2 Thessalonians API abbreviation → local '2ts'
      '1tim': '1tm',       // 1 Timothy API abbreviation → local '1tm'
      '2tim': '2tm',       // 2 Timothy API abbreviation → local '2tm'
      'titus': 'tt',       // Titus API abbreviation → local 'tt'
      'phlm': 'fm',        // Philemon API abbreviation → local 'fm'
      'heb': 'hb',         // Hebrews API abbreviation → local 'hb'
      'jas': 'tg',         // James API abbreviation → local 'tg'
      '1pet': '1pe',       // 1 Peter API abbreviation → local '1pe'
      '2pet': '2pe',       // 2 Peter API abbreviation → local '2pe'
      '1john': '1jo',      // 1 John API abbreviation → local '1jo'
      '2john': '2jo',      // 2 John API abbreviation → local '2jo'
      '3john': '3jo',      // 3 John API abbreviation → local '3jo'
      'jude': 'jd',        // Jude API abbreviation → local 'jd'
      'rev': 'ap',         // Revelation API abbreviation → local 'ap'
      
      // Keep original mappings as fallback
      'ex': 'ex',        // Êxodo
      'gn': 'gn',        // Gênesis
      'lv': 'lv',        // Levítico
      'nm': 'nm',        // Números
      'dt': 'dt',        // Deuteronômio
      'js': 'js',        // Josué
      'jz': 'jz',        // Juízes
      'rt': 'rt',        // Rute
      '1sm': '1sm',      // 1 Samuel
      '2sm': '2sm',      // 2 Samuel
      '1rs': '1rs',      // 1 Reis
      '2rs': '2rs',      // 2 Reis
      '1cr': '1cr',      // 1 Crônicas
      '2cr': '2cr',      // 2 Crônicas
      'ed': 'ed',        // Esdras
      'ne': 'ne',        // Neemias
      'et': 'et',        // Ester
      'sl': 'sl',        // Salmos
      'pv': 'pv',        // Provérbios
      'ec': 'ec',        // Eclesiastes
      'ct': 'ct',        // Cânticos
      'is': 'is',        // Isaías
      'jr': 'jr',        // Jeremias
      'lm': 'lm',        // Lamentações
      'ez': 'ez',        // Ezequiel
      'dn': 'dn',        // Daniel
      'os': 'os',        // Oséias
      'jl': 'jl',        // Joel
      'am': 'am',        // Amós
      'ob': 'ob',        // Obadias
      'jn': 'jn',        // Jonas
      'mq': 'mq',        // Miquéias
      'na': 'na',        // Naum
      'hc': 'hc',        // Habacuque
      'sf': 'sf',        // Sofonias
      'ag': 'ag',        // Ageu
      'zc': 'zc',        // Zacarias
      'ml': 'ml',        // Malaquias
      'mt': 'mt',        // Mateus
      'mc': 'mc',        // Marcos
      'lc': 'lc',        // Lucas
      'jo': 'jo',        // João
      'at': 'at',        // Atos
      'rm': 'rm',        // Romanos
      '1co': '1co',      // 1 Coríntios
      '2co': '2co',      // 2 Coríntios
      'gl': 'gl',        // Gálatas
      'ef': 'ef',        // Efésios
      'fp': 'fp',        // Filipenses
      'cl': 'cl',        // Colossenses
      '1ts': '1ts',      // 1 Tessalonicenses
      '2ts': '2ts',      // 2 Tessalonicenses
      '1tm': '1tm',      // 1 Timóteo
      '2tm': '2tm',      // 2 Timóteo
      'tt': 'tt',        // Tito
      'fm': 'fm',        // Filemom
      'hb': 'hb',        // Hebreus
      'tg': 'tg',        // Tiago
      '1pe': '1pe',      // 1 Pedro
      '2pe': '2pe',      // 2 Pedro
      '1jo': '1jo',      // 1 João
      '2jo': '2jo',      // 2 João
      '3jo': '3jo',      // 3 João
      'jd': 'jd',        // Judas
      'ap': 'ap',        // Apocalipse
    },
    'en': {
      'gen': 'gen',      // Genesis
      'exod': 'exod',    // Exodus
      'lev': 'lev',      // Leviticus
      'num': 'num',      // Numbers
      'deut': 'deut',    // Deuteronomy
      'josh': 'josh',    // Joshua
      'judg': 'judg',    // Judges
      'ruth': 'ruth',    // Ruth
      '1sam': '1sam',    // 1 Samuel
      '2sam': '2sam',    // 2 Samuel
      '1kgs': '1kgs',    // 1 Kings
      '2kgs': '2kgs',    // 2 Kings
      '1chr': '1chr',    // 1 Chronicles
      '2chr': '2chr',    // 2 Chronicles
      'ezra': 'ezra',    // Ezra
      'neh': 'neh',      // Nehemiah
      'esth': 'esth',    // Esther
      'job': 'job',      // Job
      'ps': 'ps',        // Psalms
      'prov': 'prov',    // Proverbs
      'eccl': 'eccl',    // Ecclesiastes
      'song': 'song',    // Song of Solomon
      'isa': 'isa',      // Isaiah
      'jer': 'jer',      // Jeremiah
      'lam': 'lam',      // Lamentations
      'ezek': 'ezek',    // Ezekiel
      'dan': 'dan',      // Daniel
      'hos': 'hos',      // Hosea
      'joel': 'joel',    // Joel
      'amos': 'amos',    // Amos
      'obad': 'obad',    // Obadiah
      'jonah': 'jonah',  // Jonah
      'mic': 'mic',      // Micah
      'nah': 'nah',      // Nahum
      'hab': 'hab',      // Habakkuk
      'zeph': 'zeph',    // Zephaniah
      'hag': 'hag',      // Haggai
      'zech': 'zech',    // Zechariah
      'mal': 'mal',      // Malachi
      'matt': 'matt',    // Matthew
      'mark': 'mark',    // Mark
      'luke': 'luke',    // Luke
      'john': 'john',    // John
      'acts': 'acts',    // Acts
      'rom': 'rom',      // Romans
      '1cor': '1cor',    // 1 Corinthians
      '2cor': '2cor',    // 2 Corinthians
      'gal': 'gal',      // Galatians
      'eph': 'eph',      // Ephesians
      'phil': 'phil',    // Philippians
      'col': 'col',      // Colossians
      '1thess': '1thess', // 1 Thessalonians
      '2thess': '2thess', // 2 Thessalonians
      '1tim': '1tim',    // 1 Timothy
      '2tim': '2tim',    // 2 Timothy
      'titus': 'titus',  // Titus
      'phlm': 'phlm',    // Philemon
      'heb': 'heb',      // Hebrews
      'jas': 'jas',      // James
      '1pet': '1pet',    // 1 Peter
      '2pet': '2pet',    // 2 Peter
      '1john': '1john',  // 1 John
      '2john': '2john',  // 2 John
      '3john': '3john',  // 3 John
      'jude': 'jude',    // Jude
      'rev': 'rev',      // Revelation
    }
  };
  
  const langMap = abbreviationMap[languageCode] || abbreviationMap['pt-br'];
  const mappedAbbrev = langMap[normalizedBookId];
  
  if (mappedAbbrev) {
    const mappedBook = canon.find(b => b.abbrev === mappedAbbrev);
    if (mappedBook) return mappedBook.name;
  }
  
  // Fallback: try to find by partial match or return the bookId as is
  const partialMatch = canon.find(b => 
    b.abbrev.toLowerCase().includes(normalizedBookId) || 
    normalizedBookId.includes(b.abbrev.toLowerCase())
  );
  
  return partialMatch ? partialMatch.name : bookId;
}

export function getLangByVersion(version: string): string {
  switch (version) {
    case 'almeida':
    case 'jfa':
    case 'nvi':
      return 'pt-br';
    case 'kjv':
      return 'en';
    case 'rccv':
    case 'rvr1960':
      return 'es';
    default:
      return 'pt-br';
  }
}