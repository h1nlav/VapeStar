import React from 'react';
import styles from './Activation.module.css';

const Activation = ({ text, closeModal }) => {
    return (
        <div className={styles.confirmation}>
            <div className={styles.confirmation__icon}><div /></div>
            <h3 className={styles.confirmation__text}>{text}</h3>
            <button
                className={styles.confirmation__button}
                onClick={() => closeModal()}
            >
                <span>
                    Close
                </span>
            </button>
        </div>
    );
};

export default Activation;