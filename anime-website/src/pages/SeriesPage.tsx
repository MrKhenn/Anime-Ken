import React, { useState } from 'react';
import Grid from '../components/Grid';
import GenreButtons from '../components/GenreButtons';

const SeriesPage: React.FC = () => {
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const genres = [{id: 10759, name: 'Action & Adventure'}, {id: 16, name: 'Animation'}, {id: 35, name: 'Comedy'}, {id: 80, name: 'Crime'}, {id: 99, name: 'Documentary'}, {id: 18, name: 'Drama'}, {id: 10751, name: 'Family'}, {id: 10762, name: 'Kids'}, {id: 9648, name: 'Mystery'}, {id: 10763, name: 'News'}, {id: 10764, name: 'Reality'}, {id: 10765, name: 'Sci-Fi & Fantasy'}, {id: 10766, name: 'Soap'}, {id: 10767, name: 'Talk'}, {id: 10768, name: 'War & Politics'}, {id: 37, name: 'Western'}];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">Series</h1>
            <GenreButtons genres={genres.map(g => g.name)} onSelectGenre={setSelectedGenre} selectedGenre={selectedGenre || ''} />
            <Grid section="series" genre={genres.find(g => g.name === selectedGenre)?.id.toString()} />
        </div>
    );
};

export default SeriesPage;
