import React, { useState } from 'react';
import io from 'socket.io-client';
import MainWindowManager from './components/mainmenu/mainwindowmanager'

const socket = io();

function App() {
  return (
    <MainWindowManager socket={socket}/>
  );
}

export default App;
