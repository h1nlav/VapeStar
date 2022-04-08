import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../..';
import { getAllCategories } from '../../../../api/categoryApi';
import AdminAddCategory from '../AdminAddCategory/AdminAddCategory';
import AdminCategory from '../AdminCategory/AdminCategory';
import styles from './AdminCategoriesList.module.css'

const AdminCategoriesList = () => {
    const { catalog } = useContext(Context);
    const [categories, setCategories] = useState([]);

    useEffect(async () => await fetchAndShowCategories(), []);

    const fetchAndShowCategories = async () => {
        await getAllCategories()
            .then(data => {
                data.map(category => {
                    normalizeCategoryFilters(category);
                    category.categories.map(subCategory => {
                        normalizeCategoryFilters(subCategory);
                        subCategory.categories = [];
                    });
                });
                setCategories(data);
                catalog.setCategories(data);
            });
    }

    const normalizeCategoryFilters = (category) => {
        if (category.filters) {
            let tmpArray = [];
            category.filters.map(el => tmpArray.push(el[1]));
            category.filters = tmpArray;
        } else category.filters = [];
    }

    return (
        <ul className={styles.categoriesList}>
            <div className={styles.categoriesList__name}>
                <h1>Categories</h1>
            </div>


            {categories.map(category =>
                <AdminCategory
                    key={category.id}
                    category={category}
                    fetchAndShowCategories={fetchAndShowCategories}
                    isMainCategory={true}
                />
            )}

            <AdminAddCategory fetchAndShowCategories={fetchAndShowCategories} />
        </ul >
    );
};

export default AdminCategoriesList;