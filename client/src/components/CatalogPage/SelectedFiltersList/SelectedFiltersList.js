import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../../../';
import Translit from '../../../utils/urlTransliteration';
import makeCatalogUrl from '../../../utils/makeCatalogUrl';
import styles from './SelectedFiltersList.module.css'

const SelectedFiltersList = observer(() => {
    const { catalog } = useContext(Context);
    const { ctg } = useParams();
    const navigate = useNavigate();

    const [selectedIsAvailable, setSelectedIsAvailable] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState('');
    const [selectedFilters, setSelectedFilters] = useState({});

    useEffect(() => {
        let isAvailable = [];
        [['In stock', 'true'], ['Out of stock', 'false']]
            .map((item) => catalog.selectedIsAvailable.indexOf(item[1]) !== -1 && isAvailable.push(item));
        setSelectedIsAvailable(isAvailable);

        (catalog.selectedMinPrice && catalog.selectedMaxPrice)
            ? setSelectedPrice(`${catalog.selectedMinPrice} - ${catalog.selectedMaxPrice}`)
            : setSelectedPrice('');

        let allFilters = JSON.parse(JSON.stringify(catalog.filters));
        let selecredFiltersObj = {};
        Object.keys(allFilters).map(filterKey => {
            Object.keys(allFilters[filterKey].values).map(valueKey => {
                if (allFilters[filterKey].values[valueKey].count === 0) {
                    let filterName = allFilters[filterKey].$DISPLAY_FILTER_NAME;
                    let filterValue = allFilters[filterKey].values[valueKey].$DISPLAY_VALUE_NAME;
                    if (!selecredFiltersObj[filterName]) selecredFiltersObj[filterName] = [];
                    selecredFiltersObj[filterName].push(filterValue);
                }
            });
        });
        setSelectedFilters(selecredFiltersObj);
    }, [catalog.selectedIsAvailable, catalog.selectedMinPrice, catalog.selectedMaxPrice, catalog.filters]);


    const removeAllFilters = () => {
        if (catalog.fetchOption === 'search') navigate('/search/text=' + catalog.search.replace(' ', '+') + ';/');
        else if (catalog.fetchOption === 'catalog') navigate('/catalog/' + ctg + '/');
    }

    const removeFilter = (filterName, value = null) => {
        let selectedIsAvailable = [...catalog.selectedIsAvailable];
        let minPrice = catalog.selectedMinPrice;
        let maxPrice = catalog.selectedMaxPrice;
        let urlFilters = { ...catalog.selectedFilters };

        if (filterName === 'available') selectedIsAvailable = selectedIsAvailable.filter(el => el !== value);
        else if (filterName === 'price') {
            minPrice = null;
            maxPrice = null;
        } else {
            filterName = Translit(filterName);
            value = Translit(value);
            urlFilters[filterName] = urlFilters[filterName].filter(el => el !== value);
            urlFilters[filterName].length === 0 && delete urlFilters[filterName];
        }

        navigate(makeCatalogUrl({
            ctg,
            search: catalog.search,
            minPrice: minPrice,
            maxPrice: maxPrice,
            isAvailable: selectedIsAvailable,
            order: catalog.selectedOrder,
            page: [1],
            filters: urlFilters
        }));
    }

    if (selectedIsAvailable.length === 0 && selectedPrice.length === 0 && Object.keys(selectedFilters).length === 0) return (<div />);
    return (
        <ul className={styles.selectedFilters}>
            <li
                className={styles.selectedFilters__removeAll}
                onClick={() => removeAllFilters()}
            >
                <span>Clear all filters</span>
            </li>

            {selectedIsAvailable.map(item =>
                <li
                    key={item[0]}
                    className={styles.selectedFilters__filter}
                    onClick={() => removeFilter('available', item[1])}
                >
                    <span>{item[0]}</span>
                    <div />
                </li>
            )}

            {selectedPrice.length > 0 &&
                <li
                    className={styles.selectedFilters__filter}
                    onClick={() => removeFilter('price')}
                >
                    <span>{selectedPrice}</span>
                    <div></div>
                </li>
            }

            {
                Object.keys(selectedFilters).map(filterName =>
                    selectedFilters[filterName].map(value =>
                        <li
                            key={value}
                            className={styles.selectedFilters__filter}
                            onClick={() => removeFilter(filterName, value)}
                        >
                            <span>{value}</span>
                            <div></div>
                        </li>
                    )
                )
            }
        </ul>
    );
});

export default SelectedFiltersList;



