import React from 'react';
import { FACEBOOK_ROUTE, INSTAGRAM_ROUTE, TELEGRAM_ROUTE, YOUTUBE_ROUTE } from '../../router/consts';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footer__wrapper}>
                <div className={styles.footer__logo}>
                    <span>Vapestar</span>
                </div>

                <div className={styles.footer__socials}>
                    <a href={INSTAGRAM_ROUTE} className={styles.footer__inst} target="_blank" />
                    <a href={TELEGRAM_ROUTE} className={styles.footer__telegram} target="_blank" />
                    <a href={YOUTUBE_ROUTE} className={styles.footer__youtube} target="_blank" />
                    <a href={FACEBOOK_ROUTE} className={styles.footer__facebook} target="_blank" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;