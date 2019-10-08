
class Munition {

  constructor (idTank, name, timereset, power, posx, posy, visex, visey) {
    this.idTank = idTank;         // l'id du tank ayant invoqué la munition
    this.name = name;             // nom de la munition
    this.timereset = timereset;   // le temps d'attente avant de pouvoir retirer cette munition
    this.power = power;           // la puissance de la munition
    this.posx = posx;             // position du centre de rotation en x sur le canvas
    this.posy = posy;             // position du centre de rotation en y sur le canvas
    this.visex = visex;           // position en x visé sur la canvas
    this.visey = visey;           // position en y visé sur la canvas
    this.actualDuration = 0;      // nombre de frames "vécues" par la munition
    this.angle = 0;               // angle de la munition
    this.radius = 0;              // rayon de la munition
  }

  // ----- les Guetteurs ----- //
  getName () { return this.name; }
  getPosX () { return this.posx; }
  getPosY () { return this.posy; }
  getRadius () { return this.radius; }
  getAngle () { return this.angle; }
  getIdTank () { return this.idTank; }
  getIdMunition () { return this.ismun; }
  getTimeReset () {
    return this.timereset;
  }

  // on fait bouger la Munition
  // retourne true si elle doit rester à l'écran, false autrement
  move () {
    if (this.actualDuration >= this.maxDuration) {
      return false;
    }
    if (this.posx < 0 || this.posx > canvas.width) {
      return false;
    }
    if (this.posy < 0 || this.posy > canvas.height) {
      return false;
    }
    this.actualDuration += 1;
    this.posx += this.dx;
    this.posy += this.dy;
    return true;
  }

  // fonction vérifiant si la munition à touché le tank entré en paramètre
  touch (tank) {
    if (this.getIdTank() != tank.getIdTank()) {
      if (Math.sqrt((tank.getPosX() - this.posx) ** 2 + (tank.getPosY() - this.posy) ** 2) <= tank.getHeight() + this.radius) {
        tank.doDamages(this.power);
        return true;
      }
    }
    return false;
  }

}

// munition Normale
// un projectile rapide en forme d'obus, dont les dégâts augmentent avec la longueur de son parcours
class MunitionNormal extends Munition {

  constructor (idTank, posx, posy, anglecanonx, anglecanony, visex, visey) {
    super (idTank, "Normale", 50 , 60, posx, posy, visex, visey);

    this.idmun = 0;

    this.angle = Math.atan( (visey - posy) / (visex - posx) );
    this.maxDuration = 360;
    this.basepower = this.power;

    // la vitesse de cette munition est de 5
    this.dx = Math.cos(this.angle) * 10;
    this.dy = Math.sin(this.angle) * 10;

    if (visex < this.posx) {
        this.dx *= -1;
        this.dy *= -1;
    }

    this.radius = 5;

    // on reset posx et posy
    this.posx += anglecanonx;
    this.posy += anglecanony;

    this.angle = this.angle * 180 / Math.PI + 45;;
  }

  dropPower () {
    this.power = this.basepower + this.actualDuration;
  }

  draw (ctx) {
    this.dropPower();
    // la base de la munition est carré
    ctx.fillStyle = "black";
    ctx.beginPath();

    ctx.moveTo(this.posx + 10 * Math.cos((this.angle) * constPI), this.posy + 10 * Math.sin((this.angle) * constPI));
    ctx.lineTo(this.posx + 10 * Math.cos((this.angle) * constPI), this.posy + 10 * Math.sin((this.angle) * constPI));
    ctx.lineTo(this.posx + 10 * Math.cos((this.angle + 90) * constPI), this.posy + 10 * Math.sin((this.angle +90) * constPI));
    if (this.dx < 0) {
      ctx.lineTo(this.posx + 15 * Math.cos((this.angle + 180 - 45) * constPI), this.posy + 15 * Math.sin((this.angle + 180 - 45) * constPI));
    }
    ctx.lineTo(this.posx + 10 * Math.cos((this.angle + 180) * constPI), this.posy + 10 * Math.sin((this.angle + 180) * constPI));
    ctx.lineTo(this.posx + 10 * Math.cos((this.angle + 270) * constPI), this.posy + 10 * Math.sin((this.angle + 270) * constPI));
    if (this.dx >= 0) {
      ctx.lineTo(this.posx + 15 * Math.cos((this.angle - 45) * constPI), this.posy + 15 * Math.sin((this.angle - 45) * constPI));
    }

    ctx.closePath();
    ctx.fill();
  }

  touch (tank) {
    if (this.getIdTank() != tank.getIdTank()) {
      if (Math.sqrt((tank.getPosX() - this.posx) ** 2 + (tank.getPosY() - this.posy) ** 2) <= tank.getHeight() + this.radius) {
        tank.doDamages(this.power);

        tank.knockBack(this.dx * this.power / 30, this.dy * this.power / 30);
        return true;
      }
    }
    return false;
  }

