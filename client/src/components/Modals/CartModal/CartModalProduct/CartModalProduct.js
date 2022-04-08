import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../../..';
import { deleteCart, updateCart } from '../../../../api/cartApi';
import { PRODUCT_ROUTE } from '../../../../router/consts';
import styles from './CartModalProduct.module.css';

const CartModalProduct = observer(({ product }) => {
    const { auth, order } = useContext(Context);
    const [isDotsMenuOpened, setIsDotsMenuOpened] = useState(false);

    useEffect(() => {
        if (isDotsMenuOpened) {
            document.addEventListener('click', function closeDotsMenu(e) {
                setIsDotsMenuOpened(false);
                this.removeEventListener('click', closeDotsMenu);
            });
        }
    }, [isDotsMenuOpened]);

    const removeAndShowProduct = async () => {
        await deleteCart(auth.user.id, product.productId)
            .then(() => order.setCart(JSON.parse(localStorage.getItem('cart')) || []));
    }

    const changeAndShowProduct = async (quantity) => {
        await updateCart(auth.user.id, product.productId, quantity)
            .then(() => order.setCart(JSON.parse(localStorage.getItem('cart')) || []));
    }

    return (
        <li className={styles.cartProduct}>
            <div className={styles.cartProduct__top}>
                <div className={styles.cartProduct__img}>
                    <img src={process.env.REACT_APP_API_URL + '/img/' + product.productPic} />
                </div>

                <div className={styles.cartProduct__name}>
                    <Link
                        to={PRODUCT_ROUTE + '/' + product.productId}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.cartProduct__link}
                    >
                        {product.productName}
                    </Link>
                </div>

                <div
                    className={styles.dots}
                    onClick={() => !isDotsMenuOpened && setIsDotsMenuOpened(true)}
                >
                    <div className={styles.dots__Img} />
                    {isDotsMenuOpened &&
                        <ul
                            id='dotsMenu'
                            className={styles.dots__menu}
                        >
                            <li>
                                <div
                                    className={styles.removeProduct}
                                    onClick={() => removeAndShowProduct()}
                                >
                                    <div className={styles.removeProduct__img}><div /></div>
                                    <span className={styles.removeProduct__text}>Удалить</span>
                                </div>
                            </li>
                        </ul>
                    }
                </div>
            </div>

            <div className={styles.cartProduct__bottom}>
                <div className={styles.cartProduct__inputContainer}>
                    <div
                        className={`${styles.cartProduct__inputbutton} unselectable`}
                        onClick={() => product.quantity > 1 && changeAndShowProduct(product.quantity - 1)}
                    >
                        <span style={product.quantity === 1 ? { color: '#d2d2d2' } : { color: '#fe5000' }}>–</span>
                    </div>
                    <input
                        className={styles.cartProduct__input}
                        type='number'
                        value={product.quantity}
                        onChange={e => { if (e.target.value >= 1 && e.target.value <= 100) changeAndShowProduct(e.target.value) }}
                    />
                    <div
                        className={`${styles.cartProduct__inputbutton} unselectable`}
                        onClick={() => product.quantity <= 99 && changeAndShowProduct(product.quantity + 1)}
                    >
                        <span style={product.quantity >= 99 ? { color: '#d2d2d2' } : { color: '#fe5000' }}>+</span>
                    </div>
                </div>

                <div className={styles.cartProduct__price}>{(product.productPrice * product.quantity).toLocaleString()} $</div>
            </div>
        </li >
    )
});

export default CartModalProduct;