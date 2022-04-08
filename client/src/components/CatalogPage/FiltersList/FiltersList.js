import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../..';
import { getAvailableFilters, getCatalogFilters } from '../../../api/productApi';
import { sortedKeys } from '../../../utils/sortedKeys';
import AvailableFilter from '../AvailableFilter/AvailableFilter';
import PriceSlider from '../PriceSlider/PriceSlider';
import Filter from '../Filter/Filter';
import styles from './FiltersList.module.css';
import ModalName from '../../UI/ModalName/ModalName';
import { BodyScrollOff, BodyScrollOn } from '../../../utils/changeBodyScroll';
import { useNavigate, useParams } from 'react-router-dom';

const FiltersList = observer(({ isLinkDecrypting, isVisible, closeModal }) => {
    useEffect(() => isVisible ? BodyScrollOff() : BodyScrollOn(), [isVisible]);
    const [isBgDown, setIsBgDown] = useState(false);

    const navigate = useNavigate();

    const { catalog } = useContext(Context);
    const { ctg } = useParams();

    useEffect(async () => {
        if (!isLinkDecrypting) {
            catalog.addIsCatalogFetching('filters');

            catalog.fetchOption === 'catalog' && await getCatalogFilters({
                categoryId: catalog.selectedCategoryId,
                minPrice: catalog.selectedMinPrice,
                maxPrice: catalog.selectedMaxPrice,
                isAvailable: catalog.selectedIsAvailable,
                ...catalog.selectedFilters
            }).then(data => catalog.setFilters(data));

            ['catalog', 'search'].indexOf(catalog.fetchOption) !== -1 &&
                await getAvailableFilters({
                    fetchOption: catalog.fetchOption,
                    categoryId: catalog.selectedCategoryId,
                    search: catalog.search,
                    minPrice: catalog.selectedMinPrice,
                    maxPrice: catalog.selectedMaxPrice,
                    ...catalog.selectedFilters
                }).then(data => catalog.setIsAvailableCount([data.availableCount, data.notAvailableCount]));

            catalog.deleteIsCatalogFetching('filters');
        }
    }, [
        isLinkDecrypting,
        catalog.fetchOption,
        catalog.selectedCategoryId,
        catalog.search,
        catalog.selectedMinPrice,
        catalog.selectedMaxPrice,
        catalog.selectedIsAvailable,
        catalog.selectedFilters
    ]);

    return (
        <div
            id='bg'
            className={`${styles.filtersList} ${isVisible && styles.filtersListActive}`}
            onMouseDown={e => e.target.id == 'bg' && setIsBgDown(true)}
            onMouseUp={e => {
                if (e.target.id == 'bg' && isBgDown) closeModal();
                setIsBgDown(false);
            }}
        >
            <div className={styles.filtersList__wrapper}>
                <div className={styles.modalName}>
                    <ModalName modalName={`Filters`} callback={() => closeModal()} />
                </div>

                <div className={styles.filtersList__content}>
                    <AvailableFilter availableCount={catalog.isAvailableCount} />
                    <PriceSlider isLinkDecrypting={isLinkDecrypting} />

                    {catalog.fetchOption === 'catalog' && sortedKeys(catalog.filters).map(key =>
                        <Filter
                            key={key}
                            filterName={key}
                            filterValues={catalog.filters[key]}
                        />
                    )}

                    <div className={styles.bottomButtons}>
                        <button
                            className={styles.bottomButtons__apply}
                            onClick={() => closeModal()}
                        >
                            Apply filters
                        </button>
                        <button
                            className={styles.bottomButtons__reset}
                            onClick={function () {
                                if (catalog.fetchOption === 'search') navigate('/search/text=' + catalog.search.replace(' ', '+') + ';/');
                                else if (catalog.fetchOption === 'catalog') navigate('/catalog/' + ctg + '/');
                                closeModal()
                            }}
                        >
                            Reset filters
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
});

export default FiltersList;