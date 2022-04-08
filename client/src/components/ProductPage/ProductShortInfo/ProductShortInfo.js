import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../..';
import { addCart } from '../../../api/cartApi';
import TouchGallery from '../TouchGallery/TouchGallery';
import Gallery from '../Gallery/Gallery';
import CartModal from '../../Modals/CartModal/CartModal/CartModal';
import styles from './ProductShortInfo.module.css';

const ProductShortInfo = observer(({ product }) => {
    const { auth, order } = useContext(Context);
    const [isTouchGallery, setIsTouchGallery] = useState(window.matchMedia("(max-width: 800px)").matches);

    useEffect(() => {
        let isUnmount = false
        let windowWidthMatch = window.matchMedia("(max-width: 800px)");
        windowWidthMatch.addListener(() => !isUnmount && setIsTouchGallery(windowWidthMatch.matches));
        return () => { isUnmount = true };
    }, []);
    const [quantity, setQuantity] = useState(1);

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

        order.setCart(JSON.parse(localStorage.getItem('cart')));
        setIsCartModalVisible(true);
    }

    const [isCartModalVisible, setIsCartModalVisible] = useState(false);

    return (
        <div className={styles.shortInfo}>
            <div className={styles.shortInfo_galleryContainer}>
                {isTouchGallery
                    ? <TouchGallery pics={product.products_pics} />
                    : <Gallery pics={product.products_pics} productName={product.name} />
                }
            </div>

            <div className={styles.shortInfo_offerСontainer}>
                <div className={styles.shortInfo__name}>{product.name}</div>

                <div className={styles.rating}>
                    <div className={styles.rating__stars}>
                        <span>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                        <div
                            className={styles.rating__starsProgress}
                            style={{ width: `${product.avgRating / 5 * 100}%` }}
                        >&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                    </div>

                    {parseInt(product.countRating) > 0
                        ?
                        <div className={styles.rating__comments}>
                            <div /><span>{product.countRating}</span>
                        </div>
                        :
                        <div className={styles.rating__comments}>
                            <span>No reviews</span>
                        </div>
                    }
                </div>

                <div className={styles.shortInfo__description}>{product.description}</div>

                <div className={styles.shortInfo__price}>{product.price.toLocaleString()} $</div>

                <div className={styles.shortInfo__isAvailable}>
                    {product.isAvailable
                        ? <span className={styles.available}>In stock, ready to ship</span>
                        : <span className={styles.not_available}>Out of stock</span>
                    }
                </div>

                {product.isAvailable &&
                    (isProductInCart
                        ?
                        <div className={styles.makeOrder}>
                            <div
                                className={styles.makeOrder__productInCart}
                                onClick={() => setIsCartModalVisible(true)}
                            >
                                <div />
                                <span>Product in cart</span>
                            </div>
                        </div>
                        :
                        <div className={styles.makeOrder}>
                            <input
                                className={styles.makeOrder__quantityInput}
                                type='number'
                                value={quantity}
                                onChange={e => { if (e.target.value >= 1) setQuantity(parseInt(e.target.value)) }}
                            ></input>
                            <div className={styles.makeOrder__quantityTouchspin}>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                                <button onClick={() => { if (quantity - 1 >= 1) setQuantity(quantity - 1) }}>−</button>
                            </div>

                            <div
                                className={styles.makeOrder__addToCart}
                                onClick={() => addToCartAndShow()}
                            >
                                <div />
                                <span>Add to cart</span>
                            </div>
                        </div>
                    )
                }
            </div>

            <CartModal isVisible={isCartModalVisible} closeModal={() => setIsCartModalVisible(false)} />
        </div >
    );
});

export default ProductShortInfo;


