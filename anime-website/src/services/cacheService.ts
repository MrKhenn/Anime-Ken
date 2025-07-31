const CACHE_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

export const getCachedMovies = () => {
  const cachedData = localStorage.getItem('popularMovies');
  if (!cachedData) {
    return null;
  }

  const { data, timestamp } = JSON.parse(cachedData);
  if (Date.now() - timestamp > CACHE_EXPIRATION_MS) {
    localStorage.removeItem('popularMovies');
    return null;
  }

  return data;
};

export const cacheMovies = (data: any) => {
  const cacheData = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem('popularMovies', JSON.stringify(cacheData));
};
