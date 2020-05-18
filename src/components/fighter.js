import AEG from './../Images/Planes/AEG/AEG_CIV_default.png'
import AEGdmged from './../Images/Planes/AEG/AEG_CIV_default_damaged.png'
import enemyAEG from './../Images/Planes/AEG/AEG_CIV_enemy.png'
import enemyAEGdmged from './../Images/Planes/AEG/AEG_CIV_enemy_damaged.png'
import AEGDestroyed from './../Images/Planes/AEG/AEG_CIV_death.png'
import Projectile from './projectile'
import { degToRad, distancePointFromLine } from './../helper.js'

class Fighter {
    constructor(args) {
      this.id = args.id;
      this.name = args.name;
      this.health = args.hp;
      this.canControl = args.canControl;
      this.position = args.position;
      this.velocity = {
          x: 0,
          y: 0
      }
      this.rotation = 0;
      this.rotationSpeed = 1.5;
      this.speed = 3;
      this.image = new Image();
      if (this.canControl)
        this.image.src = AEG;
      else
        this.image.src = enemyAEG;
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
      this.projectilesFired = 0;
      this.projectiles = [];
      this.destroyed = false;
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

    setHealth(hp) {

    }

    setPosition(pos) {
      this.position = pos;
    }

    updateProjectiles(projs) {
      this.projectiles = [];
      if (projs.length > 0) {
        projs.forEach(proj => {
          const pjct = new Projectile({
            isOwner: false,
            position: proj.position,
            angle: proj.angle,
            maxShootLength: 400
          });
          this.projectiles.push(pjct);
        });
      }
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
      this.projectilesFired++;
      this.projectiles.push(new Projectile({
        isOwner: this.canControl,
        position: projPos,
        angle: this.rotation,
        maxShootLength: 400
      }));
    }

    isInCollision(projectile) {
      const p1 = { x: projectile.position.x, y: projectile.position.y };
      const p2 = { x: p1.x + Math.cos(projectile.angle) * projectile.defaultSize.width, y: p1.y + Math.sin(projectile.angle) * projectile.defaultSize.width };
      if (this.containsPoint(p1) || this.containsPoint(p2)) {
        return true;
      }
      return false;
    }

    containsPoint(point) {
      // https://math.stackexchange.com/questions/190111/how-to-check-if-a-point-is-inside-a-rectangle second one
      const rect = this.getBoundaryPoints();
      const distABP = distancePointFromLine(point, { x1: rect.A.x, y1: rect.A.y, x2: rect.B.x, y2: rect.B.y });
      const distDCP = distancePointFromLine(point, { x1: rect.C.x, y1: rect.C.y, x2: rect.D.x, y2: rect.D.y });
      const distABDC = distancePointFromLine(rect.A, { x1: rect.C.x, y1: rect.C.y, x2: rect.D.x, y2: rect.D.y });
      if (distABP <= distABDC && distDCP <= distABDC) {
        const distACP = distancePointFromLine(point, { x1: rect.A.x, y1: rect.A.y, x2: rect.C.x, y2: rect.C.y });
        const distBDP = distancePointFromLine(point, { x1: rect.B.x, y1: rect.B.y, x2: rect.D.x, y2: rect.D.y });
        const distACBD = distancePointFromLine(rect.A, { x1: rect.B.x, y1: rect.B.y, x2: rect.D.x, y2: rect.D.y });
        if (distACP <= distACBD && distBDP <= distACBD) {
          return true;
        }
      }
      return false;
    }

    getBoundaryPoints() {
      const A = { x: this.position.x + Math.cos(degToRad(this.rotation + 90)) * (this.size.height / 4), y: this.position.y + Math.sin(degToRad(this.rotation + 90)) * this.size.height / 4 };
      const B = { x: A.x + Math.cos(degToRad(this.rotation)) * this.size.width, y: A.y + Math.sin(degToRad(this.rotation)) * this.size.width };
      const C = { x: B.x + Math.cos(degToRad(this.rotation + 90)) * (this.size.height / 3), y: B.y + Math.sin(degToRad(this.rotation + 90)) * (this.size.height / 3) };
      const D = { x: A.x + Math.cos(degToRad(this.rotation + 90)) * (this.size.height / 3), y: A.y + Math.sin(degToRad(this.rotation + 90)) * (this.size.height / 3) };
      return {
        A: A, B: B, C: C, D: D
      }
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

      if (!this.destroyed) {
        // Draw
        const context = state.context;
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation * Math.PI / 180);
        context.drawImage(this.image, 0,0, this.size.width, this.size.height);
        context.restore();
      }
      
      this.projectiles.forEach(proj => proj.render(state));
    }

    data() {
      return {
        id: this.id,
        name: this.name,
        health: this.health,
        position: this.position,
        angle: this.rotation,
        projs: this.projectiles.map(proj => proj.shortData())
      };
    }
}

export default Fighter;