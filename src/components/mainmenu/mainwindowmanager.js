import React from 'react';
import MainWindow from './mainwindow'
import Background from './../background/background'

function MainWindowManager () {
    return (
        <div>
            <Background />
            <MainWindow />
        </div>
    );
}

export default MainWindowManager;