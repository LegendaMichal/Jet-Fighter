class BasicCloud {
    constructor(args) {
        this.screenSize = args.screenSize;
        this.size = args.size;
        this.pos = {
            x: this.getRandomPositionX(),
            y: this.getRandomPositionY()
        };
        this.velocity = this.getRandomSpeed();
        this.scale = Math.random() + 0.5;
    }

    getRandomSpeed() {
        return  Math.random() * 2 - 1;
    }

    getRandomPositionX() {
        return Math.random() * this.screenSize.width;
    }

    getRandomPositionY() {
        return Math.random() * (this.screenSize.height * 3 / 5);
    }

    returnCloudIntoCanvas() {
        this.velocity = this.getRandomSpeed();
        this.scale = Math.random() + 0.5;
        this.pos = {
            x: (this.velocity < 0 ? this.screenSize.width * this.scale : -this.size.width * this.scale),
            y: this.getRandomPositionY()
        };
    }

    render(context) {

        // moving
        this.pos = {
            x: this.pos.x + this.velocity,
            y: this.pos.y
        };
        if (this.pos.x * this.scale > this.screenSize.width || (this.pos.x + this.size.width) * this.scale < 0)
            this.returnCloudIntoCanvas();

        // drawing
        const unitX = this.size.width / 10;
        const unitY = this.size.height / 7;
        context.save();
        context.beginPath();
        context.scale(this.scale, this.scale);
        let curPos = { x: this.pos.x + unitX * 2, y: this.pos.y + unitY * 3.5 };
        context.moveTo(curPos.x, curPos.y);
        let conPos1 = { x: curPos.x - unitX * 2.8, y: curPos.y - unitY * 0.4 };
        let conPos2 = { x: curPos.x + unitX * 0.5, y: curPos.y - unitY * 3.7 };
        curPos = { x: curPos.x + unitX * 1.6, y: curPos.y - unitY * 1.9 };
        context.bezierCurveTo(conPos1.x, conPos1.y, conPos2.x, conPos2.y, curPos.x, curPos.y);
        context.lineTo(curPos.x - unitX * 0.3, curPos.y + unitY * 0.4);
        conPos1 = { x: curPos.x + unitX * 1.5, y: curPos.y - unitY * 2.2 };
        conPos2 = { x: curPos.x + unitX * 3.7, y: curPos.y - unitY * 1.7 };
        curPos = { x: curPos.x + unitX * 3.4, y: curPos.y - unitY * 0.2 };
        context.bezierCurveTo(conPos1.x, conPos1.y, conPos2.x, conPos2.y, curPos.x, curPos.y);
        conPos1 = { x: curPos.x + unitX * 1.4, y: curPos.y - unitY * 1.1 };
        conPos2 = { x: curPos.x + unitX * 3.7, y: curPos.y + unitY * 1.5 };
        curPos = { x: curPos.x + unitX * 2.4, y: curPos.y + unitY * 2.7 };
        context.bezierCurveTo(conPos1.x, conPos1.y, conPos2.x, conPos2.y, curPos.x, curPos.y);
        context.lineTo(curPos.x - unitX * 0.3, curPos.y - unitY * 0.2);
        conPos1 = { x: curPos.x + unitX * 1.4, y: curPos.y + unitY * 0.8 };
        conPos2 = { x: curPos.x - unitX * 1.8, y: curPos.y + unitY * 2.9 };
        curPos = { x: curPos.x - unitX * 2.4, y: curPos.y + unitY * 0.3 };
        context.bezierCurveTo(conPos1.x, conPos1.y, conPos2.x, conPos2.y, curPos.x, curPos.y);
        context.lineTo(curPos.x + unitX * 0.2, curPos.y + unitY * 0.6);
        conPos1 = { x: curPos.x - unitX * 0.5, y: curPos.y + unitY * 1.8 };
        conPos2 = { x: curPos.x - unitX * 2.5, y: curPos.y + unitY * 1.6 };
        curPos = { x: curPos.x - unitX * 2.5, y: curPos.y + unitY * 0.3 };
        context.bezierCurveTo(conPos1.x, conPos1.y, conPos2.x, conPos2.y, curPos.x, curPos.y);
        context.lineTo(curPos.x + unitX * 0.3, curPos.y - unitY * 0.2);
        conPos1 = { x: curPos.x - unitX * 3.1, y: curPos.y + unitY * 2.5 };
        conPos2 = { x: curPos.x - unitX * 5.1, y: curPos.y - unitY * 0.8 };
        curPos = { x: this.pos.x + unitX * 2, y: this.pos.y + unitY * 3.5 };
        context.bezierCurveTo(conPos1.x, conPos1.y, conPos2.x, conPos2.y, curPos.x, curPos.y);
        context.lineTo(curPos.x, curPos.y);
        context.closePath();
        context.fillStyle = "#ddd";
        context.strokeStyle = "#888";
        context.scale(1,1);
        context.fill();
        context.stroke();
        context.restore();
    }
}

export { BasicCloud as default };