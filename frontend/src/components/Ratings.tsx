import React from "react";
import styles from "@/styles/modules/ratings.module.scss";

interface RatingProps {
  rating: number;
  size: number;
}

const Rating: React.FC<RatingProps> = ({ rating, size }) => {
  const stars = Array(5)
    .fill(false)
    .map((_, index) => index + 0.5 < rating);

  return (
    <div className={styles.rating}>
      {stars.map((filled, index) => (
        <span
          key={index}
          className={filled ? styles.filled : styles.empty}
          style={{ fontSize: `${size}px` }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default Rating;
