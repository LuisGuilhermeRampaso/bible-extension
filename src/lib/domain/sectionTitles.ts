import type { DataVerse } from '../api/types';

export interface SectionTitle {
  title: string;
  subtitle?: string;
  verse: number;
}

export interface ChapterSections {
  [verse: number]: SectionTitle;
}

export interface BookSections {
  [chapter: number]: ChapterSections;
}

export interface BibleSections {
  [bookId: string]: BookSections;
}

// Mapeamento de títulos seccionais da Bíblia
export const BIBLE_SECTION_TITLES: BibleSections = {
  // Evangelho de João - Capítulos principais
  'jhn': {
    1: {
      1: { title: "O Verbo Divino", subtitle: "A pré-existência de Cristo", verse: 1 },
      19: { title: "O Testemunho de João Batista", subtitle: "João nega ser o Cristo", verse: 19 },
      29: { title: "Jesus, o Cordeiro de Deus", subtitle: "O primeiro encontro com Jesus", verse: 29 },
      35: { title: "Os Primeiros Discípulos", subtitle: "Chamado dos apóstolos", verse: 35 },
      43: { title: "A Chamada de Filipe e Natanael", subtitle: "O crescimento do ministério", verse: 43 }
    },
    3: {
      1: { title: "O Novo Nascimento", subtitle: "Diálogo com Nicodemos", verse: 1 },
      16: { title: "O Amor de Deus", subtitle: "O versículo mais famoso da Bíblia", verse: 16 },
      22: { title: "O Testemunho de João", subtitle: "A alegria de João Batista", verse: 22 }
    },
    10: {
      1: { title: "O Bom Pastor", subtitle: "Jesus cuida de suas ovelhas", verse: 1 },
      11: { title: "Jesus é a Porta", subtitle: "A entrada para a salvação", verse: 11 },
      22: { title: "A Festa da Dedicação", subtitle: "Jesus se revela como o Messias", verse: 22 }
    },
    20: {
      1: { title: "A Ressurreição", subtitle: "O túmulo vazio", verse: 1 },
      11: { title: "Maria Madalena", subtitle: "O primeiro encontro com o Cristo ressurreto", verse: 11 },
      19: { title: "Jesus Aparece aos Discípulos", subtitle: "A paz e a missão", verse: 19 },
      24: { title: "Tomé, o Incrédulo", subtitle: "A bênção para os que creem", verse: 24 },
      30: { title: "O Propósito do Evangelho", subtitle: "Para que creiamos", verse: 30 }
    }
  },

  // Gênesis - Capítulos fundamentais
  'gen': {
    1: {
      1: { title: "A Criação", subtitle: "Deus cria o universo e a vida", verse: 1 },
      26: { title: "A Criação do Homem", subtitle: "À imagem e semelhança de Deus", verse: 26 },
      31: { title: "A Avaliação de Deus", subtitle: "Era muito bom", verse: 31 }
    },
    2: {
      4: { title: "O Jardim do Éden", subtitle: "O lar perfeito", verse: 4 },
      15: { title: "O Mandamento", subtitle: "A árvore do conhecimento", verse: 15 },
      18: { title: "A Primeira Mulher", subtitle: "Eva é criada", verse: 18 }
    },
    3: {
      1: { title: "A Queda", subtitle: "A tentação e o pecado", verse: 1 },
      8: { title: "O Chamado de Deus", subtitle: "Onde você está?", verse: 8 },
      21: { title: "A Promessa", subtitle: "A primeira profecia messiânica", verse: 21 },
      23: { title: "A Expulsão", subtitle: "Deixando o Éden", verse: 23 }
    },
    12: {
      1: { title: "O Chamado de Abraão", subtitle: "Deus chama um homem", verse: 1 },
      7: { title: "A Promessa", subtitle: "Uma grande nação", verse: 7 },
      10: { title: "A Jornada", subtitle: "Partindo para Canaã", verse: 10 }
    },
    22: {
      1: { title: "O Teste de Fé", subtitle: "Deus prova Abraão", verse: 1 },
      11: { title: "A Providência", subtitle: "Deus providencia o cordeiro", verse: 11 },
      15: { title: "A Aliança", subtitle: "A promessa reafirmada", verse: 15 }
    }
  },

  // Salmos - Salmos mais conhecidos
  'psa': {
    23: {
      1: { title: "O Senhor é Meu Pastor", subtitle: "O salmo mais amado", verse: 1 },
      4: { title: "O Vale da Sombra da Morte", subtitle: "Confiando em tempos difíceis", verse: 4 },
      6: { title: "A Mesa Preparada", subtitle: "Honra na presença dos inimigos", verse: 6 }
    },
    51: {
      1: { title: "O Arrependimento de Davi", subtitle: "Tem misericórdia de mim", verse: 1 },
      10: { title: "Coração Puro", subtitle: "Cria em mim um coração puro", verse: 10 },
      17: { title: "Sacrifício Agradável", subtitle: "Espírito quebrantado", verse: 17 }
    },
    91: {
      1: { title: "Proteção Divina", subtitle: "À sombra do Onipotente", verse: 1 },
      11: { title: "Anjos de Guarda", subtitle: "Proteção angelical", verse: 11 },
      14: { title: "Promessas de Deus", subtitle: "Eu o livrarei", verse: 14 }
    },
    103: {
      1: { title: "Bênçãos de Deus", subtitle: "Bendize, ó minha alma", verse: 1 },
      8: { title: "Misericórdia e Graça", subtitle: "Tão grande é o seu amor", verse: 8 },
      12: { title: "Distância dos Pecados", subtitle: "Tão longe como o oriente do ocidente", verse: 12 }
    }
  },

  // Provérbios - Sabedoria prática
  'pro': {
    3: {
      1: { title: "Sabedoria e Instrução", subtitle: "O caminho da sabedoria", verse: 1 },
      5: { title: "Confia no Senhor", subtitle: "Reconhece-o em todos os teus caminhos", verse: 5 },
      11: { title: "A Correção do Senhor", subtitle: "Não desprezes a disciplina", verse: 11 }
    },
    31: {
      10: { title: "A Mulher Virtuosa", subtitle: "Quem a encontrará?", verse: 10 },
      25: { title: "Força e Dignidade", subtitle: "Veste-se de força e dignidade", verse: 25 },
      30: { title: "O Temor do Senhor", subtitle: "A mulher que teme ao Senhor", verse: 30 }
    }
  },

  // Isaías - Profecias messiânicas
  'isa': {
    9: {
      1: { title: "Luz na Escuridão", subtitle: "O povo que andava em trevas", verse: 1 },
      6: { title: "O Menino Messiânico", subtitle: "Um filho nos nasceu", verse: 6 }
    },
    53: {
      1: { title: "O Servo Sofredor", subtitle: "Quem creu em nossa pregação?", verse: 1 },
      4: { title: "Nossas Doenças", subtitle: "Ele tomou sobre si nossas enfermidades", verse: 4 },
      5: { title: "Nossos Pecados", subtitle: "A paz pela sua punição", verse: 5 },
      11: { title: "O Sacrifício Perfeito", subtitle: "Como cordeiro foi levado ao matadouro", verse: 11 }
    },
    55: {
      1: { title: "Convite à Salvação", subtitle: "Vós, todos os que tendes sede", verse: 1 },
      8: { title: "Os Caminhos de Deus", subtitle: "Meus pensamentos não são os vossos", verse: 8 },
      12: { title: "A Palavra de Deus", subtitle: "Não voltará vazia", verse: 12 }
    }
  },

  // Mateus - Ensinos de Jesus
  'mat': {
    5: {
      1: { title: "O Sermão do Monte", subtitle: "As bem-aventuranças", verse: 1 },
      3: { title: "Bem-Aventuranças", subtitle: "Felizes os humildes de espírito", verse: 3 },
      13: { title: "Sal e Luz", subtitle: "Vós sois o sal da terra", verse: 13 },
      21: { title: "A Lei e os Profetas", subtitle: "Não vim abolir, mas cumprir", verse: 21 },
      43: { title: "Amor aos Inimigos", subtitle: "Amai os vossos inimigos", verse: 43 }
    },
    6: {
      1: { title: "A Oração do Senhor", subtitle: "O Pai Nosso", verse: 1 },
      9: { title: "Como Orar", subtitle: "Pai nosso que estás nos céus", verse: 9 },
      19: { title: "Tesouros no Céu", subtitle: "Onde está o vosso tesouro", verse: 19 },
      24: { title: "Ansiedade", subtitle: "Não andeis ansiosos", verse: 24 },
      33: { title: "Buscai Primeiro", subtitle: "Buscai primeiro o reino de Deus", verse: 33 }
    },
    7: {
      1: { title: "Não Julgar", subtitle: "Não julgueis para não serdes julgados", verse: 1 },
      7: { title: "Oração Persistente", subtitle: "Pedi, buscai, batei", verse: 7 },
      12: { title: "A Porta Estreita", subtitle: "Entrai pela porta estreita", verse: 12 },
      24: { title: "Casa na Rocha", subtitle: "O homem prudente", verse: 24 }
    },
    28: {
      18: { title: "A Grande Comissão", subtitle: "Fazei discípulos de todas as nações", verse: 18 },
      20: { title: "A Presença de Cristo", subtitle: "Estou convosco sempre", verse: 20 }
    }
  },

  // Atos - História da igreja primitiva
  'act': {
    2: {
      1: { title: "Pentecostes", subtitle: "O Espírito Santo descende", verse: 1 },
      14: { title: "O Sermão de Pedro", subtitle: "A profecia de Joel", verse: 14 },
      22: { title: "Jesus, o Messias", subtitle: "A ressurreição e ascensão", verse: 22 },
      37: { title: "O Chamado ao Arrependimento", subtitle: "Arrependei-vos e batizai-vos", verse: 37 },
      42: { title: "A Primeira Igreja", subtitle: "Perseverança na doutrina", verse: 42 }
    },
    9: {
      1: { title: "A Conversão de Saulo", subtitle: "Perseguidor de cristãos", verse: 1 },
      15: { title: "O Chamado de Ananias", subtitle: "Instrumento escolhido", verse: 15 },
      20: { title: "Paulo, o Apóstolo", subtitle: "Escolhido para os gentios", verse: 20 }
    }
  },

  // Romanos - Teologia paulina
  'rom': {
    1: {
      1: { title: "Introdução a Romanos", subtitle: "Paulo, servo de Cristo", verse: 1 },
      16: { title: "O Evangelho", subtitle: "O poder de Deus para salvação", verse: 16 },
      18: { title: "A Ira de Deus", subtitle: "A revelação da justiça divina", verse: 18 }
    },
    3: {
      1: { title: "A Universalidade do Pecado", subtitle: "Não há justo, nem um sequer", verse: 1 },
      23: { title: "A Justificação pela Fé", subtitle: "Todos pecaram", verse: 23 },
      28: { title: "Justificação pela Fé", subtitle: "Justificados gratuitamente", verse: 28 }
    },
    5: {
      1: { title: "A Paz com Deus", subtitle: "Justificados pela fé", verse: 1 },
      8: { title: "O Amor de Deus", subtitle: "Deus prova seu amor por nós", verse: 8 },
      12: { title: "Adão e Cristo", subtitle: "Pecado e salvação", verse: 12 },
      20: { title: "A Graça Abundante", subtitle: "Onde abundou o pecado", verse: 20 }
    },
    8: {
      1: { title: "Vida no Espírito", subtitle: "Não há condenação", verse: 1 },
      28: { title: "Nada nos Separará", subtitle: "O amor de Cristo", verse: 28 },
      31: { title: "Conclusão Triunfante", subtitle: "Em todas estas coisas", verse: 31 }
    },
    12: {
      1: { title: "Culto Racional", subtitle: "Apresentai vossos corpos", verse: 1 },
      4: { title: "Diversos Ministérios", subtitle: "Muitos membros, um corpo", verse: 4 },
      9: { title: "Amor Sincero", subtitle: "O amor seja sem hipocrisia", verse: 9 }
    }
  },

  // Apocalipse - Profecias finais
  'rev': {
    1: {
      1: { title: "Revelação de Jesus Cristo", subtitle: "O que brevemente deve acontecer", verse: 1 },
      9: { title: "Patmos", subtitle: "João na ilha de Patmos", verse: 9 },
      12: { title: "Visão de Cristo", subtitle: "Alguém semelhante ao filho do homem", verse: 12 }
    },
    21: {
      1: { title: "Novos Céus e Nova Terra", subtitle: "Não haverá mais morte", verse: 1 },
      3: { title: "O Tabernáculo de Deus", subtitle: "Deus habitará com os homens", verse: 3 },
      4: { title: "Deus Enxugará Lágrimas", subtitle: "Não haverá mais pranto", verse: 4 }
    },
    22: {
      7: { title: "A Promessa Final", subtitle: "Eis que venho sem demora", verse: 7 },
      12: { title: "Recompensa", subtitle: "Eis que venho cedo", verse: 12 },
      13: { title: "Conclusão", subtitle: "A graça do Senhor Jesus", verse: 13 }
    }
  }
};

