import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../../..';
import { getMinMaxPrices } from '../../../api/productApi';
import makeCatalogUrl from '../../../utils/makeCatalogUrl';
import styles from './PriceSlider.module.css';

const PriceSlider = observer(({ isLinkDecrypting }) => {
    const { catalog } = useContext(Context);
    const { ctg } = useParams();
    const navigate = useNavigate();

    const [minInput, setMinInput] = useState(null);
    const [maxInput, setMaxInput] = useState(null);
    const [minSlider, setMinSlider] = useState(null);
    const [maxSlider, setMaxSlider] = useState(null);

    const inputMin = useRef(null);
    const inputMax = useRef(null);
    const submitButton = useRef(null);

    useEffect(() => {
        let isUnmount = false;
        if (!isLinkDecrypting && catalog.fetchOption && (catalog.fetchOption === 'catalog' || catalog.fetchOption === 'search')) {
            catalog.addIsCatalogFetching('price');

            const fetchPrices = async () => {
                await getMinMaxPrices({
                    fetchOption: catalog.fetchOption,
                    categoryId: catalog.selectedCategoryId,
                    search: catalog.search
                }).then(data => {
                    catalog.setCategoryMinPrice(data.minPrice);
                    catalog.setCategoryMaxPrice(data.maxPrice);
                });

                if (!catalog.selectedMinPrice && !catalog.selectedMaxPrice) {
                    await getMinMaxPrices({
                        fetchOption: catalog.fetchOption,
                        categoryId: catalog.selectedCategoryId,
                        search: catalog.search,
                        isAvailable: catalog.selectedIsAvailable,
                        ...catalog.selectedFilters
                    }).then(data => {
                        if (data.minPrice !== data.maxPrice) {
                            !isUnmount && setMinInput(data.minPrice); !isUnmount && setMinSlider(data.minPrice);
                            !isUnmount && setMaxInput(data.maxPrice); !isUnmount && setMaxSlider(data.maxPrice);
                        } else {
                            !isUnmount && setMinInput(null); !isUnmount && setMinSlider(null);
                            !isUnmount && setMaxInput(null); !isUnmount && setMaxSlider(null);
                        }
                    })
                } else {
                    !isUnmount && setMinInput(catalog.selectedMinPrice); !isUnmount && setMinSlider(catalog.selectedMinPrice);
                    !isUnmount && setMaxInput(catalog.selectedMaxPrice); !isUnmount && setMaxSlider(catalog.selectedMaxPrice);
                }

                catalog.deleteIsCatalogFetching('price');
            }
            
            fetchPrices();
        }
        return () => { isUnmount = true };
    }, [
        isLinkDecrypting,
        catalog.fetchOption,
        catalog.selectedCategoryId,
        catalog.search,
        catalog.selectedIsAvailable,
        catalog.selectedFilters
    ]);

    const makeEnabled = () => {
        inputMin.current.style.border = "1px solid #a6a5a5";
        inputMax.current.style.border = "1px solid #a6a5a5";
        submitButton.current.disabled = false;
    }
    const makeDisabled = () => {
        inputMin.current.style.border = "1px solid #f84147";
        inputMax.current.style.border = "1px solid #f84147";
        submitButton.current.disabled = true;
    }

    const checkMin = (e) => {
        setMinInput(e.target.value)
        if (parseInt(e.target.value) > catalog.categoryMinPrice && parseInt(e.target.value) - 1 < parseInt(maxInput)) {
            makeEnabled();
            setMinSlider(e.target.value);
        } else makeDisabled();
    }
    const checkMax = (e) => {
        setMaxInput(e.target.value)
        if (parseInt(e.target.value) < catalog.categoryMaxPrice && parseInt(e.target.value) + 1 > parseInt(minInput)) {
            makeEnabled();
            setMaxSlider(e.target.value);
        } else makeDisabled();
    }

    const changeUrlPrice = (minPrice, maxPrice) => navigate(makeCatalogUrl({
        ctg,
        search: catalog.search,
        minPrice,
        maxPrice,
        isAvailable: catalog.selectedIsAvailable,
        order: catalog.selectedOrder,
        page: [1],
        filters: catalog.selectedFilters
    }));

    if (!minInput || !maxInput || !minSlider || !maxSlider) return (<div />);
    return (
        <div className={styles.priceSlider}>
            <div className={styles.priceSlider__name}>Price</div>
            <div className={styles.priceSlider__inputsContainer}>
                <input ref={inputMin} type='number' value={minInput || 0} onInput={e => checkMin(e)} />
                <span>—</span>
                <input ref={inputMax} type='number' value={maxInput || 0} onInput={e => checkMax(e)} />
                <button ref={submitButton} className={styles.submit_button} disabled={false} onClick={() => changeUrlPrice(minInput, maxInput)}>
                    OK
                </button>
            </div>
            <div className={styles.priceSlider__sliderContainer}>
                <div className={styles.priceSlider__slider}>
                    <div
                        className={styles.priceSlider__progress}
                        style={{
                            left: `${((parseInt(minSlider) - catalog.categoryMinPrice) / (catalog.categoryMaxPrice - catalog.categoryMinPrice)) * 95}%`,
                            right: `${95 - (((parseInt(maxSlider) - catalog.categoryMinPrice) / (catalog.categoryMaxPrice - catalog.categoryMinPrice)) * 95)}%`
                        }}
                    ></div>
                </div>
                <div className={styles.priceSlider__rangeInputs}>
                    <input type="range"
                        className={styles.rangeInputs__min}
                        min={catalog.categoryMinPrice}
                        max={catalog.categoryMaxPrice}
                        value={minSlider || 0}
                        onInput={e => {
                            setMaxInput(maxSlider);
                            makeEnabled();
                            if (e.target.value > parseInt(maxSlider)) {
                                setMinSlider(maxSlider);
                                setMinInput(maxSlider);
                            } else {
                                setMinSlider(e.target.value);
                                setMinInput(e.target.value);
                            }
                        }}
                    />
                    <input type="range"
                        className={styles.rangeInputs__max}
                        min={catalog.categoryMinPrice}
                        max={catalog.categoryMaxPrice}
                        value={maxSlider || 0}
                        onInput={e => {
                            setMinInput(minSlider);
                            makeEnabled();

                            if (e.target.value < parseInt(minSlider)) {
                                setMaxSlider(minSlider);
                                setMaxInput(minSlider);
                            } else {
                                setMaxSlider(e.target.value);
                                setMaxInput(e.target.value);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

export default PriceSlider;
