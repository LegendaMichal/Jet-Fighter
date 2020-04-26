import React from 'react';

function LobbyCreator(props) {
    const lobbyName = props.playerName + '\'s lobby';
    const onCreate = e => {
        e.preventDefault();

        const form = e.target;
        const data = new FormData(form);
        props.onCreate(data);
    }
    return (
        <>
            <div className="row">
                <div className="col">
                    <h1>Create Game</h1>
                </div>
            </div>
            <form className="form-group" onSubmit={onCreate}>
                <div className="row" style={{ marginTop: 15, marginBottom: 15, marginLeft: -15, marginRight: -15 }}>
                    <div className="col">
                        <div className="row" style={{ marginTop: 15, marginBottom: 15, marginLeft: -15, marginRight: -15 }}>
                            <div className="col">
                                <span style={{ margin: 15 }}>Lobby Name:</span>
                                <input name="lobbyName" type="text" placeholder="e.g. Martin's game" defaultValue={lobbyName}/>
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: 15, marginBottom: 15, marginLeft: -15, marginRight: -15 }}>
                            <div className="col-lg-12">
                                <span style={{ margin: 15 }}>Max players:</span>
                                <input name='maxPlayers' type="number" min="2" max="5" step="1" defaultValue={2}/>
                            </div>
                        </div>
                    </div>
                </div>
                <input className="btn btn-primary" type="submit" value="Create"/>
            </form>
        </>
    );
}

export default LobbyCreator;