// Função para obter títulos seccionais para um capítulo específico
export function getSectionTitles(bookId: string, chapter: number): SectionTitle[] {
  const normalizedBookId = bookId.toLowerCase();
  const bookSections = BIBLE_SECTION_TITLES[normalizedBookId];
  
  if (!bookSections || !bookSections[chapter]) {
    return [];
  }
  
  return Object.values(bookSections[chapter]).sort((a, b) => a.verse - b.verse);
}

// Função para detectar automaticamente seções baseadas em padrões do texto
export function detectSectionChanges(verses: DataVerse[]): SectionTitle[] {
  const sections: SectionTitle[] = [];
  
  for (let i = 0; i < verses.length; i++) {
    const verse = verses[i];
    const text = verse.text.toLowerCase();
    
    // Detectar quando Jesus começa a falar
    if (text.includes('disse jesus') || text.includes('respondeu jesus') || text.includes('lhes disse:')) {
      if (i === 0 || !verses[i-1].text.toLowerCase().includes('disse jesus')) {
        sections.push({
          title: "Palavras de Jesus",
          verse: verse.verse
        });
      }
    }
    
    // Detectar mudança de local
    if (text.includes('entraram em') || text.includes('saíram de') || text.includes('chegaram a')) {
      const locationMatch = text.match(/(entraram em|saíram de|chegaram a) ([^.]+)/);
      if (locationMatch) {
        sections.push({
          title: `Em ${locationMatch[2].trim()}`,
          verse: verse.verse
        });
      }
    }
    
    // Detectar mudança de personagens principais
    if (text.includes('então') && (text.includes('disse') || text.includes('respondeu'))) {
      const personMatch = text.match(/então ([^ ]+) (disse|respondeu)/);
      if (personMatch) {
        sections.push({
          title: `Discurso de ${personMatch[1]}`,
          verse: verse.verse
        });
      }
    }
  }
  
  return sections;
}

// Função combinada que usa títulos mapeados e detecta automaticamente
export function getAllSectionTitles(bookId: string, chapter: number, verses: DataVerse[]): SectionTitle[] {
  const mappedTitles = getSectionTitles(bookId, chapter);
  const detectedTitles = detectSectionChanges(verses);
  
  // Combinar e remover duplicados
  const allTitles = [...mappedTitles];
  
  detectedTitles.forEach(detected => {
    const exists = allTitles.find(mapped => 
      Math.abs(mapped.verse - detected.verse) <= 2 // Considerar próximos como duplicados
    );
    if (!exists) {
      allTitles.push(detected);
    }
  });
  
  return allTitles.sort((a, b) => a.verse - b.verse);
}
