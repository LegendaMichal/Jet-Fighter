import React from 'react'

function PlayerShortInfo(props) {
    return (
        <>
            <h6>Your Nickname</h6>
            <div className='row'>
                <div className='col'>
                    <input type='text' placeholder='e.g. John Doe' style={{
                        paddingTop: 5, paddingBottom: 5,
                        paddingRight: 1, paddingLeft: 1
                    }} value={props.name} onChange={ e => props.setName(e.target.value) }/>
                </div>
            </div>
        </>
    );
}

export default PlayerShortInfo;