export interface HeadingSection {
  from: number;
  to: number;
  title: {
    pt: string;
    en: string;
  };
}

export interface ChapterHeadings {
  [chapterNumber: string]: HeadingSection[];
}

export interface BookHeadings {
  [bookId: string]: ChapterHeadings;
}

export interface HeadingsData {
  [bookId: string]: ChapterHeadings;
}

class HeadingsService {
  private headingsData: HeadingsData | null = null;
  private loadPromise: Promise<void> | null = null;

  async loadHeadings(): Promise<void> {
    if (this.headingsData) return;
    
    if (this.loadPromise) {
      await this.loadPromise;
      return;
    }

    this.loadPromise = this.fetchHeadings();
    await this.loadPromise;
  }

  private async fetchHeadings(): Promise<void> {
    try {
      console.log('Fetching headings from /headings_v1_pentateuco.json');
      const response = await fetch('/headings_v1_pentateuco.json');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to load headings: ${response.status}`);
      }
      this.headingsData = await response.json();
      console.log('Headings loaded:', this.headingsData ? Object.keys(this.headingsData) : 'null');
      
      // Verificar se GEN existe nos dados
      if (this.headingsData && this.headingsData['GEN']) {
        console.log('GEN chapters:', Object.keys(this.headingsData['GEN']));
        console.log('GEN 1:', this.headingsData['GEN']['1']);
      }
    } catch (error) {
      console.error('Error loading headings:', error);
      this.headingsData = {};
    }
  }

  getChapterHeadings(bookId: string, chapter: number, _language: 'pt' | 'en' = 'pt'): HeadingSection[] {
    if (!this.headingsData) return [];
    
    const bookHeadings = this.headingsData[bookId];
    if (!bookHeadings) return [];
    
    const chapterHeadings = bookHeadings[chapter.toString()];
    if (!chapterHeadings) return [];
    
    return chapterHeadings;
  }

  getVerseHeading(bookId: string, chapter: number, verse: number, language: 'pt' | 'en' = 'pt'): HeadingSection | null {
    const headings = this.getChapterHeadings(bookId, chapter, language);
    
    for (const heading of headings) {
      if (verse >= heading.from && verse <= heading.to) {
        return heading;
      }
    }
    
    return null;
  }

  getAllHeadingsForChapter(bookId: string, chapter: number, language: 'pt' | 'en' = 'pt'): Array<{
    verse: number;
    title: string;
    isNewSection: boolean;
  }> {
    const headings = this.getChapterHeadings(bookId, chapter, language);
    const result: Array<{ verse: number; title: string; isNewSection: boolean }> = [];
    
    console.log('Processing headings for language:', language);
    
    for (const heading of headings) {
      const title = heading.title[language] || heading.title['pt'] || heading.title['en'] || 'Sem título';
      console.log('Heading:', heading, 'Title:', title);
      
      result.push({
        verse: heading.from,
        title: title,
        isNewSection: true
      });
    }
    
    return result;
  }

  hasHeadingsForBook(bookId: string): boolean {
    if (!this.headingsData) return false;
    return bookId in this.headingsData;
  }

  hasHeadingsForChapter(bookId: string, chapter: number): boolean {
    const headings = this.getChapterHeadings(bookId, chapter);
    return headings.length > 0;
  }
}

export const headingsService = new HeadingsService();
