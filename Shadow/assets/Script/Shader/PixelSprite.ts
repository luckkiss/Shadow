import { PixelStyleMaterial, PixelSpineMaterial } from "./ShaderManager";
import { gEventMgr } from "../Event/EventManager";
import { GlobalEvent } from "../Event/EventName";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PixelSprite extends cc.Component {
  private material: PixelStyleMaterial = new PixelStyleMaterial();
  private spineMaterial: PixelSpineMaterial = new PixelSpineMaterial();

  private oldMaterial = null;
  private oldSpineMaterial = null;

  @property(cc.Integer)
  sampleCount = 800;

  onLoad() {
    gEventMgr.on(
      GlobalEvent.PXIEL_ENABLE,
      () => {
        if (PXIEL) {
          this.init();
        } else {
          this.reset();
        }
      },
      this
    );
    if (PXIEL) {
      this.init();
    } else {
      this.reset();
    }
  }

  init() {
    if (!PXIEL) return;
    let sprite = this.getComponent(cc.Sprite);
    let spine = this.getComponent(sp.Skeleton);
    let label = this.getComponent(cc.Label);

    this.material.setDefine("disableColor", false);
    this.spineMaterial.setDefine("disableColor", false);

    this.material.setProperty("sampleCount", this.sampleCount);
    this.spineMaterial.setProperty("sampleCount", this.sampleCount);
    if (sprite) {
      this.oldMaterial = sprite["_spriteMaterial"];
      sprite["_spriteMaterial"] = this.material;
      sprite["_activateMaterial"]();
    }

    if (label) {
      this.oldMaterial = label["_material"];
      if (label["_frame"] && label["_frame"]["_texture"]) {
        this.material.texture = label["_frame"]["_texture"];
      }
      label["_material"] = this.material;
      label["_activateMaterial"]();
    }

    if (spine) {
      this.oldSpineMaterial = spine["_material"];
      spine["_updateMaterial"](this.spineMaterial);
    }
  }

  reset() {
    let sprite = this.getComponent(cc.Sprite);
    let spine = this.getComponent(sp.Skeleton);
    let label = this.getComponent(cc.Label);

    if (sprite && this.oldMaterial) {
      sprite["_spriteMaterial"] = this.oldMaterial;
      sprite["_activateMaterial"]();
    }

    if (label && this.oldMaterial) {
      label["_material"] = this.oldMaterial;
      label["_activateMaterial"]();
    }

    if (spine && this.oldSpineMaterial) {
      spine["_updateMaterial"](this.oldSpineMaterial);
    }
  }
}
