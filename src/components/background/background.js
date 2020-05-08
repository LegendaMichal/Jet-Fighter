import React, { Component } from 'react';
import BasicCloud from './../cloud';
import FighterAnim from './fighter'

class Background extends React.Component {
    constructor(args) {
        super();
        this.state = {
            screen: {
                width: window.screen.width,
                height: window.screen.height,
                ratio: window.devicePixelRatio || 1,
            },
            context: null
        };
        this.canvas = React.createRef();

        this.clouds = [];
        this.fighters = [];

    }

    fighterFly1(fighter) {
        setTimeout(() => fighter.up(), 2500);
        setTimeout(() => fighter.stay(), 6000);
        setTimeout(() => fighter.up(), 8000);
        setTimeout(() => fighter.stay(), 8700);
        setTimeout(() => fighter.down(), 8800);
        setTimeout(() => fighter.stay(), 9000);
        setTimeout(() => fighter.up(), 9800);
        setTimeout(() => fighter.stay(), 10500);
        setTimeout(() => fighter.down(), 11000);
        setTimeout(() => fighter.stay(), 11700);
    }



    componentDidMount() {    
        const context = this.canvas.current.getContext('2d');
        this.setState({ context: context });
        requestAnimationFrame(() => {this.update()});

        while (this.clouds.length < 6) {
            this.clouds.push(new BasicCloud({
                screenSize: this.state.screen,
                size: {
                    width: 300,
                    height: 200
                }
            }));
        }
        const fighter = new FighterAnim({
            position: {
                x: -64,
                y: this.state.screen.height / 4
            },
            screen: this.state.screen,
            animation: () => this.fighterFly1(fighter)
        });
        this.fighters.push(fighter)
        fighter.resetAnimation();
    }

    update(time) {
        const context = this.state.context;
    
        context.save();
        context.scale(this.state.screen.ratio, this.state.screen.ratio);
        context.clearRect(0, 0, this.state.screen.width, this.state.screen.height);
    
        // Motion trail
        context.fillStyle = '#25c5df';
        context.globalAlpha = 0.4;
        context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
        context.globalAlpha = 1;
    
        // Render
        this.clouds.forEach(cloud => {
            cloud.render(context);
        });
        this.fighters.forEach(fighter => {
            if (!fighter.isFreeToUse()) {
                fighter.render(this.state);
            }
            else {
                setTimeout(() => fighter.resetAnimation(), 1000);
            }
        })
    
        context.restore();
        // Next frame
        requestAnimationFrame((time) => {this.update(time)});
    }

    render() {
        return (
                <canvas ref={this.canvas} 
                    style={{ zIndex: -1, position: "fixed", overflow: "hidden" }} 
                    height={this.state.screen.height * this.state.screen.ratio}
                    width={this.state.screen.width * this.state.screen.ratio}/>
        )
    }
}

export default Background;