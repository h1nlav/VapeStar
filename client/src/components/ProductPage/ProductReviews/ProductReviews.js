import React, { useContext, useState } from 'react';
import { Context } from '../../..';
import convertDbDate from '../../../utils/convertDbDate';
import AuthModal from '../../Modals/AuthModal/AuthModal/AuthModal';
import AddAnswerModal from '../../Modals/AddAnswerModal/AddAnswerModal';
import AddReviewModal from '../../Modals/AddReviewModal/AddReviewModal';
import styles from './ProductReviews.module.css';
import ProductReviewsList from '../ProductReviewsList/ProductReviewsList';

const ProductReviews = ({ product, reviews, callback, }) => {
    const { auth } = useContext(Context);

    const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
    const [isAddReviewModalVisible, setIsAddReviewModalVisible] = useState(false);

    return (
        <div className={styles.ProductReviews}>
            <div className={styles.ProductReviews__addReview}>
                <span>Leave feedback about this product</span>
                <button
                    onClick={() => {
                        if (auth.isAuth) setIsAddReviewModalVisible(true);
                        else setIsAuthModalVisible(true)
                    }}
                >Write a review</button>
            </div>

            <ProductReviewsList reviews={reviews} callback={callback} />
            
            <AuthModal isVisible={isAuthModalVisible} closeModal={() => setIsAuthModalVisible(false)} />
            <AddReviewModal isVisible={isAddReviewModalVisible} closeModal={setIsAddReviewModalVisible} productId={product.id} callback={callback} />
        </div>
    );
};

export default ProductReviews;