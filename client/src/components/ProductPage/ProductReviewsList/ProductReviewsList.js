import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Context } from '../../..';
import { deleteAnswer, deleteReview } from '../../../api/reviewApi';
import convertDbDate from '../../../utils/convertDbDate';
import AddAnswerModal from '../../Modals/AddAnswerModal/AddAnswerModal';
import AuthModal from '../../Modals/AuthModal/AuthModal/AuthModal';
import ConfirmationModal from '../../UI/ConfirmationModal/ConfirmationModal';
import styles from './ProductReviewsList.module.css'

const ProductReviewsList = observer(({ reviews, callback, removeAbility = false }) => {
    const { auth } = useContext(Context);

    const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);

    const [isAddAnswerModalVisible, setIsAddAnswerModalVisible] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);

    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [confirmationModalMessage, setConfirmationModalMessage] = useState('');
    const [confirmationModalCallback, setConfirmationModalCallback] = useState(null);

    const removeAndShowReview = async (id) => {
        await deleteReview({ id })
            .then(() => callback());
    }

    const removeAndShowAnswer = async (id) => {
        await deleteAnswer({ id })
            .then(async () => callback());
    }

    return (
        <ul className={styles.reviewsList}>
            {reviews.map(review =>
                <li
                    key={review.id}
                    className={styles.review}
                >
                    <div className={styles.review__content}>
                        <div className={styles.review__header}>
                            <span className={styles.review__name}>{review.user.name} {review.user.surname}</span>
                            <span className={styles.review__date}>{convertDbDate(review.createdAt)}</span>
                        </div>
                        <div className={styles.review__rating}>
                            {[1, 2, 3, 4, 5].map(value =>
                                <div
                                    key={value}
                                    className={value <= review.rating
                                        ? `${styles.review__star} ${styles.review__selectedStar}`
                                        : styles.review__star
                                    }
                                />
                            )}
                        </div>

                        <div className={styles.review__comment}>
                            <span>{review.comment}</span>
                        </div>


                        <div className={styles.review__buttons}>
                            <div
                                className={styles.review__answerButton}
                                onClick={() => {
                                    if (auth.isAuth) {
                                        setSelectedReviewId(review.id);
                                        setIsAddAnswerModalVisible(true);
                                    } else setIsAuthModalVisible(true)

                                }}
                            >
                                <div />
                                <span>Reply</span>
                            </div>

                            {removeAbility && ((review.user.id === auth.user.id) || auth.user.role === 'ADMIN' || auth.user.role === 'ROOT') &&
                                <button
                                    className={styles.review__removeButton}
                                    onClick={() => {
                                        setConfirmationModalMessage(<span>Are you sure you want to delete your review?</span>);
                                        setConfirmationModalCallback(() => () => removeAndShowReview(review.id));
                                        setIsConfirmationModalVisible(true);
                                    }}
                                >
                                    Delete
                                </button>
                            }
                        </div >
                    </div>

                    <ul className={styles.review__answers}>
                        {review.answers.map(answer =>
                            <li
                                key={answer.id}
                                className={styles.answer}
                            >
                                <div className={styles.answer__header}>
                                    <span className={styles.answer__name}>{answer.user.name} {answer.user.surname}</span>
                                    <span className={styles.answer__date}>{convertDbDate(answer.createdAt)}</span>
                                </div>

                                <div className={styles.answer__comment}>
                                    <span>{answer.comment}</span>
                                </div>

                                <div className={styles.review__buttons}>
                                    <div />

                                    {removeAbility && ((answer.user.id === auth.user.id) || auth.user.role === 'ADMIN' || auth.user.role === 'ROOT') &&
                                        <button
                                            className={styles.review__removeButton}
                                            onClick={() => {
                                                setConfirmationModalMessage(<span>Are you sure you want to delete your answer?</span>);
                                                setConfirmationModalCallback(() => () => removeAndShowAnswer(answer.id));
                                                setIsConfirmationModalVisible(true);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    }
                                </div >
                            </li>
                        )}
                    </ul>
                </li>
            )}

            <AuthModal isVisible={isAuthModalVisible} closeModal={() => setIsAuthModalVisible(false)} />
            <AddAnswerModal isVisible={isAddAnswerModalVisible} closeModal={setIsAddAnswerModalVisible} reviewId={selectedReviewId} callback={callback} />
            <ConfirmationModal
                isVisible={isConfirmationModalVisible}
                setIsVisible={setIsConfirmationModalVisible}
                message={confirmationModalMessage}
                callback={confirmationModalCallback}
            />
        </ul>
    );
});

export default ProductReviewsList;