import React from 'react';
import styles from './CatalogLoader.module.css';

const CatalogLoader = ({ isVisible }) => {
    if (!isVisible) return (<div />)
    return (
        <div className={styles.loader__wrapper}>
            <div className={styles.loader} />
        </div>
    );
};

export default CatalogLoader;