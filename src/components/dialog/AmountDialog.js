import React from 'react';
import Modal from 'react-modal/lib/components/Modal';
import './AmountDialog.css';
const AmountDialog = ({ hide, setAmt }) => {


    const [amount, setAmount] = React.useState();


    return <Modal onRequestClose={hide} isOpen={true} className='dialog' >
        <div className='dialog-container'>
            <h3 style={{ color: 'var(--primary)' }}>Enter Amount</h3>
            <input type={'number'} className='dialog-input' value={amount} onChange={(event) => { setAmount(event.currentTarget.value) }} />
            <div className='dialog-button-container' onClick={() => {
                setAmt(parseFloat(amount) * 1000000);
                hide();
            }}>Submit</div>
        </div>
    </Modal >;
};

export default AmountDialog;
