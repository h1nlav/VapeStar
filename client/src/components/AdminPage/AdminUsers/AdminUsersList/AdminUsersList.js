import React, { useEffect, useState } from 'react';
import { getUsers } from '../../../../api/userApi';
import TopChoicePanel from '../../../UI/TopChoicePanel/TopChoicePanel';
import AdminUser from '../AdminUser/AdminUser';
import styles from './AdminUsersList.module.css';

const AdminUsersList = () => {
    const [selectedOption, setSelectedOption] = useState('Users');
    const [users, setUsers] = useState([]);
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [usersCount, setUsersCount] = useState(0);
    const [blockedUsersCount, setBlockedUsersCount] = useState(0);

    useEffect(() => fetchAndShowUsers(), [])

    const fetchAndShowUsers = async () => {
        await getUsers()
            .then(data => {
                setUsers(data.users.rows);
                setUsersCount(data.users.count)
                setBlockedUsers(data.blockedUsers.rows);
                setBlockedUsersCount(data.blockedUsers.count)
            })
    }

    const switchOptionEl = (option) => {
        switch (option) {
            case 'Users': return (
                users.map(user =>
                    <AdminUser key={user.id} user={user} fetchAndShowUsers={fetchAndShowUsers} option={selectedOption} />
                )
            );

            case 'Blocked Users': return (
                blockedUsers.map(user =>
                    <AdminUser key={user.id} user={user} fetchAndShowUsers={fetchAndShowUsers} option={selectedOption} />
                )
            );
        }
    }

    return (
        <ul className={styles.usersList}>
            <TopChoicePanel options={['Users', 'Blocked Users']} selectedOption={selectedOption} setSelectedOption={setSelectedOption} />

            <div className={styles.usersList__name}>
                <h1>{selectedOption}</h1>
            </div>

            <div className={styles.usersList__count}>
                {selectedOption === 'Users' && <span>Total number of users: {usersCount}</span>}
                {selectedOption === 'Blocked Users' && <span>Total number of blocked users: {blockedUsersCount}</span>}
            </div>

            <div>
                {switchOptionEl(selectedOption)}
            </div>
        </ul >
    );
};

export default AdminUsersList;