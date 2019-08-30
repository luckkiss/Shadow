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
  MONSTER = 1 << 1,
  BALL = 1 << 2,
  BACKGROUND = 1 << 3,
  ITEM = 1 << 4,
  DONE = Step.MONSTER | Step.BALL | Step.BACKGROUND | Step.ITEM
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
    this.doneCallback();
  }

  private nextStep(step: Step) {
    this.step |= step;
    console.log("Factory Step:" + Step[step]);
    if (this.step >= Step.DONE) {
      this.doneCallback && this.doneCallback();
    }
  }

  private monstersPool: HashMap<string | number, ObjPool> = new HashMap();
  initMonsters() {
    let monsters = TableMgr.inst.getAll_Monster_ball__monster_Data();
    let self = this;
    let count = 0;
    let total = 0;
    for (let id in monsters) total++;
    for (let id in monsters) {
      let url = "Prefabs/Monster/Monster-" + monsters[id].mod;
      cc.loader.loadRes(url, cc.Prefab, (err, prefab) => {
        if (err) {
          console.error(err);
        } else {
          let monsterNode = cc.instantiate(prefab);
          self.monstersPool.add(id, new ObjPool(monsterNode, 10));
          count++;
          if (count >= total) {
            self.nextStep(Step.MONSTER);
          }
        }
      });
    }
  }

  private ballPool: HashMap<string, ObjPool> = new HashMap();
  initBalls() {
    let balls = TableMgr.inst.getAll_Monster_ball_ball_Data();
    console.log(balls);
    let self = this;
    let count = 0;
    let total = 0;
    for (let id in balls) total++;
    for (let id in balls) {
      let url = "Prefabs/Ball/Ball-" + id;
      cc.loader.loadRes(url, cc.Prefab, (err, prefab) => {
        if (err) {
          console.error(err);
        } else {
          let ball = cc.instantiate(prefab);
          self.ballPool.add(id, new ObjPool(ball, 10));
          count++;
          if (count >= total) {
            self.nextStep(Step.BALL);
          }
        }
      });
    }
  }

  private scenePool: HashMap<string, ObjPool> = new HashMap();
  initBackground() {
    let scenes = TableMgr.inst.getAll_Monster_ball_scene_Data();
    let self = this;
    let count = 0;
    let total = 0;
    for (let id in scenes) total++;
    for (let id in scenes) {
      let url = "Prefabs/Background/Background-" + id;
      cc.loader.loadRes(url, cc.Prefab, (err, prefab) => {
        if (err) {
          console.error(err);
        } else {
          let scene = cc.instantiate(prefab);
          self.scenePool.add(id, new ObjPool(scene, 1));
          count++;
          if (count >= total) {
            self.nextStep(Step.BACKGROUND);
          }
        }
      });
    }
  }

  private itemPool: HashMap<string, ObjPool> = new HashMap();
  initItems() {
    let items = TableMgr.inst.getAll_Monster_ball_prop_Data();
    let self = this;
    let count = 0;
    let total = 0;
    for (let id in items) total++;
    for (let id in items) {
      let url = "Prefabs/Item/Item-" + id;
      cc.loader.loadRes(url, cc.Prefab, (err, prefab) => {
        if (err) {
          console.error(err);
        } else {
          let item = cc.instantiate(prefab);
          self.itemPool.add(id, new ObjPool(item, 10));
          count++;
          if (count >= total) {
            self.nextStep(Step.ITEM);
          }
        }
      });
    }
  }

  getMonster(monsterID: string | number, ...args): cc.Node {
    return this.monstersPool.get(monsterID).get(args);
  }

  getBall(ballID: string, ...args): cc.Node {
    return this.ballPool.get(ballID).get(args);
  }

  putMonster(monsterID: string, monster: cc.Node) {
    this.monstersPool.get(monsterID).put(monster);
  }

  putBall(ballID: string, ball: cc.Node) {
    this.ballPool.get(ballID).put(ball);
  }

  getBackground(sceneID: string, ...args): cc.Node {
    return this.scenePool.get(sceneID).get(args);
  }

  putBackground(sceneID: string, scene: cc.Node) {
    this.scenePool.get(sceneID).put(scene);
  }

  getItems(itemID: string, ...args): cc.Node {
    console.log(itemID);
    return this.itemPool.get(itemID).get(args);
  }

  puItems(itemID: string, item: cc.Node) {
    this.itemPool.get(itemID).put(item);
  }
}

export const gFactory = GameFactory.inst;
