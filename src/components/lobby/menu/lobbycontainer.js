import React from 'react';
import LobbyTable from './lobbytable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

function LobbyContainer(props) {
    return (
        <>
            <div className='row'>
                <div className='col'>
                    <button className="" id='homeBtn' type="button" onClick={props.back}><FontAwesomeIcon icon={faHome} size="2x" aria-hidden="true"/></button>
                </div>
            </div>
            <h1>Custom Games</h1>
            <div className='row'>
                <div className='col'>
                    <LobbyTable joinLobby={props.joinLobby} lobbyList={props.lobbyList}/>
                </div>
            </div>
            <div className='row'>
                <div className="col text-right">
                    <button className="btn btn-primary" type="button" onClick={props.createGame}>Create Game</button>
                </div>
            </div>
        </>
    );
}

export default LobbyContainer;