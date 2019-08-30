import { templates } from "./ShaderTemplate";
const renderEngine = cc.renderer.renderEngine;
const Material = renderEngine.Material;
const renderer = renderEngine.renderer;
const gfx = renderEngine.gfx;

/**
 * 需要创建一下manager才能初始化自定义的shader
 */
export class ShaderManager {
  private static ins: ShaderManager;
  public static get inst() {
    return this.ins ? this.ins : (this.ins = new ShaderManager());
  }
  private constructor() {
    // init shader templates
    let programLib = cc.renderer["_forward"]["_programLib"];
    if (!programLib) {
      console.error("programLib not exist!");
      return;
    }
    for (let template of templates) {
      if (!programLib._templates[template.name]) {
        programLib.define(
          template.name,
          template.vert,
          template.frag,
          template.defines
        );
      }
    }
  }
}
if (CC_EDITOR) {
  ShaderManager.inst;
}

/** 渐变Material */
export class TransitionMaterial extends Material {
  private time: number = 0.0;
  private range: number = 0.1;
  constructor() {
    super();
    var pass = new renderer.Pass("transition_sprite");
    pass.setDepth(false, false);
    pass.setCullMode(gfx.CULL_NONE);
    pass.setBlend(
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA,
      gfx.BLEND_ONE_MINUS_SRC_ALPHA,
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA,
      gfx.BLEND_ONE_MINUS_SRC_ALPHA
    );

    var mainTech = new renderer.Technique(
      ["transparent"],
      [
        { name: "texture", type: renderer.PARAM_TEXTURE_2D },
        { name: "color", type: renderer.PARAM_COLOR4 },
        { name: "time", type: renderer.PARAM_FLOAT },
        { name: "range", type: renderer.PARAM_FLOAT }
      ],
      [pass]
    );

    this["_color"] = { r: 1, g: 1, b: 1, a: 1 };
    this["_effect"] = new renderer.Effect(
      [mainTech],
      {
        color: this._color,
        time: this.time,
        range: this.range
      },
      [
        { name: "useTexture", value: true },
        { name: "useModel", value: false },
        { name: "useColor", value: true }
      ]
    );

    this["_mainTech"] = mainTech;
    this["_texture"] = null;
  }

  get effect() {
    return this._effect;
  }

  get texture() {
    return this._texture;
  }

  set texture(val) {
    if (this._texture !== val) {
      this["_texture"] = val;
      this._effect.setProperty("texture", val.getImpl());
      this._texIds["texture"] = val.getId();
    }
  }

  get useModel() {
    return this._effect.getDefine("useModel");
  }

  set useModel(val) {
    this._effect.define("useModel", val);
  }

  get useTexture() {
    return this._effect.getDefine("useTexture");
  }

  set useTexture(val) {
    this._effect.define("useTexture", val);
  }

  get useColor() {
    return this._effect.getDefine("useColor");
  }

  set useColor(val) {
    this._effect.define("useColor", val);
  }

  setProperty(key: string, val: any) {
    this._effect.setProperty(key, val);
  }

  clone() {
    var copy = new TransitionMaterial();
    copy._mainTech.copy(this._mainTech);
    copy.texture = this.texture;
    copy.useTexture = this.useTexture;
    copy.useModel = this.useModel;
    copy.useColor = this.useColor;
    copy.updateHash();
    return copy;
  }
}

