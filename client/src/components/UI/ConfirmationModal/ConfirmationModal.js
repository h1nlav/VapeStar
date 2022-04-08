import React, { useState } from 'react';
import ModalName from '../ModalName/ModalName';
import styles from './ConfirmationModal.module.css';

const ConfirmationModal = ({ isVisible, setIsVisible, message, callback }) => {
    const [isBgDown, setIsBgDown] = useState(false);

    if (!isVisible) return (<div></div>);
    return (
        <div id='bg' className={styles.modal}
            onMouseDown={e => e.target.id == 'bg' && setIsBgDown(true)}
            onMouseUp={e => {
                if (e.target.id == 'bg' && isBgDown) setIsVisible(false);
                setIsBgDown(false)
            }}
        >
            <div className={styles.modal__content}>
                <ModalName modalName={`Warning`} callback={() => setIsVisible(false)} />

                <div className={styles.modal__message}>{message}</div>

                <div className={styles.modal__buttons}>
                    <button
                        className={styles.modal__confirmationButton}
                        onClick={() => {
                            callback();
                            setIsVisible(false);
                        }}
                    >
                        Yes
                    </button>
                    <button
                        className={styles.modal__cancelButton}
                        onClick={() => setIsVisible(false)}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;