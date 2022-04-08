import React, { useState } from 'react';
import AdminChangeProduct from '../AdminChangeProduct/AdminChangeProduct';
import styles from './AdminAddProduct.module.css';

const AdminAddProduct = ({ fetchAndShowProducts, categories }) => {
    const [isNewProductCreating, setIsNewProductCreating] = useState(false);

    return (
        <div>
            {isNewProductCreating
                ?
                <div className={styles.addProductForm}>
                    <AdminChangeProduct
                        isCreating={true}
                        product={{
                            name: '',
                            categoryId: 0,
                            description: '',
                            price: 0,
                            isAvailable: true,
                            products_pics: [],
                            info: []
                        }}
                        categories={categories}
                        fetchAndShowProducts={fetchAndShowProducts}
                        setIsProductChanging={setIsNewProductCreating}
                    />
                </div>
                :
                <div
                    className={styles.addProductForm_addProductButton}
                    onClick={() => setIsNewProductCreating(true)}
                >
                    <span>Add product</span>
                </div>
            }
        </div>
    );
};

export default AdminAddProduct;