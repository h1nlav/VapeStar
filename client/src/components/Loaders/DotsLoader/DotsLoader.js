import React from 'react';
import styles from './DotsLoader.module.css'

const DotsLoader = () => {
    return (
        <ul className={styles.dotsLoader}>
            <li className={styles.dotsLoader__dot}><div /></li>
            <li className={styles.dotsLoader__dot}><div /></li>
            <li className={styles.dotsLoader__dot}><div /></li>
            <li className={styles.dotsLoader__dot}><div /></li>
            <li className={styles.dotsLoader__dot}><div /></li>
        </ul>
    );
};

export default DotsLoader;