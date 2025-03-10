window.onload = init;
window.onresize = resize;

var gameover = false;
var constPI = Math.PI / 180;


// fonction d 'initialisation de la partie'
function initializeGame () {
    score = 0;
    mainTank = new Tank(1, 100, 100, 50, 120, angledft, 4, 10000, "#e6a2a2", "#c06060", "#c08080");
    listEnnemisTank = [];
    for (let i = 0; i < 1; i++) { summonEnnemyTank(); }
    drawCanvasWeapon(ctxmun, mainTank.getIdMunition());
    play();
}

function resize () {
  canvas.width = window.innerWidth;
  canvas.style.left = "0px";
  canvasBackground.width = window.innerWidth;
  canvasBackground.style.left = "0px";
  canvasmun.width = window.innerWidth;
  canvasmun.style.left = "0px";

  drawBackground ();
  drawCanvasWeapon(ctxmun, mainTank.getIdMunition());
}

function init () {
  // récupération du canvas
  // création d'un objet game, qui centralisera la partie
  //let game = new Game(document.querySelector("#canvasTankilla"));
  canvas = document.querySelector("#canvasTankilla");
  canvasBackground = document.querySelector("#canvasTankillaBackGround");
  canvasmun = document.querySelector("#canvasWeapon");
  ctx = canvas.getContext("2d");
  ctxbg = canvasBackground.getContext("2d");
  ctxmun = canvasmun.getContext("2d");;

  score = 0;

  idAnim = 0;
  shoot = false;
  waitingshoot = 0;

  accid = 2;

  up = false;
  down = false;
  right = false;
  left = false;

  mouse = {
    x: 0,
    y: 0
  };

  listMunitions = [];
  angleRotation = 0;
  angleRotate = 5;

  mainTank = null;
  listEnnemisTank = [];

  angledft = 0;

  canvas.onmousemove = function(event) {
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
  }

  canvas.onmousedown = function (event) {
    if (event.button == 0)
      shoot = true;

  }
  canvas.onmouseup = function (event) {
    if (event.button == 0)
      shoot = false;
  }


  document.addEventListener ('keydown', function(event) {
    if (event.keyCode == 68) {
        // touche D
        right = true;
    }
    if (event.keyCode == 90) {
        // touche Z
        up = true;
    }
    if (event.keyCode == 81) {
        // touche Q
        left = true;
    }
    if (event.keyCode == 83) {
        // touche S
        down = true;
    }
  });

  document.addEventListener('keyup', function (event) {
    if (event.keyCode == 68) {
        // touche D
        right = false;
    }
    if (event.keyCode == 90) {
        // touche Z
        up = false;
    }
    if (event.keyCode == 81) {
        // touche Q
        left = false;
    }
    if (event.keyCode == 83) {
        // touche S
        down = false;
    }
    if (event.keyCode == 32) {
        mainTank.boost();
    }
  });

  window.addEventListener('mousewheel',function(event) {
    let acc = -1;
    if (event.deltaY < 0) {
      acc = 1;
    }
    mainTank.changeWeapon(acc);
    drawCanvasWeapon(ctxmun, mainTank.getIdMunition());
    waitingshoot = -50;
  });




  initializeGame ();
  resize();
  drawCanvasWeapon(ctxmun, mainTank.getIdMunition());
}

