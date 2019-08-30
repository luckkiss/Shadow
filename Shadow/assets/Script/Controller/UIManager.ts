import { HashMap } from "../Utils/HashMap";

const { ccclass } = cc._decorator;

export interface uiItem {
  URL: string;
  /** 异步创建 */
  createInstance: (complete: (gComp: fgui.GComponent) => void) => void;
  /** 同步创建 */
  createInstanceSync: () => fgui.GComponent;
  /** 释放包资源，尽量不要，除非是一些不常用的小界面，并且必须单独一个包  */
  releaseInstance: () => void;
}
class UIManager {
  private static ins: UIManager;
  public static get inst() {
    return this.ins ? this.ins : (this.ins = new UIManager());
  }
  private constructor() {}

  private isInit: boolean = false;

  private guiMap: HashMap<string, fgui.GComponent> = new HashMap();
  private windowMap: HashMap<string, fgui.GComponent> = new HashMap();
  private init() {
    !CC_EDITOR && fgui.addLoadHandler();
    //cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
    cc.view.setResizeCallback(this.onResize.bind(this));
    cc.director.on(
      cc.Director.EVENT_AFTER_SCENE_LAUNCH,
      () => {
        !CC_EDITOR && fgui.GRoot.create();
      },
      this
    );
  }

  /** 加载一些静态UI资源，一些动态加载的小UI，需要动态加载和卸载 */
  loadUIPackage(callabck: Function) {
    console.log(
      "###################################loadUIPackage###############################"
    );
    if (!this.isInit) this.init();
    cc.loader.loadResDir(
      "UI/sync",
      (err, assets: cc.RawAsset[], urls: string[]) => {
        console.log(urls);
        if (err) {
          callabck(err);
        } else {
          for (let url of urls) {
            if (!/atlas/.test(url)) {
              console.log(url);
              fgui.UIPackage.addPackage(url);
            }
          }
          callabck(null);
        }
      }
    );
  }

  onResize() {
    var size = cc.view.getCanvasSize();
    size.width /= cc.view.getScaleX();
    size.height /= cc.view.getScaleY();
    this.guiMap.forEach((key: string, view: fgui.GComponent) => {
      view.setPosition(
        (size.width - view.width) / 2,
        (size.height - view.height) / 2
      );
    });

    this.windowMap.forEach((key: string, view: fgui.GComponent) => {
      view.setPosition(
        (size.width - view.width) / 2,
        (size.height - view.height) / 2
      );
    });
  }

  /**
   * 打开GUI
   * GUI都是一些比较底层的UI，资源常驻内存
   * @param packageName 包名
   * @param resName 界面名
   * @param type 界面脚本
   */
  openGUI<T extends BaseUI>(uiItem: uiItem, type: { new (): T }): T {
    let gui = this.guiMap.get(uiItem.URL);
    if (gui) {
      let comp = gui.node.getComponent(type);
      if (gui.node.active) {
        console.warn("UI is showed:" + uiItem.URL);
      } else {
        comp.show();
      }
      return comp;
    } else {
      let view = uiItem.createInstanceSync();
      view.setPosition(
        (fgui.GRoot.inst.width - view.width) / 2,
        (fgui.GRoot.inst.height - view.height) / 2
      );
      fgui.GRoot.inst.addChild(view);
      this.guiMap.add(uiItem.URL, view);
      return view.node
        .addComponent(type)
        .register(view)
        .show();
    }
  }

  closeGUI<T extends BaseUI>(uiItem: uiItem, type: { new (): T }): T {
    let gui = this.guiMap.get(uiItem.URL);
    if (!gui) {
      console.error("UI not exist:" + uiItem.URL);
      return null;
    }
    return gui.node.getComponent(type).hide();
  }

  /**
   * Window是一些上层窗口，资源动态加载卸载
   */
  openWindow<T extends BaseUI>(uiItem: uiItem, type: { new (): T }): void {
    let win = this.windowMap.get(uiItem.URL);
    if (win) {
      let comp = win.node.getComponent(type);
      if (win.node.active) {
        console.warn("UI is showed:" + uiItem.URL);
      } else {
        comp.show();
      }
    } else {
      uiItem.createInstance((gComp: fgui.GComponent) => {
        gComp.setPosition(
          (fgui.GRoot.inst.width - gComp.width) / 2,
          (fgui.GRoot.inst.height - gComp.height) / 2
        );
        fgui.GRoot.inst.addChild(gComp);
        this.guiMap.add(uiItem.URL, gComp);
        gComp.node
          .addComponent(type)
          .register(gComp)
          .show();
      });
    }
  }

  closeWindow<T extends BaseUI>(uiItem: uiItem, type: { new (): T }): boolean {
    let win = this.windowMap.get(uiItem.URL);
    if (!win) {
      console.error("UI not exist:" + uiItem.URL);
      return false;
    }
    let success = win.node.getComponent(type).hide(true);
    uiItem.releaseInstance();
    this.windowMap.remove(uiItem.URL);
    return success;
  }
}

/**
 * UI界面管理器
 */
export const UIMgr = UIManager.inst;

/** 界面的基类 */
@ccclass
export abstract class BaseUI extends cc.Component {
  public abstract register(view: fgui.GComponent): any;
  /**
   * call after show
   */
  protected onShow() {}

  /**
   * call after hide
   */
  protected onHide() {}

  /** 显示界面 */
  public show() {
    if (!this.node.isValid) {
      console.error(" node valid!");
      return this;
    }

    if (!this.node.active) {
      this.node.active = true;
    }
    this.onShow();
    return this;
  }

  /** 隐藏界面 */
  public hide(clean: boolean = false): boolean {
    if (!this.node.isValid) {
      console.error(" node valid!");
      return false;
    }

    if (this.node.active) {
      this.node.active = false;
    }
    this.onHide();
    if (clean) {
      this.node.removeFromParent(clean);
    }
    return true;
  }
}
