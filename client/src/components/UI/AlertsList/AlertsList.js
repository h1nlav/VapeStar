import React from 'react';
import styles from './AlertsList.module.css';

const AlertsList = ({ checkArray }) => {
    return (
        <ul className={styles.alerts}>
            {checkArray.map((item, index) =>
                <li key={index} className={styles.alerts__item}>
                    <div /><span>{item}</span>
                </li>
            )}
        </ul>
    );
};

export default AlertsList;