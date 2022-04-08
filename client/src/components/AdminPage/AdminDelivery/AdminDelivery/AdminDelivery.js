import React, { useEffect, useState } from 'react';
import { getAdminDeliveryInfo } from '../../../../api/deliveryApi';
import TopChoicePanel from '../../../UI/TopChoicePanel/TopChoicePanel';
import AdminDeliveryCitiesList from '../AdminDeliveryCitiesList/AdminDeliveryCitiesList';
import AdminDeliveryCompaniesList from '../AdminDeliveryCompaniesList/AdminDeliveryCompaniesList';
import AdminDeliveryDepartmentsList from '../AdminDeliveryDepartmentsList/AdminDeliveryDepartmentsList';

const AdminDelivery = () => {
    const [deliveryCities, setDeliveryCities] = useState([]);
    const [deliveryCitiesCount, setDeliveryCitiesCount] = useState(0);
    const [deliveryCompanies, setDeliveryCompanies] = useState([]);
    const [deliveryCompaniesCount, setDeliveryCompaniesCount] = useState(0);
    const [deliveryDepartments, setDeliveryDepartments] = useState([]);
    const [deliveryDepartmentsCount, setDeliveryDepartmentsCount] = useState(0);
    const [deliveryDepartmentsRequiringChange, setDeliveryDepartmentsRequiringChange] = useState([]);
    const [deliveryDepartmentsRequiringChangeCount, setDeliveryDepartmentsRequiringChangeCount] = useState(0);


    useEffect(() => fetchAndShowDeliveryInfo(), []);

    const fetchAndShowDeliveryInfo = async () => {
        await getAdminDeliveryInfo()
            .then(data => {
                setDeliveryCities(data.cities.rows);
                setDeliveryCitiesCount(data.cities.count);
                setDeliveryCompanies(data.companies.rows);
                setDeliveryCompaniesCount(data.companies.count);
                setDeliveryDepartments(data.departments.rows);
                setDeliveryDepartmentsCount(data.departments.count);
                setDeliveryDepartmentsRequiringChange(data.departmentsRequiredChange.rows);
                setDeliveryDepartmentsRequiringChangeCount(data.departmentsRequiredChange.count);
            })
    }

    const [selectedOption, setSelectedOption] = useState('Cities');
    const switchOptionEl = (option) => {
        switch (option) {
            case 'Cities': return (
                <AdminDeliveryCitiesList
                    deliveryCities={deliveryCities}
                    deliveryCitiesCount={deliveryCitiesCount}
                    fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo}
                />
            );

            case 'Services': return (
                <AdminDeliveryCompaniesList
                    deliveryCompanies={deliveryCompanies}
                    deliveryCompaniesCount={deliveryCompaniesCount}
                    fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo}
                />
            );

            case 'Departments': return (
                <AdminDeliveryDepartmentsList
                    deliveryDepartments={deliveryDepartments}
                    deliveryDepartmentsCount={deliveryDepartmentsCount}
                    deliveryCities={deliveryCities}
                    deliveryCompanies={deliveryCompanies}
                    fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo}
                />
            );

            case 'Departments requiring changes': return (
                <AdminDeliveryDepartmentsList
                    deliveryDepartments={deliveryDepartmentsRequiringChange}
                    deliveryDepartmentsCount={deliveryDepartmentsRequiringChangeCount}
                    deliveryCities={deliveryCities}
                    deliveryCompanies={deliveryCompanies}
                    fetchAndShowDeliveryInfo={fetchAndShowDeliveryInfo}
                    isRequiringChange={true}
                />
            );
        }
    }

    return (
        <div>
            <TopChoicePanel options={['Cities', 'Services', 'Departments', 'Departments requiring changes']} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
            <div>
                {switchOptionEl(selectedOption)}
            </div>
        </div>
    );
};

export default AdminDelivery;