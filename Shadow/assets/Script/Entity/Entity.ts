import { threadId } from "worker_threads";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Entity extends cc.Component {
  // LIFE-CYCLE CALLBACKS:

  @property(cc.Vec2)
  gravity: cc.Vec2 = cc.v2(0, 0);

  private speed: cc.Vec2 = cc.v2(0, 0);
  onLoad() {}

  start() {}

  addSpeed(applySpeed: cc.Vec2) {
    this.speed.addSelf(applySpeed);
  }

  applySpeed(speed: cc.Vec2) {
    this.speed = speed;
  }

  update(dt: number) {
    let offset = this.speed.mul(dt).add(this.gravity.mul(0.5 * dt * dt));
    this.node.x += offset.x * this.node.scaleX;
    this.node.y += offset.y * this.node.scaleY;
    this.speed.addSelf(this.gravity.mul(dt));
  }
}
