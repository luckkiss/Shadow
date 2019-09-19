import { gCamera } from "../Controller/CameraController";
import { UIMgr } from "../Controller/UIManager";
import MainUI from "../UI/MainUI";
import fMainUI from "../UI/export/Game/fMainUI";
import { Game } from "../Entity/Game";
import { Config } from "../Config/Config";
import { gFactory } from "../Factory/GameFactory";

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
export default class GameScene extends cc.Component {
  // LIFE-CYCLE CALLBACKS:

  @property(cc.Camera)
  UICamera: cc.Camera = null;
  @property(cc.Camera)
  MainCamera: cc.Camera = null;
  @property(cc.Node)
  BackgroundRoot: cc.Node = null;
  @property(cc.Node)
  PlayerRoot: cc.Node = null;
  @property(cc.Node)
  BlockRoot: cc.Node = null;
  @property(cc.Node)
  BlockRootInverse: cc.Node = null;

  private offset: number = 0;
  onLoad() {
    gCamera.bindMainCamera(this.MainCamera);
    gCamera.bindUICamera(this.UICamera);
    cc.director.getCollisionManager().enabled = true;
    cc.director.getCollisionManager().enabledDebugDraw = true;
  }

  start() {
    UIMgr.openGUI(fMainUI, MainUI);
    this.addBlock(this.BlockRoot);
  }

  update(dt: number) {
    let back = this.BackgroundRoot.children[0];
    let backPos = this.MainCamera.node.convertToNodeSpaceAR(
      back.convertToWorldSpaceAR(back.position)
    );

    if (backPos.x <= -Config.Size.width * 2 + this.offset) {
      back.x = this.BackgroundRoot.children[1].x + 2 * Config.Size.width;
      this.offset += 2 * Config.Size.width;
      [this.BackgroundRoot.children[1], this.BackgroundRoot.children[0]] = [
        this.BackgroundRoot.children[0],
        this.BackgroundRoot.children[1]
      ];

      this.addBlock(this.BlockRoot);
      if (Game.score > 100) {
        this.addBlock(this.BlockRootInverse);
      }
    }
    Game.score++;
    //Game.speed++;
  }

  addBlock(blockRoot: cc.Node) {
    for (let block of blockRoot.children) {
      if (
        block.x <
        this.MainCamera.node.x - Config.Size.width / 2 - block.width
      ) {
        if (block.name == "Low") {
          gFactory.putLowBlock(block);
        } else {
          gFactory.putHighBlock(block);
        }
      }
    }

    let startX = this.MainCamera.node.x + Config.Size.width / 2;
    let endX = startX + Config.Size.width;

    for (let x = startX; x <= endX; x += ((x % 3) + 1) * 200) {
      let high = cc.director.getTotalFrames() % 2 ? "High" : "Low";
      blockRoot.addChild(gFactory.getHighBlock(high, cc.v2(x, 0)));
    }
  }

  lateUpdate() {}
}
