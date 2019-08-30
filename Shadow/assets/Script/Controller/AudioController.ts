import { HashMap } from "../Utils/HashMap";
import { gEventMgr } from "../Event/EventManager";
import { GlobalEvent } from "../Event/EventName";

interface AudioItem {
  loop: boolean;
  volume: number;
  clipName: string;
  supTime: number;
  skip: boolean;
}
class AudioController {
  private static ins: AudioController;
  private static PlayedList: AudioItem[] = [];
  private static canPlay: boolean =
    cc.sys.os.toLowerCase() != cc.sys.OS_IOS.toLowerCase();
  private static hasBindTouch: boolean = false;
  private constructor() {}
  public static get inst() {
    return this.ins ? this.ins : (this.ins = new AudioController());
  }

  private clips: HashMap<string, cc.AudioClip> = new HashMap();
  init(callback: Function) {
    let self = this;
    cc.loader.loadResDir("sounds", cc.AudioClip, function(
      err,
      clips: cc.AudioClip[],
      urls
    ) {
      if (err) {
        console.error(err);
      } else {
        for (let clip of clips) {
          self.clips.add(clip.name, clip);
        }
        self.initEvent();
        callback && callback();
      }
    });
  }

  initEvent() {
    gEventMgr.targetOff(this);
  }

  stop(clipName: string, audioID: number) {
    if (AudioController.canPlay) {
      cc.audioEngine.stop(audioID);
    } else {
      for (let clipItem of AudioController.PlayedList) {
        clipItem.skip = clipItem.clipName == clipName;
      }
    }
  }

  play(clipName: string, loop: boolean, volume: number = 1.0): number {
    if (!AudioController.canPlay && !AudioController.hasBindTouch) {
      AudioController.hasBindTouch = true;
      let self = this;
      let playFunc = function() {
        cc.game.canvas.removeEventListener("touchstart", playFunc);
        AudioController.canPlay = true;
        let item: AudioItem;
        while (
          (item = AudioController.PlayedList.pop()) &&
          self.clips.get(item.clipName) &&
          !item.skip
        ) {
          let audioID = cc.audioEngine.play(
            self.clips.get(item.clipName),
            item.loop,
            item.volume
          );
          cc.audioEngine.setCurrentTime(
            audioID,
            (Date.now() - item.supTime) / 1000
          );
        }
      };

      cc.game.canvas.addEventListener("touchstart", playFunc);
    }

    if (!this.clips.get(clipName)) return -1;

    if (AudioController.canPlay) {
      return cc.audioEngine.play(this.clips.get(clipName), loop, volume);
    } else {
      AudioController.PlayedList.push({
        clipName: clipName,
        loop: loop,
        volume: volume,
        supTime: Date.now(),
        skip: false
      });
      return -2;
    }
  }
}
/**
 * 只管理游戏内音频，UI的全部交给FairyUI
 */
export const gAudio = AudioController.inst;
