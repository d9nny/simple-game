/*jshint esversion: 6 */

const actorChars = {
  "@": Player,
  "o": Coin,
  "=": Lava, "|": Lava, "v": Lava
};

const maxStep = 0.05;

function Level(plan) {
    this.width = plan[0].length;
    this.height = plan.length;
    this.grid = [];
    this.actors = [];

    for (var y = 0; y < this.height; y++) {
        const line = plan[y],
              gridLine = [];
        for (var x = 0; x < this.width; x++) {
            const ch = line[x],
                  Actor = actorChars[ch];
            let fieldType = null;

            if (Actor) {
                this.actors.push(new Actor(new Vector(x,y), ch));
            } else if (ch === 'x') {
                fieldType = 'wall';
            } else if (ch === '!') {
                fieldType = 'lava';
            }
            gridLine.push(fieldType);
        }
        this.grid.push(gridLine);
    }

    this.player = this.actors.find(actor => actor.type === 'player');
    this.status = this.finishDelay = null;
}

Level.prototype.isFinished = function() {
    return this.status !== null && this.finishDelay < 0;
};

Level.prototype.obstacleAt = function(pos, size) {
    var xStart = Math.floor(pos.x),
        xEnd = Math.ceil(pos.x + size.x),
        yStart = Math.floor(pos.y),
        yEnd = Math.ceil(pos.y + size.y);

    if (xStart < 0 || xEnd > this.width || yStart < 0) { return 'wall'; }
    if (yEnd > this.height) { return 'lava'; }

    for (var y = yStart; y < yEnd; y++) {
        for (var x = xStart; x < xEnd; x++) {
            const fieldType = this.grid[y][x];
            if (fieldType) { return fieldType; }
        }
    }
};

Level.prototype.actorAt = function(actor) {
    for (var i = 0; i < this.actors.length; i++) {
        const other = this.actors[i];
        if (other != actor &&
            actor.pos.x + actor.size.x > other.pos.x &&
            actor.pos.x < other.pos.x + other.size.x &&
            actor.pos.y + actor.size.y > other.pos.y &&
            actor.pos.y < other.pos.y + other.size.y) { return other; }
    }
};

Level.prototype.animate = function(step, keys) {
    const self = this;

    if (this.status !== null) { self.finishDelay -= step; }

    function act(thisStep) {
        self.actors.forEach(actor => {
            actor.act(thisStep, self, keys);
        }, this);
    }

    while (step > 0) {
        const thisStep = Math.min(step, maxStep);
        act(thisStep);
        step -= thisStep;
    }
};

Level.prototype.playerTouched = function(type, actor) {
    if (type === 'lava' && this.status === null) {
        this.status = 'lost';
        this.finishDelay = 1;
    } else if (type === 'coin') {
        this.actors = this.actors.filter(other => actor !== other);
    }
    if (this.finishDelay === null && !this.actors.some(actor => actor.type === 'coin')) {
        this.status = 'won';
        this.finishDelay = 1;
    }
};



