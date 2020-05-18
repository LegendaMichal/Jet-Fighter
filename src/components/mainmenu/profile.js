import React, { useState } from 'react';
import ProfileSecurity from './profile_parts/security';
import ProfileStats from './profile_parts/stats';
import PlayerHistory from './profile_parts/matchhistory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faHome, faLock, faChartBar } from '@fortawesome/free-solid-svg-icons';

function PlayerProfile(props) {
    const [ profileState, setProfileState ] = useState('security');
    const showStats = () => {
        setProfileState('stats');
    }
    const showSecurity = () => {
        setProfileState('security');
    }
    const showMatchHistory = () => {
        setProfileState('match-history');
    }
    return (
        <div className='d-flex justify-content-center'>
            
            <div className='profile-btns'>
                <div className='row'>
                    <div className='col'>
                        <button className="" id='homeBtn' type="button" onClick={props.back}><FontAwesomeIcon icon={faHome} size="2x" aria-hidden="true"/></button>
                    </div>
                </div>
                <div className='row profile-head'>
                    <div className='col-4'>
                        <button className="" id='profileBtn' type="button"><FontAwesomeIcon icon={faUser} size="7x"/></button>
                    </div>
                    <div className='col'>
                        <input type="text" id="pName" value={props.playerData.playerName} onChange={ e => props.changeName(e.target.value) }/>
                    </div>
                </div>
                <div className='row profile-options'>
                    <div className="col-4">
                        <button className="" id='stats' type="button" onClick={showStats}><FontAwesomeIcon icon={faUser} size="1x"/></button>
                    </div>
                    <div className="col-4">
                        <button className="" id='match-history' type="button" onClick={showMatchHistory}><FontAwesomeIcon icon={faChartBar} size="1x"/></button>
                    </div>
                    <div className="col-4">
                        <button className="" id='security' type="button" onClick={showSecurity}><FontAwesomeIcon icon={faLock} size="1x"/></button>
                    </div>
                </div>
                <div className='row profile-register'>
                    { profileState === 'stats' ?
                      <ProfileStats/>
                    : profileState === 'security' ?
                        <ProfileSecurity/> 
                    : profileState === 'match-history' ?
                        <PlayerHistory/>
                    : false }
                </div>
            </div>
        </div>
    );
}

export default PlayerProfile;