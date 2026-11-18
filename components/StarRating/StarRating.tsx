"use client";

import { Rating, Star } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import styles from "./StarRating.module.css";

const STAR_SHAPE_CONFIG = {
  itemShapes: Star,
  itemStrokeWidth: 1,
};

interface StarRatingProps {
  value: number;
  count?: 1 | 5;
  readOnly?: boolean;
  showValue?: boolean;
  className?: string;
}

export default function StarRating({
  value,
  count = 5,
  readOnly = true,
  showValue = false,
  className = "",
}: StarRatingProps) {
  const numericValue = Number(value) || 0;
  const clampedValue = Math.max(0, Math.min(5, numericValue));
  const roundedValue = Math.round(clampedValue * 2) / 2;
  const passedToRating = count === 1 ? 1 : roundedValue;

  return (
    <div className={`${styles.row} ${className}`.trim()}>
      <Rating
        className={styles.rating}
        value={passedToRating}
        readOnly={readOnly}
        items={count}
        itemStyles={STAR_SHAPE_CONFIG}
        halfFillMode="svg"
        spaceInside="none"
        transition="colors"
      />
      {showValue && readOnly && <span className={styles.score}>{numericValue}</span>}
    </div>
  );
}
