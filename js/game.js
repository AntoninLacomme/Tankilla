window.onload = init;

var gameover = false;
var constPI = Math.PI / 180;


// fonction d 'initialisation de la partie'
function initializeGame () {
    mainTank = new Tank(1, 100, 100, 50, 120, angledft, 4, 10000, "#e6a2a2", "#c06060", "#c08080");
    listEnnemisTank = [];
    for (let i = 0; i < 1; i++) { summonEnnemyTank(); }
    play();
}


function init () {
  // récupération du canvas
  // création d'un objet game, qui centralisera la partie
  //let game = new Game(document.querySelector("#canvasTankilla"));
  canvas = document.querySelector("#canvasTankilla");
  canvasmun = document.querySelector("#canvasWeapon");

  ctx = canvas.getContext("2d");
  ctxmun = canvasmun.getContext("2d");

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


  initializeGame();
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
  for (let i=0; i < listEnnemisTank.length; i++) {
    let ennemiTank = listEnnemisTank[i];
    if (ennemiTank.getLife() <= 0) {
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

  // on dessine le background
  ctx.fillStyle = "dimgrey";
  ctx.beginPath();
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.closePath();

  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.fillRect(0, canvas.height / 2 - 5, canvas.width, 10);
  ctx.closePath();

  ctx.beginPath();
  ctx.fillRect(canvas.width / 2 - 5, 0, 10, canvas.height);
  ctx.closePath();

  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) *0.4, 0, Math.PI*2, false);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "darkgrey";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) *0.38, 0, Math.PI*2, false);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "dimgrey";
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) *0.38,
          Math.PI * 1.29, Math.PI * 1.41, false);
  ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) *0.38,
          Math.PI * 2.59, Math.PI * 2.71, false);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) *0.38,
          Math.PI * 0.79, Math.PI * 0.91, false);
  ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) *0.38,
          Math.PI * 2.09, Math.PI * 2.21, false);
  ctx.closePath();
  ctx.fill();



  // on dessine :
  // - le tank
  mainTank.drawTank(ctx, mouse.x, mouse.y);

  listEnnemisTank.forEach((ennemiTank) => {
    ennemiTank.drawTank(ctx, mainTank.getPosX(), mainTank.getPosY());
  });
  // - les munitions
  listMunitions.forEach((munition) => {
    munition.draw(ctx, mouse.x, mouse.y);
  });

  // on bouge
  mainTank.move();

  // création d'une super liste contenant tous les tanks actuellement à l'écran
  let listAllTanks = [];
  listAllTanks.push(mainTank);
  listEnnemisTank.forEach((tank) => {
    listAllTanks.push(tank);
  });

  // pour chacun de ces tanks, on ckeck si une munition les a touché
  for (let i = 0; i < listMunitions.length; i++) {
    let munition = listMunitions[i];
    listAllTanks.forEach((ennemiTank) => {
      if (munition.getIdTank() != ennemiTank)
      if (munition.touch(ennemiTank)) {
        listMunitions.splice(i, 1);
      }
      else {
        if (!munition.move()) {
          listMunitions.splice(i, 1);
        }
      }
    });
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

function drawCanvasWeapon (ctx, idWeapon) {
  ctx.clearRect(0, 0, canvasmun.width, canvasmun.height);
  // draw munition Normale
  ctx.fillStyle = "black";
  ctx.beginPath();
  let posx = 30;
  let posy = canvasWeapon.height / 2 + 5;
  let angle = -90;

  ctx.moveTo(posx + 10 * Math.cos((angle + 45) * Math.PI / 180), posy + 10 * Math.sin((angle + 45) * Math.PI / 180));
  ctx.lineTo(posx + 10 * Math.cos((angle + 45) * Math.PI / 180), posy + 10 * Math.sin((angle + 45) * Math.PI / 180));
  ctx.lineTo(posx + 10 * Math.cos((angle + 90 + 45) * Math.PI / 180), posy + 10 * Math.sin((angle +90 + 45) * Math.PI / 180));
  ctx.lineTo(posx + 10 * Math.cos((angle + 180 + 45) * Math.PI / 180), posy + 10 * Math.sin((angle + 180 + 45) * Math.PI / 180));
  ctx.lineTo(posx + 10 * Math.cos((angle + 270 + 45) * Math.PI / 180), posy + 10 * Math.sin((angle + 270 + 45) * Math.PI / 180));
  ctx.lineTo(posx + 15 * Math.cos((angle + 0) * Math.PI / 180), posy + 15 * Math.sin((angle + 0) * Math.PI / 180));

  ctx.closePath();
  ctx.fill();


  // draw munition Grenaille
  posx = 80;
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(posx, posy, 2, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();


  // draw munition Fire
  posx = 130;
  let radius = 10;
  ctx.fillStyle = "rgb(255,255,0)";
  ctx.beginPath();
  ctx.arc(posx, posy, radius, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();

  // draw munition bulle
  posx = 180;
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.arc(posx, posy, radius, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.stroke();

  // draw munition Amour
  posx = 230;
  ctx.fillStyle = "rgb(255, 200 ,200)";
  // dessinons la base, un carré
  ctx.beginPath();

  ctx.moveTo(posx + 20 * Math.cos((angle) * Math.PI / 180), posy + 20 * Math.sin((angle) * Math.PI / 180));
  ctx.lineTo(posx + 20 * Math.cos((angle + 90) * Math.PI / 180), posy + 20 * Math.sin((angle +90) * Math.PI / 180));

  ctx.lineTo(posx + 20 * Math.cos((angle + 180) * Math.PI / 180), posy + 20 * Math.sin((angle + 180) * Math.PI / 180));
  ctx.lineTo(posx + 20 * Math.cos((angle + 270) * Math.PI / 180), posy + 20 * Math.sin((angle + 270) * Math.PI / 180));


  ctx.closePath();
  ctx.fill();
  // puis les deux cercles qui feront les oreilles

  // Math.sqrt(200) = 14.14
  ctx.beginPath();
  ctx.arc(posx + 9, posy - 9, 14, Math.PI * 0.25, Math.PI * 1.25, true);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(posx - 10, posy - 10, 14, Math.PI * 1.75, Math.PI*2.75, true);
  ctx.closePath();
  ctx.fill();



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
  ctx.fillStyle = "red";
  ctx.fillText("GAME OVER", canvas.width / 16, canvas.height / 2);
  ctx.strokeText("GAME OVER", canvas.width / 16, canvas.height / 2);
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
