import { observer } from 'mobx-react-lite';
import React, { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../..';
import { ADMIN_ROUTE, MAIN_ROUTE, USER_ROUTE } from '../../router/consts';
import CategoryListModal from '../Modals/CategoryListModal/CategoryListModal';
import SearchModal from '../Modals/SearchModal/SearchModal/SearchModal';
import AuthModal from '../Modals/AuthModal/AuthModal/AuthModal';
import CartModal from '../Modals/CartModal/CartModal/CartModal';
import styles from './Navbar.module.css';

const NavBar = observer(() => {
    const { auth, order } = useContext(Context);

    const [iscategoryListVisible, setIsCategoryListVisible] = useState(false);
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [isAuthModalVisible, setIsAuthModalVisible] = useState(false);
    const [isCartModalVisible, setIsCartModalVisible] = useState(false);
    window.addEventListener("popstate", function () { resetModalStates() });

    const categoryListModal = useRef(null);
    const closeCategoryListModal = () => {
        if (categoryListModal.current) {
            categoryListModal.current.style.opacity = "0";
            setTimeout(() => {
                categoryListModal.current.style = null;
                setIsCategoryListVisible(false);
            }, 100);
        }
    }

    const resetModalStates = () => {
        setIsCategoryListVisible(false);
        setIsSearchModalVisible(false);
        setIsAuthModalVisible(false);
        setIsCartModalVisible(false);
    }

    return (
        <div className={styles.navBar}>
            <div className={styles.navBar__content}>
                <button className={`${styles.logo} unselectable`} onClick={() => resetModalStates()}>
                    <Link to={MAIN_ROUTE} className={styles.navBar__link}>
                        <div className={styles.logo__image}></div>
                        <span className={styles.logo__text}>Vapestar</span>
                    </Link>
                </button>

                <button className={`${styles.catalogButton} unselectable`}
                    onClick={() => iscategoryListVisible
                        ? closeCategoryListModal()
                        : (resetModalStates(), setIsCategoryListVisible(true))
                    }
                >

                    <div className={styles.catalogButton__image} />
                    <span className={styles.catalogButton__text}>Catalog</span>
                </button>

                <div className={styles.search}>
                    <SearchModal isSearchModalVisible={isSearchModalVisible} setIsSearchModalVisible={setIsSearchModalVisible} resetModalStates={resetModalStates} />
                </div>

                {auth.isAuth
                    ?
                    <button
                        className={`${styles.userPage} unselectable`}
                        onClick={() => resetModalStates()}
                    >
                        <Link to={(auth.user.role == 'ADMIN' || auth.user.role == 'ROOT') ? ADMIN_ROUTE : USER_ROUTE}>
                            <div className={styles.userPage__img}><div /></div>
                        </Link>
                    </button>
                    :
                    <button
                        className={`${styles.userModal} unselectable`}
                        onClick={() => {
                            resetModalStates();
                            setIsAuthModalVisible(true);
                        }}
                    >
                        <div className={styles.userModal__img}><div /></div>
                    </button>
                }

                <button
                    className={`${styles.cart} unselectable`}
                    onClick={() => {
                        resetModalStates();
                        setIsCartModalVisible(true);
                    }}
                >
                    <div className={styles.cart__img} />
                    {order.cart.length > 0 &&
                        <div className={styles.cart__text}>
                            <span>{order.cart.length}</span>
                        </div>
                    }
                </button>
            </div>

            <CategoryListModal isVisible={iscategoryListVisible} closeModal={closeCategoryListModal} modalRef={categoryListModal} />
            <AuthModal isVisible={isAuthModalVisible} closeModal={() => setIsAuthModalVisible(false)} />
            <CartModal isVisible={isCartModalVisible} closeModal={() => setIsCartModalVisible(false)} />
        </div >
    );
});

export default NavBar;