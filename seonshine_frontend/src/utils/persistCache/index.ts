class PersistCache {
  static save(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  static read(key: string): string | null {
    return localStorage.getItem(key);
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }
}

export default PersistCache;
