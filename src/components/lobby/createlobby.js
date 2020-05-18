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
                <div className="row">
                    <div className="col">
                        <div className="row">
                            <div className="col-3">
                                <label htmlFor='lobbyName'>Lobby Name:</label>
                            </div>
                            <div className='col'>
                                <input name="lobbyName" id='lobbyName' type="text" placeholder="e.g. Martin's game" defaultValue={lobbyName}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <label htmlFor='maxPlayers'>Max players:</label>
                            </div>
                            <div className='col'>
                                <input name='maxPlayers' id='maxPlayers' type="number" min="2" max="5" step="1" defaultValue={2}/>
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