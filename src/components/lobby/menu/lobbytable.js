import React, { useState } from 'react';
import LobbyIndex from './lobbyindex'

function LobbyTable(props) {
    return (
        <div className="table-responsive border rounded border-primary shadow-lg">
            <table className="table table-striped table-sm">
                <thead>
                    <tr className="text-capitalize">
                        <th>Lobby name</th>
                        <th>players</th>
                        <th>join</th>
                    </tr>
                </thead>
                <tbody>
                    {props.lobbyList.map(lobby => {
                        return (
                            <LobbyIndex key={lobby.id} name={lobby.name} connected={lobby.playersCount} max={lobby.maxPlayers} onClick={() => props.joinLobby(lobby.id)}/>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default LobbyTable;