export class WaveMaterial extends Material {
  private time: number = 0.0;
  private range: number = 2;
  private deltaTime: number = 0;
  constructor() {
    super();
    var pass = new renderer.Pass("wave_sprite");
    pass.setDepth(false, false);
    pass.setCullMode(gfx.CULL_NONE);
    pass.setBlend(
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA,
      gfx.BLEND_ONE_MINUS_SRC_ALPHA,
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA,
      gfx.BLEND_ONE_MINUS_SRC_ALPHA
    );

    var mainTech = new renderer.Technique(
      ["transparent"],
      [
        { name: "texture", type: renderer.PARAM_TEXTURE_2D },
        { name: "color", type: renderer.PARAM_COLOR4 },
        { name: "time", type: renderer.PARAM_FLOAT },
        { name: "deltaTime", type: renderer.PARAM_FLOAT },
        { name: "range", type: renderer.PARAM_FLOAT }
      ],
      [pass]
    );

    this["_color"] = { r: 1, g: 1, b: 1, a: 1 };
    this["_effect"] = new renderer.Effect(
      [mainTech],
      {
        color: this._color,
        time: this.time,
        range: this.range,
        deltaTime: this.deltaTime
      },
      [
        { name: "useTexture", value: true },
        { name: "useModel", value: false },
        { name: "useColor", value: true }
      ]
    );

    this["_mainTech"] = mainTech;
    this["_texture"] = null;
  }

  get effect() {
    return this._effect;
  }

  get texture() {
    return this._texture;
  }

  set texture(val) {
    if (this._texture !== val) {
      this["_texture"] = val;
      this._effect.setProperty("texture", val.getImpl());
      this._texIds["texture"] = val.getId();
    }
  }

  get useModel() {
    return this._effect.getDefine("useModel");
  }

  set useModel(val) {
    this._effect.define("useModel", val);
  }

  get useTexture() {
    return this._effect.getDefine("useTexture");
  }

  set useTexture(val) {
    this._effect.define("useTexture", val);
  }

  get useColor() {
    return this._effect.getDefine("useColor");
  }

  set useColor(val) {
    this._effect.define("useColor", val);
  }

  setProperty(key: string, val: any) {
    this._effect.setProperty(key, val);
  }

  clone() {
    var copy = new TransitionMaterial();
    copy._mainTech.copy(this._mainTech);
    copy.texture = this.texture;
    copy.useTexture = this.useTexture;
    copy.useModel = this.useModel;
    copy.useColor = this.useColor;
    copy.updateHash();
    return copy;
  }
}

export class ButterflySpringMaterial extends Material {
  constructor() {
    super();
    var pass = new renderer.Pass("butterfly_spring");
    pass.setDepth(false, false);
    pass.setCullMode(gfx.CULL_NONE);
    pass.setBlend(
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA,
      gfx.BLEND_ONE_MINUS_SRC_ALPHA,
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA,
      gfx.BLEND_ONE_MINUS_SRC_ALPHA
    );

    var mainTech = new renderer.Technique(
      ["transparent"],
      [
        { name: "texture", type: renderer.PARAM_TEXTURE_2D },
        { name: "color", type: renderer.PARAM_COLOR4 }
      ],
      [pass]
    );

    this["_color"] = { r: 1, g: 1, b: 1, a: 1 };
    this["_effect"] = new renderer.Effect(
      [mainTech],
      {
        color: this._color
      },
      [
        { name: "useTexture", value: true },
        { name: "useModel", value: false },
        { name: "useColor", value: true }
      ]
    );

    this["_mainTech"] = mainTech;
    this["_texture"] = null;
  }

  get effect() {
    return this._effect;
  }

  get texture() {
    return this._texture;
  }

  set texture(val) {
    if (this._texture !== val) {
      this["_texture"] = val;
      this._effect.setProperty("texture", val.getImpl());
      this._texIds["texture"] = val.getId();
    }
  }

  get useModel() {
    return this._effect.getDefine("useModel");
  }

  set useModel(val) {
    this._effect.define("useModel", val);
  }

  get useTexture() {
    return this._effect.getDefine("useTexture");
  }

  set useTexture(val) {
    this._effect.define("useTexture", val);
  }

  get useColor() {
    return this._effect.getDefine("useColor");
  }

  set useColor(val) {
    this._effect.define("useColor", val);
  }

  setProperty(key: string, val: any) {
    this._effect.setProperty(key, val);
  }

  setDefine(key: string, val: any) {
    this._effect.define(key, val);
  }

