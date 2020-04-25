import React, { Component } from 'react';
import Fighter from './fighter'

const KEY = {
  DOWN: 40,
  UP: 38,
  SPACE: 32
};

const io = require('socket.io-client');
const socket = io();

export default class JetsFightGame extends Component {
  constructor() {
    super();
    this.state = {
      screen: {
        width: 1080,
        height: 580,
        ratio: window.devicePixelRatio || 1,
      },
      context: null,
      keys : {
        up    : 0,
        down  : 0,
        space : 0,
      }
    }
    this.canvas = React.createRef();
    this.player = null;
    this.others = [];
  }

  handleKeys(value, e){
    let keys = this.state.keys;
    if(e.keyCode === KEY.UP  )  keys.up     = value;
    if(e.keyCode === KEY.DOWN)  keys.down   = value;
    if(e.keyCode === KEY.SPACE) keys.space  = value;
    this.setState({
      keys : keys
    });
  }

  otherUpdate(data) {
    let found = false;
    this.others.forEach(jet => {
      if (jet.getID() === data.id) {
        jet.setPosition(data.position);
        jet.setAngle(data.angle);
        jet.updateProjectiles(data.projs);
        found = true;
      }
    });
    if (!found) {
      this.joinOther(data);
    }
  }

  joinOther(data) {
    this.others.push(new Fighter({
      id: data.id,
      position: {
        x: this.state.screen.width/2,
        y: this.state.screen.height/2
      },
      create: this.registerObject,
      onDestroy: this.unregisterObject,
      canControl: false
    }));
  }

  deleteOther(data) {
    this.others = this.others.filter(jet => jet.getID() !== data.id);
  }

  componentDidMount() {
    socket.on('my_id', data => this.startGame(data.id));
    socket.on('other_update', data => this.otherUpdate(data));
    socket.on('player_join', data => this.joinOther(data));
    socket.on('player_left', data => this.deleteOther(data));

    window.addEventListener('keyup',   this.handleKeys.bind(this, false));
    window.addEventListener('keydown', this.handleKeys.bind(this, true));

    const context = this.canvas.current.getContext('2d');
    this.setState({ context: context });
    requestAnimationFrame(() => {this.update()});
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeys);
    window.removeEventListener('keydown', this.handleKeys);
  }

  update(time) {
    const context = this.state.context;
    context.clearRect(0, 0, this.state.screen.width, this.state.screen.height);

    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);

    // Motion trail
    context.fillStyle = '#25c5df';
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
    context.globalAlpha = 1;

    // Render
    if (this.player !== null) {
      this.player.render(this.state);
      socket.emit('player_data', this.player.data());
    }
    Object.entries(this.others).forEach(([key, value]) => {
      value.render(this.state);
    });

    context.restore();
    // Next frame
    requestAnimationFrame((time) => {this.update(time)});
  }

  startGame(id) {
    this.setState({
      inGame: true
    });

    // Make fighter
    this.player = new Fighter({
      id: id,
      position: {
        x: this.state.screen.width/2,
        y: this.state.screen.height/2
      },
      canControl: true
    });
  }

  render() {
    return (
      <div>
        <canvas ref={this.canvas}
          width={this.state.screen.width * this.state.screen.ratio}
          height={this.state.screen.height * this.state.screen.ratio}
        />
      </div>
    );
  }
}