import { Monster_ball__monster,Monster_ball_ball,Monster_ball_evaluate,Monster_ball_paly_level,Monster_ball_prop,Monster_ball_scene,Monster_ball_text,} from  './table';

/**
* json数据管理
*/

export class TableMgr {  
    private static ins: TableMgr;
    public static JSON_URL: string = "";
    public static get inst() {
        return this.ins ? this.ins : (this.ins = new TableMgr());
    }

    private constructor() {}

    private load = TableMgr.JSON_URL && TableMgr.JSON_URL != "" ? cc.loader.load.bind(cc.loader) : cc.loader.loadRes.bind(cc.loader);
    private fileFormat = TableMgr.JSON_URL && TableMgr.JSON_URL != "" ? ".json?time=" + Date.now() : "";
    private total: number = 0;
    private complete: number = 0;
    private completeCallback: () => void;
    private progressCallback: (progress: number) => void;
    /** 
    *
    * @param url json 路径
    * @param complete
    * @param progress
    */
    startLoad(url: string, complete: () => void, progress?: (progress: number) => void) {
        this.completeCallback = complete;
        this.progressCallback = progress;

        let self = this;
        this.load(TableMgr.JSON_URL + url.trim().split('/').join('') + '/file_list' + this.fileFormat, function(err, JsonAsset: cc.JsonAsset) {
            if (err) {
                console.error(err.errorMessage);
            } else {
                let jsonArray = JsonAsset.constructor["name"] == "Array" ? JsonAsset : JsonAsset.json;
                 this.total = jsonArray.length;
                 for (let jsonFile of jsonArray) {
                     self.loadJson(url.trim().split('/').join('')+'/' + jsonFile.replace('.json', ''));
                 }
            }
            }.bind(this)
        );
    }
        
    private loadJson(url) {
        console.log('start load:' + url);
        
        let self = this;
        let tableName = url.split("/")[1];
        this.load(TableMgr.JSON_URL + url + this.fileFormat, function(err, JsonAsset: cc.JsonAsset) {
            if (err) {
                console.error(err.errorMessage);
            } else {
                let jsonArray = JsonAsset.constructor["name"] == "Array" ? JsonAsset : JsonAsset.json;
                for (let json of jsonArray) {
                    self[tableName][json['ID']] = json;
                }
                self.completeLoad();
            }
        }.bind(this));
    }
    private completeLoad() {
        this.complete++;
        if (this.complete >= this.total) {
            if (this.completeCallback) this.completeCallback();
        }
    }
private Monster_ball__monster: any = {};
private Monster_ball_ball: any = {};
private Monster_ball_evaluate: any = {};
private Monster_ball_paly_level: any = {};
private Monster_ball_prop: any = {};
private Monster_ball_scene: any = {};
private Monster_ball_text: any = {};
 public getMonster_ball__monster (key: string|number) : Monster_ball__monster{
    if (this.Monster_ball__monster[key]){
 return this.Monster_ball__monster[key];
}
 else { console.error('Monster_ball__monster 不存key：'+key); return null;}
 }
 public getAll_Monster_ball__monster_Data() : any{
 return this.Monster_ball__monster;}
 public getMonster_ball_ball (key: string|number) : Monster_ball_ball{
    if (this.Monster_ball_ball[key]){
 return this.Monster_ball_ball[key];
}
 else { console.error('Monster_ball_ball 不存key：'+key); return null;}
 }
 public getAll_Monster_ball_ball_Data() : any{
 return this.Monster_ball_ball;}
 public getMonster_ball_evaluate (key: string|number) : Monster_ball_evaluate{
    if (this.Monster_ball_evaluate[key]){
 return this.Monster_ball_evaluate[key];
}
 else { console.error('Monster_ball_evaluate 不存key：'+key); return null;}
 }
 public getAll_Monster_ball_evaluate_Data() : any{
 return this.Monster_ball_evaluate;}
 public getMonster_ball_paly_level (key: string|number) : Monster_ball_paly_level{
    if (this.Monster_ball_paly_level[key]){
 return this.Monster_ball_paly_level[key];
}
 else { console.error('Monster_ball_paly_level 不存key：'+key); return null;}
 }
 public getAll_Monster_ball_paly_level_Data() : any{
 return this.Monster_ball_paly_level;}
 public getMonster_ball_prop (key: string|number) : Monster_ball_prop{
    if (this.Monster_ball_prop[key]){
 return this.Monster_ball_prop[key];
}
 else { console.error('Monster_ball_prop 不存key：'+key); return null;}
 }
 public getAll_Monster_ball_prop_Data() : any{
 return this.Monster_ball_prop;}
 public getMonster_ball_scene (key: string|number) : Monster_ball_scene{
    if (this.Monster_ball_scene[key]){
 return this.Monster_ball_scene[key];
}
 else { console.error('Monster_ball_scene 不存key：'+key); return null;}
 }
 public getAll_Monster_ball_scene_Data() : any{
 return this.Monster_ball_scene;}
 public getMonster_ball_text (key: string|number) : Monster_ball_text{
    if (this.Monster_ball_text[key]){
 return this.Monster_ball_text[key];
}
 else { console.error('Monster_ball_text 不存key：'+key); return null;}
 }
 public getAll_Monster_ball_text_Data() : any{
 return this.Monster_ball_text;}
}