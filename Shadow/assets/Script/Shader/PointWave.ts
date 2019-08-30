import {
  TransitionMaterial,
  WaveMaterial,
  PointWaveMaterial
} from "./ShaderManager";
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
export default class PointWaveSprite extends cc.Component {
  private material: PointWaveMaterial = new PointWaveMaterial();

  onLoad() {
    console.log(this.node);
    let sprite = this.getComponent(cc.Sprite);
    if (!sprite) return;
    sprite["_spriteMaterial"] = this.material;
    sprite["_activateMaterial"]();

    this.material.setProperty("range", 0.01);
    //this.material.setDefine("useShadow", true);
    this.node.on(
      cc.Node.EventType.TOUCH_END,
      (event: cc.Event.EventTouch) => {
        let location = this.node.convertToNodeSpace(event.getLocation());
        location.x /= this.node.getContentSize().width;
        location.y /= this.node.getContentSize().height;
        location.y = 1 - location.y;
        this.time = 0;
        this.waveRange = 0.01;
        this.material.setProperty("time", this.time);
        this.material.setProperty("range", this.waveRange);
        this.material.setProperty("point", location);
      },
      this
    );
  }

  start() {}

  private time = 0;
  private waveRange = 0.01;
  update(dt) {
    this.material.setProperty("range", this.waveRange);
    this.material.setProperty("time", this.time);
    this.material.setProperty("deltaTime", dt);
    //this.waveRange += 0.01;
    this.time += dt / 2;
    if (this.waveRange > 0.1) this.waveRange = 0.1;
  }
}
