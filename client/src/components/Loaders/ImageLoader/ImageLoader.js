import React from 'react';
import styles from './ImageLoader.module.css';

const ImageLoader = () => {
    return (
        <div className={styles.loader__wrapper}>
            <div className={styles.loader}>
                <div className={styles.loader__animation}><div /></div>
            </div>
        </div>
    );
};

export default ImageLoader;