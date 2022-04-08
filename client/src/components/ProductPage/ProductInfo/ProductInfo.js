import React, { useState } from 'react';
import ProductSpecifications from '../ProductSpecifications/ProductSpecifications';
import ProductReviews from '../ProductReviews/ProductReviews';
import styles from './ProductInfo.module.css';

const ProductInfo = ({ product, reviews, callback }) => {
    const [chosenOption, setChosenOption] = useState(0);

    return (
        <div className={styles.productInfo}>
            <ul className={styles.productInfo__navigation}>
                <div className={styles.productInfo__lastSpace} />
                <li
                    className={chosenOption == 0
                        ? `${styles.productInfo__option} ${styles.productInfo__chosenOption}`
                        : styles.productInfo__option}
                    onClick={(e) => setChosenOption(0)}
                >
                    <span>Specifications</span>
                </li>
                <li
                    className={chosenOption == 1
                        ? `${styles.productInfo__option} ${styles.productInfo__chosenOption}`
                        : styles.productInfo__option}
                    onClick={(e) => setChosenOption(1)}
                >
                    <span>Reviews ({product.countRating})</span>
                </li>
                <div className={styles.productInfo__lastSpace} />
            </ul>
            <div className={styles.productInfo__content}>
                {chosenOption === 0 && <ProductSpecifications product={product} />}
                {chosenOption === 1 && <ProductReviews product={product} reviews={reviews} callback={callback} />}
            </div>
        </div>
    );
};

export default ProductInfo;