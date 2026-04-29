import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './SkeletonCard.scss';

const SkeletonCard = ({ index = 0 }) => {
  const [shimmerDirection, setShimmerDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setShimmerDirection(prev => prev === 1 ? -1 : 1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const delay = (index % 5) * 0.05;

  return (
    <motion.div 
      className="skeleton-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="skeleton-card__poster">
        <div className="skeleton-card__shimmer"></div>
      </div>
      <div className="skeleton-card__info">
        <div className="skeleton-card__title">
          <div className="skeleton-card__shimmer"></div>
        </div>
        <div className="skeleton-card__rating">
          <div className="skeleton-card__shimmer"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkeletonCard;