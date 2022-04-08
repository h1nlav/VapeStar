import React, { useEffect, useState } from 'react';
import { getAllReviews } from '../../../api/reviewApi';
import TopChoicePanel from '../../UI/TopChoicePanel/TopChoicePanel';
import UserReviewsProductsList from '../../UserPage/UserReviews/UserReviewsProductsList/UserReviewsProductsList';

const AdminReviews = () => {
    const [isReviewsFetching, setIsReviewsFetching] = useState(true);
    const [selectedOption, setSelectedOption] = useState('My reviews');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        let isUnmount = false;

        !isUnmount && setIsReviewsFetching(true);
        let order;
        if (selectedOption == 'All reviews') order = 'id';
        if (selectedOption == 'Last reviews') order = 'new';
        getAllReviews({ order })
            .then(data => !isUnmount && setProducts(data || []));

        !isUnmount && setIsReviewsFetching(false);

        return () => { isUnmount = true };
    }, [selectedOption, isReviewsFetching]);

    return (
        <div>
            <TopChoicePanel options={['All reviews', 'Last reviews']} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />

            <UserReviewsProductsList
                products={products}
                selectedOption={selectedOption}
                isReviewsFetching={isReviewsFetching}
                callback={() => setIsReviewsFetching(true)}
            />
        </div>
    );
};

export default AdminReviews;