import { BaseUI } from "../Controller/UIManager";

const { ccclass } = cc._decorator;

@ccclass
export default class MainUI extends BaseUI {
  register() {}

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
