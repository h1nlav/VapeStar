import React, { useEffect, useState } from 'react';
import { getAdmins } from '../../../../api/userApi';
import AuthStore from '../../../../store/AuthStore';
import AdminAddAdmin from '../AdminAddAdmin/AdminAddAdmin';
import AdminAdmin from '../AdminAdmin/AdminAdmin';
import styles from './AdminAdminsList.module.css';

const AdminAdminsList = () => {
    const [admins, setAdmins] = useState([]);
    const [adminsCount, setAdminsCount] = useState(0);

    useEffect(() => fetchAndShowAdmins(), [])

    const fetchAndShowAdmins = async () => {
        await getAdmins()
            .then(data => {
                setAdmins(data.rows);
                setAdminsCount(data.count)
            })
    }

    return (
        <ul className={styles.adminsList}>
            <div className={styles.adminsList__name}>
                <h1>Administrators</h1>
            </div>
            <div className={styles.adminsList__count}>
                <span>Total number of administrators: {adminsCount}</span>
            </div>

            {admins.map(admin => <AdminAdmin key={admin.id} admin={admin} fetchAndShowAdmins={fetchAndShowAdmins} />)}

            <AdminAddAdmin newAdmin={new AuthStore()} fetchAndShowAdmins={fetchAndShowAdmins} />
        </ul>
    );
};

export default AdminAdminsList;