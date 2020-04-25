import AEG from './../Images/Planes/AEG/AEG_CIV_default.png'
import Projectile from './projectile';

class Fighter {
    constructor(args) {
        this.position = args.position;
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
          return {
            x: Math.cos(this.rotation*Math.PI/180) * (this.size.width * 2 / 3),
            y: Math.sin(this.rotation*Math.PI/180) * (this.size.height / 2)
          }
        }
        this.lastTimeFired = performance.now();
        this.fireTimePeriod = 80; // in ms
        this.onCreate = args.create;
        this.onDestroy = args.onDestroy;

        this.onCreate(this, 'fighters');
    }

    rotate(dir) {
        const before = this.origin();
        if (dir === 'DOWN') {
            this.rotation -= this.rotationSpeed;
        }
        if (dir === 'UP') {
            this.rotation += this.rotationSpeed;
        }
        const after = this.origin();
        // Rotate around origin
        this.position.x += before.x - after.x;
        this.position.y += before.y - after.y;
    }

    center() {
      return {
        x: this.position.x + this.size.width / 2,
        y: this.position.y + this.size.height / 2
      }
    }

    shoot() {
      const actualTime = performance.now();
      if (actualTime - this.lastTimeFired < this.fireTimePeriod) {
        return;
      }
      this.lastTimeFired = actualTime;
      const projPos = {
        x: this.position.x + Math.cos(this.rotation*Math.PI/180) * this.size.width,
        y: this.position.y + Math.sin(this.rotation*Math.PI/180) * this.size.height,
      };
      new Projectile({
        position: projPos,
        angle: this.rotation,
        maxShootLength: 400,
        create: this.onCreate,
        onDestroy: this.onDestroy
      });
    }

    render(state) {
        // Controls
        if (state.keys.space) {
          this.shoot();
        }
        if (state.keys.up){
          this.rotate('UP');
        }
        if (state.keys.down){
          this.rotate('DOWN');
        }
    
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
    
        // Screen edges
        if(this.position.x > state.screen.width) this.position.x = 0;
        else if(this.position.x < 0) this.position.x = state.screen.width;
        if(this.position.y > state.screen.height) this.position.y = 0;
        else if(this.position.y < 0) this.position.y = state.screen.height;
    
        // Draw
        const context = state.context;
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation * Math.PI / 180);
        context.strokeRect(0, 0, this.size.width, this.size.height);
        context.drawImage(this.image, 0,0, this.size.width, this.size.height);
        context.restore();
    }
}

export default Fighter;