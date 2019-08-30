import Entity from "./Entity";
import { gEventMgr } from "../Event/EventManager";
import { GlobalEvent } from "../Event/EventName";

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

export enum JUMP {
  Top,
  Bottom
}

@ccclass
export default class Player extends cc.Component {
  @property({ type: cc.Enum(JUMP) })
  JumpType: JUMP = JUMP.Top;

  private jumpTimes: number = 0;
  private entity: Entity;
  private get Entity() {
    return this.entity
      ? this.entity
      : (this.entity = this.getComponent(Entity));
  }

  onLoad() {
    gEventMgr.on(GlobalEvent.JUMP, this.onJump, this);
  }

  start() {}

  onJump(type: JUMP) {
    if (type == this.JumpType && this.jumpTimes++ < 2) {
      console.log(this.jumpTimes);
      this.Entity.applySpeed(cc.v2(0, 500));
    }
  }

  update(dt: number) {
    if (this.node.y * this.node.scaleY < 0) {
      this.node.y = 0;
      this.Entity.applySpeed(cc.v2(0, 0));
      this.jumpTimes = 0;
    } else {
    }
  }
}
