import React from 'react';
import styles from './FirstEntryLoader.module.css';

const FirstEntryLoader = () => {
    return (
        <div className={styles.loader__wrapper}>
            <div className={styles.loader}>
                <div className={styles.loader__animation}><div /></div>
                <span className={`${styles.loader__logo} unselectable`}>VAPESTAR</span>
            </div>
        </div>
    );
};

export default FirstEntryLoader;