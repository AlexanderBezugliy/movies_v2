import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../config/api';
import './MovieCard.scss';

const MovieCard = ({ movie, genres, index, language, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setTransform({ rotateX, rotateY, scale: 1.05 });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
    setIsHovered(false);
  };

  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const title = language === 'ru-RU' ? movie.title : movie.original_title;
  
  const movieGenres = movie.genre_ids?.slice(0, 2).map(id => {
    const genre = genres?.find(g => g.id === id);
    return genre ? (language === 'ru-RU' ? genre.name : genre.name) : null;
  }).filter(Boolean);

  return (
    <motion.div
      ref={cardRef}
      className="movie-card"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: (index % 25) * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className={`movie-card__glow ${isHovered ? 'active' : ''}`}></div>
      
      <div className="movie-card__poster-wrapper">
        {posterUrl ? (
          <img 
            src={posterUrl} 
            alt={title}
            className="movie-card__poster"
          />
        ) : (
          <div className="movie-card__poster-placeholder">
            <span>🎬</span>
          </div>
        )}
        
        <div className="movie-card__overlay">
          <button className="movie-card__play-btn">
            ▶
          </button>
        </div>

        <div className="movie-card__rating">
          <span className="movie-card__rating-star">★</span>
          <span>{movie.vote_average?.toFixed(1)}</span>
        </div>
      </div>

      <div className="movie-card__info">
        <h3 className="movie-card__title">{title}</h3>
        <div className="movie-card__genres">
          {movieGenres?.map((genre, idx) => (
            <span key={idx} className="movie-card__genre">
              {genre}
              {idx < movieGenres.length - 1 && ', '}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;