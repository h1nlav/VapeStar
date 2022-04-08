import React from 'react';
import OrderSelect from '../OrderSelect/OrderSelect';
import SelectedFiltersList from '../SelectedFiltersList/SelectedFiltersList';
import styles from './TopPanell.module.css'

const TopPanell = ({setIsFiltersListVisible, productsQuantity, params}) => {
    return (
        <div className={styles.topPanell}>
            <div className={styles.topPanell__left}>
                <button
                    className={styles.topPanell__filtersButton}
                    onClick={() => setIsFiltersListVisible(true)}
                >
                    <div />
                    <span>Filters</span>
                </button>
                <div className={styles.topPanell__productsQuantity}>
                    <span>{params && `Products selected: ${productsQuantity}`}</span>
                </div>
                <div className={styles.topPanell__selectedFilters}>
                    <SelectedFiltersList />
                </div>
            </div>
            <div className={styles.topPanell__right}>
                <OrderSelect />
            </div>
            <div className={styles.topPanell__border} />
        </div>
    );
};

export default TopPanell;