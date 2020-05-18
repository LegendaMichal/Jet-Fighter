import img from './../Images/Planes/AEG/projectile/Bullet_3.png'
import { maxOfAbs } from './../helper'

class Projectile {
    constructor(args) {
        this.position = args.position;
        this.angle = args.angle;
        this.lifeSpanLength = args.maxShootLength;
        this.isOwner = args.isOwner;
        
        this.speed = 15;
        this.velocity = {
            x: Math.cos(this.angle*Math.PI/180) * this.speed,
            y: Math.sin(this.angle*Math.PI/180) * this.speed
        }
        this.defaultSize = 8;
        this.size = {
            width: Math.cos(this.angle*Math.PI/180) * this.defaultSize,
            height: Math.sin(this.angle*Math.PI/180) * this.defaultSize
        }
        this.trajectoryLength = 0;
        this.image = new Image();
        this.image.src = img;
        this.hit = false;
    }

    hitObject() {
        this.hit = true;
    }

    isExpired() {
        return this.trajectoryLength > this.lifeSpanLength || this.hit;
    }

    render(state) {

        // Draw
        const context = state.context;
        context.save();
        context.lineWidth = 1;
        context.strokeStyle = '#d80c00';
        context.beginPath();
        context.moveTo(this.position.x, this.position.y);
        context.lineTo(this.position.x + this.size.width, this.position.y + this.size.height);
        context.stroke();
        context.restore();


        if (this.isOwner) {
            // move
            this.trajectoryLength += Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
        }
    }

    shortData() {
        return {
            position: this.position,
            angle: this.angle
        }
    }
}

export default Projectile;