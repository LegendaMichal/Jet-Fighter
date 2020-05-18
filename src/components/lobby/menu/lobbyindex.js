import React from 'react';

function LobbyIndex(props) {
    const lobbyName = props.name;
    const connectedPlayers = props.connected;
    const maxPlayers = props.max;
    const disabled = connectedPlayers >= maxPlayers;
    return (
        <tr>
            <td>{lobbyName}</td>
            <td>{connectedPlayers}/{maxPlayers}</td>
            <td>
                <button className="join-btn" type="button" onClick={props.onClick} disabled={disabled}>Join</button>
            </td>
        </tr>
    );
}

export default LobbyIndex;