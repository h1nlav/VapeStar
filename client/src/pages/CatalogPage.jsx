import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Context } from '..';
import Translit from '../utils/urlTransliteration.js';
import CatalogLoader from '../components/Loaders/CatalogLoader/CatalogLoader';
import FiltersList from '../components/CatalogPage/FiltersList/FiltersList';
import ProductList from '../components/CatalogPage/ProductList/ProductList';
import styles from '../css/Catalog.module.css';
import TopPanell from '../components/CatalogPage/TopPanell/TopPanell';

const Catalog = observer(() => {
    const { catalog } = useContext(Context);
    const { ctg, params = '' } = useParams();

    const [isFilterlistVisible, setIsFiltersListVisible] = useState(false);

    const [isLinkDecrypting, setIsLinkDecrypting] = useState(true);
    useEffect(() => {
        setIsLinkDecrypting(true);
        if (catalog.categories) {
            catalog.setFetchOption('catalog');
            catalog.resetCatalogStore();
            if (!params.includes('page')) {
                catalog.setSelectedPage([1]);
                catalog.setIsSelectedSeveralPages(false);
            }
            catalog.setSearch(null);

            const checkCtg = (category) => {
                if (Translit(category.name) === ctg) {
                    catalog.selectedCategoryId !== category.id && catalog.setIsSelectedSeveralPages(false);
                    catalog.setSelectedCategoryId(category.id);
                    catalog.setSelectedCategoryName(category.name);
                }
            }

            catalog.categories.map(category => {
                checkCtg(category);
                category.categories.map(subCategory => checkCtg(subCategory));
            });

            let filters = {};
            let paramsArray = params.split(';');
            paramsArray.pop();

            paramsArray.map(param => {
                let filterName = param.split('=')[0];
                if (filterName === 'price') {
                    catalog.setSelectedMinPrice(param.split('=')[1].split('-')[0]);
                    catalog.setSelectedMaxPrice(param.split('=')[1].split('-')[1]);
                } else if (filterName === 'available') {
                    let isAvailable = [];
                    param.split('=')[1].split(',').map(value => isAvailable.push(value));
                    catalog.setSelectedIsAvailable(isAvailable);
                } else if (filterName === 'order') {
                    catalog.setSelectedOrder(param.split('=')[1]);
                } else if (filterName === 'page') {
                    let selectedPage = +param.split('=')[1].split(',');
                    if (catalog.isSelectedSeveralPages) {
                        let selectedPages = [...catalog.selectedPage, selectedPage];
                        catalog.setSelectedPage(selectedPages);
                    } else catalog.setSelectedPage([selectedPage]);
                } else {
                    let filterValues = [];
                    param.split('=')[1].split(',').map(value => filterValues.push(value));
                    filters[filterName] = filterValues;
                }
            });

            catalog.addIsCatalogFetching('products');
            catalog.setSelectedFilters(filters);
        }
        setIsLinkDecrypting(false);
    }, [catalog.categories, ctg, params]);

    return (
        <div className={styles.catalog}>
            <div className={styles.catalog__categoryName}>
                <h1>{catalog.selectedCategoryName}</h1>
            </div>

            <TopPanell setIsFiltersListVisible={setIsFiltersListVisible} productsQuantity={catalog.productsQuantity} params={params} />

            <div className={styles.catalog__content}>
                <FiltersList isLinkDecrypting={isLinkDecrypting} isVisible={isFilterlistVisible} closeModal={() => setIsFiltersListVisible(false)} />
                <ProductList isLinkDecrypting={isLinkDecrypting} />
            </div>

            <CatalogLoader isVisible={isLinkDecrypting || Object.keys(catalog.isCatalogFetching).length !== 0} />
        </div >
    );
});

export default Catalog;

