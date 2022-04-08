import React from 'react';
import styles from './ProductSpecifications.module.css'

const ProductSpecifications = ({ product }) => {

    const sortedKeys = (obj) => {
        return Object.keys(obj)
            .sort(function (a, b) {
                return a.localeCompare(b);
            });
    }

    return (
        <table className={styles.specifications}>
            <tbody>
                {sortedKeys(product.info).map((key, index) =>
                    <tr key={index} className={styles.specifications__item}>
                        <td>{product.info[key].$INFO_NAME}</td>
                        <td>{product.info[key].$INFO_VALUE}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default ProductSpecifications;