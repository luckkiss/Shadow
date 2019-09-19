class CameraController {
  private static ins: CameraController;
  public static get inst() {
    return this.ins ? this.ins : (this.ins = new CameraController());
  }

  private minZoomRatio: number = 0.5;

  private maxMoveYRatio: number = 0.5;

  private isEnableCameraZoom: boolean = false;

  private MainCamera: cc.Camera = null;

  private UICamera: cc.Camera = null;

  private target: cc.Node = null;

  private enableFollow: boolean = true;

  public canZoomOut: boolean = true;
  private constructor() {
    cc.director.on(
      cc.Director.EVENT_AFTER_UPDATE,
      this.lateUpdate.bind(this),
      this
    );
  }

  shake() {
    let shakeRange = 0.5;
    let moveY = cc.sequence(
      cc.moveBy(0.03, cc.v2(0, 50 * shakeRange)),
      cc.moveBy(0.06, cc.v2(0, -100 * shakeRange)),
      cc.moveBy(0.03, cc.v2(0, 50 * shakeRange))
    );

    let shakeUpDown = cc.repeat(moveY, 5);
    this.MainCamera.node.runAction(shakeUpDown);
  }

  initCamera() {
    this.enableFollow = true;
    if (!this.MainCamera || !this.MainCamera.node) return;
  }

  zoomIn() {
    this.enableFollow = false;
    // this.MainCamera.node.stopActionByTag(101);
    // let zoomIn = cc.moveTo(0.4, cc.v2(0, 360));
    // zoomIn.setTag(100);
    // this.MainCamera.node.runAction(zoomIn);
  }

  zoomOut() {
    let zoomOut = cc.moveTo(0.2, cc.v2(0, 0));
    zoomOut.setTag(101);
    this.MainCamera.node.stopActionByTag(100);
    this.MainCamera.node.runAction(zoomOut);
    this.enableFollow = true;
  }

  bindUICamera(camera: cc.Camera) {
    this.UICamera = camera;
  }

  bindMainCamera(camera: cc.Camera) {
    this.MainCamera = camera;
  }

  /** 设置当前跟随目标 */
  setTarget(newTarget: cc.Node) {
    this.target = newTarget;
    if (!this.target) {
      console.log(" 球没了");
      this.readyRocket(false);
    }
    //this.readyRocket(false);
  }

  readyRocket(isReady: boolean) {
    if (this.enableFollow == !isReady) return;
    console.log("enable follow:" + this.enableFollow);

    if (isReady) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  lateUpdate() {
    if (
      !this.MainCamera ||
      !this.MainCamera.node ||
      !this.UICamera ||
      !this.UICamera.node
    )
      return;

    if (!this.target || !this.target.isValid) {
      if (this.MainCamera.zoomRatio < 1) {
        this.MainCamera.zoomRatio += 0.05;
      } else if (this.MainCamera.zoomRatio > 1) {
        this.MainCamera.zoomRatio -= 0.05;
      }
      this.MainCamera.zoomRatio = CMath.Clamp(this.MainCamera.zoomRatio, 1, 0);
      return;
    }
    // // 移动垂直方向镜头
    // this.MainCamera.node.y = this.target.y - cc.winSize.height / 4;

    // this.MainCamera.node.y = CMath.Clamp(
    //   this.MainCamera.node.y,
    //   cc.winSize.height * this.maxMoveYRatio,
    //   0
    // );

    // // 移动水平方向镜头
    // if (this.target.x > cc.winSize.width / 4) {
    //   this.MainCamera.node.x = this.target.x - cc.winSize.width / 4;
    // } else if (this.target.x < -cc.winSize.width / 4) {
    //   this.MainCamera.node.x = this.target.x + cc.winSize.width / 4;
    // }

    // this.MainCamera.node.x = CMath.Clamp(
    //   this.MainCamera.node.x,
    //   cc.winSize.width / 2,
    //   -cc.winSize.width / 2
    // );
    this.MainCamera.node.x = this.target.x;

    // 镜头缩放
    if (this.isEnableCameraZoom) {
      let ratioX =
        1 - (Math.abs(this.MainCamera.node.x) / cc.winSize.width) * 2;

      // 计算y方向的缩放
      let ratioY = 1 - Math.abs(this.MainCamera.node.y) / cc.winSize.height;

      // ratioY /= this.zoomRatioSense;
      if (ratioY < this.minZoomRatio) ratioY = this.minZoomRatio;
      ratioY += (1 - ratioX) * (1 - ratioY);

      this.MainCamera.zoomRatio = ratioY;
    }
  }
}
export const gCamera = CameraController.inst;
