import React, { Component } from 'react';
import Fighter from './fighter'

const KEY = {
  DOWN: 40,
  UP: 38,
  SPACE: 32
};

const io = require('socket.io-client');
const socket = io('http://localhost:3011');

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
    this.fighters = [];
    this.projectiles = [];

    this.lastTime = performance.now();
    this.fpsInterval = 45;
    this.rendered = true;
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

  componentDidMount() {
    window.addEventListener('keyup',   this.handleKeys.bind(this, false));
    window.addEventListener('keydown', this.handleKeys.bind(this, true));

    const context = this.canvas.current.getContext('2d');
    this.setState({ context: context });
    this.startGame();
    requestAnimationFrame(() => {this.update()});
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeys);
    window.removeEventListener('keydown', this.handleKeys);
  }

  update(time) {

    if (!this.rendered) {
      console.log("not rendered");
    }
    this.rendered = false;
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
    this.projectiles.forEach(projectile =>
      projectile.render(this.state)
      );
    this.fighters.forEach(jet => {
      jet.render(this.state);
    });

    context.restore();

    this.rendered = true;
    // Next frame
    requestAnimationFrame((time) => {this.update(time)});
  }

  startGame() {
    this.setState({
      inGame: true
    });

    // Make fighter
    new Fighter({
      position: {
        x: this.state.screen.width/2,
        y: this.state.screen.height/2
      },
      create: this.registerObject,
      onDestroy: this.unregisterObject
    });
  }

  registerObject = (object, group) => {
    this[group].push(object);
  }

  unregisterObject = (object, group) => {
    if (this[group].includes(object)) {
      this[group].splice(this[group].indexOf(object), 1);
    }
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