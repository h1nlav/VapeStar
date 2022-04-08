import React from 'react';
import styles from './ModalName.module.css'

const ModalName = ({ modalName, callback }) => {
    return (
        <div className={styles.modalName}>
            <span className={styles.modalName__text}>{modalName}</span>
            <div className={styles.modalName__img} onClick={() => callback()}></div>
        </div>
    );
};

export default ModalName;