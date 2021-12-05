var bg, bgImg;
var player, shooterImg, shooter_shooting;
var zombieImg, zombie;
var explosionSnd, explosionImg, explosion
var bullet
var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;
var gameState = "fight";
var bullets = 70;
var lives = 3;
var score = 0;
var reset;
var lose,winning,explosionSound;

function preload() {
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")
  zombieImg = loadImage("assets/zombie.png")
  explosionSnd = loadSound("assets/explosion.mp3")
  explosionImg = loadImage("assets/heart_1.png")
  bgImg = loadImage("assets/bg.jpeg");


  lose = loadSound("assets/lose.mp3")
  winning = loadSound("assets/win.mp3")
  explosionSound = loadSound("assets/explosion.mp3")

}

function setup() {


  createCanvas(windowWidth-300, windowHeight-300);

  //adding the background image
  bg = createSprite(displayWidth / 2 + 5, displayHeight / 2 - 25, 20, 20)
  bg.addImage(bgImg)
  bg.scale = 2.2


  //creating the player sprite
  player = createSprite(displayWidth - 1700, displayHeight - 300, 50, 50);
  player.addImage(shooterImg)
  player.scale = 0.5
  player.debug = true
  player.setCollider("rectangle", 0, 0, 300, 300)


  //creating sprites to depict lives remaining
  heart1 = createSprite(displayWidth - 150, 40, 20, 20)
  heart1.visible = false
  heart1.addImage("heart1", heart1Img)
  heart1.scale = 0.4

  heart2 = createSprite(displayWidth - 100, 40, 20, 20)
  heart2.visible = false
  heart2.addImage("heart2", heart2Img)
  heart2.scale = 0.4

  heart3 = createSprite(displayWidth - 150, 40, 20, 20)
  heart3.addImage("heart3", heart3Img)
  heart3.scale = 0.4
  heart3.visible = false


  //creating group for zombies    
  zombieGroup = new Group();
  bulletGroup = new Group();
}

function draw() {
  background(0);


  if (gameState === "fight") {

    //displaying the appropriate image according to lives reamining
    if (lives === 3) {
      heart3.visible = true
      heart1.visible = false
      heart2.visible = false
    }
    if (lives === 2) {
      heart2.visible = true
      heart1.visible = false
      heart3.visible = false
    }
    if (lives === 1) {
      heart1.visible = true
      heart3.visible = false
      heart2.visible = false
    }

    //go to gameState "lost" when 0 lives are remaining
    if (lives === 0) {
      gameState = "lost"
      heart1.visible = false
      heart3.visible = false
      heart2.visible = false

    }
    //moving the player up and down and making the game mobile compatible using touches
    if (keyDown("UP_ARROW") || touches.length > 0) {
      player.y = player.y - 30
    }
    if (keyDown("DOWN_ARROW") || touches.length > 0) {
      player.y = player.y + 30
    }


    //release bullets and change the image of shooter to shooting position when space is pressed
    if (keyWentDown("space") || touches.length > 0) {
      bullet = createSprite(displayWidth - 1150, player.y - 30, 20, 10)
      bullet.velocityX = 20;

      bulletGroup.add(bullet)
      player.depth = bullet.depth
      player.depth = player.depth + 2
      player.addImage(shooter_shooting)
      bullets = bullets - 1;
      explosionSound.play();
    }

    //player goes back to original standing image once we stop pressing the space bar
    else if (keyWentUp("space")) {
      player.addImage(shooterImg)
    }

    //go to gameState "bullet" when player runs out of bullets
    if (bullets == 0) {
      gameState = "bullet";
      lose.play();

    }

    //destroy the zombie when bullet touches it
    if (zombieGroup.isTouching(bulletGroup)) {
      for (var i = 0; i < zombieGroup.length; i++) {

        if (zombieGroup[i].isTouching(bulletGroup)) {
          zombieGroup[i].destroy()
          bulletGroup.destroyEach()
          score = score + 2;
        }

      }
    }

    //destroy zombie when player touches it
    if (zombieGroup.isTouching(player)) {

      for (var i = 0; i < zombieGroup.length; i++) {

        if (zombieGroup[i].isTouching(player)) {
          zombieGroup[i].destroy()

          lives = lives - 1;
        }

      }
    }
    //go to the gameState won if th escore reaches to 100

    if (score == 100) {
      gameState = "won";
      winning.play ();

    }

    //calling the function to spawn zombies
    enemy();
  }

  drawSprites();

  //displaying the score and remaining lives and bullets
  textSize(20)
  fill("black")
  text("Bullets = " + bullets, displayWidth/2 - 610, displayHeight / 2 - 450)
  text("Score = " + score, displayWidth/2 - 610, displayHeight / 2 - 420)
  text("Lives = " + lives, displayWidth/2- 610, displayHeight / 2 - 390)

  //destroy zombie and player and display a message in gameState "lost"
  if (gameState == "lost") {

    textSize(100)
    fill("red")
    text("You Lost ", 400, 400)
    zombieGroup.destroyEach();
    player.destroy();
   // gameState = "restart";

  }

  //destroy zombie and player and display a message in gameState "won"
  else if (gameState == "won") {

    textSize(100)
    fill("yellow")
    text("You Won ", 400, 400)
    zombieGroup.destroyEach();
    player.destroy();

  }

  //destroy zombie, player and bullets and display a message in gameState "bullet"
  else if (gameState == "bullet") {

    textSize(70)
    fill("yellow")
    text("You ran out of bullets!!!", displayWidth / 2 - 100, displayHeight / 2 + 50);
    zombieGroup.destroyEach();
    player.destroy();
    bulletGroup.destroyEach();
  //  gameState ="restart"

  }
 /* else if (gameState =="restart"){
    var restart = createSprite(width/2,heigth/2,50,50);
    restart.shapeColor ="red";
    if(mousePressedOver(restart)){
      gameState ="fight";
    }
  }*/

}

function enemy() {
  if (frameCount % 80 == 0) {
    // creating zombie sprite
    zombie = createSprite(random(displayWidth + 10, displayWidth + 80), random(displayHeight - 100, displayHeight - 850), 50, 50)
    zombie.addImage(zombieImg)
    zombie.scale = 0.15;
    //zombie.lifetime = 600;
    zombie.velocityX = -3;
    zombieGroup.add(zombie)
  }
}
/*if (bulletGroup.isTouching(zombieGroup))
  score=score+1*/



