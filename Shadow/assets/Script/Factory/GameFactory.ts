import { TableMgr } from "../TableMgr";
import { HashMap } from "../Utils/HashMap";

class ObjPool {
  private _pool = [];
  private poolHandlerComps = [];
  private template: cc.Node;
  constructor(template: cc.Node, initSize: number, poolHandlerComps?: any[]) {
    this.poolHandlerComps = poolHandlerComps;
    this.template = template;
    this.initPool(initSize);
  }

  initPool(size: number) {
    for (let i = 0; i < size; ++i) {
      let newNode = cc.instantiate(this.template);
      this.put(newNode);
    }
  }

  size() {
    return this._pool.length;
  }

  clear() {
    var count = this._pool.length;
    for (var i = 0; i < count; ++i) {
      this._pool[i].destroy && this._pool[i].destroy();
    }
    this._pool.length = 0;
  }

  put(obj: any) {
    if (obj && this._pool.indexOf(obj) === -1) {
      // Remove from parent, but don't cleanup
      obj.removeFromParent(false);

      // Invoke pool handler
      if (this.poolHandlerComps) {
        let handlers = this.poolHandlerComps;
        for (let handler of handlers) {
          let comp = obj.getComponent(handler);
          if (comp && comp.unuse) {
            comp.unuse.apply(comp);
          }
        }
      } else {
        let handlers = obj.getComponents(cc.Component);
        for (let handler of handlers) {
          if (handler && handler.unuse) {
            handler.unuse.apply(handler);
          }
        }
      }

      this._pool.push(obj);
    }
  }

  get(..._) {
    var last = this._pool.length - 1;
    if (last < 0) {
      console.warn(" last < 0 ");
      this.initPool(10);
    }
    last = this._pool.length - 1;
    // Pop the last object in pool
    var obj = this._pool[last];
    this._pool.length = last;

    // Invoke pool handler
    if (this.poolHandlerComps) {
      let handlers = this.poolHandlerComps;
      for (let handler of handlers) {
        let comp = obj.getComponent(handler);
        if (comp && comp.reuse) {
          comp.reuse.apply(comp, arguments);
        }
      }
    } else {
      let handlers = obj.getComponents(cc.Component);
      for (let handler of handlers) {
        if (handler && handler.reuse) {
          handler.reuse.apply(handler, arguments);
        }
      }
    }
    return obj;
  }
}

enum Step {
  INIT = 0,
  BLOCK_LOW,
  BLOCK_HIGH,
  DONE = Step.BLOCK_LOW | Step.BLOCK_HIGH
}

class GameFactory {
  private static ins: GameFactory;
  public static get inst() {
    return this.ins ? this.ins : (this.ins = new GameFactory());
  }
  private constructor() {}

  private step: Step = Step.INIT;
  private doneCallback: Function;
  init(callback: Function) {
    this.doneCallback = callback;
    this.initBlockLow();
    this.initBlockHigh();
  }

  private nextStep(step: Step) {
    this.step |= step;
    console.log("Factory Step:" + Step[step]);
    if (this.step >= Step.DONE) {
      this.doneCallback && this.doneCallback();
    }
  }

  private blockLowPool: ObjPool;
  initBlockLow() {
    let self = this;
    cc.loader.loadRes("Prefabs/blockLow", cc.Prefab, (err, prefab) => {
      if (err) {
        console.error(err);
      } else {
        let item = cc.instantiate(prefab);
        self.blockLowPool = new ObjPool(item, 100);
        self.nextStep(Step.BLOCK_LOW);
      }
    });
  }

  private blockHighPool: ObjPool;
  initBlockHigh() {
    let self = this;
    cc.loader.loadRes("Prefabs/blockHigh", cc.Prefab, (err, prefab) => {
      if (err) {
        console.error(err);
      } else {
        let item = cc.instantiate(prefab);
        self.blockHighPool = new ObjPool(item, 100);
        self.nextStep(Step.BLOCK_HIGH);
      }
    });
  }

  getLowBlock(...args) {
    return this.blockLowPool.get(...args);
  }

  putLowBlock(block: cc.Node) {
    this.blockLowPool.put(block);
  }

  getHighBlock(...args) {
    return this.blockHighPool.get(...args);
  }

  putHighBlock(block: cc.Node) {
    this.blockHighPool.put(block);
  }
}

export const gFactory = GameFactory.inst;
