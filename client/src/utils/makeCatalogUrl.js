const makeCatalogUrl = ({ ctg = null, search = null, minPrice, maxPrice, isAvailable, order, page, filters = {}, }) => {
    let link = '';
    let urlParams = '';

    if (search) link += '/search/';
    else if (ctg) link += '/catalog/' + ctg + '/';

    if (isAvailable.length !== 0) {
        urlParams += 'available=';
        isAvailable.map(value => urlParams += value + ',');
        urlParams = urlParams.slice(0, -1) + ';';
    }

    if (minPrice && maxPrice) urlParams = urlParams + 'price=' + minPrice + '-' + maxPrice + ';';

    if (order && order !== 'new') urlParams = urlParams + 'order=' + order + ';';

    if (page && page[page.length - 1] !== 1) urlParams = urlParams + 'page=' + page[page.length - 1] + ';';

    Object.keys(filters).map(key => {
        urlParams += key + '=';
        filters[key].map(value => urlParams += value + ',');
        urlParams = urlParams.slice(0, -1) + ';';
    });

    if (search) urlParams += 'text=' + search.replace(' ', '+') + ';';

    if (urlParams.length !== 0) return link + urlParams + '/';
    else return link;
};

export default makeCatalogUrl;