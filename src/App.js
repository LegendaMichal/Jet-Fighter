import React, { useState } from 'react';
import Game from './components/jetsfight';
import io from 'socket.io-client';
import MainWindowManager from './components/mainmenu/mainwindowmanager'

import LobbyMenu from './components/lobby/lobbymenu'

const socket = io();

function App() {
  const [ sessionId, setSessionId ] = useState('');
  socket.on('load_game', (id) => {
    console.log(id);
    setSessionId(id);
  });
  return (
    <MainWindowManager />
    // <div className="Game">
    //   { sessionId ? <Game socket={socket} sesionId={sessionId}/> : <LobbyMenu socket={socket}/> }
    // </div>
  );
}

export default App;
