import React from 'react';
import PlayerIndex from './playerindex'

function Lobby(props) {
    return (
        <div>
            <h5>{props.lobbyName}</h5>
            <div className='row context-row'>
                <div className='col'>
                    <div className='table-responsive border rounded border-primary shadow-lg'>
                        <table className="table table-striped table-sm">
                            <thead>
                                <tr className="text-capitalize">
                                    <th>Player name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.playerList.map(player => {
                                    return (
                                        <PlayerIndex key={player.id} name={player.name}/>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-3'>
                    <button onClick={props.onLeave}>Leave</button>
                </div>
                <div className='col-3'>
                    <button onClick={props.onStart}>Start Game</button>
                </div>
            </div>
        </div>
    );
}

export default Lobby;