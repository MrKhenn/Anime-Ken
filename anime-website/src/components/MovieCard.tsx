import React from 'react';
import { Card } from 'react-bootstrap';
import { Anime } from './AnimeCard';

interface MovieCardProps {
    movie: Anime;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <Card>
      <Card.Img variant="top" src={movie.poster} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>
          <small className="text-muted">{movie.Genre}</small>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default MovieCard;
