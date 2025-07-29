import React, { useState } from 'react';
import Grid from '../components/Grid';
import GenreButtons from '../components/GenreButtons';

const GenresPage: React.FC = () => {
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const genres = [
        {id: 28, name: 'Action'},
        {id: 12, name: 'Adventure'},
        {id: 16, name: 'Animation'},
        {id: 35, name: 'Comedy'},
        {id: 80, name: 'Crime'},
        {id: 99, name: 'Documentary'},
        {id: 18, name: 'Drama'},
        {id: 10751, name: 'Family'},
        {id: 14, name: 'Fantasy'},
        {id: 36, name: 'History'},
        {id: 27, name: 'Horror'},
        {id: 10402, name: 'Music'},
        {id: 9648, name: 'Mystery'},
        {id: 10749, name: 'Romance'},
        {id: 878, name: 'Science Fiction'},
        {id: 10770, name: 'TV Movie'},
        {id: 53, name: 'Thriller'},
        {id: 10752, name: 'War'}
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">Géneros</h1>
            <GenreButtons genres={genres.map(g => g.name)} onSelectGenre={setSelectedGenre} selectedGenre={selectedGenre || ''} />
            <Grid section="genres" genre={selectedGenre || ''} />
        </div>
    );
};

export default GenresPage;
