import React from 'react';
import UserReviewsProduct from '../UserReviewsProduct/UserReviewsProduct';
import styles from './UserReviewsProductsList.module.css';

const UserReviewsProductsList = ({ products, selectedOption, isReviewsFetching, callback }) => {
    return (
        <ul className={styles.reviewsProductsList}>
            <div className={styles.reviewsProductsList__name}>
                <h1>{selectedOption}</h1>
            </div>

            {(!isReviewsFetching && products.length === 0) &&
                <div className={styles.reviewsProductsList__notFound}>
                    {selectedOption === 'My reviews' && <span>You have not left any review in our store yet :(</span>}
                    {selectedOption === 'My answers' && <span>You have not left any answer in our store yet :(</span>}
                </div>
            }

            {products.map(product =>
                <UserReviewsProduct
                    key={product.id}
                    product={product}
                    callback={callback}
                />)
            }
        </ul >
    );
};

export default UserReviewsProductsList;