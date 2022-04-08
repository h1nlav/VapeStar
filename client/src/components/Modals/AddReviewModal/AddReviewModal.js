import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../..';
import { createReview } from '../../../api/reviewApi';
import { BodyScrollOff, BodyScrollOn } from '../../../utils/changeBodyScroll';
import AlertsList from '../../UI/AlertsList/AlertsList';
import ModalName from '../../UI/ModalName/ModalName';
import styles from './AddReviewModal.module.css';

const AddReviewModal = ({ isVisible, closeModal, productId, callback }) => {
    useEffect(() => isVisible ? BodyScrollOff() : BodyScrollOn(), [isVisible]);

    const { auth } = useContext(Context);

    const [isBgDown, setIsBgDown] = useState(false);

    const [selectedRating, setSelectedRating] = useState(-1);
    const [hoverRating, setHoverRating] = useState(-1);
    const [selectedRatingAlert, setSelectedRatingAlert] = useState('');

    const [comment, setСomment] = useState('');
    const [commentAlert, setCommentAlert] = useState('');

    const closeAddReviewModal = () => {
        setSelectedRating(-1);
        setСomment('');
        setSelectedRatingAlert('');
        setCommentAlert('');
        closeModal();
    }

    const addRewiew = async () => {
        await createReview({
            rating: selectedRating,
            comment,
            productId: productId,
            userId: auth.user.id
        });
        if (callback) callback();
        closeAddReviewModal();
    }

    if (!isVisible) return (<div></div>);
    return (
        <div id='bg' className={styles.modal}
            onMouseDown={e => e.target.id == 'bg' && setIsBgDown(true)}
            onMouseUp={e => {
                if (e.target.id == 'bg' && isBgDown) closeAddReviewModal();
                setIsBgDown(false)
            }}
        >
            <div className={styles.modal__wrapper}>
                <ModalName modalName={`Write a review`} callback={() => closeAddReviewModal()} />
                <div className={styles.modal__content}>
                    <div className={styles.rating}>
                        <div className={styles.rating__content}>
                            {['Bad', 'So-so', 'Normal', 'Good', 'Great'].map((ratingName, index) =>
                                <div key={index + 1}
                                    className={styles.rating__item}
                                    onMouseMove={() => setHoverRating(index + 1)}
                                    onTouchStart={() => setHoverRating(index + 1)}
                                    onMouseLeave={() => setHoverRating(-1)}
                                    onTouchEnd={() => setHoverRating(-1)}
                                    onClick={() => {
                                        setSelectedRatingAlert('');
                                        setSelectedRating(index + 1);
                                    }}
                                >
                                    <div
                                        className={
                                            hoverRating == -1
                                                ?
                                                index + 1 <= selectedRating
                                                    ? `${styles.rating__star} ${styles.rating__selectedStar}`
                                                    : styles.rating__star
                                                :
                                                index + 1 <= hoverRating
                                                    ? `${styles.rating__star} ${styles.rating__selectedStar}`
                                                    : styles.rating__star
                                        }
                                    />
                                    <span>{ratingName}</span>
                                </div>
                            )}
                            <div />
                        </div>
                        {selectedRatingAlert && <AlertsList checkArray={[selectedRatingAlert]} />}
                    </div>

                    <div className={styles.comment}>
                        <span className={styles.comment__text}>Сomment</span>
                        <textarea
                            className={styles.comment__textarea}
                            style={!commentAlert ? { borderColor: '#d2d2d2' } : { borderColor: '#f84147' }}
                            onChange={e => {
                                setСomment(e.target.value);
                                setCommentAlert('');
                            }}
                        />
                        {commentAlert && <AlertsList checkArray={[commentAlert]} />}
                    </div>

                    <div className={styles.modal__buttons}>
                        <button
                            className={styles.modal__cancel}
                            onClick={() => closeAddReviewModal()}
                        >
                            Cancel
                        </button>
                        <button className={styles.modal__accept}
                            onClick={() => {
                                if (selectedRating == -1) setSelectedRatingAlert('You must select a mark');
                                if (!comment) setCommentAlert('This field is required');
                                if (selectedRating != -1 && comment) addRewiew();
                            }}
                        >Leave feedback</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddReviewModal;