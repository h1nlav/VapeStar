import React, { useState } from 'react';
import { deletePaymentOption } from '../../../../api/deliveryApi';
import ConfirmationModal from '../../../UI/ConfirmationModal/ConfirmationModal';
import FullInfoField from '../../../UI/FullInfoField/FullInfoField';
import ShortInfoContainer from '../../../UI/ShortInfoContainer/ShortInfoContainer';
import AdminChangePaymentOption from '../AdminChangePaymentOption/AdminChangePaymentOption';
import styles from './AdminPaymentOption.module.css';

const AdminPaymentOption = ({ paymentOption, fetchAndShowPaymentOptions }) => {
    const [isPaymentOptionOpened, setIsPaymentOptionOpened] = useState(false);
    const [isPaymentOptionChanging, setIsPaymentOptionChanging] = useState(false);

    const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
    const [confirmationModalMessage, setConfirmationModalMessage] = useState('');
    const [confirmationModalCallback, setConfirmationModalCallback] = useState(null);

    const removeAndShowPaymentOption = async (id) => {
        await deletePaymentOption({ id })
            .then(() => fetchAndShowPaymentOptions());
    }

    return (
        <li className={styles.paymentOption}>
            <ShortInfoContainer
                id={`№ ${paymentOption.id}`}
                isOpened={isPaymentOptionOpened}
                onClick={() => setIsPaymentOptionOpened(!isPaymentOptionOpened)}
            >
                <div className={styles.shortInfo__name}>{paymentOption.name}</div>
            </ShortInfoContainer>

            {isPaymentOptionOpened &&
                <div>
                    <div className={styles.paymentOption__opened}>
                        {isPaymentOptionChanging
                            ?
                            <AdminChangePaymentOption
                                paymentOption={paymentOption}
                                fetchAndShowPaymentOptions={fetchAndShowPaymentOptions}
                                setIsPaymentOptionChanging={setIsPaymentOptionChanging}
                            />
                            :
                            <div className={styles.fullInfo}>
                                <FullInfoField fieldName={'Payment method name'} fieldValue={paymentOption.name} />

                                <div className={styles.fullInfo__buttons}>
                                    <button
                                        className={styles.fullInfo__removeButton}
                                        onClick={() => {
                                            setConfirmationModalMessage(<span>Вы точно хотите платежную опцию {paymentOption.name}?</span>);
                                            setConfirmationModalCallback(() => () => removeAndShowPaymentOption(paymentOption.id))
                                            setIsConfirmationModalVisible(true);
                                        }}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className={styles.fullInfo__editButton}
                                        onClick={() => setIsPaymentOptionChanging(!isPaymentOptionChanging)}
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
        </li>
    );
};

export default AdminPaymentOption;