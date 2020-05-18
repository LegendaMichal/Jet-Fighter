import React from 'react';

function ReconnectMenu(props) {
    return (
        <div className='d-flex justify-content-center'>
            <div className='reconnect-btns'>
                <div className='row'>
                    <div className='col'>
                        <h3>Game in progress</h3>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        {/* <button className="" id='profileBtn' type="button" onClick={props.onReconnect}>Reconnect</button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReconnectMenu;