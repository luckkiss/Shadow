import { Config } from "../Config/Config";
import { ShaderManager } from "../Shader/ShaderManager";
import { gAudio } from "../Controller/AudioController";
import { UIMgr } from "../Controller/UIManager";
import { gFactory } from "../Factory/GameFactory";
const celerx = require("../Utils/celerx");
const { ccclass, property } = cc._decorator;

/** 加载的步骤 */
export enum LOAD_STEP {
  /** 初始化 */
  READY = 2 << 0,
  /** 初始化 */
  INIT = 2 << 1,
  /** 注册 */
  REGISTER = 2 << 2,
  /** 登录 */
  LOGIN = 2 << 3,
  /** 匹配 */
  MATCH = 2 << 4,
  /** 加载表 */
  FACTORY = 2 << 5,
  /** 动画播放完成 */
  ANIMATION_DONE = 2 << 6,
  /** 场景加载完成 */
  SCENE_DONE = 2 << 7,
  AUDIO = 2 << 8,
  UI = 2 << 9,
  /** 完成 */
  DONE = LOAD_STEP.READY |
    LOAD_STEP.INIT |
    LOAD_STEP.REGISTER |
    LOAD_STEP.LOGIN |
    LOAD_STEP.MATCH |
    LOAD_STEP.FACTORY |
    LOAD_STEP.ANIMATION_DONE |
    LOAD_STEP.SCENE_DONE |
    LOAD_STEP.AUDIO |
    LOAD_STEP.UI
}

@ccclass
export default class WelcomeScene extends cc.Component {
  /** 下一个场景名字 */
  @property({
    displayName: "游戏场景名",
    tooltip: "默认进入game场景，如果需要指定场景，可以指定"
  })
  nextSceneName: string = "game";

  @property(cc.Label)
  percentLabel: cc.Label = null;
  private maxPercent: number = 0;
  private curPercent: number = 0;

  private nextScene: cc.Scene;

  /** 当前的步骤 */
  private _step: LOAD_STEP = LOAD_STEP.READY;
  private defaultAnimation: cc.Animation;

  onLoad() {
    celerx.start();
    if (!CC_EDITOR) ShaderManager.inst;
    cc.game.setFrameRate(Config.FPS);
    this.maxPercent = 0;

    this.defaultAnimation = this.node.getComponent(cc.Animation);
    if (this.defaultAnimation) {
      this.defaultAnimation.once(
        cc.Animation.EventType.FINISHED,
        this.animationDone,
        this
      );
    } else {
      this.nextStep(LOAD_STEP.ANIMATION_DONE);
    }

    if (Config.isMultiPlayer) {
    } else {
      this.nextStep(LOAD_STEP.LOGIN);
      this.nextStep(LOAD_STEP.MATCH);
      this.nextStep(LOAD_STEP.REGISTER);
      this.nextStep(LOAD_STEP.INIT);
    }

    gFactory.init(
      function() {
        this.nextStep(LOAD_STEP.FACTORY);
      }.bind(this)
    );

    gAudio.init(
      function() {
        this.nextStep(LOAD_STEP.AUDIO);
      }.bind(this)
    );

    cc.director.preloadScene(
      this.nextSceneName,
      null,
      (err, sceneAsset: cc.SceneAsset) => {
        if (err) {
          console.error("场景加载错误");
        } else {
          this.nextScene = sceneAsset.scene;
          this.nextStep(LOAD_STEP.SCENE_DONE);
        }
      }
    );

    UIMgr.loadUIPackage(err => {
      if (!err) {
        this.nextStep(LOAD_STEP.UI);
      } else {
        console.error("UI 加载错误:", err);
      }
    });
  }

  update(dt: number) {
    this.curPercent += dt;
    if (this.curPercent >= this.maxPercent) {
      this.curPercent = this.maxPercent;
    }
    this.percentLabel.string = (this.curPercent * 100).toFixed(2) + "%";
    if (this.curPercent >= 1) {
      this.node.emit("load_done");
    }
  }

  animationDone() {
    this.defaultAnimation.off(cc.Animation.EventType.FINISHED);
    this.nextStep(LOAD_STEP.ANIMATION_DONE);
  }

  /**
   * 下一步
   */
  private nextStep(loadStep: LOAD_STEP) {
    this._step |= loadStep;
    console.log("CUR STEP:" + LOAD_STEP[loadStep] + ", total: " + this._step);
    this.maxPercent =
      (this._step & (0xffff ^ LOAD_STEP.ANIMATION_DONE)) /
      (LOAD_STEP.DONE & (0xffff ^ LOAD_STEP.ANIMATION_DONE));
    console.log(" MAXPERCENT:" + this.maxPercent);

    if (this._step >= LOAD_STEP.DONE) {
      this.node.once(
        "load_done",
        () => {
          if (this.nextScene) {
            console.log("runSceneImmediate", this.nextScene);
            cc.director.runSceneImmediate(this.nextScene);
          } else {
            cc.director.loadScene(this.nextSceneName);
          }
        },
        this
      );
      this.defaultAnimation &&
        (this.defaultAnimation.play().wrapMode = cc.WrapMode.Loop);
    } else {
      if (loadStep == LOAD_STEP.ANIMATION_DONE) {
        if (this.defaultAnimation) {
          this._step &= 0xffff ^ LOAD_STEP.ANIMATION_DONE;
          this.defaultAnimation.once(
            cc.Animation.EventType.FINISHED,
            this.animationDone,
            this
          );
          this.defaultAnimation.play();
        }
      }
    }
  }
}
