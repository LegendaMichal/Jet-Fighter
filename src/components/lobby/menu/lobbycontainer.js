import React from 'react'
import PlayerShortInfo from './playerinfo'
import LobbyTable from './lobbytable'

function LobbyContainer(props) {
    return (
        <>
            <h1 style={{
                marginTop: 15, marginBottom: 15
            }}>
                Available Games
            </h1>
            <div className='row' style={{
                marginTop: 15, marginBottom: 15
            }}>
                <div className='col'>
                    <PlayerShortInfo 
                        setName={props.setName}
                        name={props.playerName}
                    />
                </div>
            </div>
            <div className='row' style={{
                marginTop: 15, marginBottom: 15
            }}>
                <div className='col'>
                    <LobbyTable joinLobby={props.joinLobby} lobbyList={props.lobbyList}/>
                </div>
            </div>
            <div className='row' style={{
                marginTop: 15, marginBottom: 40
            }}>
                <div className="col text-right">
                    <button className="btn btn-primary" type="button" onClick={props.createGame}>Create Game</button>
                </div>
            </div>
        </>
    );
}

export default LobbyContainer;