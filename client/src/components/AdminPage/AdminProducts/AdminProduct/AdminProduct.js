import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteProduct } from '../../../../api/productApi';
import { PRODUCT_ROUTE } from '../../../../router/consts';
import ConfirmationModal from '../../../UI/ConfirmationModal/ConfirmationModal';
import FullInfoField from '../../../UI/FullInfoField/FullInfoField';
import ShortInfoContainer from '../../../UI/ShortInfoContainer/ShortInfoContainer';
import AdminChangeProduct from '../AdminChangeProduct/AdminChangeProduct';
import styles from './AdminProduct.module.css'

const AdminProduct = ({ product, categories, fetchAndShowProducts }) => {
    const [isProductOpened, setIsProductOpened] = useState(false);
    const [isProductChanging, setIsProductChanging] = useState(false);

    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false)
    const [confirmationModalMessage, setConfirmationModalMessage] = useState('')
    const [confirmationModalCallback, setConfirmationModalCallback] = useState(null)

    const removeAndShowProduct = async (id) => {
        await deleteProduct({ id })
            .then(async () => await fetchAndShowProducts());
    }

    return (
        <li className={styles.product}>
            <ShortInfoContainer
                id={`№ ${product.id}`}
                isOpened={isProductOpened}
                onClick={() => setIsProductOpened(!isProductOpened)}
            >
                <div className={styles.shortInfo__name}>
                    <Link
                        to={PRODUCT_ROUTE + '/' + product.id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.shortInfo__link}
                    >
                        {product.name}
                    </Link>
                </div>

                <div className={styles.shortInfo__category}>{categories.map(ctg => ctg.id === product.categoryId && ctg.name)}</div>
            </ShortInfoContainer>

            {isProductOpened &&

                <div className={styles.product__opened}>
                    {isProductChanging
                        ?
                        <AdminChangeProduct
                            product={product}
                            categories={categories}
                            fetchAndShowProducts={fetchAndShowProducts}
                            isProductChanging={isProductChanging}
                            setIsProductChanging={setIsProductChanging}
                        />
                        :
                        <div className={styles.fullInfo}>

                            <FullInfoField fieldName={'Product name'} fieldValue={product.name} />
                            <FullInfoField fieldName={'Category'} fieldValue={
                                product.categoryId
                                    ? categories.map(ctg => ctg.id === product.categoryId && ctg.name)
                                    : 'You must select a category!'
                            } />
                            <FullInfoField fieldName={'Product description'} fieldValue={product.description} />
                            <FullInfoField fieldName={'Unit price'} fieldValue={`${product.price} $`} />
                            <FullInfoField fieldName={'Product availability'} fieldValue={product.isAvaileble ? 'In stock' : 'Out of stock'} />

                            <div className={styles.fullInfo__field}>
                                <div className={styles.fullInfo__label}><span>Product information</span></div>
                                {product.info.map((info, index) =>
                                    <div key={index} className={styles.fullInfo__info}>
                                        <div className={styles.fullInfo__infoName}><span>{info[0]}:</span></div>
                                        <div className={styles.fullInfo__infoValue}><span>{info[1]}</span></div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.fullInfo__field}>
                                <div className={styles.fullInfo__label}><span>Product pictures</span></div>
                                <div className={styles.fullInfo__pics}>
                                    {product.products_pics.map(pic =>
                                        <a key={pic.fileName} href={process.env.REACT_APP_API_URL + '/img/' + pic.fileName} target="_blank">
                                            <div className={styles.fullInfo__pic}>
                                                <img src={process.env.REACT_APP_API_URL + '/img/' + pic.fileName}></img>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className={styles.fullInfo__buttons}>
                                <button
                                    className={styles.fullInfo__removeButton}
                                    onClick={() => {
                                        setConfirmationModalMessage(<span>Are you sure you want to delete "{product.name}" product?</span>);
                                        setConfirmationModalCallback(() => () => removeAndShowProduct(product.id));
                                        setIsConfirmationModalVisible(true);
                                    }}
                                >
                                    Delete
                                </button>
                                <button
                                    className={styles.fullInfo__editButton}
                                    onClick={() => setIsProductChanging(!isProductChanging)}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    }
                </div>

            }
            <ConfirmationModal
                isVisible={isConfirmationModalVisible}
                setIsVisible={setIsConfirmationModalVisible}
                message={confirmationModalMessage}
                callback={confirmationModalCallback}
            />
        </li>
    );
};

export default AdminProduct;