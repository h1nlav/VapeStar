import React, { useEffect, useState } from 'react';
import { getAllCategories } from '../../../../api/categoryApi';
import { getAllProducts } from '../../../../api/productApi';
import TopChoicePanel from '../../../UI/TopChoicePanel/TopChoicePanel';
import AdminProductsList from '../AdminProductsList/AdminProductsList';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [productsCount, setProductsCount] = useState(0);
    const [productsRequiredChange, setProductsRequiredChange] = useState([]);
    const [productsRequiredChangeCount, setProductsRequiredChangeCount] = useState(0);
    const [categories, setCategories] = useState([]);

    useEffect(() => fetchAndShowProducts(), []);

    const fetchAndShowProducts = async () => {
        await getAllProducts({ fetchOption: 'admin' })
            .then(data => {
                data.products.rows.map(product => {
                    let tmpArray = [];
                    Object.keys(product.info).map(infoKey => tmpArray.push([product.info[infoKey].$INFO_NAME, product.info[infoKey].$INFO_VALUE]));
                    product.info = tmpArray;
                })

                data.productsRequiredChange.rows.map(product => {
                    let tmpArray = [];
                    Object.keys(product.info).map(infoKey => tmpArray.push([product.info[infoKey].$INFO_NAME, product.info[infoKey].$INFO_VALUE]));
                    product.info = tmpArray;
                })

                setProducts(data.products.rows);
                setProductsCount(data.products.count);
                setProductsRequiredChange(data.productsRequiredChange.rows);
                setProductsRequiredChangeCount(data.productsRequiredChange.count)
            });

        await getAllCategories()
            .then(data => {
                let tmpArray = []
                data.map(category => {
                    category.categories.length == 0
                        ? tmpArray.push(category)
                        : category.categories.map(subCategory => tmpArray.push(subCategory));
                })
                setCategories(tmpArray);
            });
    }

    const [selectedOption, setSelectedOption] = useState('Products');
    const switchOptionEl = (option) => {
        switch (option) {
            case 'Products': return (
                <AdminProductsList
                    products={products}
                    productsCount={productsCount}
                    categories={categories}
                    fetchAndShowProducts={fetchAndShowProducts}
                />
            );

            case 'Products requiring change': return (
                <AdminProductsList
                    products={productsRequiredChange}
                    productsCount={productsRequiredChangeCount}
                    categories={categories}
                    fetchAndShowProducts={fetchAndShowProducts}
                    isRequiringChange={true}
                />
            );
        }
    }

    return (
        <div>
            <TopChoicePanel options={['Products', 'Products requiring change']} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <div>
                {switchOptionEl(selectedOption)}
            </div>
        </div>
    );
};

export default AdminProducts;