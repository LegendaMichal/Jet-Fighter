import React from 'react'
import LobbyContainer from './menu/lobbycontainer'
import LobbyCreator from './createlobby'
import Lobby from './lobby'

class LobbyMenu extends React.Component {
    constructor(args) {
        super(args);
        this.state = {
            lobbyPosition: 'container', // create, inside
            lobbies: [],
            lobbyData: {}
        };
        this.socket = args.socket;
        this.playerData = args.playerData;
        this.backToMenu = args.back;
    }

    joiningLobby = (id) => {
        this.socket.emit('try_join_lobby', { lobbyId: id, playerName: this.playerData.playerName });
    }

    createLobby = () => {
        this.setState({
            lobbyPosition: 'create' // container, inside
        });
    }

    newLobby = (formData) => {
        this.socket.emit('new_lobby', {
            name: formData.get('lobbyName'),
            maxPlayers: formData.get('maxPlayers')
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
            const lobby = data.find(lobby => {
                return lobby.players.some(player => player.id === this.playerData.pId);
            });
            if (lobby === undefined) {
                this.setState({
                    lobbies: data
                });
            } else {
                this.socket.emit('try_join_lobby', { lobbyId: lobby.id, playerName: this.playerData.playerName });
            }
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
            <div className='container-fluid lobbyContainer'>
                <div className='row justify-content-center lobby'>
                    <div className='col'>
                        { this.state.lobbyPosition === 'container'
                        ? <LobbyContainer
                                back={this.backToMenu}
                                playerName={this.playerData.playerName.slice(0)}
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
                                playerName={this.playerData.playerName.slice(0)} 
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