function play () {
  let count = 0;
  if (up && count < 2) {
    mainTank.setDy(-1 * mainTank.getSpeed());
    angleup = 270;
    count++;
  }
  else if (count < 2){
    mainTank.setDy(0);
    angleup = 0; //mainTank.getAngle();
  }

  if (down && count < 2) {
    mainTank.setDy(mainTank.getSpeed());
    angledown = 90;
    count++;
  }
  else if (!up && count < 2) {
    mainTank.setDy(0);
    angledown = 0; //mainTank.getAngle();
  }

  if (left && count < 2) {
    mainTank.setDx(-mainTank.getSpeed());
    angleleft = 180;
    count++;
  }
  else if (count < 2) {
    mainTank.setDx(0);
    angleleft = 0; //mainTank.getAngle();
  }

  if (right && count < 2) {
    mainTank.setDx(mainTank.getSpeed());
    angleright = 360;
    count++;
  }
  else if (!left && count < 2){
    mainTank.setDx(0);
    angleright = 0;// mainTank.getAngle();
  }

  if (count > 2) { count = 2; }
  if (up && down) {
    mainTank.setDy(0);
    angledown = 0;
    angleup = 0;
  }
  if (left && right) {
    mainTank.setDx(0);
    angleleft = 0;
    angleright = 0;
  }
  angledft = calcangle(mainTank, [angleup, angleleft, angleright, angledown]);



//  console.log(angleup, angleleft, angleright, angledown);


  killing ();
  summoning ();
  drawAll ();

  if (mainTank.getLife() <= 0) {

    diedMessage ();
    gameover = true;
    return;
  }
  idAnim = requestAnimationFrame(play);
}

function calcangle (tank, angles) {
  angle = 0;
  acc = 0;

  angles.forEach((ang) => {
    if (ang > 0) {
      angle += ang;
      acc ++;
    }
  });
  if (acc == 0) { acc = 1; }
  res = angle / acc - 35;
  return res;
}

function killing () {
  for (let i=listEnnemisTank.length-1; i >= 0; i--) {
    let ennemiTank = listEnnemisTank[i];
    if (ennemiTank.getLife() <= 0) {
      score++;
      listEnnemisTank.splice(i, 1);
      summonEnnemyTank();
    }
  }
}

function summoning () {
  if (shoot) {
    let listmun = mainTank.fire(mouse.x, mouse.y)
    if (listmun != null) {
      listmun.forEach((mun) => {
        listMunitions.push(mun);
      });
    }
  }
}

function summonEnnemyTank () {
  listEnnemisTank.push(new EnnemiTank (accid, 60 + Math.random() * (canvas.width - 120), 60 + Math.random() * (canvas.height - 120), 50, 120, ((Math.random() * 360/5) | 0) *5, 3, 300, "red", "blue", "darkblue"));
  accid++;
}

function drawAll () {
  // on nettoie le canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);



  // on dessine :
  // - les tanks
  listEnnemisTank.forEach((ennemiTank) => {
    ennemiTank.drawTank(ctx, mainTank.getPosX(), mainTank.getPosY());
  });
  mainTank.drawTank(ctx, mouse.x, mouse.y);
  // - les munitions
  listMunitions.forEach((munition) => {
    munition.draw(ctx);
  });


    // dessin de l'avion
    // Plane.drawPlane (ctx, 200, 200, 90);

  // on bouge
  mainTank.move();

  // création d'une super liste contenant tous les tanks actuellement à l'écran
  let listAllTanks = [];
  listAllTanks.push(mainTank);
  listEnnemisTank.forEach((tank) => {
    listAllTanks.push(tank);
  });

  // Pour chaque munition, on check si elle a touché un tank ou si elle a atteint sa limite
  for (let i = listMunitions.length -1; i >= 0; i--) {
    let munition = listMunitions[i];

    listAllTanks.forEach((ennemiTank) => {
      if (munition.touch(ennemiTank)) {
          listMunitions.splice(i, 1);
      }
    });

    if (!munition.move()) {
        listMunitions.splice(i, 1);
    }
  }

  // rotation du Tank
  if ((angledft - mainTank.getAngle())%180 != 0) {
    if (up || down || left || right) {
      mainTank.rotate(angleRotate);
    }
  }

  // maintenant, faisons tirer les tanks ennemis et faisons les bouger

  listEnnemisTank.forEach( (tank) => {
    tank.move();
  });
}

