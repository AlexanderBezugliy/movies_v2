import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import MovieCard from '../MovieCard';
import './MoviesGrid.scss';

const MoviesGrid = ({ movies, genres, language, onMovieSelect }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section className="movies-grid" id="movies" ref={sectionRef}>
      <div className="movies-grid__container">
        <motion.div 
          className="movies-grid__header"
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="movies-grid__title">
            {language === 'ru-RU' ? 'Популярные фильмы' : 'Popular Movies'}
          </h2>
          <div className="movies-grid__line"></div>
        </motion.div>

        <motion.div 
          className="movies-grid__grid"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {movies?.slice(0, 25).map((movie, index) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              genres={genres}
              index={index}
              language={language}
              onClick={() => onMovieSelect(movie)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MoviesGrid;