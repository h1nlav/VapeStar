import { makeAutoObservable } from 'mobx';

export default class CatalogStore {
    constructor() {
        this._fetchOption = null;

        this._isCatalogFetching = {};

        this._categories = null;
        this._selectedCategoryId = null;
        this._selectedCategoryName = null;

        this._products = [];
        this._productsQuantity = 0;

        this._limit = 60;
        this._selectedPage = [1];
        this._isSelectedSeveralPages = false;

        this._categoryMinPrice = null;
        this._categoryMaxPrice = null;
        this._selectedMinPrice = null;
        this._selectedMaxPrice = null;

        this._selectedIsAvailable = [];
        this._isAvailableCount = [0, 0];
        this._filters = {};
        this._selectedFilters = {};

        this._selectedOrder = 'new';

        this._search = null;

        makeAutoObservable(this);
    }

    resetCatalogStore() {
        this._isCatalogFetching = {};
        this._selectedMinPrice = null;
        this._selectedMaxPrice = null;
        this._selectedIsAvailable = [];
        this._selectedFilters = {};
        this._selectedOrder = 'new';
    }

    
    setFetchOption(option) { this._fetchOption = option }
    get fetchOption() { return this._fetchOption }

    addIsCatalogFetching(option) { this._isCatalogFetching[option] = true }
    deleteIsCatalogFetching(option) { delete this._isCatalogFetching[option] }
    get isCatalogFetching() { return this._isCatalogFetching }


    setCategories(categories) { this._categories = categories }
    get categories() { return this._categories }

    setSelectedCategoryId(categoryId) { this._selectedCategoryId = categoryId }
    get selectedCategoryId() { return this._selectedCategoryId }

    setSelectedCategoryName(categoryName) { this._selectedCategoryName = categoryName }
    get selectedCategoryName() { return this._selectedCategoryName }


    setProducts(products) { this._products = products }
    addProducts(products) { this._products = [...this._products, ...products] }
    get products() { return this._products }

    setProductsQuantity(productsQuantity) { this._productsQuantity = productsQuantity }
    get productsQuantity() { return this._productsQuantity }


    setLimit(limit) { this._limit = limit }
    get limit() { return this._limit }

    setSelectedPage(selectedPage) { this._selectedPage = selectedPage }
    get selectedPage() { return this._selectedPage }

    setIsSelectedSeveralPages(isSelectedSeveralPages) { this._isSelectedSeveralPages = isSelectedSeveralPages }
    get isSelectedSeveralPages() { return this._isSelectedSeveralPages }


    setCategoryMinPrice(categoryMinPrice) { this._categoryMinPrice = categoryMinPrice }
    get categoryMinPrice() { return this._categoryMinPrice }

    setCategoryMaxPrice(categoryMaxPrice) { this._categoryMaxPrice = categoryMaxPrice }
    get categoryMaxPrice() { return this._categoryMaxPrice }

    setSelectedMinPrice(selectedMinPrice) { this._selectedMinPrice = selectedMinPrice }
    get selectedMinPrice() { return this._selectedMinPrice }

    setSelectedMaxPrice(selectedMaxPrice) { this._selectedMaxPrice = selectedMaxPrice }
    get selectedMaxPrice() { return this._selectedMaxPrice }


    setSelectedIsAvailable(selectedIsAvailable) { this._selectedIsAvailable = selectedIsAvailable }
    get selectedIsAvailable() { return this._selectedIsAvailable }

    setIsAvailableCount(isAvailableCount) { this._isAvailableCount = isAvailableCount }
    get isAvailableCount() { return this._isAvailableCount }

    setFilters(filters) { this._filters = filters }
    get filters() { return this._filters }

    setSelectedFilters(selectedFilters) { this._selectedFilters = selectedFilters }
    get selectedFilters() { return this._selectedFilters }


    setSelectedOrder(selectedOrder) { this._selectedOrder = selectedOrder }
    get selectedOrder() { return this._selectedOrder }


    setSearch(search) { this._search = search }
    get search() { return this._search }
}