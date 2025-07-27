import React, { useState } from 'react';
import Grid from '../components/Grid';
import GenreButtons from '../components/GenreButtons';

const GenresPage: React.FC = () => {
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const genres = [{id: 28, name: 'Action'}, {id: 12, name: 'Adventure'}, {id: 18, name: 'Drama'}, {id: 35, name: 'Comedy'}];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">Géneros</h1>
            <GenreButtons genres={genres.map(g => g.name)} onSelectGenre={setSelectedGenre} selectedGenre={selectedGenre || ''} />
            <Grid section="genres" genre={genres.find(g => g.name === selectedGenre)?.id.toString()} />
        </div>
    );
};

export default GenresPage;
