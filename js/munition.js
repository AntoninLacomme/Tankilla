
class Munition {

  constructor (idTank, name, timereset, power, posx, posy, anglecanon, visex, visey) {
    this.idTank = idTank;
    this.name = name;
    this.timereset = timereset;
    this.power = power;
    this.posx = posx;
    this.posy = posy;
    this.visex = visex;
    this.visey = visey;
    this.actualDuration = 0;
    this.angle = 0;
    this.radius = 0;
  }

  getName () { return this.name; }
  getPosX () { return this.posx; }
  getPosY () { return this.posy; }
  getRadius () { return this.radius; }
  getAngle () { return this.angle; }
  getIdTank () { return this.idTank; }
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

  touch (tank) {
    if (this.getIdTank() != tank.getIdTank()) {
      //let limites = tank.getLimites();
      if (Math.sqrt((tank.getPosX() - this.posx) ** 2 + (tank.getPosY() - this.posy) ** 2) <= tank.getHeight() + this.radius) {
        tank.doDamages(this.power);
        return true;
      }
    }
    return false;
  }

}

class MunitionNormal extends Munition {

  constructor (idTank, posx, posy, anglecanonx, anglecanony, visex, visey) {
    super (idTank, "Normale", 50 , 60, posx, posy, visex, visey);

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
    //let limites = tank.getLimites();
    if (Math.sqrt((tank.getPosX() - this.posx) ** 2 + (tank.getPosY() - this.posy) ** 2) <= tank.getHeight() + this.radius) {
      tank.doDamages(this.power);

      tank.knockBack(this.dx * this.power / 30, this.dy * this.power / 30);
      return true;
    }
    return false;
  }


}

class MunitionFire extends Munition {

  constructor (idTank, posx, posy, anglecanonx, anglecanony, visex, visey) {
    super (idTank, "Feu", 1, 6, posx, posy, visex, visey);

    this.angle = Math.atan( (visey - posy) / (visex - posx) )+ Math.random() * 0.8 -0.4;
    this.maxDuration = 160 + Math.random() * 40 - 20;
    this.basepower = this.power;

    // la vitesse de cette munition est de 5
    this.dx = Math.cos(this.angle) * 2;
    this.dy = Math.sin(this.angle) * 2;

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
    this.power = this.basepower - Math.log((this.actualDuration+1) * 2);
  }

  draw (ctx) {
    this.dropPower ();
    ctx.fillStyle = "rgb(255," + (255 - this.actualDuration * 1.3) + ",0)";
    ctx.beginPath();
    ctx.arc(this.posx, this.posy, this.radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }

}

class MunitionGrenaille extends Munition {
  constructor (idTank, posx, posy, anglecanonx, anglecanony, visex, visey) {
    super (idTank, "Grenaille", 30, 11, posx, posy, visex, visey);

    this.angle = Math.atan( (visey - posy) / (visex - posx) )+ Math.random()*1.2-0.6;
    this.maxDuration = 50;

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

    this.angle = this.angle * constPI;
  }

  draw (ctx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.posx, this.posy, 2, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }
}

class MunitionLove extends Munition {
  constructor (idTank, posx, posy, anglecanonx, anglecanony, visex, visey) {
    super (idTank, "Pouvoir d'amour", 5, -50, posx, posy, visex, visey);

    this.angle = Math.atan( (visey - posy) / (visex - posx) )+ Math.random() * 8 -4;
    this.maxDuration = 500;

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
}


class MunitionBulle extends Munition {
  constructor (idTank, posx, posy, anglecanonx, anglecanony, visex, visey) {
    super (idTank, "Bubulles", 24, 35, posx, posy, visex, visey);

    this.angle = Math.atan( (visey - posy) / (visex - posx) )+ Math.random() * 1.2 - 0.6;
    this.maxDuration = 20 + Math.random() * 230;
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
    this.power = this.power + 0.1;
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
}
