class GameCtrl {
  private static ins: GameCtrl;
  public static get inst() {
    return this.ins ? this.ins : (this.ins = new GameCtrl());
  }

  public speed: number = 400;
  public score: number = 0;
  private constructor() {}
}

/**
 * 游戏全局对象
 */
export const Game = GameCtrl.inst;
