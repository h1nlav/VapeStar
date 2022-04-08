import React from 'react';
import { Link } from 'react-router-dom';
import { PRODUCT_ROUTE } from '../../../router/consts';
import styles from './OrderProduct.module.css';

const OrderProduct = ({ product }) => {
    return (
        <li key={product.productId} className={styles.product}>
            <div className={styles.product__img}>
                <img src={process.env.REACT_APP_API_URL + '/img/' + product.productPic} />
            </div>

            <div className={styles.product__name}>
                <Link
                    to={PRODUCT_ROUTE + '/' + product.productId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.product__link}
                >
                    {product.productName}
                </Link>
            </div>

            <div className={styles.product__field}>
                <span className={styles.product__fieldLabel}>Price</span>
                <span className={styles.product__fieldText}>{product.productPrice.toLocaleString()} $</span>
            </div>
            <div className={styles.product__field}>
                <span className={styles.product__fieldLabel}>Quantity</span>
                <span className={styles.product__fieldText}>{product.quantity}</span>
            </div>

            <div className={styles.product__field}>
                <span className={styles.product__fieldLabel}>Sum</span>
                <span className={styles.product__fieldText}>{(product.productPrice * product.quantity).toLocaleString()} $</span>
            </div>
        </li>
    );
};

export default OrderProduct;