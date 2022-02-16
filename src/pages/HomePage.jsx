

import React, { useCallback, useEffect, useState } from 'react';
import RoundedRectButton from '../components/RoundedRectButton';
import UserDataDetails from '../components/UserDataDetails';
import './HomePage.css';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi'
import Loader from '../images/Spinner.gif';
import Logo from '../images/specter.png';
import { get } from 'local-storage'
import AmountDialog from '../components/dialog/AmountDialog';
import Big from 'big.js';
import { Account } from 'near-api-js';
import { getBalance, initContract, login, logout } from "../utils";

const HomePage = () => {
    const BOATLOAD_OF_GAS = Big(3)
        .times(10 ** 13)
        .toFixed();
    const [state, setState] = useState({
    });
    const [loading, setLoading] = useState(true);

    const [showAmountDialog, setShowAmountDialog] = useState({
        show: false,
        type: '',
    });

    const onLend = async (amt) => {
        try {
            await window.contract.lend({}, BOATLOAD_OF_GAS, Big(amt).times(10 ** 24).toFixed());
        } catch (e) {
            alert(
                "Something went wrong! " +
                "Maybe you need to sign out and back in? " +
                "Check your browser console for more info."
            );
        }
    }


    const onRepay = async (amt) => {
        console.log(amt)
        try {
            await window.contract.repay({}, BOATLOAD_OF_GAS, Big(amt).times(10 ** 24).toFixed());
        } catch (e) {
            alert(
                "Something went wrong! " +
                "Maybe you need to sign out and back in? " +
                "Check your browser console for more info."
            );
        }
    }

    const onWithdraw = async (amt) => {
        try {
            await window.contract.withdraw({
                amount: Big(amt).times(10 ** 24).toFixed(),
            }, BOATLOAD_OF_GAS);
        } catch (e) {
            alert(
                "Something went wrong! " +
                "Maybe you need to sign out and back in? " +
                "Check your browser console for more info."
            );
        } finally {
            setLoading(false);
            init()
        }
    }

    const onBorrow = async (amt) => {
        try {
            await window.contract.borrow({
                amount: Big(amt).times(10 ** 24).toFixed(),
            }, BOATLOAD_OF_GAS);
        } catch (e) {
            alert(
                "Something went wrong! " +
                "Maybe you need to sign out and back in? " +
                "Check your browser console for more info."
            );
        } finally {
            setLoading(false);
            init()
        }
    }

    async function init() {
        var market_size = await window.contract.getMarketSize();
        setState(val => {
            return {
                ...val,
                globalState: {
                    market_size: market_size,
                },
            }
        })
        if (window.walletConnection.isSignedIn()) {
            var user = await window.contract.getUser({ accountId: window.accountId });
            setState(val => {
                return {
                    ...val,
                    localState: user
                }
            });
            var balance = await getBalance();
            console.log(balance)
            setState(val => {
                return {
                    ...val,
                    balance: balance.total
                }
            });
            setLoading(false);
        }
        else {
            setLoading(false)
        }
    }

    useEffect(() => {
        init()
    }, [])
    return <div>
        <div className='upper-section'>
            <div className='navbar-container'>
                <div style={{ flex: 1, display: 'flex' }}>
                    <img className='logo' src={Logo} />
                </div>
                {<div className='navbar-action-text' onClick={() => {
                    if (window.walletConnection.isSignedIn()) {
                        logout();
                    }
                    else {
                        login();
                    }
                }}>{!window.walletConnection.isSignedIn() ? 'Sign In' : 'Sign Out'}</div>}
            </div>
            <div className='presentation-container'>
                <div className='glass-container' style={{ width: '375px' }}>
                    {window.walletConnection.isSignedIn() && <div className='account-text-style'>Your Account</div>}
                    {window.walletConnection.isSignedIn() && <div>
                        <div className='balance-text-style'>TOTAL BALANCE</div>
                        <div className='amount-text-style'>{!state.balance ? '' : `${(state.balance / (10 ** 24)).toFixed(2)} NEAR`}</div>
                    </div>}
                    {window.walletConnection.isSignedIn() && <div className='address-text-style'>{!window.walletConnection.isSignedIn() ? '' : window.accountId}</div>}
                </div>
                <div className='glass-container' style={{ justifyContent: 'flex-start' }}>
                    <div className='account-text-style'>Interest Rates</div>
                    <div className='state-container' >
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '20px', color: 'var(--primary)' }}>Deposit APY</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--primary-light)' }}>0.05%</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '20px', color: 'var(--primary)' }}>Borrow APY</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--primary-light)' }}>0.10%</div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '20px', color: 'var(--primary)' }}>Market Size</div>
                            <div style={{ fontWeight: 'bold', color: 'var(--primary-light)' }}>{!state.globalState ? '' : `${(state.globalState['market_size'] / (10 ** 24)).toFixed(2)} NEAR`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='lower-section'>
            <div className='summary-text-style'>Summary</div>
            <div className='user-data-row'>
                <div className='user-data-container'>
                    <div className='heading-text'>Your NEAR Holding</div>
                    <UserDataDetails title={'Deposited Amount'} value={!state.localState ? '0.00 NEAR' : !state.localState['totalDeposits'] ? '0.00 NEAR' : `${(state.localState['totalDeposits'] / (10 ** 24)).toFixed(2)} NEAR`} />
                    <UserDataDetails title={'Interest Earned'} value={!state.localState ? '0.00 NEAR' : !state.localState['totalDeposits'] ? '0.00 NEAR' : `${((state.localState['totalDeposits'] / (10 ** 24)) * 0.05).toFixed(2)} NEAR`} />
                    <UserDataDetails title={'Total Amount'} value={!state.localState ? '0.00 NEAR' : !state.localState['totalDeposits'] ? '0.00 NEAR' : `${((state.localState['totalDeposits'] / (10 ** 24)) + (state.localState['totalDeposits'] / (10 ** 24)) * 0.05).toFixed(2)} NEAR`} />
                    <div className='user-data-action-section'>
                        <RoundedRectButton onClick={() => { setShowAmountDialog(val => { return { show: true, type: 'withdraw' } }) }} child={<FiArrowDown size={20} />} title={'Withdraw'} />
                        <RoundedRectButton onClick={() => { setShowAmountDialog(val => { return { show: true, type: 'lend' } }) }} child={<FiArrowUp size={20} />} title={'Add Funds'} />
                    </div>
                </div>
                <div className='user-data-container'>
                    <div className='heading-text'>Borrowed NEAR Holding</div>
                    <UserDataDetails title={'Borrowed Amount'} value={!state.localState ? '0.00 NEAR' : !state.localState['totalBorrows'] ? '0.00 NEAR' : `${(state.localState['totalBorrows'] / (10 ** 24)).toFixed(2)} NEAR`} />
                    <UserDataDetails title={'Interest Amount'} value={!state.localState ? '0.00 NEAR' : !state.localState['totalBorrows'] ? '0.00 NEAR' : `${((state.localState['totalBorrows'] / (10 ** 24)) * 0.1).toFixed(2)} NEAR`} />
                    <UserDataDetails title={'Total Amount'} value={!state.localState ? '0.00 NEAR' : !state.localState['totalBorrows'] ? '0.00 NEAR' : `${((state.localState['totalBorrows'] / (10 ** 24)) + (state.localState['totalBorrows'] / (10 ** 24)) * 0.1).toFixed(2)} NEAR`} />
                    <div className='user-data-action-section'>
                        <RoundedRectButton onClick={() => { setShowAmountDialog(val => { return { show: true, type: 'repay' } }) }} child={<FiArrowDown size={20} />} title={'Repay'} />
                        <RoundedRectButton onClick={() => { setShowAmountDialog(val => { return { show: true, type: 'borrow' } }) }} child={<FiArrowUp size={20} />} title={'Borrow'} />
                    </div>
                </div>
            </div>
        </div>
        {
            showAmountDialog.show && <AmountDialog hide={() => { setShowAmountDialog(val => { return { ...val, show: false } }) }} setAmt={(amt) => {
                setLoading(true)
                if (showAmountDialog.type === 'withdraw') {
                    onWithdraw(amt).then(
                        (result) => {
                            console.log("result: ", result);
                        }
                    )
                } else if (showAmountDialog.type === 'lend') {
                    onLend(amt).then(
                        (result) => {
                            console.log("result: ", result)
                        }
                    )
                } else if (showAmountDialog.type === 'repay') {
                    onRepay(Big(amt).add(amt * 0.1).toNumber()).then(
                        (result) => {
                            console.log("result: ", result)
                        }
                    )
                } else if (showAmountDialog.type === 'borrow') {
                    onBorrow(amt).then(
                        (result) => {
                            console.log("result: ", result)
                        }
                    )
                }
            }} />
        }
        {loading && <div style={{ display: 'flex', alignItems: 'center', top: 0, justifyContent: 'center', position: 'absolute', width: '100%', height: "100%", zIndex: 5, background: "#00000023" }}>
            <img src={Loader} alt={Loader} />
        </div>
        }
    </div >;
};

export default HomePage;
