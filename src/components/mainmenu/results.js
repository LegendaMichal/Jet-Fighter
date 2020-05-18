import React from 'react';

function ResultMenu(props) {
    return (
        <div className='d-flex justify-content-center'>
            <div className='reconnect-btns'>
                <div className='row'>
                    <div className='col'>
                        <h1>{props.results}.</h1>
                    </div>
                </div>
                <div className='row'>
                    <div className='col'>
                        <button className="" id='back' type="button" onClick={props.backToMenu}>Back to menu</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResultMenu;