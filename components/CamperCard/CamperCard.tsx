"use client";

import Image from "next/image";
import Link from "next/link";
import { CamperListItemDto } from "@/types/campers";
import StarRating from "@/components/StarRating/StarRating";
import styles from "./CamperCard.module.css";

interface CamperCardProperties {
  camperData: CamperListItemDto;
  isFirstCardElementInList: boolean;
}

export const CamperCard = ({ camperData, isFirstCardElementInList }: CamperCardProperties) => {
  const capitalizeFirstLetterHelper = (textString: string) => {
    return textString.charAt(0).toUpperCase() + textString.slice(1).replace("_", " ");
  };

  const formatPriceWithThousandsSeparatorHelper = (priceNumber: number) => {
    return priceNumber.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <article className={styles.camperCardContainer}>
      <Image
        src={camperData.coverImage}
        alt={camperData.name}
        width={219}
        height={240}
        unoptimized={true}
        priority={isFirstCardElementInList}
        className={styles.camperCardImage}
      />
      <div className={styles.camperCardDetails}>
        <div className={styles.camperCardHeader}>
          <h2 className={`${styles.camperCardName} interSemiBold`}>{camperData.name}</h2>
          <span className={`${styles.camperCardPrice} interSemiBold`}>
            €{formatPriceWithThousandsSeparatorHelper(camperData.price)}
          </span>
        </div>

        <ul className={styles.metaInfoRow}>
          <li className={styles.metaItem}>
            <StarRating value={camperData.rating} count={1} />
            <p className={`${styles.metaText} interRegular`}>
              {camperData.rating} ({camperData.totalReviews} Reviews)
            </p>
          </li>
          <li className={styles.metaItem}>
            <svg className={styles.metaIcon}>
              <use href="/sprite.svg#icon-map" />
            </svg>
            <span className="interRegular">{camperData.location}</span>
          </li>
        </ul>

        <p className={`${styles.cardDescriptionText} interRegular`}>
          Embrace simplicity and freedom with the {camperData.name}...
        </p>

        <ul className={styles.badgesBlock}>
          <li className={styles.featureBadgeItem}>
            <svg className={styles.badgeIcon}>
              <use href="/sprite.svg#gas-station" />
            </svg>
            <span className="interMedium">{capitalizeFirstLetterHelper(camperData.engine)}</span>
          </li>
          <li className={styles.featureBadgeItem}>
            <svg className={styles.badgeIcon}>
              <use href="/sprite.svg#transmission" />
            </svg>
            <span className="interMedium">
              {capitalizeFirstLetterHelper(camperData.transmission)}
            </span>
          </li>
          <li className={styles.featureBadgeItem}>
            <svg className={styles.badgeIcon}>
              <use href="/sprite.svg#truck-car" />
            </svg>
            <span className="interMedium">{capitalizeFirstLetterHelper(camperData.form)}</span>
          </li>
        </ul>

        <Link
          href={`/catalog/${camperData.id}`}
          target="_blank"
          className={`${styles.showMoreLink} btn interMedium`}
        >
          Show more
        </Link>
      </div>
    </article>
  );
};
