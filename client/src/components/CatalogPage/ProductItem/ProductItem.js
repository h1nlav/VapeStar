import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Context } from '../../..';
import { addCart } from '../../../api/cartApi';
import { MAIN_ROUTE } from '../../../router/consts';
import ImageLoader from '../../Loaders/ImageLoader/ImageLoader';
import CartModal from '../../Modals/CartModal/CartModal/CartModal';
import styles from './ProductItem.module.css';

const ProductItem = observer(({ product }) => {
    const { auth, order } = useContext(Context)
    const path = useLocation();

    const [isCartModalVisible, setIsCartModalVisible] = useState(false);

    const [isImageLoading, setIsImageLoading] = useState([true, true]);

    const onHover = (img) => {
        if (!isImageLoading[0] && !isImageLoading[1] && product.products_pics.length > 1)
            img.style.backgroundImage = `url(${process.env.REACT_APP_API_URL + '/img/' + product.products_pics[1].fileName})`;
    }
    const offHover = (img) => {
        if (!isImageLoading[0] && !isImageLoading[1] && product.products_pics.length > 1)
            img.style.backgroundImage = `url(${process.env.REACT_APP_API_URL + '/img/' + product.products_pics[0].fileName})`;
    }

    const [isProductInCart, setIsProductInCart] = useState(false);
    useEffect(() => {
        let isExist = false;
        for (let cartItem of order.cart) {
            if (cartItem.productId === product.id) {
                setIsProductInCart(true);
                isExist = true;
                break;
            }
        }
        if (!isExist) setIsProductInCart(false);
    }, [order.cart]);

    const addToCartAndShow = async () => {
        await addCart(
            auth.user.id,
            {
                userId: auth.user.id,
                productId: product.id,
                productName: product.name,
                productPrice: product.price,
                productPic: product.products_pics[0].fileName,
                quantity: 1,
            }
        );

        await order.setCart(JSON.parse(localStorage.getItem('cart')));
        setIsCartModalVisible(true);
    }

    return (
        <li className={path.pathname === MAIN_ROUTE ? `${styles.product} ${styles.product__mainPage}` : styles.product}>
            <img
                style={{ display: 'none' }}
                src={process.env.REACT_APP_API_URL + '/img/' + product.products_pics[0].fileName}
                onLoad={() => product.products_pics.length > 1 ? setIsImageLoading([false, isImageLoading[1]]) : setIsImageLoading([false, false])}
            />
            {product.products_pics.length > 1 &&
                <img
                    style={{ display: 'none' }}
                    src={process.env.REACT_APP_API_URL + '/img/' + product.products_pics[1].fileName}
                    onLoad={() => setIsImageLoading([isImageLoading[0], false])}
                />
            }


            <div className={product.isAvailable
                ? styles.product__content
                : `${styles.product__content} ${styles.notAvailable}`}
            >
                {(isImageLoading[0] || isImageLoading[1])
                    ?
                    <ImageLoader />
                    :
                    <Link to={`/product/${product.id}`} className={styles.product__link}>
                        <img
                            className={styles.product__img}
                            onMouseMove={e => onHover(e.target)}
                            onMouseOut={e => offHover(e.target)}
                            style={{ backgroundImage: `url(${process.env.REACT_APP_API_URL + '/img/' + product.products_pics[0].fileName})` }}
                        />
                    </Link>
                }

                <Link to={`/product/${product.id}`} className={styles.product__link}>
                    <span className={styles.product__name}>{product.name}</span>
                </Link>

                <Link to={`/product/${product.id}`} className={styles.product__link}>
                    {parseInt(product.countRating) > 0
                        ?
                        <div className={styles.rating}>
                            <div className={styles.rating__stars}>
                                <span className={styles.rating__backStars}>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                                <span
                                    className={styles.rating__topStars}
                                    style={{ width: `${product.avgRating / 5 * 100}%` }}
                                >&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                            </div>

                            <div className={styles.rating__comments}>
                                <div />
                                <span>{product.countRating}</span>
                            </div>
                        </div>
                        :
                        <div className={styles.addReview}>
                            <div />
                            <span>
                                Leave feedback
                            </span>
                        </div>
                    }
                </Link>

                <div className={styles.product__buy}>
                    <div className={styles.product__buyTop}>
                        <span className={styles.product__price}>{product.price.toLocaleString()} $</span>
                        {product.isAvailable &&
                            <div
                                className={styles.product__cart}
                                onClick={() => !isProductInCart && addToCartAndShow()}
                            >
                                <div className={isProductInCart ? styles.product__inCart : styles.product__notInCart} />
                            </div>
                        }
                    </div>
                    {product.isAvailable

                        ?
                        <div className={styles.product__available}>
                            <span className={styles.product__available}>Ready to ship</span>
                            <div />
                        </div>

                        :
                        <div className={styles.product__notAvailable}>
                            <span>Out of stock</span>
                        </div>
                    }
                </div>
            </div>
            <div className={styles.product__wrapper} />
            <CartModal isVisible={isCartModalVisible} closeModal={() => setIsCartModalVisible(false)} />
        </li >
    );
});

export default ProductItem;