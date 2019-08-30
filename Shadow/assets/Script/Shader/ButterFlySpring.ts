import {
  TransitionMaterial,
  WaveMaterial,
  ButterflySpringMaterial
} from "./ShaderManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButterflySpring extends cc.Component {
  private material: ButterflySpringMaterial = new ButterflySpringMaterial();

  onLoad() {
    let sprite = this.getComponent(cc.Sprite);
    if (!sprite) return;
    sprite["_spriteMaterial"] = this.material;
    sprite["_activateMaterial"]();
  }

  start() {}

  private time = 0;
  update(dt) {
    this.time += dt * 10;
  }
}
