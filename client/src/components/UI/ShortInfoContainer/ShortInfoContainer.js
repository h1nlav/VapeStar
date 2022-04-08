import React from 'react';
import styles from './ShortInfoContainer.module.css';

const ShortInfoContainer = ({ id, isOpened, onClick, children }) => {
    return (
        <div className={styles.shortInfoContainer} onClick={onClick}>
            <div className={styles.shortInfoContainer__id}>{id}</div>

            {children}

            <div className={isOpened
                ? styles.shortInfoContainer__arrowUp
                : styles.shortInfoContainer__arrowDown
            }><div /></div>
        </div>
    );
};

export default ShortInfoContainer;