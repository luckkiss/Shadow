/**
 * 拓展的一些数学方法
 */
interface CMath {
  /**
   * return a new val between max and min
   * @param val
   * @param max
   * @param min
   */
  Clamp(val: number, max: number, min: number);

  /**
   * cal diatance of two points
   * @param p1
   * @param p2
   */
  Distance(p1: cc.Vec2, p2: cc.Vec2);
}

// interface celerx {
//   start();
//   submitScore(score: number);
// }

declare var CMath: CMath;
/** 是否显示整个场景 （调试用）*/
declare var CAMERA_SHOW_ALL;

/** 是否无敌 （调试用）*/
declare var INVINCIBLE;

/** */
declare var GESTURE;

/** 是否像素风 （调试用）*/
declare var PXIEL;

/** 指引*/
declare var GUIDE;

declare var require;
