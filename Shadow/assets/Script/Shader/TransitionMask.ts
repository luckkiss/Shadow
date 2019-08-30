import { TransitionMaterial } from "./ShaderManager";

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
export default class TransitionMask extends cc.Component {
  private transitionMaterial: TransitionMaterial = new TransitionMaterial();

  public startTrans: boolean = false;
  onLoad() {
    let mask = this.getComponent(cc.Mask);
    mask["_material"] = this.transitionMaterial;
    mask["_activateMaterial"]();
    this.transitionMaterial.setProperty("range", 0.1);
  }

  start() {}

  private time = 0;
  update(dt) {
    if (!this.startTrans) return;
    this.time += dt * 1.2;
    this.transitionMaterial.setProperty("time", this.time);
  }
}
