

import React, { useCallback, useEffect, useState } from 'react';
import RoundedRectButton from '../components/RoundedRectButton';
import UserDataDetails from '../components/UserDataDetails';
import './HomePage.css';
import { FiArrowDown, FiArrowUp } from 'react-icons/fi'
import UnstoppableIcon from '../images/unstoppable-icon.png';
import Loader from '../images/Spinner.gif';
import Logo from '../images/specter.png';
import { get } from 'local-storage'
import AmountDialog from '../components/dialog/AmountDialog';

const HomePage = () => {
    const [state, setState] = useState({
    });
    const [loading, setLoading] = useState(true);

    const [showAmountDialog, setShowAmountDialog] = useState(false);

    const onLend = async (address, amt) => {
        // var appArgs = [];
        // appArgs.push(new Uint8Array(Buffer.from("lend")));
        // console.log("appArgs1: ", appArgs)
        // await callAppWithPayment(address, appArgs, amt)
        // setLoading(false)
        // action()
    }


    const onRepay = async (address, interestAmt) => {
        // var appArgs = [];
        // appArgs.push(new Uint8Array(Buffer.from("repay")));
        // console.log("appArgs1: ", appArgs)
        // await callAppWithPayment(address, appArgs, interestAmt)

        // setLoading(false)
        // action();
    }

    const onWithdraw = async (address, amt) => {

        // var appArgs = [];
        // appArgs.push(new Uint8Array(Buffer.from("withdraw")));
        // appArgs.push(utils.byteArray(amt));
        // console.log("appArgs2: ", appArgs)
        // await callApp(address, appArgs);
        // setLoading(false)
        // action()
    }

    const onBorrow = async (address, amt) => {

        // var appArgs = [];
        // appArgs.push(new Uint8Array(Buffer.from("borrow")));
        // appArgs.push(utils.byteArray(amt));

        // console.log("appArgs2: ", appArgs)
        // await callApp(address, appArgs);
        // setLoading(false)
        // action()
    }

    async function init() {
        var state = await globalState()
        setState(val => {
            return {
                ...val,
                globalState: state,
            }
        })
        console.log('init')
        if (get('accounts') === 'Sign In') {
            var accts = await onSignin()
            setState(val => {
                return {
                    ...val,
                    accounts: accts,
                }
            })
            setLoading(false);
        }
        else {
            setLoading(false)
        }

    }

    var action = () => {
        if (state.accounts !== undefined) {
            checkOptIn(state.accounts[0].address).then(
                (result) => {
                    if (result) {
                        console.log('User has opted in');
                    } else {
                        console.log('User has not opted in');
                        getOptInUser(state.accounts[0].address);
                    }
                }
            );
            localState(state.accounts[0].address).then(localState => {
                setState(val => {
                    return {
                        ...val,
                        localState: localState,
                    }
                })
            })
            globalState().then(globalState => {
                setState(val => {
                    return {
                        ...val,
                        globalState: globalState,
                    }
                })
            })
            balance(state.accounts[0].address).then(balance => {
                setState(val => {
                    return {
                        ...val,
                        balance: balance,
                    }
                })
            })
        }
    }

    useEffect(() => {
        // action()
    }, [state.accounts])

    useEffect(() => {
        // init()
        // action();
    }, [])
    return <div>
        <div className='upper-section'>
            <div className='navbar-container'>
                <div style={{ flex: 1, display: 'flex' }}>
                    <img className='logo' src={Logo} />
                </div>
                {!state.accounts && <div className='navbar-action-text' onClick={async () => {
                    // var accts = await onSignin()
                    // setState(val => {
                    //     return {
                    //         ...val,
                    //         accounts: accts,
                    //     }
                    // })
                    // globalState().then(globalState => {
                    //     console.log("globalState: ", globalState)
                    //     setState(val => {
                    //         return {
                    //             ...val,
                    //             globalState: globalState,
                    //         }
                    //     })
                    //     setLoading(false);
                    // })
                }}>{'Sign In'}</div>}
            </div>
            <div className='presentation-container'>
                <div className='glass-container' style={{ width: '375px' }}>
                    {state.accounts && <div className='account-text-style'>Your Account</div>}
                    {state.accounts && <div>
                        <div className='balance-text-style'>TOTAL BALANCE</div>
                        <div className='amount-text-style'>{!state.balance ? '' : `${(state.balance / 1000000).toFixed(2)} ALGO`}</div>
                    </div>}
                    {state.accounts && <div className='address-text-style'>{!state.accounts ? '' : state.accounts[0].address}</div>}
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
                            <div style={{ fontWeight: 'bold', color: 'var(--primary-light)' }}>{!state.globalState ? '' : `${(state.globalState['market_size'] / 1000000).toFixed(2)} ALGO`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='lower-section'>
            <div className='summary-text-style'>Summary</div>
            <div className='user-data-row'>
                <div className='user-data-container'>
                    <div className='heading-text'>Your ALGO Holding</div>
                    <UserDataDetails title={'Deposited Amount'} value={!state.localState ? '' : !state.localState['total_deposits'] ? '0.00 ALGO' : `${(state.localState['total_deposits'] / 1000000).toFixed(2)} ALGO`} />
                    <UserDataDetails title={'Interest Earned'} value={!state.localState ? '' : !state.localState['total_deposits'] ? '0.00 ALGO' : `${((state.localState['total_deposits'] / 1000000) * 0.05).toFixed(2)} ALGO`} />
                    <UserDataDetails title={'Total Amount'} value={!state.localState ? '' : !state.localState['total_deposits'] ? '0.00 ALGO' : `${((state.localState['total_deposits'] / 1000000) + (state.localState['total_deposits'] / 1000000) * 0.05).toFixed(2)} ALGO`} />
                    <div className='user-data-action-section'>
                        <RoundedRectButton onClick={() => { setShowAmountDialog(val => { return { show: true, type: 'withdraw' } }) }} child={<FiArrowDown size={20} />} title={'Withdraw'} />
                        <RoundedRectButton onClick={() => { setShowAmountDialog(val => { return { show: true, type: 'lend' } }) }} child={<FiArrowUp size={20} />} title={'Add Funds'} />
                    </div>
                </div>
                <div className='user-data-container'>
                    <div className='heading-text'>Borrowed ALGO Holding</div>
                    <UserDataDetails title={'Borrowed Amount'} value={!state.localState ? '' : !state.localState['total_borrows'] ? '0.00 ALGO' : `${(state.localState['total_borrows'] / 1000000).toFixed(2)} ALGO`} />
                    <UserDataDetails title={'Interest Amount'} value={!state.localState ? '' : !state.localState['total_borrows'] ? '0.00 ALGO' : `${((state.localState['total_borrows'] / 1000000) * 0.1).toFixed(2)} ALGO`} />
                    <UserDataDetails title={'Total Amount'} value={!state.localState ? '' : !state.localState['total_borrows'] ? '0.00 ALGO' : `${((state.localState['total_borrows'] / 1000000) + (state.localState['total_borrows'] / 1000000) * 0.1).toFixed(2)} ALGO`} />
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
                    onWithdraw(state.accounts[0].address, amt).then(
                        (result) => {
                            console.log("result: ", result);
                        }
                    )
                } else if (showAmountDialog.type === 'lend') {
                    onLend(state.accounts[0].address, amt).then(
                        (result) => {
                            console.log("result: ", result)
                        }
                    )
                } else if (showAmountDialog.type === 'repay') {
                    onRepay(state.accounts[0].address, parseInt(amt + (amt * 0.1) - 1000)).then(
                        (result) => {
                            console.log("result: ", result)
                        }
                    )
                } else if (showAmountDialog.type === 'borrow') {
                    onBorrow(state.accounts[0].address, amt).then(
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
