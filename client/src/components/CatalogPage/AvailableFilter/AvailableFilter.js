import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../../..';
import styles from './AvailableFilter.module.css';
import makeCatalogUrl from '../../../utils/makeCatalogUrl';

const AvailableFilter = observer(({ availableCount }) => {
    const { catalog } = useContext(Context);
    const { ctg } = useParams();
    const navigate = useNavigate();

    const changeUrlIsAvailable = (value, isSelected) => {
        let selectedIsAvailable = [...catalog.selectedIsAvailable];
        if (isSelected && selectedIsAvailable.indexOf(value) === -1) selectedIsAvailable.push(value);
        else if (!isSelected) selectedIsAvailable = selectedIsAvailable.filter(el => el !== value)

        navigate(makeCatalogUrl({
            ctg,
            search: catalog.search,
            minPrice: catalog.selectedMinPrice,
            maxPrice: catalog.selectedMaxPrice,
            isAvailable: selectedIsAvailable,
            order: catalog.selectedOrder,
            page: [1],
            filters: catalog.selectedFilters
        }));
    }

    const [isVisible, setIsVisible] = useState(false)
    useEffect(() => {
        let check = false;
        [['In stock', 'true'], ['Out of stock', 'false']].map((item, index) => {
            if ((catalog.selectedIsAvailable.indexOf(item[1]) !== -1 ||
                (catalog.selectedIsAvailable.indexOf(item[1]) === -1 && availableCount[index] > 0))) check = true;
        });
        setIsVisible(check);
    }, [availableCount, catalog.selectedIsAvailable]);


    if (!isVisible) return (<div />);
    return (
        <div className={styles.isAvailable}>
            <div className={styles.isAvailable_name}>Product availability</div>
            <div className={styles.isAvailable__checkboxes}>
                {[['In stock', 'true'], ['Out of stock', 'false']].map((item, index) => {
                    if ((catalog.selectedIsAvailable.indexOf(item[1]) !== -1 ||
                        (catalog.selectedIsAvailable.indexOf(item[1]) === -1 && availableCount[index] > 0))) return (
                            <label
                                key={item[0]}
                                className={styles.isAvailable__checkboxContainer}
                            >
                                <input type="checkbox"
                                    className={styles.isAvailable__checkbox}
                                    onChange={e => changeUrlIsAvailable(item[1], e.target.checked)}
                                    checked={catalog.selectedIsAvailable.indexOf(item[1]) !== -1 ? true : false}
                                />
                                <span>{item[0]}</span>
                                <span>{catalog.selectedIsAvailable.indexOf(item[1]) === -1 && `⠀(${availableCount[index]})`}</span>
                            </label>
                        )
                })}
            </div>
        </div>
    );
});

export default AvailableFilter;