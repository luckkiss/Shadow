import { TransitionMaterial, WaveMaterial } from "./ShaderManager";

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
export default class WaveSprite extends cc.Component {
  private wave: WaveMaterial = new WaveMaterial();

  onLoad() {
    let sprite = this.getComponent(cc.Sprite);
    if (!sprite) return;
    sprite["_spriteMaterial"] = this.wave;
    sprite["_activateMaterial"]();
    this.wave.setProperty("range", 1);
  }

  start() {}

  private time = 0;
  update(dt: number) {
    this.time += dt * 10;
    //this.wave.setProperty("range", Math.sin(this.time + dt) - Math.sin(dt));
    this.wave.setProperty("time", this.time);
    this.wave.setProperty("deltaTime", dt);
  }
}
