import React from 'react';
import { Link } from 'react-router-dom';
import { MAIN_ROUTE } from '../router/consts';
import styles from '../css/ErrorPage.module.css';

const ErrorPage = () => {
    return (
        <div className={styles.notFound}>
            <div className={styles.notFound__container}>
                <div className={styles.notFound__img}></div>
                <h1>Page not found</h1>
                <Link to={MAIN_ROUTE}>
                    <button>
                        <span>
                            To Home Page
                        </span>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;