  clone() {
    var copy = new TransitionMaterial();
    copy._mainTech.copy(this._mainTech);
    copy.texture = this.texture;
    copy.useTexture = this.useTexture;
    copy.useModel = this.useModel;
    copy.useColor = this.useColor;
    copy.updateHash();
    return copy;
  }
}

export class PointWaveMaterial extends Material {
  private time: number = 0.0;
  private range: number = 2;
  private deltaTime: number = 0;
  private point: cc.Vec2 = cc.v2(0, 0);
  constructor() {
    super();
    var pass = new renderer.Pass("point_wave");
    pass.setDepth(false, false);
    pass.setCullMode(gfx.CULL_NONE);
    pass.setBlend(
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA,
      gfx.BLEND_ONE_MINUS_SRC_ALPHA,
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA,
      gfx.BLEND_ONE_MINUS_SRC_ALPHA
    );

    var mainTech = new renderer.Technique(
      ["transparent"],
      [
        { name: "texture", type: renderer.PARAM_TEXTURE_2D },
        { name: "color", type: renderer.PARAM_COLOR4 },
        { name: "point", type: renderer.PARAM_FLOAT2 },
        { name: "time", type: renderer.PARAM_FLOAT },
        { name: "deltaTime", type: renderer.PARAM_FLOAT },
        { name: "range", type: renderer.PARAM_FLOAT }
      ],
      [pass]
    );

    this["_color"] = { r: 1, g: 1, b: 1, a: 1 };
    this["_effect"] = new renderer.Effect(
      [mainTech],
      {
        color: this._color,
        time: this.time,
        range: this.range,
        deltaTime: this.deltaTime,
        point: this.point
      },
      [
        { name: "useTexture", value: true },
        { name: "useModel", value: false },
        { name: "useColor", value: true }
      ]
    );

    this["_mainTech"] = mainTech;
    this["_texture"] = null;
  }

  get effect() {
    return this._effect;
  }

  get texture() {
    return this._texture;
  }

  set texture(val) {
    if (this._texture !== val) {
      this["_texture"] = val;
      this._effect.setProperty("texture", val.getImpl());
      this._texIds["texture"] = val.getId();
    }
  }

  get useModel() {
    return this._effect.getDefine("useModel");
  }

  set useModel(val) {
    this._effect.define("useModel", val);
  }

  get useTexture() {
    return this._effect.getDefine("useTexture");
  }

  set useTexture(val) {
    this._effect.define("useTexture", val);
  }

  get useColor() {
    return this._effect.getDefine("useColor");
  }

  set useColor(val) {
    this._effect.define("useColor", val);
  }

  setProperty(key: string, val: any) {
    this._effect.setProperty(key, val);
  }
  setDefine(key: string, val: any) {
    this._effect.define(key, val);
  }
  clone() {
    var copy = new TransitionMaterial();
    copy._mainTech.copy(this._mainTech);
    copy.texture = this.texture;
    copy.useTexture = this.useTexture;
    copy.useModel = this.useModel;
    copy.useColor = this.useColor;
    copy.updateHash();
    return copy;
  }
}

export class PixelStyleMaterial extends Material {
  constructor() {
    super();
    var pass = new renderer.Pass("pixel_style");
    pass.setDepth(false, false);
    pass.setCullMode(gfx.CULL_NONE);
    pass.setBlend(
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA,
      gfx.BLEND_ONE_MINUS_SRC_ALPHA,
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA,
      gfx.BLEND_ONE_MINUS_SRC_ALPHA
    );

    var mainTech = new renderer.Technique(
      ["transparent"],
      [
        { name: "texture", type: renderer.PARAM_TEXTURE_2D },
        { name: "color", type: renderer.PARAM_COLOR4 },
        { name: "sampleCount", type: renderer.PARAM_FLOAT }
      ],
      [pass]
    );

    this["_color"] = { r: 1, g: 1, b: 1, a: 1 };
    this["_effect"] = new renderer.Effect(
      [mainTech],
      {
        color: this._color,
        sampleCount: 100
      },
      [
        { name: "useTexture", value: true },
        { name: "useModel", value: false },
        { name: "disableColor", value: false },
        { name: "useColor", value: true }
      ]
    );

    this["_mainTech"] = mainTech;
    this["_texture"] = null;
  }

