import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../../..';
import makeCatalogUrl from '../../../utils/makeCatalogUrl';
import { sortedKeys } from '../../../utils/sortedKeys';
import styles from './Filter.module.css'

const Filter = observer(({ filterName, filterValues }) => {
    const { catalog } = useContext(Context);
    const { ctg } = useParams();
    const navigate = useNavigate();
    const changeUrlFilters = (filter, value, isSelected) => {
        let urlFilters = { ...catalog.selectedFilters };
        if (urlFilters[filter]) {
            if (isSelected) urlFilters[filter].push(value)
            else {
                urlFilters[filter] = urlFilters[filter].filter(el => el !== value);
                urlFilters[filter].length === 0 && delete urlFilters[filter];
            }
        } else if (isSelected) urlFilters[filter] = [value];

        navigate(makeCatalogUrl({
            ctg,
            search: catalog.search,
            minPrice: catalog.selectedMinPrice,
            maxPrice: catalog.selectedMaxPrice,
            isAvailable: catalog.selectedIsAvailable,
            order: catalog.selectedOrder,
            page: [1],
            filters: urlFilters
        }));
    }

    if (Object.keys(filterValues.values).length === 0) return <div />
    return (
        <div className={styles.filter}>
            <div className={styles.filter_name}>{filterValues.$DISPLAY_FILTER_NAME}</div>
            <div className={styles.filter__checkboxes}>
                {sortedKeys(filterValues.values).map(key =>
                    <label
                        key={key}
                        className={styles.choice}
                    >
                        <input type="checkbox"
                            className={styles.choice__checkbox}
                            onChange={e => changeUrlFilters(filterName, key, e.target.checked)}
                            checked={filterValues.values[key].count === 0 ? true : false}
                        />
                        <span>{filterValues.values[key].$DISPLAY_VALUE_NAME}</span>
                        <span>{filterValues.values[key].count !== 0 && `⠀(${filterValues.values[key].count})`}</span>
                    </label>
                )}
            </div>
        </div>
    );
});


export default Filter;