import React from 'react';
import AdminAddProduct from '../AdminAddProduct/AdminAddProduct';
import AdminProduct from '../AdminProduct/AdminProduct';
import styles from './AdminProductsList.module.css'

const AdminProductsList = ({ products, productsCount, categories, fetchAndShowProducts, isRequiringChange = false }) => {

    return (
        <ul className={styles.productsList}>
            <div className={styles.productsList__name}>
                <h1>{isRequiringChange ? 'Products requiring change' : 'Products'}</h1>
            </div>
            <div className={styles.productsList__count}>
                <span>{isRequiringChange ? 'Total number of products requiring change:' : 'Total number of products:'} {productsCount}</span>
            </div>

            {products.map(product =>
                <AdminProduct
                    key={product.id}
                    product={product}
                    categories={categories}
                    fetchAndShowProducts={fetchAndShowProducts}
                />
            )}

            {!isRequiringChange &&
                <AdminAddProduct fetchAndShowProducts={fetchAndShowProducts} categories={categories} />
            }

        </ul>
    );
};

export default AdminProductsList;