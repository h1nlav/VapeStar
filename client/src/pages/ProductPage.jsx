import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '..';
import { getProduct } from '../api/productApi';
import { getReviewsByProductId } from '../api/reviewApi';
import ErrorPage from './ErrorPage';
import CatalogLoader from '../components/Loaders/CatalogLoader/CatalogLoader';
import ProductShortInfo from '../components/ProductPage/ProductShortInfo/ProductShortInfo';
import ProductInfo from '../components/ProductPage/ProductInfo/ProductInfo';
import styles from '../css/ProductPage.module.css';

const ProductPage = observer(() => {
    const { catalog } = useContext(Context);
    const { id } = useParams();

    const [isError, setIsError] = useState(false);
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState(null);

    const [isReviewAdding, setIsReviewAdding] = useState(false)

    useEffect(() => {
        let isUnmount = false;

        getProduct(id, { changeViews: catalog.products.length !== 0 })
            .then(product => {
                !isUnmount && setProduct(product);
                getReviewsByProductId({ productId: product.id })
                    .then(reviews => {
                        !isUnmount && setReviews(reviews);
                        !isUnmount && setIsReviewAdding(false);
                    })
                    .catch(() => !isUnmount && setIsError(true));
            }).catch(() => !isUnmount && setIsError(true));

       
    }, [id, isReviewAdding]);

    if (isError) return (<ErrorPage />);
    if (!product || !reviews) return (<CatalogLoader isVisible={true} />);
    return (
        <div className={styles.productPage}>
            <div className={styles.productPage__content}>
                <ProductShortInfo product={product} />
                <ProductInfo product={product} reviews={reviews} callback={() => setIsReviewAdding(true)} />
            </div>
            <CatalogLoader isVisible={isReviewAdding} />
        </div>
    );
});

export default ProductPage;