

class Tank {

  // constructeur de la classe
  constructor (idTank, x, y, width, height, angle, speed, hp, colorbody, colortourelle, colorwait) {
    // l'id de notre tank
    this.idTank = idTank;

    // les couleurs
    this.colorbody = colorbody;
    this.colortourelle = colortourelle;
    this.colorwait = colorwait;

    // centre de rotation du tank
    this.posx = x;
    this.posy = y;
    // largeur
    this.width = width;
    // hauteur
    this.height = height;

    // pvs max
    this.maxlife = hp;
    // pvs actuels
    this.actuallife = this.maxlife;
    // vitesse
    this.speed = speed;
    this.timespeed = 0;
    this.timeAfterBoost = 200;

    // rayon maximal, utilisé pour le corps
    this.radius = Math.max(width, height) / 2;
    // rayon minimal, utilisé pour la tourelle
    this.minradius = Math.min(width, height) /2;

    // angle de rotation
    this.angle = angle - 0;

    // vecteur en x et y
    this.dx = 0;
    this.dy = 0;

    // munition à tirer
    this.munitions = [];
    this.idMunition = 0;
    this.timeBeforeFire = 0;
    this.accTimeBeforeFire = 0;
    // calcul pour les chenilles
    this.arrayChenilles = {};
    this.setArrayChenille ();

    // calcul pour le corps
    this.arrayBody = {};
    this.limites = {};
    this.setArrayBody ();

    this.calcLimites();
  }

  setArrayChenille () {
    let radChenille = this.radius * 0.95;
    let rangle = 125;
    let cangle = 25 ;
    // définition des points de rotation
    // on supprime la partie double, travailler avec des ints suffit, on ne peut pas allumer 1.1 pixel sur lécran
    this.arrayChenilles.cxleft = this.minradius * Math.cos((this.angle + rangle) * constPI) | 0;
    this.arrayChenilles.cyleft = this.minradius * Math.sin((this.angle + rangle) * constPI) | 0;
    this.arrayChenilles.cxright = this.minradius * Math.cos((this.angle + rangle + 180) * constPI) | 0;
    this.arrayChenilles.cyright = this.minradius * Math.sin((this.angle + rangle + 180) * constPI) | 0;
    this.arrayChenilles.firstPointX = radChenille * Math.cos((this.angle + cangle) * constPI) | 0;
    this.arrayChenilles.firstPointY = radChenille * Math.sin((this.angle + cangle) * constPI) | 0;
    this.arrayChenilles.twoPointX = radChenille * Math.cos((this.angle + 90 + cangle -70) * constPI) | 0;
    this.arrayChenilles.twoPointY = radChenille * Math.sin((this.angle + 90 + cangle -70) * constPI) | 0;
    this.arrayChenilles.threePointX = radChenille * Math.cos((this.angle + 180 + cangle) * constPI) | 0;
    this.arrayChenilles.threePointY = radChenille * Math.sin((this.angle + 180 + cangle) * constPI) | 0;
    this.arrayChenilles.fourPointX = radChenille * Math.cos((this.angle + 270 +cangle -70) * constPI) | 0;
    this.arrayChenilles.fourPointY = radChenille * Math.sin((this.angle + 270 + cangle -70) * constPI) | 0;
  }

  setArrayBody () {
    this.arrayBody.firstPointX = this.radius * Math.cos(this.angle * constPI) | 0;
    this.arrayBody.firstPointY = this.radius * Math.sin(this.angle * constPI) | 0;
    this.arrayBody.twoPointX = this.radius * Math.cos((this.angle + 70) * constPI) | 0;
    this.arrayBody.twoPointY = this.radius * Math.sin((this.angle + 70) * constPI) | 0;
    this.arrayBody.threePointX = this.radius * Math.cos((this.angle + 180) * constPI) | 0;
    this.arrayBody.threePointY = this.radius * Math.sin((this.angle + 180) * constPI) | 0;
    this.arrayBody.fourPointX = this.radius * Math.cos((this.angle + 250) * constPI) | 0;
    this.arrayBody.fourPointY = this.radius * Math.sin((this.angle + 250) * constPI) | 0;
  }

  calcLimites () {
    this.limites.l1 = affine(this.arrayBody.firstPointX, this.arrayBody.firstPointY, this.arrayBody.twoPointX, this.arrayBody.twoPointY);
    this.limites.l2 = affine(this.arrayBody.firstPointX, this.arrayBody.firstPointY, this.arrayBody.fourPointX, this.arrayBody.fourPointY);
    this.limites.l3 = affine(this.arrayBody.threePointX, this.arrayBody.threePointY, this.arrayBody.twoPointX, this.arrayBody.twoPointY);
    this.limites.l4 = affine(this.arrayBody.threePointX, this.arrayBody.threePointY, this.arrayBody.fourPointX, this.arrayBody.fourPointY);
  }

