import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Context } from '..';
import { getAllProducts } from '../api/productApi';
import { MAIN_ROUTE } from '../router/consts';
import FiltersList from '../components/CatalogPage/FiltersList/FiltersList';
import ProductList from '../components/CatalogPage/ProductList/ProductList';
import CatalogLoader from '../components/Loaders/CatalogLoader/CatalogLoader';
import TopPanell from '../components/CatalogPage/TopPanell/TopPanell';
import styles from '../css/SearchPage.module.css';

const SearchPage = observer(() => {
    const { catalog } = useContext(Context);
    const { params = '' } = useParams();

    const [isFilterlistVisible, setIsFiltersListVisible] = useState(false);

    const [isLinkDecrypting, setIsLinkDecrypting] = useState(true);
    const [isSearchResultsExist, setIsSearchResultsExist] = useState(false);
    useEffect(() => {
        let isUnmount = false;
        !isUnmount && setIsLinkDecrypting(true)

        catalog.setFetchOption('search');
        catalog.resetCatalogStore();
        if (!params.includes('page')) {
            catalog.setSelectedPage([1]);
            catalog.setIsSelectedSeveralPages(false);
        }

        let tmpSearch = params.substring(params.indexOf('text='));
        tmpSearch = tmpSearch.substring(0, tmpSearch.length - 1);
        tmpSearch = tmpSearch.substring(5).replace('+', ' ');
        catalog.setSearch(tmpSearch);

        params.split(';').map(param => {
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
            }
        });

        const checkResultsExist = async () => {
            await getAllProducts({
                fetchOption: catalog.fetchOption,
                search: catalog.search,
                limit: 0
            }).then(data => {
                data.isResultsExist && catalog.addIsCatalogFetching('products');
                !isUnmount && setIsSearchResultsExist(data.isResultsExist);
                !isUnmount && setIsLinkDecrypting(false);
            });
        }
        checkResultsExist();

        return () => { isUnmount = true };
    }, [params]);

    return (
        <div className={styles.search}>
            {isSearchResultsExist
                ?
                <div>
                    <div className={styles.search__text}>
                        <h1>Search results "{catalog.search}"</h1>
                    </div>

                    <TopPanell setIsFiltersListVisible={setIsFiltersListVisible} productsQuantity={catalog.productsQuantity} params={params} />

                    <div className={styles.search__content}>
                        <FiltersList isVisible={isFilterlistVisible} closeModal={() => setIsFiltersListVisible(false)} />
                        <ProductList isLinkDecrypting={isLinkDecrypting} />
                    </div>
                </div>
                : !isLinkDecrypting &&
                <div className={styles.notFound}>
                    <div className={styles.notFound__container}>
                        <div className={styles.notFound__img}></div>
                        <h1> No results found for "{catalog.search}"</h1>
                        <Link to={MAIN_ROUTE}>
                            <button>
                                <span>
                                    To Home Page
                                </span></button>
                        </Link>
                    </div>
                </div>
            }
            <CatalogLoader isVisible={isLinkDecrypting || Object.keys(catalog.isCatalogFetching).length !== 0} />
        </div >
    );
});

export default SearchPage;