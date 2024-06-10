const SessionCache = {
    save: (key: string, value: string) => {
      sessionStorage.setItem(key, value);
    },
    read: (key: string): string | null => {
      return sessionStorage.getItem(key);
    },
    remove: (key: string) => {
      sessionStorage.removeItem(key);
    },
  };
  
  export default SessionCache;
  