import React from 'react';
import PlayerIndex from './playerindex'

function Lobby(props) {
    return (
        <div>
            <h5>{props.lobbyName}</h5>
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
            <button onClick={props.onLeave}>Leave</button>
            <button onClick={props.onStart}>Start Game</button>
        </div>
    );
}

export default Lobby;