  get effect() {
    return this._effect;
  }

  get texture() {
    return this._texture;
  }

  set texture(val) {
    if (this._texture !== val) {
      this["_texture"] = val;
      this._effect.setProperty("texture", val.getImpl());
      this._texIds["texture"] = val.getId();
    }
  }

  get useModel() {
    return this._effect.getDefine("useModel");
  }

  set useModel(val) {
    this._effect.define("useModel", val);
  }

  get useTexture() {
    return this._effect.getDefine("useTexture");
  }

  set useTexture(val) {
    this._effect.define("useTexture", val);
  }

  get useColor() {
    return this._effect.getDefine("useColor");
  }

  set useColor(val) {
    this._effect.define("useColor", val);
  }

  setProperty(key: string, val: any) {
    this._effect.setProperty(key, val);
  }
  setDefine(key: string, val: any) {
    this._effect.define(key, val);
  }
  clone() {
    var copy = new TransitionMaterial();
    copy._mainTech.copy(this._mainTech);
    copy.texture = this.texture;
    copy.useTexture = this.useTexture;
    copy.useModel = this.useModel;
    copy.useColor = this.useColor;
    copy.updateHash();
    return copy;
  }
}

export class PixelSpineMaterial extends Material {
  constructor() {
    super();
    var pass = new renderer.Pass("spine_pxiel");
    pass.setDepth(false, false);
    pass.setCullMode(gfx.CULL_NONE);
    pass.setBlend(
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA,
      gfx.BLEND_ONE_MINUS_SRC_ALPHA,
      gfx.BLEND_FUNC_ADD,
      gfx.BLEND_SRC_ALPHA,
      gfx.BLEND_ONE_MINUS_SRC_ALPHA
    );

    var mainTech = new renderer.Technique(
      ["transparent"],
      [
        { name: "texture", type: renderer.PARAM_TEXTURE_2D },
        { name: "sampleCount", type: renderer.PARAM_FLOAT }
      ],
      [pass]
    );

    this["_effect"] = new renderer.Effect(
      [mainTech],
      {
        sampleCount: 100
      },
      [
        { name: "useModel", value: true },
        { name: "disableColor", value: false },
        { name: "alphaTest", value: false },
        { name: "use2DPos", value: true },
        { name: "useTint", value: false }
      ]
    );

    this["_mainTech"] = mainTech;
    this["_texture"] = null;
  }

  get effect() {
    return this._effect;
  }

  get texture() {
    return this._texture;
  }

  set texture(val) {
    if (this._texture !== val) {
      this["_texture"] = val;
      this._effect.setProperty("texture", val.getImpl());
      this._texIds["texture"] = val.getId();
    }
  }

  get useModel() {
    return this._effect.getDefine("useModel");
  }

  set useModel(val) {
    this._effect.define("useModel", val);
  }

  get use2DPos() {
    return this._effect.getDefine("use2DPos");
  }

  set use2DPos(val) {
    this._effect.define("use2DPos", val);
  }

  get alphaTest() {
    return this._effect.getDefine("alphaTest");
  }

  set alphaTest(val) {
    this._effect.define("alphaTest", val);
  }

  get useTint() {
    return this._effect.getDefine("useTint");
  }

  set useTint(val) {
    this._effect.define("useTint", val);
  }

  setProperty(key: string, val: any) {
    this._effect.setProperty(key, val);
  }

  setDefine(key: string, val: any) {
    this._effect.define(key, val);
  }
  clone() {
    var copy = new TransitionMaterial();
    copy._mainTech.copy(this._mainTech);
    copy.texture = this.texture;
    copy.useTexture = this.useTexture;
    copy.useModel = this.useModel;
    copy.updateHash();
    return copy;
  }
}
