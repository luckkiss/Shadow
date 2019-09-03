import Entity from "./Entity";
import { gEventMgr } from "../Event/EventManager";
import { GlobalEvent } from "../Event/EventName";
import { Game } from "./Game";
import { gCamera } from "../Controller/CameraController";

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
    gCamera.setTarget(this.node);
    gEventMgr.on(GlobalEvent.JUMP, this.onJump, this);
  }

  get DirectionY() {
    return this.node.scaleY >= 0 ? 1 : -1;
  }

  start() {}

  onJump(type: JUMP) {
    if (type == this.JumpType && this.jumpTimes++ < 2) {
      if (this.jumpTimes > 1) {
        this.Entity.speed.y = 800;
      } else {
        this.Entity.speed.y = 680;
      }
    }
  }

  update(dt: number) {
    if (this.node.y * this.DirectionY < 0) {
      this.node.y = 0;
      this.Entity.speed.y = 0;
      this.jumpTimes = 0;
    } else {
    }
    this.Entity.speed.x = Game.speed;
  }

  onCollisionEnter(other, self) {
    cc.director.pause();
  }
}
