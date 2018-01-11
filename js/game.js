/*jshint esversion: 6 */

const simpleLevelPlan = [
  "                      ",
  "                      ",
  "  x              = x  ",
  "  x         o o    x  ",
  "  x @      xxxxx   x  ",
  "  xxxxx            x  ",
  "      x!!!!!!!!!!!!x  ",
  "      xxxxxxxxxxxxxx  ",
  "                      "
];

const plans = [simpleLevelPlan],
      codes = { 37: 'left', 38: 'up', 39: 'right' , 27: 'pause' },
      controls = trackKeys(codes);
let paused = 0;

function trackKeys(codes) {
    const pressed = Object.create(null);

    function handler(event) {
        if (codes.hasOwnProperty(event.keyCode)) {

            if (event.key === 'Escape') {
                paused += 0.5;
                pressed[codes[event.keyCode]] = paused % 2 === 1;
                event.preventDefault();
            } else {
                const code = event.type === 'keydown';
                pressed[codes[event.keyCode]] = code;
                event.preventDefault();
            }
        }
    }
    addEventListener('keydown', handler);
    addEventListener('keyup', handler);
    return pressed;
}

function runAnimation(frameFunc) {
    let lastTime = null;

    function frame(time) {
        let stop = false;

        if (lastTime !== null) {
            const timeStep = Math.min(time - lastTime, 100) / 1000;
            stop = frameFunc(timeStep) === false;
        }
        lastTime = time;
        if (!stop) { requestAnimationFrame(frame); }
    }

    requestAnimationFrame(frame);
}

function runLevel(level, Display, andThen) {
    const display = new Display(document.body, level);

    runAnimation(function(step) {
        if (!controls.pause) {
            level.animate(step, controls);
            display.drawFrame(step);
            if (level.isFinished()) {
                display.clear();
                if (andThen) { andThen(level.status); }
                return false;
            }
        }
    });
}

function runGame(plans, Display) {
    let lives = 3;

    function startLevel(n) {
        runLevel(new Level(plans[n]), Display, function(status) {
            if (lives === 0) {
                console.log('GAME OVER');
            } else if (status === 'lost') {
                lives --;
                startLevel(n);
            } else if (n < plans.length -1) {
                startLevel(n+1);
            } else {
                console.log("YOU WIN");
            }
        });
    }
    startLevel(0);
}

// const simpleLevel = new Level(simpleLevelPlan);
// const display = new DOMDisplay(document.body, simpleLevel);

runGame(plans, DOMDisplay);
