

class EnnemiTank extends Tank {

  constructor (idTank, x, y, width, height, angle, speed, colorbody, colortourelle, colorwait) {
    super(idTank, x, y, width, height, angle, speed, colorbody, colortourelle, colorwait);

    // temps avant de tirer
    this.timeBeforeShoot = 50;
    this.accTimeBeforeShoot = 0;

    this.idMunition = Math.random() * 5 | 0;

    // le point à rejoindre
    this.xtojoin = this.posx;
    this.ytojoin = this.posy;
    this.affinejoin = affine(this.posx, this.posy, this.xtojoin, this.ytojoin);
  }

  shoot (posx, posy) {
    this.accTimeBeforeShoot++;

    if (this.timeBeforeShoot <= this.accTimeBeforeShoot) {
        this.accTimeBeforeShoot = 0;
        this.accTimeBeforeFire = 0;
        this.fire(posx, posy);
    }
  }

  ennemiRotation () {
    let count = 0;
    let up = this.dy < 0;
    let left = this.dx < 0;
    let right = this.dx > 0;
    let down = this.dy > 0;


    if (up && count < 2) {
      this.setDy(-1 * this.getSpeed());
      angleup = 270;
      count++;
    }
    else if (count < 2){
      this.setDy(0);
      angleup = 0; //mainTank.getAngle();
    }

    if (down && count < 2) {
      this.setDy(this.getSpeed());
      angledown = 90;
      count++;
    }
    else if (!up && count < 2) {
      this.setDy(0);
      angledown = 0; //mainTank.getAngle();
    }

    if (left && count < 2) {
      this.setDx(-this.getSpeed());
      angleleft = 180;
      count++;
    }
    else if (count < 2) {
      this.setDx(0);
      angleleft = 0; //mainTank.getAngle();
    }

    if (right && count < 2) {
      this.setDx(this.getSpeed());
      angleright = 360;
      count++;
    }
    else if (!left && count < 2){
      this.setDx(0);
      angleright = 0;// mainTank.getAngle();
    }

    if (count > 2) { count = 2; }
    if (up && down) {
      this.setDy(0);
      angledown = 0;
      angleup = 0;
    }
    if (left && right) {
      this.setDx(0);
      angleleft = 0;
      angleright = 0;
    }
    angledft = calcangle(this, [angleup, angleleft, angleright, angledown]);
    if ((angledft - this.getAngle()) % 180 != 0) {
      if (up || down || left || right) {
        super.rotate(angleRotate);
      }
    }
  }

  move () {

    if (this.dx == 0 && this.dy == 0) {
      this.xtojoin = (60 + Math.random() * (canvas.width - 120)) | 0;
      this.ytojoin = (60 + Math.random() * (canvas.height - 120)) | 0;
    }

    if (this.xtojoin > this.posx + this.speed) {
      this.dx = this.speed;
    }
    else if (this.xtojoin < this.posx - this.speed) {
      this.dx = -this.speed;
    }
    else {
      this.dx = 0;
    }

    if (this.ytojoin > this.posy + this.speed) {
      this.dy = this.speed;
    }
    else if (this.ytojoin < this.posy - this.speed) {
      this.dy = -this.speed;
    }
    else {
      this.dy = 0;
    }

    super.move();
    this.ennemiRotation();

    let listmun = this.fire(mainTank.getPosX(), mainTank.getPosY());
    if (listmun != null) {
      listmun.forEach((mun) => {
        listMunitions.push(mun);
      });
      this.accTimeBeforeFire--;
    }
  }
}
