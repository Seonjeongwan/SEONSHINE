class PersistCache {
  static save(key: string, value: string, rememberMe?: boolean) {
    if (rememberMe) {
      localStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, value);
    }
  }

  static read(key: string): string | null {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  }

  static remove(key: string) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}

export default PersistCache;