function drawBackground () {
  // on dessine le background
  ctxbg.fillStyle = "dimgrey";
  ctxbg.beginPath();
  ctxbg.fillRect(0, 0, canvas.width, canvas.height);
  ctxbg.closePath();

  ctxbg.fillStyle = "yellow";
  ctxbg.beginPath();
  ctxbg.fillRect(0, canvas.height / 2 - 5, canvas.width, 10);
  ctxbg.closePath();

  ctxbg.beginPath();
  ctxbg.fillRect(canvas.width / 2 - 5, 0, 10, canvas.height);
  ctxbg.closePath();

  ctxbg.fillStyle = "yellow";
  ctxbg.beginPath();
  ctxbg.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) *0.4, 0, Math.PI*2, false);
  ctxbg.closePath();
  ctxbg.fill();
  ctxbg.fillStyle = "darkgrey";
  ctxbg.beginPath();
  ctxbg.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) *0.38, 0, Math.PI*2, false);
  ctxbg.closePath();
  ctxbg.fill();

  ctxbg.fillStyle = "dimgrey";
  ctxbg.beginPath();
  ctxbg.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) *0.38,
          Math.PI * 1.29, Math.PI * 1.41, false);
  ctxbg.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) *0.38,
          Math.PI * 2.59, Math.PI * 2.71, false);
  ctxbg.closePath();
  ctxbg.fill();

  ctxbg.beginPath();
  ctxbg.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) *0.38,
          Math.PI * 0.79, Math.PI * 0.91, false);
  ctxbg.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) *0.38,
          Math.PI * 2.09, Math.PI * 2.21, false);
  ctxbg.closePath();
  ctxbg.fill();
}

function drawCanvasWeapon (ctx, idWeapon) {
  ctx.clearRect(0, 0, canvasmun.width, canvasmun.height);

  let posy = canvasWeapon.height / 2 + 5;

  // draw munition Normale
  MunitionNormal.drawMunition(ctx, 30, posy);
  // draw munition Grenaille
  MunitionGrenaille.drawMunition(ctx, 80, posy);
  // draw munition Fire
  MunitionFire.drawMunition(ctx, 130, posy);
  // draw munition bulle
  MunitionBulle.drawMunition(ctx, 180, posy);
  // draw munition Chevrotine
  MunitionChevrotine.drawMunition(ctx, 230, posy);
  // draw munition Amour
  MunitionLove.drawMunition(ctx, 280, posy);


  // la sélection
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(20 + idWeapon * 50, 5);
  ctx.lineTo(10 + idWeapon * 50, 5);
  ctx.lineTo(10 + idWeapon * 50, 15);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo((idWeapon+1) * 50, 15);
  ctx.lineTo((idWeapon+1) * 50, 5);
  ctx.lineTo(-10 + (idWeapon+1) * 50, 5);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-10 + (idWeapon+1) * 50, canvasWeapon.height-5);
  ctx.lineTo((idWeapon+1) * 50, canvasWeapon.height-5);
  ctx.lineTo((idWeapon+1) * 50, canvasWeapon.height-15);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(20 + idWeapon * 50, canvasWeapon.height-5);
  ctx.lineTo(10 + idWeapon * 50, canvasWeapon.height-5);
  ctx.lineTo(10 + idWeapon * 50, canvasWeapon.height-15);
  ctx.stroke();
}

function diedMessage () {
  ctx.font = "11em Arial";
  ctx.fillStyle = "skyblue";
  ctx.fillText("GAME OVER", canvas.width / 16, canvas.height / 2);
  ctx.strokeText("GAME OVER", canvas.width / 16, canvas.height / 2);
  ctx.font = "7em Arial";
  ctx.fillText("Votre score: " + score, canvas.width / 5, canvas.height * 0.8);
  ctx.strokeText("Votre score: " + score, canvas.width / 5, canvas.height * 0.8);
}

function affine (x1, y1, x2, y2) {
  return {
    a: (y2 - y1) / (x2 - x1),
    b: y1 - (x1 * (y2 - y1) / (x2 - x1)),
    fx: function(x) { return this.a * x + this.b; }
  }
}

document.addEventListener('keyup', function (event) {
  if (gameover && event.keyCode == 13) {
      gameover = false;

      initializeGame ();
  }
});
