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

    let url = `http://localhost:4000/api/${section}?page=${page}`;
    if (section === 'movies' && genre) {
      url = `http://localhost:4000/api/search?q=${genre}`;
    } else if (genre) {
        url += `&genre=${genre}`;
    }

    fetch(url)
      .then(r => r.json())
      .then(res => {
        const filteredRes = res.filter((item: any) => item.poster && item.poster !== 'N/A');
        sessionStorage.setItem(cacheKey, JSON.stringify(filteredRes));
        setData(prev => [...prev, ...filteredRes]);
        setHasMore(filteredRes.length === 42);
      });
  }, [page, section, genre, cached, cacheKey]);

  return { data, loadMore: () => setPage(p => p + 1), hasMore };
}