  static drawMunition (ctx, posx, posy) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    let angle = -90;

    ctx.moveTo(posx + 10 * Math.cos((angle + 45) * Math.PI / 180), posy + 10 * Math.sin((angle + 45) * Math.PI / 180));
    ctx.lineTo(posx + 10 * Math.cos((angle + 45) * Math.PI / 180), posy + 10 * Math.sin((angle + 45) * Math.PI / 180));
    ctx.lineTo(posx + 10 * Math.cos((angle + 90 + 45) * Math.PI / 180), posy + 10 * Math.sin((angle +90 + 45) * Math.PI / 180));
    ctx.lineTo(posx + 10 * Math.cos((angle + 180 + 45) * Math.PI / 180), posy + 10 * Math.sin((angle + 180 + 45) * Math.PI / 180));
    ctx.lineTo(posx + 10 * Math.cos((angle + 270 + 45) * Math.PI / 180), posy + 10 * Math.sin((angle + 270 + 45) * Math.PI / 180));
    ctx.lineTo(posx + 15 * Math.cos((angle + 0) * Math.PI / 180), posy + 15 * Math.sin((angle + 0) * Math.PI / 180));

    ctx.closePath();
    ctx.fill();
  }

}

// LE LANCE FLAAAAAAAAAAME
// une munition particulièrement puissante quand elle est tirée, mais rapidement en puissance
// au fur et à mesure que la couleur rougie
class MunitionFire extends Munition {

  constructor (idTank, posx, posy, anglecanonx, anglecanony, visex, visey) {
    super (idTank, "Feu", 1, 4, posx, posy, visex, visey);

    this.angle = Math.atan( (visey - posy) / (visex - posx) )+ Math.random() * 0.8 -0.4;
    this.maxDuration = 80 + Math.random() * 40 - 20;
    this.basepower = this.power;
    this.idmun = 1;

    // la vitesse de cette munition est de 5
    this.dx = Math.cos(this.angle) * 6;
    this.dy = Math.sin(this.angle) * 6;

    this.radius = 10;

    if (visex < this.posx) {
        this.dx *= -1;
        this.dy *= -1;
    }

    // on reset posx et posy
    this.posx += anglecanonx;
    this.posy += anglecanony;

    this.angle = this.angle * constPI;
  }

  dropPower () {
    this.power = this.basepower - Math.log((this.actualDuration+1) * 0.8);
  }

