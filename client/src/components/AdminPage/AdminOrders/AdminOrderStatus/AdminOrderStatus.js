import React, { useState } from 'react';
import { deleteStatus } from '../../../../api/orderApi';
import ConfirmationModal from '../../../UI/ConfirmationModal/ConfirmationModal';
import FullInfoField from '../../../UI/FullInfoField/FullInfoField';
import ShortInfoContainer from '../../../UI/ShortInfoContainer/ShortInfoContainer';
import AdminChangeOrderStatus from '../AdminChangeOrderStatus/AdminChangeOrderStatus';
import styles from './AdminOrderStatus.module.css';

const AdminOrderStatus = ({ status, fetchAndShowOrders }) => {
    const [isStatusOpened, setIsStatusOpened] = useState(false);
    const [isStatusChanging, setIsStatusChanging] = useState(false);

    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [confirmationModalMessage, setConfirmationModalMessage] = useState('');
    const [confirmationModalCallback, setConfirmationModalCallback] = useState(null);


    const removeAndShowStatus = async (id) => {
        await deleteStatus({ id }).then(async () => { await fetchAndShowOrders() });
    }

    return (
        <li className={styles.status}>
            <ShortInfoContainer
                id={`№ ${status.id}`}
                isOpened={isStatusOpened}
                onClick={() => setIsStatusOpened(!isStatusOpened)}
            >
                <div className={styles.shortInfo__name}>{status.name}</div>
                <div className={styles.shortInfo__color}>{status.color}</div>
            </ShortInfoContainer>

            {isStatusOpened &&
                <div>
                    <div className={styles.status__opened}>
                        {isStatusChanging
                            ?
                            <AdminChangeOrderStatus
                                status={status}
                                fetchAndShowOrders={fetchAndShowOrders}
                                setIsStatusChanging={setIsStatusChanging}
                            />
                            :
                            <div className={styles.fullInfo}>
                                <div className={styles.fullInfo__fields}>
                                    <FullInfoField fieldName={'Status name'} fieldValue={status.name} />
                                    <FullInfoField fieldName={'Status color'} fieldValue={status.color} />
                                </div>

                                <div className={styles.fullInfo__buttons}>
                                    {status.id !== 1 &&
                                        <button
                                            className={styles.fullInfo__removeButton}
                                            onClick={() => {
                                                setConfirmationModalMessage(<span>Вы точно хотите удалить статус {status.name}?</span>);
                                                setConfirmationModalCallback(() => () => removeAndShowStatus(status.id))
                                                setIsConfirmationModalVisible(true);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    }

                                    <button
                                        className={styles.fullInfo__editButton}
                                        onClick={() => setIsStatusChanging(!isStatusChanging)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            }
            <ConfirmationModal
                isVisible={isConfirmationModalVisible}
                setIsVisible={setIsConfirmationModalVisible}
                message={confirmationModalMessage}
                callback={confirmationModalCallback}
            />
        </li >
    );
};

export default AdminOrderStatus;