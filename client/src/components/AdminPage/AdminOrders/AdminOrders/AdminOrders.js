import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect, useState } from 'react';
import { Context } from '../../../..';
import { getOrderDeliveryInfo, getAllPaymentOptions } from '../../../../api/deliveryApi';
import { getAllOrders } from '../../../../api/orderApi';
import TopChoicePanel from '../../../UI/TopChoicePanel/TopChoicePanel';
import AdminOrdersList from '../AdminOrdersList/AdminOrdersList';
import AdminOrdersStatusesList from '../AdminOrdersStatusesList/AdminOrdersStatusesList';

const AdminOrders = observer(() => {
    const { auth } = useContext(Context);

    const [selectedOption, setSelectedOption] = useState('Orders');

    const [orders, setOrders] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [deliveryInfo, setDeliveryInfo] = useState([]);
    const [paymentOptions, setPaymentOptions] = useState([]);

    useEffect(() => fetchAndShowOrders(), []);

    const fetchAndShowOrders = async () => {
        await getAllOrders()
            .then(data => {
                setOrders(data.orders);
                setStatuses(data.statuses);
            })
        await getOrderDeliveryInfo()
            .then(data => setDeliveryInfo(data));
        await getAllPaymentOptions()
            .then(data => setPaymentOptions(data));
    }

    const switchOptionEl = (option) => {
        switch (option) {
            case 'Orders': return (
                <AdminOrdersList
                    orders={orders}
                    fetchAndShowOrders={fetchAndShowOrders}
                    statuses={statuses}
                    deliveryInfo={deliveryInfo}
                    paymentOptions={paymentOptions}
                />
            );

            case 'Order statuses': return (
                <AdminOrdersStatusesList
                    statuses={statuses}
                    fetchAndShowOrders={fetchAndShowOrders}
                />
            );
        }
    }

    return (
        <div>
            {auth.user.role == 'ROOT' &&
                <TopChoicePanel options={['Orders', 'Order statuses']} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            }

            <div>
                {switchOptionEl(selectedOption)}
            </div>
        </div>
    );
});

export default AdminOrders;