  draw (ctx) {
    this.dropPower ();
    ctx.fillStyle = "rgb(255," + (255 - this.actualDuration * 2.5) + ",0)";
    ctx.beginPath();
    ctx.arc(this.posx, this.posy, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }

  static drawMunition (ctx, posx, posy) {
    let radius = 10;
    ctx.fillStyle = "rgb(255,255,0)";
    ctx.beginPath();
    ctx.arc(posx, posy, radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }

}

// Munition Grenaille, tire plusieurs petits projectiles à grande dispersion
class MunitionGrenaille extends Munition {
  constructor (idTank, posx, posy, anglecanonx, anglecanony, visex, visey) {
    super (idTank, "Grenaille", 30, 11, posx, posy, visex, visey);

    this.angle = Math.atan( (visey - posy) / (visex - posx) )+ Math.random()*1.2-0.6;
    this.maxDuration = 50;
    this.idmun = 2;

    // la vitesse de cette munition est de 8
    this.dx = Math.cos(this.angle) * 6;
    this.dy = Math.sin(this.angle) * 6;

    if (visex < this.posx) {
        this.dx *= -1;
        this.dy *= -1;
    }

    // on reset posx et posy
    this.posx += anglecanonx;
    this.posy += anglecanony;

    this.radius = 2;

    this.angle = this.angle * constPI;
  }

  draw (ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.posx, this.posy, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }

  static drawMunition (ctx, posx, posy) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(posx, posy, 2, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }
}


class MunitionChevrotine extends Munition {
  constructor (idTank, posx, posy, anglecanonx, anglecanony, visex, visey) {
    super (idTank, "Chevrotine", 50, 20, posx, posy, visex, visey);
    this.angle = Math.atan( (visey - posy) / (visex - posx) );
    this.maxDuration = 20;
    this.anglecanonx = anglecanonx;
    this.anglecanony = anglecanony;
    this.radius = 8;
    this.idmun = 3;
    this.havesummoning = false;

    // la vitesse de cette munition est de 9
    this.dx = Math.cos(this.angle) * 9;
    this.dy = Math.sin(this.angle) * 9;

    if (visex < this.posx) {
        this.dx *= -1;
        this.dy *= -1;
    }

    // on reset posx et posy
    this.posx += anglecanonx;
    this.posy += anglecanony;

    this.angle = this.angle * constPI;
  }

  move () {
    if (!this.havesummoning && this.actualDuration >= this.maxDuration) {
      for (let i = 0; i < 28; i++) {
        listMunitions.push(new MunitionSummonChevrotine (this.idTank, this.posx, this.posy, this.dx, this.dy, this.angle, this.visex, this.visey));
      }
      this.havesummoning = true;
      return false;
    }
    if (this.posx < 0 || this.posx > canvas.width) {
      return false;
    }
    if (this.posy < 0 || this.posy > canvas.height) {
      return false;
    }
    this.actualDuration += 1;
    this.posx += this.dx;
    this.posy += this.dy;
    return true;
  }

  draw (ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.posx, this.posy, 8, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }

  static drawMunition (ctx, posx, posy) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(posx, posy, 8, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }

}

class MunitionSummonChevrotine extends Munition {
  constructor (idTank, posx, posy, dx, dy, angle, visex, visey) {
    super (idTank, "Chevrotine", 0, 4, posx, posy, visex, visey);
    this.maxDuration = 36;
    this.idmun = 4;
    this.radius = 2;

    this.dx = dx + Math.random()*1.4-0.7;
    this.dy = dy + Math.random()*1.4-0.7;

    this.angle = angle * constPI;
  }

  draw (ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.posx, this.posy, 2, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }
}

// Munition d'amour !
// Ne tuez pas vos ennemis, AIMEZ LES !
class MunitionLove extends Munition {
  constructor (idTank, posx, posy, anglecanonx, anglecanony, visex, visey) {
    super (idTank, "Pouvoir d'amour", 5, -50, posx, posy, visex, visey);

    this.angle = Math.atan( (visey - posy) / (visex - posx) )+ Math.random() * 8 -4;
    this.maxDuration = 500;
    this.idmun = 5;

    // la vitesse de cette munition est de 5
    this.dx = Math.cos(this.angle) * 3;
    this.dy = Math.sin(this.angle) * 3;

    if (visex < this.posx) {
        this.dx *= -1;
        this.dy *= -1;
    }

    // on reset posx et posy
    this.posx += anglecanonx;
    this.posy += anglecanony;

    this.angle = this.angle;
  }

  draw (ctx) {
    ctx.fillStyle = "rgb(255," + (200 - this.actualDuration * 2) + ",200)";
    // dessinons la base, un carré
    ctx.beginPath();

    ctx.moveTo(this.posx + 20 * Math.cos((this.angle) * Math.PI / 180), this.posy + 20 * Math.sin((this.angle) * Math.PI / 180));
    ctx.lineTo(this.posx + 20 * Math.cos((this.angle + 90) * Math.PI / 180), this.posy + 20 * Math.sin((this.angle +90) * Math.PI / 180));

    ctx.lineTo(this.posx + 20 * Math.cos((this.angle + 180) * Math.PI / 180), this.posy + 20 * Math.sin((this.angle + 180) * Math.PI / 180));
    ctx.lineTo(this.posx + 20 * Math.cos((this.angle + 270) * Math.PI / 180), this.posy + 20 * Math.sin((this.angle + 270) * Math.PI / 180));


    ctx.closePath();
    ctx.fill();
    // puis les deux cercles qui feront les oreilles

    // Math.sqrt(200) = 14.14
    ctx.beginPath();
    ctx.arc(this.posx + 9, this.posy - 9, 14, Math.PI * 0.25, Math.PI * 1.25, true);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.posx - 10, this.posy - 10, 14, Math.PI * 1.75, Math.PI*2.75, true);
    ctx.closePath();
    ctx.fill();
  }

  static drawMunition (ctx, posx, posy) {
    let angle = 0;
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
  }

}

// Munition Bulle, tire un petit cercle bleu qui grandi avec le temps
// plus il est grand, plus il tape fort
class MunitionBulle extends Munition {
  constructor (idTank, posx, posy, anglecanonx, anglecanony, visex, visey) {
    super (idTank, "Bubulles", 24, 40, posx, posy, visex, visey);

    this.angle = Math.atan( (visey - posy) / (visex - posx) )+ Math.random() * 1.2 - 0.6;
    this.maxDuration = 60 + Math.random() * 180;
    this.radius = 10;

    // la vitesse de cette munition est de 5
    this.dx = Math.cos(this.angle) * 2;
    this.dy = Math.sin(this.angle) * 2;

    if (visex < this.posx) {
        this.dx *= -1;
        this.dy *= -1;
    }

    // on reset posx et posy
    this.posx += anglecanonx;
    this.posy += anglecanony;

    this.angle = this.angle;
  }

  dropPower () {
    this.power = this.power + 0.5;
  }

  draw (ctx) {
    this.dropPower();
    this.radius += 0.1;
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.posx, this.posy, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.stroke();
  }

  static drawMunition (ctx, posx, posy) {
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.arc(posx, posy, 10, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.stroke();
  }
}
