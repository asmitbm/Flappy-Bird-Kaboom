import kaboom from "kaboom";

// initialize context
kaboom();

// load assets
loadSprite("birdy", "sprites/birdy.png");
loadSprite("bg", "sprites/bg.png");
loadSprite("pipe", "sprites/pipe.png");
loadSound("wooosh", "sounds/wooosh.mp3");
loadSound("hit", "sounds/hit.mp3");
loadSound("off", "sounds/off.mp3");
loadSound("score", "sounds/score.mp3");
loadSound("OtherworldlyFoe", "sounds/OtherworldlyFoe.mp3");

const music = play("OtherworldlyFoe", {
  loop: true, volume: 0.3});

let highScore = 0;

scene("game", () => {
 const PIPE_GAP = 120;
 let score = 0;

 add ([
   sprite("bg", {width: width(), height: height()})
 ]);

 const scoreText = add ([
   text(score, {size: 50})
 ]);

 // add a character to screen
const player = add([
	 // list of components
	 sprite("birdy"),
   scale(2),
	 pos(80, 40),
	 area(),
   body(), 
 ]);

 function producePipes() {
  const offset = rand(-50, 50);

  add ([
    sprite("pipe"),
    pos(width(), height()/2 + offset + PIPE_GAP/2),
    "pipe",
    area(),
    {'passed': false}
  ]);

  add ([
    sprite("pipe", {flipY: true}),
    pos(width(), height()/2 + offset - PIPE_GAP/2),
    origin("botleft"),
    "pipe",
    area()
  ]);
 }

 loop(2, () => {
   producePipes();
 }); 

action("pipe", (pipe) => {
   pipe.move(-150, 0);

   if (pipe.passed === false && pipe.pos.x < player.pos.x) {
     pipe.passed = true;
     score += 1;
     play("score");
     scoreText.text = score;
   }
 });

 player.collides("pipe", () => {
   play("hit");
   go("gameover", score);
 });

 player.action(() => {
   if(player.pos.y > height() + 50 || player.pos.y < -50) {
     go("gameover", score);
   }
 });

 keyPress("space", () => {
   play("wooosh");
   player.jump(300);
 });
});

scene("gameover", (score) => {
  play("off");
  if (score > highScore) {
    highScore = score;
  }

  add ([
   sprite("bg", {width: width(), height: height()})
 ]);
  
  add([
    text(
    "Gameover! \n\n" 
    + "score: " + score
    + "\n" + "high-score: " + highScore
    + "\n\n" + "press space",   
    {size: 45})
  ]);

  keyPress("space", () => {
    go("game");
  });
});

go("game"); 