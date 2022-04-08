import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../..';
import { getReviewsByUserId } from '../../../../api/reviewApi';
import TopChoicePanel from '../../../UI/TopChoicePanel/TopChoicePanel';
import UserReviewsProductsList from '../UserReviewsProductsList/UserReviewsProductsList';

const UserReviews = observer(() => {
    const { auth } = useContext(Context);

    const [isReviewsFetching, setIsReviewsFetching] = useState(true);
    const [selectedOption, setSelectedOption] = useState('My reviews');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        let isUnmount = false;
        if (auth.user.id) {
            !isUnmount && setIsReviewsFetching(true);
            let fetchOption;
            if (selectedOption == 'My reviews') fetchOption = 'reviews';
            if (selectedOption == 'My answers') fetchOption = 'answers';
            getReviewsByUserId({ userId: auth.user.id, fetchOption })
                .then(data => !isUnmount && setProducts(data || []));
            !isUnmount && setIsReviewsFetching(false);
        }
        return () => { isUnmount = true };
    }, [auth.user.id, selectedOption, isReviewsFetching]);

    return (
        <div>
            <TopChoicePanel options={['My reviews', 'My answers']} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <UserReviewsProductsList
                products={products}
                selectedOption={selectedOption}
                isReviewsFetching={isReviewsFetching}
                callback={() => setIsReviewsFetching(true)}
            />
        </div>
    );
});

export default UserReviews;