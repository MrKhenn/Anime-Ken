import { useEffect, useState } from 'react';

export default function useUnifiedData(section: 'movies'|'series'|'genres', genre?: string) {
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setData([]);
    setPage(1);
  }, [genre, section]);

  useEffect(() => {
    const fetchData = async () => {
        const cacheKey = `${section}_${genre || 'all'}_${page}`;
        const cached = sessionStorage.getItem(cacheKey);

        if (cached) {
            setData(prev => [...prev, ...JSON.parse(cached)]);
            setHasMore(JSON.parse(cached).length === 42); // 6×7
            return;
        }

        let url = '';
        if (section === 'genres') {
            if (genre) {
                url = `http://localhost:4000/api/genres?genre=${genre}&page=${page}`;
            } else {
                url = `http://localhost:4000/api/genres?page=${page}`;
            }
        } else if (section === 'series') {
            url = `http://localhost:4000/api/series?page=${page}`;
        } else if (section === 'movies') {
            url = `http://localhost:4000/api/movies?page=${page}`;
        } else if (genre) {
            url = `http://localhost:4000/api/search?q=${genre}&page=${page}`;
        } else {
            return;
        }

        if (!url) return;

        const response = await fetch(url);
        const res = await response.json();
        const filteredRes = res.filter((item: any) => item.poster && item.poster !== 'N/A');
        if(page === 1) setData(filteredRes);
        else setData(prev => [...prev, ...filteredRes]);
        setHasMore(filteredRes.length === 42);
    };

    fetchData();
  }, [page, section, genre]);

  return { data, loadMore: () => setPage(p => p + 1), hasMore };
}