  changeWeapon (acc) {
    this.idMunition += acc;
    if (this.idMunition < 0)
      this.idMunition = 4;
    if (this.idMunition > 4)
      this.idMunition = 0;
  }

  getArrayBody () {
    return this.arrayBody;
  }

  getLimites () {
    return this.limites;
  }

  getIdTank () { return this.idTank; }

  getSpeed() { return this.speed; }

  getAngle () { return this.angle; }

  getHeight () { return this.radius; }

  getWidth () { return this.minradius; }

  getPosX () { return this.posx; }

  getPosY () { return this.posy; }

  getLife () { return this.actuallife; }

  getAngleCanon (visex, visey) {
    let anglecanon = Math.atan( (visey - this.posy) / (visex - this.posx) ) * 180 / Math.PI;    // son angle
    if (visex >= this.posx) {
        anglecanon += 180;
    }
    return anglecanon;
  }

  getIdMunition () {
    return this.idMunition;
  }

  getAllMunitions () {
    return this.munitions;
  }

  getTimeReset () {
    return this.timeBeforeFire;
  }

  setTimeReset (time) { this.timeBeforeFire = time; }

  setDx (x) { this.dx = x; }
  setDy (y) { this.dy = y; }

  knockBack (x, y) {
    this.posx += x;
    this.posy += y;
    this.setPositionInCanvas ();
  }

  boost () {
    if (this.timeAfterBoost == 200) {
      this.timeAfterBoost = 0;
      this.timespeed = 30;
    }
  }

  setPositionInCanvas () {
    if (this.posx < this.radius) { this.posx = this.radius; }
    if (this.posx > canvas.width - this.radius) { this.posx = canvas.width - this.radius; }
    if (this.posy < this.radius) { this.posy = this.radius; }
    if (this.posy > canvas.height - this.radius) { this.posy = canvas.height - this.radius; }
  }


  // fonction infligeant des dégâts au tank
  doDamages (damages) {
    this.actuallife -= damages;
    if (this.actuallife < 0) { this.actuallife = 0; }
    if (this.actuallife > this.maxlife) { this.actuallife = this.maxlife; }
  }

  // fonction rajoutant un angle à l'angle actuel
  rotate (ang) {
    this.angle += ang;
    if (this.angle < -180) { this.angle += 360; }
    if (this.angle > 180) { this.angle -= 360; }
    this.setArrayChenille();
    this.setArrayBody();
    this.calcLimites();
  }

