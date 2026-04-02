export type View = 'books' | 'chapters' | 'reader';

export type RouteState = {
  view: View;
  version: string;
  bookAbbrev?: string;
  bookName?: string;
  chapter?: number;
  highlightVerse?: number;
};

type Listener = (state: RouteState) => void;

export class Router {
  private state: RouteState;
  private listeners = new Set<Listener>();

  constructor(initial: RouteState) {
    this.state = initial;
  }

  getState(): RouteState {
    return this.state;
  }

  setState(next: RouteState): void {
    this.state = next;
    for (const l of this.listeners) l(this.state);
  }

  patch(patch: Partial<RouteState>): void {
    this.setState({ ...this.state, ...patch });
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }
}
