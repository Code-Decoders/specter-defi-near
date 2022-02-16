import React from 'react';
import './UserDataDetails.css'
const UserDataDetails = ({title, value}) => {
    return <div className='details-row'>
        <div className='title-text-style'>{title}</div>
        <div className='value-text-style'>{value}</div>
    </div>;
};

export default UserDataDetails;
