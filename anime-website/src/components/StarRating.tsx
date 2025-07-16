import React from 'react';
import './StarRating.css';

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full-${i}`} className="star full-star">★</span>);
  }

  if (halfStar) {
    stars.push(<span key="half" className="star half-star">★</span>);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} className="star empty-star">☆</span>);
  }

  return <div className="star-rating">{stars}</div>;
};

export default StarRating;
