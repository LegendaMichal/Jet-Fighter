import React from 'react';
import MainWindow from './mainwindow'
import Background from './../background/background'
import PlayerProfile from './profile';
import Login from './login'
import { generateId } from '../../helper';
import Cookies from 'js-cookie'
import LobbyMenu from '../lobby/lobbymenu';
import Game from './../jetsfight';
import Reconnect from './reconnect';
import ShowResult from './results';

function MainWindowManager (props) {
    const loggedId = Cookies.get('TIA-Jet-Fighter');
    const islogged = loggedId !== undefined;
    const [ menuState, setMenuState ] = React.useState(islogged ? 'Menu' : 'first-screen');
    const profileClick = () => {
        setMenuState('Profile');
    };
    const menuClick = () => {
        setMenuState('Menu');
        let jetFighterCookie = Cookies.get('TIA-Jet-Fighter');
        if (jetFighterCookie === undefined) {
            jetFighterCookie = generateId();
        }
        Cookies.set('TIA-Jet-Fighter', jetFighterCookie, { expires: 1/12, SameSite: 'Strict' });
        setPlayerData({
            ...playerData,
            pId: jetFighterCookie, 
        });
        return jetFighterCookie;
    };
    const customGame = () => {
        setMenuState('custom-game-lobby');
    };

    
    const [ playerData, setPlayerData ] = React.useState(
        {
            loggedIn : islogged,
            pId : loggedId,
            playerName : "Player 1",
        }
    );
    const setPlayerName = (name) => {
        setPlayerData({
            ...playerData,
            "playerName": name
        });
        props.socket.emit('name_change', { id: playerData.pId, name: name });
    };
    props.socket.on('PlayerRegistered', playerInfo => {

    });
    props.socket.on('PlayerLoggedIn', playerInfo => {
        
    });
    const partialLogin = () => {
        const id = menuClick();
        props.socket.emit('partial_login', { id: id, name: playerData.playerName });
    }
    if (islogged) {
        props.socket.emit('partial_login', { id: loggedId, name: playerData.playerName });
    }

    props.socket.on('user_is_in_game', isInGame => {
        console.log("user in game");
        if (isInGame && menuState !== 'in-game') {
            setMenuState('reconnect');
        }
    })
    const onReconnect = () => {
        console.log('reconnect_attempt');
        props.socket.emit('reconnect_attempt', true);
    }
    props.socket.on('disconnect_from_game', () => {
        setMenuState('reconnect');
    });

    const [ sessionId, setSessionId ] = React.useState('');
    props.socket.on('load_game', (id) => {
        console.log(id);
        setSessionId(id);
        setMenuState('in-game');
    });
    const [ resultPos, setResultPos ] = React.useState(-1);
    props.socket.on('lost', position => {
        setMenuState('result');
        setResultPos(position);
    })
    props.socket.on('winner', () => {
        setMenuState('result');
        setResultPos(1);
    })
    return (
        <div>
            { menuState === 'in-game' ? <Game socket={props.socket} sesionId={sessionId} pName={playerData.playerName}/> : <Background /> }
            { menuState === 'Menu' ?
                <MainWindow clickProfile={profileClick} customGameClick={customGame}/>
            : menuState === 'Profile' ? 
                <PlayerProfile back={menuClick} playerData={playerData} changeName={setPlayerName}/> 
            : menuState === 'first-screen' ?
                <Login goToMenu={partialLogin}/>
            : menuState === 'custom-game-lobby' ?
                <LobbyMenu back={menuClick} playerData={playerData} socket={props.socket}/>
            : menuState === 'reconnect' ?
                <Reconnect onReconnect={onReconnect}/>
            : menuState === 'result' ?
                <ShowResult results={resultPos} backToMenu={menuClick}/>
            : false }
        </div>
    );
}

export default MainWindowManager;