import React from 'react'
import LobbyContainer from './menu/lobbycontainer'
import LobbyCreator from './createlobby'
import Lobby from './lobby'

class LobbyMenu extends React.Component {
    constructor(args) {
        super(args);
        this.state = {
            lobbyPosition: 'container', // create, inside
            playerName: (args && args.playerName ? args.playerName : "player 1"),
            lobbies: [],
            lobbyData: {}
        };
        this.socket = args.socket;
    }

    setName = (name) => {
        this.setState({
            playerName: name
        });
    }

    joiningLobby = (id) => {
        this.socket.emit('try_join_lobby', { lobbyId: id, playerName: this.state.playerName });
    }

    createLobby = () => {
        this.setState({
            lobbyPosition: 'create' // container, inside
        });
    }

    newLobby = (formData) => {
        this.socket.emit('new_lobby', {
            name: formData.get('lobbyName'),
            maxPlayers: formData.get('maxPlayers'),
            playerName: this.state.playerName.slice(0)
        });
    }

    leaveLobby = () => {
        this.socket.emit('leave_lobby', this.state.lobbyData.id);
    }

    startGame = () => {
        this.socket.emit('start_game', this.state.lobbyData.id);
    }

    componentDidMount() {
        this.socket.emit('enter_menu');
        this.socket.on('default_name', data => {
            console.log("name", data);
        })
        this.socket.on('enter_lobby', data => {
            this.setState({
                lobbyPosition: 'inside', // create, container
                lobbyData: data
            });
        });
        this.socket.on('leave_lobby', () => {
            this.setState({
                lobbyPosition: 'container', // create, container
            });
        });
        this.socket.on('update_lobbies', data => {
            this.setState({
                lobbies: data
            });
        });
        this.socket.on('update_lobby', data => {
            this.setState({
                lobbyData: data
            });
        });
    }

    componentWillUnmount() {
        this.socket.emit('leave_menu');
    }

    render() {
        return (   
            <div className='container-fluid'>
                <div className='row justify-content-center'>
                    <div className='col-lg-6 offset-lg-0'>
                        { this.state.lobbyPosition === 'container'
                        ? <LobbyContainer
                                playerName={this.state.playerName.slice(0)}
                                createGame={this.createLobby} 
                                setName={this.setName} 
                                joinLobby={this.joiningLobby}
                                lobbyList={this.state.lobbies}
                                />
                        : this.state.lobbyPosition === 'inside'
                            ? <Lobby 
                                playerList={this.state.lobbyData.playerNames}
                                lobbyName={this.state.lobbyData.name}
                                onLeave={this.leaveLobby}
                                onStart={this.startGame}
                                />
                            : <LobbyCreator 
                                playerName={this.state.playerName.slice(0)} 
                                onCreate={this.newLobby} 
                                />
                        }
                    </div>
                </div>
            </div>
            );
    }
}

export default LobbyMenu;