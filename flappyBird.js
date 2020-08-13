"use strict";

const cv = document.getElementById("game");
const ct = cv.getContext("2d");
const fps = 50;
const birdNum = 20;
var gameStarted = false;
var score = 0;
const wallStartNum = 5;
const hard = 1500;
var walls = [];
var wallsCopy = []
var produceWall = false;
var firstInter;
var gameOverBol = false;

const gameProp = {
  w:cv.width,
  h:cv.height,
  c:"white",
  bw:cv.width/130,
  bc:"black"
}

const birdProp = {
  x:gameProp.w/birdNum,
  y:gameProp.h/2 - gameProp.h/birdNum/2,
  w:gameProp.w/birdNum,
  h:gameProp.h/birdNum,
  c:gameProp.bc,
  v:gameProp.h/60,
  jumpD:gameProp.h/6,
  rightD:gameProp.w/12
}

const wallProp = {
  sep:cv.width/5,
  x:cv.width - cv.width/10,
  y:0,
  w:cv.width/50,
  ws:birdProp.h*7, //wall Sep
  v:birdProp.v/6.5,
  c:"red"
}

const drawRect = (x,y,w,h,c) =>{
  ct.fillStyle = c;
  ct.fillRect(x,y,w,h);
}

class game{
  constructor(w,h,c,bw,bc){ //game width, game height, wall width, wall height,bird width, bird height, border color, background color, wall color, bird color
    this.w = w;
    this.h = h;
    this.c = c;
    this.bw = bw;
    this.bc = bc;
  }

  gameOver(){
    gameStarted = false;
    gameOverBol = true;
    drawRect(ga.bw,ga.bw,ga.w - 2*ga.bw,ga.h - 2*ga.bw,"white");
    ct.fillStyle = this.bc;
    ct.font = cv.width/27+"px sans-serif";
    ct.fillText("Game Over Refresh Page To Play Again Your Score: "+score,7*ga.bw,12*ga.bw,cv.width-2*ga.bw,cv.height-2*ga.bw,"white");
  }

  cleanStartText(){
    drawRect(cv.width/3.8,cv.width/20,300,50,"white");
  }

  drawStartText(){
    ct.fillStyle = this.bc;
    ct.font = cv.width/25+"px sans-serif";
    ct.fillText("Click Space to Start Game",cv.width/3.8,cv.width/10);
  }

  cleanScore(x,y,w,h){
    drawRect(x,y,w,h,this.c);
  }

  drawScore(num){
    this.cleanScore(this.w - this.bw+8 - cv.width/10,this.bw+1,cv.width/12,cv.width/17); //taştığı için ekleme çıkartmalar
    let x;
    if(num<10){
      x = cv.width - cv.width/25;
    }
    else if(10<=num && num<100){
      x = cv.width - cv.width/17;
    }
    else if(100<=num && num<1000){
      x = cv.width - cv.width/13
    }
    else{
      x = cv.width - cv.width/10
    }

    ct.fillStyle = this.bc;
    ct.font = cv.width/25+"px sans-serif";
    ct.fillText(num,x,cv.width/20);
  }

  drawObjectStart(){
    //game back-ground
    drawRect(0,0,ga.w,ga.h,ga.c);
    //border - top
    drawRect(0,0,ga.w,ga.bw,ga.bc);
    //border - right
    drawRect(ga.w-ga.bw,0,ga.bw,ga.h,ga.bc);
    //border - bottom
    drawRect(0,ga.h-ga.bw,ga.w,ga.bw,ga.bc);
    //border - left
    drawRect(0,0,ga.bw,ga.h,ga.bc);
  }
}

class bird{
  constructor(x,y,w,h,c,v,jumpD,rightD){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.v = v;
    this.changedV = v;

    this.jumpD = jumpD;
    this.beforeYjump = this.y;
    this.jumpWorking = false;
    this.jumpAgain = false;
    this.jumpVdecrease = 14;

    this.rightNum = 10;
    this.rightD = rightD;
    this.beforeXright = this.x;
    this.rightWorking = false;
    this.rightAgain = false;
    this.changedVright = v;

    this.leftD = rightD;
    this.beforeXleft = this.x;
    this.leftWorking = false;
    this.leftAgain = false;
    this.changedVleft = v;
  }

  drawObjectStart(){
    drawRect(this.x,this.y,this.w,this.h,this.c);
  }

