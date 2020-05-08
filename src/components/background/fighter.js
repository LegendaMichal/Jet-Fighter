import AEG from './../../Images/Planes/AEG/AEG_CIV_default.png'
import Projectile from './../projectile'
import { degToRad } from './../../helper'

class FighterAnim {
    constructor(args) {
      this.defaultPos = {
        x: args.position.x,
        y: args.position.y
      };
      this.position = args.position;
      this.isFreeToUse = () => {
        return (this.position.x > args.screen.width || 
          this.position.x < 0 ||
          this.position.y > args.screen.height ||
          this.position.y < 0)
          && this.wasUsed
      };
      this.animation = args.animation;
      this.velocity = {
          x: 0,
          y: 0
      }
      this.rotation = 0;
      this.rotationSpeed = 1.5;
      this.speed = 3;
      this.image = new Image();
      this.image.src = AEG;
      this.size = {
        width: 64,
        height: 64
      }
      this.origin = () => {
        const radRot = degToRad(this.rotation);
        return {
          x: Math.cos(radRot) * (this.size.width * 2 / 3),
          y: Math.sin(radRot) * (this.size.height / 2)
        }
      }
      this.lastTimeFired = performance.now();
      this.fireTimePeriod = 80; // in ms
      this.projectiles = [];
      this.wasUsed = false;
      this.isShooting = false;
      this.rotating = "NONE";
      this.isRotating = () => this.rotating === "DOWN" || this.rotating === "UP";
    }

    resetAnimation = () => {
      this.rotation = 0;
      this.position = {
        x: this.defaultPos.x,
        y: this.defaultPos.y
      };
      this.wasUsed = false;
      setTimeout(this.animation(), 1500);
    }

    rotate() {
      const before = this.origin();
      if (this.rotating === 'DOWN') {
          this.rotation += this.rotationSpeed;
      }
      if (this.rotating === 'UP') {
          this.rotation -= this.rotationSpeed;
      }
      const after = this.origin();
      // Rotate around origin
      this.position.x += before.x - after.x;
      this.position.y += before.y - after.y;
    }

    gunPosition() {
      const sizeX = this.size.width * 0.88;
      const sizeY = this.size.height * 0.39;
      const gunDistance = Math.sqrt(Math.pow(sizeX, 2) + Math.pow(sizeY, 2));
      const gunAngle = degToRad(this.rotation) + Math.atan(sizeY / sizeX);
      return {
        x: this.position.x + Math.cos(gunAngle) * gunDistance,
        y: this.position.y + Math.sin(gunAngle) * gunDistance,
      };
    }
    
    shoot() {
      const actualTime = performance.now();
      if (actualTime - this.lastTimeFired < this.fireTimePeriod) {
        return;
      }
      this.lastTimeFired = actualTime;
      const projPos = this.gunPosition();
      this.projectiles.push(new Projectile({
        isOwner: true,
        position: projPos,
        angle: this.rotation,
        maxShootLength: 400
      }));
    }

    up = () => {
      this.wasUsed = true;
      this.rotating = "UP";
    }

    down = () => {
      this.wasUsed = true;
      this.rotating = "DOWN";
    }

    stay = () => {
      this.wasUsed = true;
      this.rotating = "NONE";
    }

    fire = () => {
      this.wasUsed = true;
      this.isShooting = true;
    }

    stopFiring = () => {
      this.wasUsed = true;
      this.isShooting = false;
    }

    render(state) {
      // Controls
      if (this.isShooting)
        this.shoot();
      if (this.isRotating())
        this.rotate();
  
      // Move
      this.velocity.x = Math.cos(this.rotation*Math.PI/180) * this.speed;
      this.velocity.y = Math.sin(this.rotation*Math.PI/180) * this.speed;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
  
      // Rotation
      if (this.rotation >= 360) {
        this.rotation -= 360;
      }
      if (this.rotation < 0) {
        this.rotation += 360;
      }
      
      this.projectiles = this.projectiles.filter(proj => !proj.isExpired());

      // Draw
      const context = state.context;
      context.save();
      context.translate(this.position.x, this.position.y);
      context.rotate(this.rotation * Math.PI / 180);
      context.drawImage(this.image, 0,0, this.size.width, this.size.height);
      context.restore();

      this.projectiles.forEach(proj => proj.render(state));
    }
}

export default FighterAnim;