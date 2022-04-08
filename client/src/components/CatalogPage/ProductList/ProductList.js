import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from 'react';
import { Link, useLocation, useParams } from "react-router-dom";
import { CATALOG_ROUTE, MAIN_ROUTE, SEARCH_ROUTE } from "../../../router/consts";
import { Context } from '../../..';
import { getAllProducts } from '../../../api/productApi';
import ProductItem from '../ProductItem/ProductItem';
import CatalogPagination from '../CatalogPagination/CatalogPagination';
import styles from './ProductList.module.css';

const ProductList = observer(({ isLinkDecrypting }) => {
    const { catalog } = useContext(Context);

    const path = useLocation()
    const { ctg } = useParams();

    useEffect(async () => {
        if (!isLinkDecrypting) {
            catalog.addIsCatalogFetching('products');
            await getAllProducts({
                fetchOption: catalog.fetchOption,
                order: catalog.selectedOrder,
                page: catalog.selectedPage[catalog.selectedPage.length - 1],
                limit: catalog.limit,
                search: catalog.search,
                categoryId: catalog.selectedCategoryId,
                minPrice: catalog.selectedMinPrice,
                maxPrice: catalog.selectedMaxPrice,
                isAvailable: catalog.selectedIsAvailable,
                ...catalog.selectedFilters
            }).then(data => {
                catalog.setProductsQuantity(data.count || 0)
                if (catalog.isSelectedSeveralPages) catalog.addProducts(data.products || []);
                else catalog.setProducts(data.products || []);
            });
            catalog.deleteIsCatalogFetching('products');
        }
    }, [
        isLinkDecrypting,
        catalog.fetchOption,
        catalog.selectedOrder,
        catalog.selectedPage,
        catalog.limit,
        catalog.search,
        catalog.selectedCategoryId,
        catalog.selectedMinPrice,
        catalog.selectedMaxPrice,
        catalog.selectedFilters
    ]);

    return (
        <div className={styles.productList}>
            {catalog.products.length === 0 && !catalog.isLinkDecrypting && Object.keys(catalog.isCatalogFetching).length === 0
                ?
                <div className={styles.notFound}>
                    <span className={styles.notFound__text}>Sorry, no results were found <br /> for the selected filters :(</span>
                    <Link to={function () {
                        if (path.pathname.startsWith(CATALOG_ROUTE)) return (CATALOG_ROUTE + '/' + ctg);
                        else if (path.pathname.startsWith(SEARCH_ROUTE)) return (SEARCH_ROUTE + '/text=' + catalog.search + ';');
                        else return (MAIN_ROUTE)
                    }()}>
                        <button className={styles.notFound__button}>
                            <span>Reset Filters</span>
                        </button>
                    </Link>
                </div>
                :
                <ul className={styles.productList__list}>
                    {catalog && catalog.products && catalog.products.map(product =>
                        <ProductItem
                            key={product.id}
                            product={product}
                        />
                    )}
                </ul>
            }
            <CatalogPagination />
        </div >
    );
});

export default ProductList;