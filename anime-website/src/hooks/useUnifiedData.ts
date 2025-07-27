import { useEffect, useState } from 'react';

export default function useUnifiedData(section: 'movies'|'series'|'genres', genre?: string) {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const cacheKey = `${section}_${genre || 'all'}_${page}`;
  const cached = sessionStorage.getItem(cacheKey);

  useEffect(() => {
    if (cached) {
      setData(prev => [...prev, ...JSON.parse(cached)]);
      setHasMore(JSON.parse(cached).length === 42); // 6×7
      return;
    }

    fetch(`/api/${section}?page=${page}${genre ? `&genre=${genre}` : ''}`)
      .then(r => r.json())
      .then(res => {
        sessionStorage.setItem(cacheKey, JSON.stringify(res));
        setData(prev => [...prev, ...res]);
        setHasMore(res.length === 42);
      });
  }, [page, section, genre, cached, cacheKey]);

  return { data, loadMore: () => setPage(p => p + 1), hasMore };
}
