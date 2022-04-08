import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '..';
import ProductList from '../components/CatalogPage/ProductList/ProductList';
import CatalogLoader from '../components/Loaders/CatalogLoader/CatalogLoader';
import styles from '../css/MainPage.module.css'

const Main = observer(() => {
    const { catalog } = useContext(Context);

    const [isLinkDecrypting, setIsLinkDecrypting] = useState(true);
    useEffect(() => {
        setIsLinkDecrypting(true);
        catalog.setFetchOption('main');
        catalog.addIsCatalogFetching('products');
        setIsLinkDecrypting(false);
    }, []);

    return (
        <div className={styles.main}>
            <div className={styles.main__text} >
                <h1>Popular offers</h1>
            </div>
            <div className={styles.main__productList}>
                <ProductList isLinkDecrypting={isLinkDecrypting} />
            </div >
            <CatalogLoader isVisible={isLinkDecrypting || Object.keys(catalog.isCatalogFetching).length !== 0} />
        </div >
    );
});

export default Main;