  draw(x,y){
    drawRect(x,y,this.w,this.h,this.c);
  }

  clear(x,y){
    drawRect(x,y,this.w,this.h+1.7,ga.c);
  }

  moveFall(){
    let inter = setInterval(() =>{
      if(!this.jumpAgain){
        if(this.y <= ga.h - 3*(br.h/2)-br.w/10){
          this.clear(this.x,this.y-1); //taşıyor ondan 1 eklendi
          this.y+=this.changedV;
          if(this.changedV <= this.v)
            this.changedV = this.jumpVdecrease*this.changedV/(this.jumpVdecrease-1)
          this.draw(this.x,this.y);
      }
      else{
        clearInterval(inter);
        this.jumpWorking = false;
        this.changedV = this.v
        return true;
      }
    }
    else{
      clearInterval(inter);
      this.jumpAgain = false;
      this.changedV = this.v
      this.moveJump();
      return true;
    }
  },1000/fps);
}

  moveJump(){
    this.jumpWorking = true;
    this.beforeYjump = this.y;

    let inter = setInterval(() =>{
      if(!this.jumpAgain){
        if(this.beforeYjump - this.y <= this.jumpD && this.y >= this.h/2){
          this.clear(this.x,this.y+1); //taşıyor ondan 1 eklendi
          this.y-=this.changedV;
          if(this.changedV > 1)
            this.changedV = (this.jumpVdecrease-1)*this.changedV/this.jumpVdecrease
          this.draw(this.x,this.y);
        }
        else{
          clearInterval(inter);
          this.moveFall();
          return true;
        }
      }
      else{
        clearInterval(inter);
        this.jumpAgain = false;
        this.changedV = this.v;
        this.moveJump();
        return true;
      }
    },1000/fps);
  }

  moveRight(){
    this.rightWorking = true;
    this.beforeXright = this.x;

    let inter = setInterval(() =>{
      if(!this.rightAgain){
        if(this.x - this.beforeXright <= this.rightD - this.w && this.x + wallProp.sep < ga.w){
          this.clear(this.x,this.y-1); //taşıyor ondan 1 eklendi
          this.x+=this.changedVright;
          if(this.changedVright > 1)
            this.changedVright = (this.rightNum-1)*this.changedVright/(this.rightNum-1);
          this.draw(this.x,this.y);
        }
        else{
          clearInterval(inter);
          this.rightAgain = false;
          this.changedVright = this.v;
          this.rightWorking = false;
          return true;
        }
      }
      else{
        clearInterval(inter);
        this.rightAgain = false;
        this.changedVright = this.v;
        this.moveRight();
        return true;
      }
    },1000/fps);
  }

  moveLeft(){
    this.leftWorking = true;
    this.beforeXleft = this.x;

    let inter = setInterval(() =>{
      if(!this.leftAgain){
        if(this.beforeXleft - this.x <= this.leftD && this.x - this.w/2 > 0){
          this.clear(this.x,this.y-1); //taşıyor ondan 1 eklendi
          this.x-=this.changedVleft;
          if(this.changedVleft > 1)
            this.changedVleft = (this.rightNum-1)*this.changedVleft/(this.rightNum-1);
          this.draw(this.x,this.y);
        }
        else{
          clearInterval(inter);
          this.leftAgain = false;
          this.changedVleft = this.v;
          this.leftWorking = false;
          return true;
        }
      }
      else{
        clearInterval(inter);
        this.leftAgain = false;
        this.changedVleft = this.v;
        this.moveLeft();
        return true;
      }
    },1000/fps);
  }
}

class wall{
  constructor(x,y,w,ws,v,c){
    this.x = x;
    this.upY = y;
    this.downY = y;
    this.w = w;
    this.ws = ws;
    this.v = v;
    this.c = c;
    this.randomY = 0;
  }

  clear(){
    this.upY = ga.bw;
    this.downY = ga.bw + this.randomY + this.ws;
    let downH = ga.w - this.downY - ga.bw;
    drawRect(this.x - 2,this.upY+0.4,this.w + 3,this.randomY+1.5,ga.c); //taştığı için 1 eklendi
    drawRect(this.x - 1,this.downY-1,this.w + 2,downH,ga.c); //taştığı için 1 eklendi
  }

