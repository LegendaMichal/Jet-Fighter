import React, { useState } from 'react';

function JetIndex(props) {
    return (
        <div className='row jet' id={props.jetData.id}>
            <div className='col'>
                <div className='placement'>{props.placement}. {props.jetData.name} - {props.jetData.hp}</div>
            </div>
        </div>
    );
}

export default JetIndex;