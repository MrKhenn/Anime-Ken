import React from 'react';
import Grid from '../components/Grid';

const SeriesPage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">Series</h1>
            <Grid section="series" />
        </div>
    );
};

export default SeriesPage;
