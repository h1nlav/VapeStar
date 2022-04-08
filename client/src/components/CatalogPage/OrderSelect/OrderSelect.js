import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Context } from '../../..';
import { useNavigate, useParams } from 'react-router-dom';
import makeCatalogUrl from '../../../utils/makeCatalogUrl';
import styles from './OrderSelect.module.css';

const OrderSelect = observer(() => {
    const { catalog } = useContext(Context);
    const { ctg } = useParams();
    const navigate = useNavigate();

    const changeOrderUrl = (order) => navigate(makeCatalogUrl({
        ctg,
        search: catalog.search,
        minPrice: catalog.selectedMinPrice,
        maxPrice: catalog.selectedMaxPrice,
        isAvailable: catalog.selectedIsAvailable,
        order: order,
        page: [1],
        filters: catalog.selectedFilters
    }));

    return (
        <div className={styles.order} >
            <select
                className={styles.order__select}
                value={catalog.selectedOrder}
                onInput={e => changeOrderUrl(e.target.value)}
            >
                {[['New', 'new'],
                ['From cheap', 'cheap'],
                ['From expensive', 'expencive'],
                ['Rating', 'rating'],
                ['Popular', 'popular']].map(option =>
                    <option key={option[1]} value={option[1]}>{option[0]}</option>
                )}
            </select>
        </div >
    );
});

export default OrderSelect;