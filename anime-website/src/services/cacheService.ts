const CACHE_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

export const getCache = (key: string) => {
  const cachedData = localStorage.getItem(key);
  if (!cachedData) {
    return null;
  }

  const { data, timestamp } = JSON.parse(cachedData);
  if (Date.now() - timestamp > CACHE_EXPIRATION_MS) {
    localStorage.removeItem(key);
    return null;
  }

  return data;
};

export const setCache = (key: string, data: any) => {
  const cacheData = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
};
