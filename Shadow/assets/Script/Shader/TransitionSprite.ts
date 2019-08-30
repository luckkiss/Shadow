import { TransitionMaterial } from "./ShaderManager";
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

@ccclass
export default class TransitionSprite extends cc.Component {
  private transitionMaterial: TransitionMaterial = new TransitionMaterial();
  onLoad() {
    let sprite = this.getComponent(cc.Sprite);
    sprite["_spriteMaterial"] = this.transitionMaterial;
    sprite["_activateMaterial"]();
    this.transitionMaterial.setProperty("range", 0.1);
  }

  start() {}

  private time = 0;
  update(dt) {
    if (!this.node.active) {
      this.Time = 0;
      return;
    }
    this.Time += dt * 0.8;
    if (this.time > 2) {
      this.Time = 0;
      this.node.active = false;
    }
  }

  set Time(val) {
    this.time = val;
    this.transitionMaterial.setProperty("time", this.time);
  }

  get Time() {
    return this.time;
  }
}
