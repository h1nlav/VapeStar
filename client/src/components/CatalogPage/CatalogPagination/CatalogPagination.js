import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../../..';
import makeCatalogUrl from '../../../utils/makeCatalogUrl';
import styles from './CatalogPagination.module.css';

const CatalogPagination = observer(() => {
    const { catalog } = useContext(Context);
    const { ctg } = useParams();
    const navigate = useNavigate();

    const [lastSelectedPage, setLastSelectedPage] = useState(0);
    useEffect(() => {
        setLastSelectedPage(catalog.selectedPage[catalog.selectedPage.length - 1])
    }, [catalog.selectedPage]);

    const [pagesArray, setPagesArray] = useState([]);
    useEffect(() => {
        let pagesQuantity = Math.ceil(catalog.productsQuantity / catalog.limit);
        let tmpArray = [];
        if (pagesQuantity < 10) for (let i = 1; i <= pagesQuantity; i++) tmpArray.push(i);
        else {
            for (let i = 1; i <= pagesQuantity; i++) {
                if (i == 1 || i == pagesQuantity) tmpArray.push(i);
                else {
                    if ((lastSelectedPage <= 5 && i <= 7) || (lastSelectedPage >= pagesQuantity - 5 && i >= pagesQuantity - 6)
                        || (i >= lastSelectedPage - 2 && i <= lastSelectedPage + 2)) tmpArray.push(i);
                    else {
                        if (tmpArray[tmpArray.length - 1] == '...') continue;
                        else tmpArray.push('...');
                    }
                }
            }
        }
        setPagesArray(tmpArray);
    }, [lastSelectedPage, catalog.productsQuantity]);

    const changePageUrl = (page, isSeveralPages) => {
        catalog.setIsSelectedSeveralPages(isSeveralPages);
        navigate(makeCatalogUrl({
            ctg,
            search: catalog.search,
            minPrice: catalog.selectedMinPrice,
            maxPrice: catalog.selectedMaxPrice,
            isAvailable: catalog.selectedIsAvailable,
            order: catalog.selectedOrder,
            page: [page],
            filters: catalog.selectedFilters
        }));
    }

    if (pagesArray.length <= 1) return (<div />);
    return (
        <div className={styles.catalogPagination}>
            {lastSelectedPage != pagesArray[pagesArray.length - 1] &&
                <div
                    className={styles.showMore}
                    onClick={() => changePageUrl(lastSelectedPage + 1, true)}
                >
                    <div className={styles.showMore__img} />
                    <span className={styles.showMore__text}>Показать еще</span>
                </div>
            }

            <div className={styles.catalogPagination__content}>
                <div className={lastSelectedPage == pagesArray[0]
                    ? `${styles.catalogPagination__leftButton} ${styles.catalogPagination__buttonBlocked}`
                    : styles.catalogPagination__leftButton}
                    onClick={() => lastSelectedPage !== pagesArray[0] && changePageUrl(lastSelectedPage - 1, false)}
                ><div /></div>

                <span className={styles.catalogPagination__pagesCount}>Page {catalog.selectedPage[catalog.selectedPage.length - 1]} of {pagesArray.length}</span>
                <div className={styles.catalogPagination__pagesList}>
                    {pagesArray.map((item, index) =>
                        <div
                            key={index}
                            className={function (item, index) {
                                if (item == '...') {
                                    if ((index < 4 && catalog.selectedPage.indexOf(pagesArray[2] - 1) !== -1))
                                        return `${styles.catalogPagination__pageItem} ${styles.catalogPagination__selectedPageItem}`;
                                    else return styles.catalogPagination__pageItem;
                                } else {
                                    if (catalog.selectedPage.indexOf(item) !== -1)
                                        return `${styles.catalogPagination__pageItem} ${styles.catalogPagination__selectedPageItem}`;
                                    else return styles.catalogPagination__pageItem;
                                }
                            }(item, index)}
                            onClick={() => {
                                if (item == '...' && index > 4) changePageUrl(pagesArray[pagesArray.length - 3] + 1, false);
                                else if (item == '...' && index < 4) changePageUrl(pagesArray[2] - 1, false);
                                else changePageUrl(item, false);
                            }}
                        >
                            <span>{item}</span>
                        </div>
                    )}
                </div>

                <div className={lastSelectedPage == pagesArray[pagesArray.length - 1]
                    ? `${styles.catalogPagination__rightButton} ${styles.catalogPagination__buttonBlocked}`
                    : styles.catalogPagination__rightButton}
                    onClick={() => lastSelectedPage !== pagesArray[pagesArray.length - 1] && changePageUrl(lastSelectedPage + 1, false)}
                ><div /></div>
            </div>
        </div >
    );
});

export default CatalogPagination;