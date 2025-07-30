import React from 'react';

interface GenreTagsProps {
    genres: { id: number; name: string }[];
    onSelectGenre: (genre: string | null) => void;
    selectedGenre: string | null;
}

const GenreTags: React.FC<GenreTagsProps> = ({ genres, onSelectGenre, selectedGenre }) => {
    return (
        <div className="flex flex-wrap justify-center mb-8">
            {genres.map(genre => (
                <button
                    key={genre.id}
                    onClick={() => onSelectGenre(genre.name)}
                    className={`px-4 py-2 m-2 rounded-full font-semibold ${
                        selectedGenre === genre.name
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-800 text-gray-300'
                    }`}
                >
                    {genre.name}
                </button>
            ))}
        </div>
    );
};

export default GenreTags;
