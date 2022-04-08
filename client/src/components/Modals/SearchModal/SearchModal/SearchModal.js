import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../../../api/productApi';
import { SEARCH_ROUTE } from '../../../../router/consts';
import SearchOffer from '../SearchOffer/SearchOffer';
import styles from './SearchModal.module.css'

const SearchModal = ({ isSearchModalVisible, setIsSearchModalVisible, resetModalStates }) => {
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(false);

    const searchModalBackground = useRef(null);
    const debounceTimer = useRef(null);

    const [searchText, setSearchText] = useState('');
    const [searchOffers, setSearchOffers] = useState([]);
    const [searchOffersCount, setSearchOffersCount] = useState(0);
    const [isOffersNotFound, setIsOffersNotFound] = useState(false);

    useMemo(async () => {
        setIsFetching(true);
        clearTimeout(debounceTimer.current);
        if (searchText.length !== 0) {
            debounceTimer.current = setTimeout(async () => {
                await getAllProducts({
                    fetchOption: 'search',
                    search: searchText,
                    order: 'popular',
                    limit: 5,
                }).then(data => {
                    if (data.count === 0) {
                        setSearchOffers([]);
                        setSearchOffersCount(0);
                        setIsOffersNotFound(true);
                    }
                    else {
                        setSearchOffers(data.products);
                        setSearchOffersCount(data.count);
                        setIsOffersNotFound(false);
                    }
                })
                setIsFetching(false);
            }, 1000);
        }
    }, [searchText]);

    const resetOffers = () => {
        setSearchOffers([]);
        setSearchOffersCount(0);
        setIsOffersNotFound(false);
    }

    const navigateToSearchPage = () => {
        resetOffers();
        setSearchText('');
        setIsSearchModalVisible(false);
        navigate(SEARCH_ROUTE + '/' + `text=${searchText.replace(' ', "+")}` + ';')
    }

    return (
        <div className={`${styles.search} unselectable`}>
            <div
                ref={searchModalBackground}
                className={isSearchModalVisible ? styles.search__bgOn : styles.search__bgOff}
                onClick={() => setIsSearchModalVisible(false)}
            />
            <div className={`${styles.search__container} ${isSearchModalVisible && styles.active}`} >

                <input
                    className={styles.search__input}
                    type='text'
                    placeholder="Search.."
                    value={searchText}
                    onClick={() => !isSearchModalVisible && resetModalStates()}
                    onFocus={e => {
                        if (e.target.value.length !== 0) {
                            resetModalStates();
                            setIsSearchModalVisible(true);
                        }
                    }}
                    onInput={e => {
                        setSearchText(e.target.value);
                        if (e.target.value.length !== 0) {
                            resetModalStates();
                            setIsSearchModalVisible(true);
                        }
                        else {
                            setIsSearchModalVisible(false);
                            resetOffers();
                        }
                    }}
                    onKeyDown={e => e.key == 'Enter' && searchText.length > 0 && navigateToSearchPage()}
                />
                <div
                    className={styles.search__imgContainer}
                >
                    <div
                        className={`${styles.search__img} ${isSearchModalVisible && styles.search__imgActive}`}
                        onClick={() => {
                            if (isSearchModalVisible) {
                                resetOffers();
                                setSearchText('');
                                setIsSearchModalVisible(false);
                            }
                        }}
                    />
                </div>

                <div className={styles.search__offersList}>
                    <ul
                        className={styles.search__offersListContainer}
                        style={isSearchModalVisible && (searchOffersCount > 0 || isOffersNotFound) ? { display: 'block' } : { display: 'none' }}
                    >
                        {isOffersNotFound
                            ?
                            <div className={styles.search__offersNotFound}>Nothing found for your request</div>
                            :
                            <div>
                                {searchOffers.map(offer =>
                                    <SearchOffer
                                        key={offer.id}
                                        offer={offer}
                                        closeModal={() => {
                                            resetOffers();
                                            setSearchText('');
                                            setIsSearchModalVisible(false);
                                        }}
                                    />
                                )}

                                {searchOffersCount > 5 && !isFetching &&
                                    <div
                                        className={styles.search__allOffers}
                                        onClick={() => navigateToSearchPage()}
                                    >
                                        Show all results ({searchOffersCount})
                                    </div>
                                }
                            </div>
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SearchModal;