  drawTank (ctx, visex, visey) {
    // on dessine le tank
    // on commence par dessiner les chenilles
    // on défini la longueur des chenilles

    // définition du centre de rotation de la chenille gauche
    let centXleft = this.posx + this.arrayChenilles.cxleft;
    let centYleft = this.posy + this.arrayChenilles.cyleft;
    // définition du centre de rotation de la chenille droite
    let centXright = this.posx + this.arrayChenilles.cxright;
    let centYright = this.posy + this.arrayChenilles.cyright;

    // dessin de la chenille gauche

    ctx.fillStyle = 'grey';
    ctx.beginPath();
    ctx.moveTo(centXleft + this.arrayChenilles.firstPointX, centYleft + this.arrayChenilles.firstPointY);
    ctx.lineTo(centXleft + this.arrayChenilles.twoPointX, centYleft + this.arrayChenilles.twoPointY);
    ctx.lineTo(centXleft + this.arrayChenilles.threePointX, centYleft + this.arrayChenilles.threePointY);
    ctx.lineTo(centXleft + this.arrayChenilles.fourPointX, centYleft + this.arrayChenilles.fourPointY);
    ctx.closePath();
    ctx.fill();
    // dessin de la chenille droite
    ctx.beginPath();
    ctx.moveTo(centXright + this.arrayChenilles.firstPointX, centYright + this.arrayChenilles.firstPointY);
    ctx.lineTo(centXright + this.arrayChenilles.twoPointX, centYright + this.arrayChenilles.twoPointY);
    ctx.lineTo(centXright + this.arrayChenilles.threePointX, centYright + this.arrayChenilles.threePointY);
    ctx.lineTo(centXright + this.arrayChenilles.fourPointX, centYright + this.arrayChenilles.fourPointY);
    ctx.closePath();
    ctx.fill();


    // on dessine le corps principal
    ctx.fillStyle = this.colorbody;
    ctx.beginPath();
    ctx.moveTo(this.posx + this.arrayBody.firstPointX, this.posy + this.arrayBody.firstPointY);
    ctx.lineTo(this.posx + this.arrayBody.twoPointX, this.posy + this.arrayBody.twoPointY);
    ctx.lineTo(this.posx + this.arrayBody.threePointX, this.posy + this.arrayBody.threePointY);
    ctx.lineTo(this.posx + this.arrayBody.fourPointX, this.posy + this.arrayBody.fourPointY);
    ctx.closePath();
    ctx.fill();

    // on dessine le canon
    let lghcanon = (this.radius + this.minradius) * 0.8;    // sa longueur
    let anglecanon = this.getAngleCanon(visex, visey);
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(this.posx, this.posy);
    ctx.lineTo(this.posx + lghcanon * Math.cos((anglecanon + 172) * constPI), this.posy + lghcanon * Math.sin((anglecanon + 172) * constPI));
    ctx.lineTo(this.posx + lghcanon * Math.cos((anglecanon + 188) * constPI), this.posy + lghcanon * Math.sin((anglecanon + 188) * constPI));
    ctx.closePath();
    ctx.fill();


    // on dessine la tourelle
    ctx.fillStyle = this.colortourelle;
    if (this.timeAfterBoost > 0 && this.timeAfterBoost < 200) {
      ctx.fillStyle = this.colorwait;
    }
    ctx.beginPath();
    ctx.arc(this.posx, this.posy, this.minradius, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    // puis le timer du dash
    if (this.timeAfterBoost > 0 && this.timeAfterBoost < 200) {
      ctx.fillStyle = this.colortourelle;
      ctx.beginPath();
      ctx.moveTo(this.posx, this.posy);
      ctx.arc(this.posx, this.posy, this.minradius, 0, Math.PI * this.timeAfterBoost / 100, false);
      ctx.lineTo(this.posx, this.posy);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    // enfin, on dessine la barre de vie

    ctx.fillStyle = 'red';
    ctx.fillRect(this.posx - this.minradius*2, this.posy - this.radius - 20, this.minradius * 4, 5);
    ctx.fillStyle = 'green';
    ctx.fillRect(this.posx - this.minradius*2, this.posy - this.radius - 20, (this.minradius * 4) * (this.actuallife / this.maxlife), 5);
  }

  move () {
    // timer avant le prochain dash
    if (this.timeAfterBoost < 200) {
      this.timeAfterBoost++;
    }

    // si l'on en est en plain dash
    if (this.timespeed > 0) {
      this.timespeed--;
      this.dx *= 3;
      this.dy *= 3;
    }

    if (this.accTimeBeforeFire > 0) {
      this.accTimeBeforeFire--;
    }
    this.posx += this.dx;
    this.posy += this.dy;
    this.calcLimites();
    this.setPositionInCanvas();
  }

  fire (visex, visey) {
    if (this.accTimeBeforeFire == 0) {
      let lghcanon = (this.radius + this.minradius) * 0.8;
      let anglecanon = this.getAngleCanon(visex, visey);
      let newMunition = [];
      if (this.idMunition == 0) {
        newMunition.push(new MunitionNormal (this.idTank, this.posx, this.posy, lghcanon * Math.cos((anglecanon + 180) * Math.PI / 180), lghcanon * Math.sin((anglecanon + 180) * Math.PI / 180), visex, visey));
      }
      if (this.idMunition == 1) {
        for (let i = 0; i < 16; i++)
        newMunition.push(new MunitionGrenaille (this.idTank, this.posx, this.posy,  lghcanon * Math.cos((anglecanon + 180) * Math.PI / 180), lghcanon * Math.sin((anglecanon + 180) * Math.PI / 180), visex, visey));
      }
      if (this.idMunition == 2) {
        for (let i = 0; i < 2; i++)
          newMunition.push(new MunitionFire (this.idTank, this.posx, this.posy, lghcanon * Math.cos((anglecanon + 180) * Math.PI / 180), lghcanon * Math.sin((anglecanon + 180) * Math.PI / 180), visex, visey));
      }
      if (this.idMunition == 3) {
        newMunition.push(new MunitionBulle (this.idTank, this.posx, this.posy, lghcanon * Math.cos((anglecanon + 180) * Math.PI / 180), lghcanon * Math.sin((anglecanon + 180) * Math.PI / 180), visex, visey));
      }
      if (this.idMunition == 4) {
        newMunition.push(new MunitionLove (this.idTank, this.posx, this.posy, lghcanon * Math.cos((anglecanon + 180) * Math.PI / 180), lghcanon * Math.sin((anglecanon + 180) * Math.PI / 180), visex, visey));
      }
      this.timeBeforeFire = newMunition[0].getTimeReset();
      this.accTimeBeforeFire = this.timeBeforeFire;
      return newMunition;
    }
    return null;
  }
}
