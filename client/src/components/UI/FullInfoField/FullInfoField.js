import React from 'react';
import styles from './FullInfoField.module.css';

const FullInfoField = ({ fieldName, fieldValue }) => {
    return (
        <div className={styles.fullInfo}>
            <span className={styles.fullInfo__label}>{fieldName}</span>
            <span className={styles.fullInfo__value}>{fieldValue}</span>
        </div>
    );
};

export default FullInfoField;