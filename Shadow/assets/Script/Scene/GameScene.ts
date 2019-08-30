import { gCamera } from "../Controller/CameraController";
import { UIMgr } from "../Controller/UIManager";
import MainUI from "../UI/MainUI";
import fMainUI from "../UI/export/GameScene/fMainUI";

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
export default class Game extends cc.Component {
  // LIFE-CYCLE CALLBACKS:

  @property(cc.Camera)
  UICamera: cc.Camera = null;
  @property(cc.Camera)
  MainCamera: cc.Camera = null;
  @property(cc.Node)
  BackgroundRoot: cc.Node = null;
  @property(cc.Node)
  PlayerRoot: cc.Node = null;

  onLoad() {
    gCamera.bindMainCamera(this.MainCamera);
    gCamera.bindUICamera(this.UICamera);
  }

  start() {
    UIMgr.openGUI(fMainUI, MainUI);
  }

  update(dt: number) {}
}
