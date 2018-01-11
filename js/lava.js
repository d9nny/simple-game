/*jshint esversion: 6 */

function Lava(pos, ch) {
    this.pos = pos;
    this.size = new Vector(1,1);
    if (ch === '=') { this.speed = new Vector(2,0); }
    if (ch === '|') { this.speed = new Vector(0,2); }
    if (ch === 'v') {
        this.speed = new Vector(0,3);
        this.repeatPos = pos;
    }
}

Lava.prototype.type = 'lava';

Lava.prototype.act = function(step, level) {
    const newPos = this.pos.plus(this.speed.times(step));
    if (!level.obstacleAt(newPos, this.size)) {
        this.pos = newPos;
    } else if (this.repeatPos) {
        this.pos = this.repeatPos;
    } else {
        this.speed = this.speed.times(-1);
    }
};
