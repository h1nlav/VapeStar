import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCT_ROUTE } from '../../../../router/consts';
import ProductReviewsList from '../../../ProductPage/ProductReviewsList/ProductReviewsList';
import ShortInfoContainer from '../../../UI/ShortInfoContainer/ShortInfoContainer';
import styles from './UserReviewsProduct.module.css';

const UserReviewsProduct = ({ product, callback }) => {
    const [isProductOpened, setIsProductOpened] = useState(false);

    return (
        <li className={styles.product}>
            <ShortInfoContainer
                id={product.id}
                isOpened={isProductOpened}
                onClick={() => setIsProductOpened(!isProductOpened)}
            >
                <div className={styles.shortInfo__name}>
                    <Link
                        to={PRODUCT_ROUTE + '/' + product.id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.shortInfo__link}
                    >
                        {product.name}
                    </Link>

                </div>
            </ShortInfoContainer>

            {isProductOpened &&
                <ProductReviewsList
                    reviews={product.reviews}
                    callback={callback}
                    removeAbility={true}
                />
            }
        </li>
    );
};

export default UserReviewsProduct;