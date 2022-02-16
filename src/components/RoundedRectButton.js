import React from 'react';
import './RoundedRectButton.css'
const RoundedRectButton = ({child, title, onClick}) => {
    return <div onClick={onClick}  style={{cursor: 'pointer'}}>
        <div className='rounded-rect-button-container'>
            {child}
        </div>
        <div className='rounded-rect-button-text'>{title}</div>
    </div>;
};

export default RoundedRectButton;
