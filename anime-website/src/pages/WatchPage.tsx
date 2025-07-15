import React from 'react';
import { useParams } from 'react-router-dom';
import './WatchPage.css'; // Styles for this page

const WatchPage: React.FC = () => {
  const { animeId } = useParams<{ animeId: string }>();

  // In a real app, you might fetch details based on animeId to get the title.
  // For this version, we'll just use the ID in the title.
  // The video source is now directly from the imdbID, which we are pretending is the video ID.
  const videoUrl = `https://www.imdb.com/video/imdb/${animeId}/imdb/embed`;


  return (
    <div className="watch-page-container">
      <h1 className="watch-title">Now Watching: Anime ID {animeId}</h1>
      {animeId ? (
        <div className="video-player-wrapper">
          <iframe
            src={videoUrl}
            width="100%"
            height="100%"
            allowFullScreen
            allow="autoplay; fullscreen"
            title={`Video Player - ${animeId}`}
            className="video-iframe"
          ></iframe>
        </div>
      ) : (
        <p className="video-not-available">No video ID provided.</p>
      )}
    </div>
  );
};

export default WatchPage;
