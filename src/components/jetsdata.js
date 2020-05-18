import React from 'react';
import JetIndex from './jetindex';

function JetsData(props) {
    // sort data
    props.jetsData.sort((jet1, jet2) => {
        return jet1.hp - jet2.hp;
    });
    return (
        <div className='jetsdata'>
            {props.jetsData.map(jet => {
                return (
                    <JetIndex jetData={jet} placement={props.jetsData.indexOf(jet) + 1}/>
                );
            })}
        </div>
    );
}

export default JetsData;