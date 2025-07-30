import React from 'react';
import { Card } from 'react-bootstrap';
import { Anime } from './AnimeCard';

interface SeriesCardProps {
    serie: Anime;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ serie }) => {
  return (
    <Card>
      <Card.Img variant="top" src={serie.poster} />
      <Card.Body>
        <Card.Title>{serie.title}</Card.Title>
        <Card.Text>
          <small className="text-muted">{serie.Genre}</small>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default SeriesCard;
