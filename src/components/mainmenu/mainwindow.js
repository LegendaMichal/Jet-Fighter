import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'

function MainWindow() {
    return (
        <div className='d-flex justify-content-center'>
            <div className='menu-btns'>
                <div className='row'>
                    <div className='col'>
                        <button className="" id='profileBtn' type="button"><FontAwesomeIcon icon={faUser} size="7x"/></button>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <button className="" id='rankedGameBtn' type="button">Play ranked</button>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <button className="" id='customGameBtn' type="button">Play custom</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainWindow;