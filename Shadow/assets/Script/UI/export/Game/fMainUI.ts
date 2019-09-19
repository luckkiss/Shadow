/** This is an automatically generated class by FairyGUI. Please do not modify it. **/



export default class fMainUI extends fgui.GComponent {

	public m_ButtonTop:fgui.GButton;
	public m_ButtonBottom:fgui.GButton;

	public static URL:string = "ui://vmvonsvyv7i62";
    
	/** 创建界面实例，需要先加载包资源  */
	public static createInstanceSync():fMainUI {
        		return <fMainUI>(fgui.UIPackage.createObject("Game","fMainUI"));
	}

	/** 异步创建界面实例  */
	public static createInstance(complete: (gComponent: fgui.GComponent) => void): void {
	
		fgui.UIPackage.loadPackage('UI/dync/Game', function(err) {
      if (err) {
        console.error("load package error:", err);
      } else {
        complete(fgui.UIPackage.createObject("Game", "fMainUI").asCom);
      }
    });
	}

    /** 释放包资源，尽量不要，除非是一些不常用的小界面，并且必须单独一个包  */
  public static releaseInstance(): void {
      fgui.UIPackage.removePackage("Game");
  }

	protected onConstruct(): void {
      		this.m_ButtonTop = <fgui.GButton>(this.getChild("ButtonTop"));
		this.m_ButtonBottom = <fgui.GButton>(this.getChild("ButtonBottom"));
	}
}