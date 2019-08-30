/**
* 导出表自动生成的表数据声明
*/
    /** Monster_ball__monster的怪物类型*/
    export enum Monster_ball__monster_monster{
        /** 小怪 */
        XiaoGuai = 1,
        /** BOSS */
        BOSS = 2,
    };

    /** Monster_ball__monster的移动类型*/
    export enum Monster_ball__monster_type_1{
        /** 固定位置不动 */
        GuDingWeiZhiBuDong = 1,
        /** 陆地平移 */
        LuDiPingYi = 2,
        /** 飞行平移 */
        FeiHangPingYi = 3,
        /** 全图瞬移 */
        QuanTuShunYi = 4,
    };

    /** Monster_ball__monster的移动类型*/
    export enum Monster_ball__monster_type_2{
        /** 陆地平移 */
        LuDiPingYi = 1,
        /** 飞行平移 */
        FeiHangPingYi = 2,
        /** 全图瞬移 */
        QuanTuShunYi = 3,
        /** 固定位置不动 */
        GuDingWeiZhiBuDong = 4,
    };

    /** Monster_ball__monster的移动类型*/
    export enum Monster_ball__monster_type_3{
        /** 陆地平移 */
        LuDiPingYi = 1,
        /** 飞行平移 */
        FeiHangPingYi = 2,
        /** 全图瞬移 */
        QuanTuShunYi = 3,
        /** 固定位置不动 */
        GuDingWeiZhiBuDong = 4,
    };

    /** Monster_ball_ball的球的类型*/
    export enum Monster_ball_ball_form{
        /** 普通 */
        PuTong = 1,
        /** 炸弹 */
        ZhaDan = 2,
        /** 电击麻痹 */
        DianJiMaBi = 3,
    };

    /** Monster_ball_paly_level的关卡类型*/
    export enum Monster_ball_paly_level_form{
        /** 普通关卡 */
        PuTongGuanQia = 1,
        /** BOSS关 */
        BOSSGuan = 2,
    };

    /** Monster_ball_prop的道具的类型*/
    export enum Monster_ball_prop_form{
        /** 恢复耐久度 */
        HuiFuNaiJiuDu = 1,
        /** 全屏攻击怪物 */
        QuanPingGongJiGuaiWu = 2,
        /** 全部怪物停顿 */
        QuanBuGuaiWuTingDun = 3,
        /** 加分数 */
        JiaFenShu = 4,
    };




    /** 表 Monster_ball__monster数据结构 */
    export interface Monster_ball__monster {
        /** 编号 */
        ID:number;
        /** 怪物类型 */
        monster:number;
        /** 名称 */
        name:string;
        /** 模型ID */
        mod:number;
        /** 得分 */
        score:number;
        /** 血量1 */
        hp_1:number;
        /** 攻击力 */
        attack_1:number;
        /** 攻击频率s */
        hz_1:number;
        /** 攻击间隔s */
        interval:number;
        /** 停留时间 */
        stop:number;
        /** 移动类型 */
        type_1:number;
        /** 移动速度 */
        speed_1:number;
        /** 血量2 */
        hp_2:number;
        /** 攻击力_1 */
        attack_2:number;
        /** 攻击频率s_1 */
        hz_2:number;
        /** 移动类型_1 */
        type_2:number;
        /** 移动速度_1 */
        speed_2:number;
        /** 血量3 */
        hp_3:number;
        /** 攻击力_2 */
        attack_3:number;
        /** 攻击频率s_2 */
        hz_3:number;
        /** 移动类型_2 */
        type_3:number;
        /** 移动速度_2 */
        speed_3:number;
        /** 智能 */
        ai:string;
    };

    /** 表 Monster_ball_ball数据结构 */
    export interface Monster_ball_ball {
        /** 编号 */
        ID:number;
        /** 名称 */
        name:string;
        /** 球的类型 */
        form:number;
        /** 持续时间 */
        continue:number;
        /** 使用寿命s */
        lifetime:number;
        /** 攻击力 */
        attack:number;
        /** 耐久度 */
        durable:number;
        /** 连击加分 */
        combo:number;
    };

    /** 表 Monster_ball_evaluate数据结构 */
    export interface Monster_ball_evaluate {
        /** 编号 */
        ID:number;
        /** 评价 */
        evaluate:string[];
        /** 最低分 */
        min:number;
        /** 最高分 */
        max:number;
    };

    /** 表 Monster_ball_paly_level数据结构 */
    export interface Monster_ball_paly_level {
        /** 编号 */
        ID:string;
        /** 关卡类型 */
        form:number;
        /** 关卡地图 */
        map:number;
        /** 插入剧情 */
        dialogue:number;
        /** 关卡血量 */
        hp:number;
        /** 出身点1怪物 */
        monster1:string[];
        /** 出身点2怪物 */
        monster2:string[];
        /** 出身点3怪物 */
        monster3:string[];
        /** 最大怪物数量 */
        monste_max:number;
        /** 配置的球 */
        ball:string[];
        /** 配置道具 */
        prop:string[];
        /** 最大道具数量 */
        prop_max:number;
        /** 基本分数 */
        score:number;
        /** 剩余血量完成 */
        hp_mini:number;
        /** 增加分数 */
        subjoin:number;
    };

    /** 表 Monster_ball_prop数据结构 */
    export interface Monster_ball_prop {
        /** 编号 */
        ID:number;
        /** 名称 */
        name:string;
        /** 道具的类型 */
        form:number;
        /** 持续时间 */
        continue:number;
        /** 攻击力 */
        attack:number;
        /** 恢复 */
        recover:number;
        /** 停止 */
        stop:number;
        /** 增加分数 */
        subjoin:number;
    };

    /** 表 Monster_ball_scene数据结构 */
    export interface Monster_ball_scene {
        /** 编号 */
        ID:number;
        /** 名称 */
        name:string;
    };

    /** 表 Monster_ball_text数据结构 */
    export interface Monster_ball_text {
        /** 编号 */
        ID:number;
        /** 名称 */
        name:string;
        /** 中文字 */
        text1:string;
        /** 英文 */
        text2:string;
    };

