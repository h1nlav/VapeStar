import React from 'react';
import Footer from './components/Footer/Footer';
import NavBar from './components/NavBar/NavBar';
import styles from './css/NavBarFooterWrapper.module.css';

const NavBarFooterWrapper = ({ component, isIndentDown = true }) => {
    return (
        <div className={styles.wrapper}>
            <NavBar />
            <div className={`${styles.wrapper__content} ${isIndentDown && styles.wrapper__contentIndent}`}>
                {component}
            </div>
            <Footer />
        </div>
    );
};

export default NavBarFooterWrapper;