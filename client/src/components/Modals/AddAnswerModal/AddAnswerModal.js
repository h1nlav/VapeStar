import React, { useContext, useState } from 'react';
import { Context } from '../../..';
import { createAnswer } from '../../../api/reviewApi';
import AlertsList from '../../UI/AlertsList/AlertsList';
import ModalName from '../../UI/ModalName/ModalName';
import styles from './AddAnswerModal.module.css';

const AddAnswerModal = ({ isVisible, closeModal, reviewId, callback }) => {
    const [isBgDown, setIsBgDown] = useState(false);

    const { auth } = useContext(Context);

    const [comment, setСomment] = useState('');
    const [commentAlert, setCommentAlert] = useState('');

    const closeAddAnswerModal = () => {
        setСomment('');
        setCommentAlert('');
        closeModal();
    }

    const addAnswer = async () => {
        await createAnswer({
            comment,
            reviewId,
            userId: auth.user.id
        });

        if (callback) callback();
        closeAddAnswerModal();
    }

    if (!isVisible) return (<div></div>);
    return (
        <div id='bg' className={styles.modal}
            onMouseDown={e => e.target.id == 'bg' && setIsBgDown(true)}
            onMouseUp={e => {
                if (e.target.id == 'bg' && isBgDown) closeAddAnswerModal();
                setIsBgDown(false)
            }}
        >
            <div className={styles.modal__wrapper}>
                <ModalName modalName={`Write an answer`} callback={() => closeAddAnswerModal()} />

                <div className={styles.modal__content}>
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
                            onClick={() => closeAddAnswerModal()}
                        >
                            Cancel
                        </button>
                        <button className={styles.modal__accept}
                            onClick={() => {
                                if (!comment) setCommentAlert('This field is required');
                                else addAnswer()
                            }}
                        >Leave a reply</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAnswerModal;