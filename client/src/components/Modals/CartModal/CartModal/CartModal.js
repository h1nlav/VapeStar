import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../../../..';
import { CHECKOUT_ROUTE } from '../../../../router/consts';
import { BodyScrollOff, BodyScrollOn } from '../../../../utils/changeBodyScroll';
import ModalName from '../../../UI/ModalName/ModalName';
import CartModalProduct from '../CartModalProduct/CartModalProduct';
import styles from './CartModal.module.css';

const CartModal = observer(({ isVisible, closeModal }) => {
    useEffect(() => isVisible ? BodyScrollOff() : BodyScrollOn(), [isVisible]);

    const [isBgDown, setIsBgDown] = useState(false);

    const { order } = useContext(Context);
    const location = useLocation();

    if (!isVisible) return (<div></div>);
    return (
        <div id='bg' className={styles.modal}
            onMouseDown={e => e.target.id == 'bg' && setIsBgDown(true)}
            onMouseUp={e => {
                if (e.target.id == 'bg' && isBgDown) closeModal();
                setIsBgDown(false);
            }}
        >
            <div className={styles.modal__content}>
                <ModalName modalName={'Cart'} callback={() => closeModal()} />

                {order.cart.length > 0
                    ?
                    <ul className={styles.productList}>
                        {order.cart.map(product =>
                            <CartModalProduct key={product.productId} product={product} />
                        )}

                        <div className={styles.productList__buttons}>
                            <button
                                className={`${location.pathname === CHECKOUT_ROUTE ? styles.productList__backButtonOff : styles.productList__backButton} unselectable`}
                                onClick={() => location.pathname !== CHECKOUT_ROUTE && closeModal()}
                            >
                                Continue shopping
                            </button>

                            <div className={styles.productList__makeOrder}>
                                <span className={styles.productList__makeOrderPrice}>
                                    {
                                        function () {
                                            let price = 0;
                                            order.cart.map(cartItem => price += cartItem.productPrice * cartItem.quantity);
                                            return price.toLocaleString();
                                        }()
                                    } $
                                </span>

                                <Link to={CHECKOUT_ROUTE}>
                                    <button
                                        className={`${styles.productList__makeOrderButton} unselectable`}
                                        onClick={() => closeModal()}
                                    >
                                        {location.pathname === CHECKOUT_ROUTE ? 'Continue' : 'Checkout order'}
                                    </button>
                                </Link>

                            </div>
                        </div>
                    </ul>
                    :
                    <div className={styles.emptyCart}>
                        <div />
                        <span>Cart is empty</span>
                        <button onClick={() => closeModal()}>
                            <span>Continue shopping</span>
                        </button>
                    </div>
                }
            </div>
        </div >
    );
});

export default CartModal;