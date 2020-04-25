import img from './../Images/Planes/AEG/projectile/Bullet_3.png'
import maxOfAbs from './../helper'

class Projectile {
    constructor(args) {
        this.position = args.position;
        this.speed = 15;
        this.angle = args.angle;
        this.velocity = {
            x: Math.cos(this.angle*Math.PI/180) * this.speed,
            y: Math.sin(this.angle*Math.PI/180) * this.speed
        }
        this.size = {
            width: maxOfAbs(Math.cos(this.angle*Math.PI/180) * 20.5, Math.sin(this.angle*Math.PI/180) * 20.5),
            height: maxOfAbs(Math.cos(this.angle*Math.PI/180) * 3, Math.sin(this.angle*Math.PI/180) * 3)
        }
        this.trajectoryLength = 0;
        this.lifeSpanLength = args.maxShootLength;
        this.image = new Image();
        this.image.src = img;

        args.create(this, 'projectiles');
        this.onDestroy = args.onDestroy;
    }

    checkLifeSpan() {
        if (this.trajectoryLength > this.lifeSpanLength) {
            this.onDestroy(this, 'projectiles');
        }
    }

    render(state) {
        this.checkLifeSpan();

        // move
        this.trajectoryLength += Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Draw
        const context = state.context;
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.angle * Math.PI / 180);
        context.drawImage(this.image, 0,0, this.size.width, this.size.height);
        context.restore();
    }
}

export default Projectile;