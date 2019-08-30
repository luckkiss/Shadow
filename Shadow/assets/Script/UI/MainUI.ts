import { BaseUI } from "../Controller/UIManager";
import fMainUI from "./export/GameScene/fMainUI";
import { gEventMgr } from "../Event/EventManager";
import { GlobalEvent } from "../Event/EventName";
import { JUMP } from "../Entity/Player";

const { ccclass } = cc._decorator;

@ccclass
export default class MainUI extends BaseUI {
  private uiView: fMainUI = null;
  register(view: fMainUI) {
    this.uiView = view;
    this.init();
    return this;
  }

  init() {
    this.uiView.m_ButtonTop.onClick(this.topClick, this);
    this.uiView.m_ButtonBottom.onClick(this.bottomClick, this);
  }

  topClick() {
    gEventMgr.emit(GlobalEvent.JUMP, JUMP.Top);
  }

  bottomClick() {
    gEventMgr.emit(GlobalEvent.JUMP, JUMP.Bottom);
  }

  onHide() {
    console.log("onHide");
  }

  onShow() {
    console.log("onShow");
  }

  close111() {
    throw Error("Fuck");
  }
}
