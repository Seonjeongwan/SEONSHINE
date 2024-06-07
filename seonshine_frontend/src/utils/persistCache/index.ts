import Cookies from 'js-cookie';

class PersistCache {
  static save(key: string, value: string, options: Cookies.CookieAttributes = {}): void {
    Cookies.set(key, value, options);
  }

  static read(key: string): string | undefined {
    return Cookies.get(key);
  }

  static remove(key: string): void {
    Cookies.remove(key);
  }
}

export default PersistCache;
