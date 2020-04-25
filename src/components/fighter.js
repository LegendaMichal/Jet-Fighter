import AEG from './../Images/Planes/AEG/AEG_CIV_default.png'
import Projectile from './projectile';

class Fighter {
    constructor(args) {
      this.id = args.id;
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
      this.canControl = args.canControl;
      this.projectilesFired = 0;
      this.projectiles = [];
    }

    getID() {
      return this.id;
    }

    setAngle(angle) {
      this.rotation = angle;
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

    setPosition(pos) {
      this.position = pos;
    }

    updateProjectiles(projs) {
      this.projectiles = [];
      if (projs.length > 0) {
        projs.forEach(proj => {
          this.projectiles.push(new Projectile({
            isOwner: false,
            position: proj.position,
            angle: proj.angle,
            maxShootLength: 400
          }));
        });
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
      this.projectilesFired++;
      this.projectiles.push(new Projectile({
        isOwner: this.canControl,
        position: projPos,
        angle: this.rotation,
        maxShootLength: 400
      }));
    }

    render(state) {
      if (this.canControl) {
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
        
        this.projectiles = this.projectiles.filter(proj => !proj.isExpired());
      }

      // Draw
      const context = state.context;
      context.save();
      context.translate(this.position.x, this.position.y);
      context.rotate(this.rotation * Math.PI / 180);
      context.strokeRect(0, 0, this.size.width, this.size.height);
      context.drawImage(this.image, 0,0, this.size.width, this.size.height);
      context.restore();

      this.projectiles.forEach(proj => proj.render(state));
    }

    data() {
      return {
        id: this.id,
        position: this.position,
        angle: this.rotation,
        projs: this.projectiles.map(proj => proj.shortData())
      };
    }
}

export default Fighter;