  draw(){
    if(gameStarted){
      this.upY = ga.bw;
      this.downY = ga.bw + this.randomY + this.ws;
      let downH = ga.w - this.downY - ga.bw;
      drawRect(this.x,this.upY+1,this.w,this.randomY,this.c); //taştığı için 1 eklendi
      drawRect(this.x,this.downY,this.w,downH-1.4,this.c); //taştığı için  eklendi
    }
  }

  createWall(){
    this.randomY = Math.random()*(ga.h-ga.bw-this.ws);
    this.draw();
  }

  check(){  //kontrol yazılacak
    if((br.x + br.w)-this.x > 0 && (br.x + br.w)-this.x < br.w && br.y - (this.upY + this.randomY) > 0 && this.downY - (br.y + br.h) > 0){ //x denk ise, y denk ise
      return true;
    }
    //(br.x + br.w) - this.x > 0 && (br.x + br.w) - this.x < br.w &&
    else if(br.y - (this.upY + this.randomY) < 0 && (br.x + br.w) - this.x > 0 && (br.x + br.w) - this.x < br.w || this.downY - (br.y + br.h) < 0 && (br.x + br.w) - this.x > 0 && (br.x + br.w) - this.x < br.w){
      return false;
    }
  }

  move(){ //farklı her bir wall için hareket yazılacak
    let first = true;
      let inter = setInterval(() =>{
        if(gameStarted){
          if(this.x > 3*(this.w/5)){
            if(this.check() && first == true){
              first = false;
              score+=5;
              ga.drawScore(score);
            }

            if(this.check() == false){
              ga.gameOver();
              clearInterval(inter);
              produceWall = false;
              return true;
            }

            this.clear();
            this.x-=this.v;
            this.draw();
          }
          else{
            this.clear();
            clearInterval(inter);
            produceWall = true;
            return true;
          }
      }
    },1000/fps);
  }

  start(){
    this.createWall();
    this.move();
  }
}

//init
const ga = new game(gameProp.w,gameProp.h,gameProp.c,gameProp.bw,gameProp.bc);
const br = new bird(birdProp.x,birdProp.y,birdProp.w,birdProp.h,birdProp.c,birdProp.v,birdProp.jumpD,birdProp.rightD);

const startGameArea = () =>{
  ga.drawObjectStart();
  br.drawObjectStart();
  ga.drawStartText();
}

const keyEvent = (e) =>{
  if(!gameOverBol){
    if(e.key == " "){
      gameStarted = true;
      if(br.jumpWorking == true){
        br.jumpAgain = true;
      }
      else{
        br.moveJump();
      }
    }
    if(gameStarted){
      if(e.key == "ArrowRight"){
        if(!br.leftWorking){
          if(br.rightWorking == true){
            br.rightAgain = true;
          }
          else{
            br.moveRight();
          }
        }
      }
      else if(e.key == "ArrowLeft"){
        if(!br.rightWorking){
          if(br.leftWorking == true){
            br.leftAgain = true;
          }
          else{
            br.moveLeft();
          }
        }
      }
    }
  }
}


const startWallsFirst = () =>{ //wallStartNum kadar wall üretilecek
  for(let i = 0;i<wallStartNum;i++){
    if(gameStarted){
      setTimeout(() =>{
        walls.push(new wall(wallProp.x,wallProp.y,wallProp.w,wallProp.ws,wallProp.v,wallProp.c));
        wallsCopy.push(walls[i]);
        walls[i].start();
      },i*hard);
    }
  }
}

const controlWalls = () =>{ //walls array wallsCopy ye kopyalanacak ama sonuncu element i kopyalanmayacak onun yerine sonuncu elementine yeni wall objesi koyulacak
  if(gameStarted){
    if(produceWall){
      produceWall = false;
      for(let i = 0;i<walls.length-1;i++){
        wallsCopy[i] = walls[i+1];
        walls[i] = wallsCopy[i];
      }
      walls.push(new wall(wallProp.x,wallProp.y,wallProp.w,wallProp.ws,wallProp.v,wallProp.c));
      wallsCopy[walls.length-1] = walls[walls.length-1];
      walls[walls.length-1].start();
    }
  }
}

const afterGamestarted = () =>{
  if(gameStarted){
    ga.cleanStartText();
    ga.drawScore(score);
    clearInterval(firstInter);
    startWallsFirst();
    setInterval(controlWalls,hard);
  }
}

const startGame = () =>{
  startGameArea();
  document.addEventListener("keydown",keyEvent);
  firstInter = setInterval(afterGamestarted,10);
}

startGame();
