declare class Dialog {
	constructor();
	public WinTools: WinTools;
	public showDialog(
		message?: string,
		title?: string,
		type?: MessageTypeString,
		button?: ButtonString,
		defaultButton?: ButtonDefaultString,
		icon?: IconString,
	): Promise<Response>;
	public showInputBox(
		message?: string,
		title?: string,
		defaultText?: string,
		xPos?: number,
		yPos?: number,
	): Promise<Response>;

	public showOpenFileDialog(
		multiFile?: boolean,
		title?: string,
		...filterData: filterData[]
	): Promise<Response>;

	public showFolderDialog(description?: string): Promise<Response>;
}

declare class WinTools {
	public readonly client: Dialog;
	public readonly ready: boolean;
	public setup(): WinTools;
	public exitWin(mode?: ExitWinMode, force?: boolean): Promise<string>;
	public monitor(mode?: MonitorMode): Promise<string>;
	public restartExplorer(): Promise<string>;
	public beep(freq: number, duration: number): Promise<string>;
	public windowsBeep(): Promise<string>;
	public cdrom(open?: boolean, name?: string): Promise<string>;
	public mute(): Promise<string>;
	public unmute(): Promise<string>;
	public setVolume(volume: number): Promise<string>;
	public setCursor(x: number, y: number): Promise<string>;
	public moveCursor(x: number, y: number): Promise<string>;
	public fakeKey(key: string, mode?: KeypressMode): Promise<string>;
	public fakeMouse(mouse?: MouseMode, mode?: MousepressMode): Promise<string>;
	public trayBalloon(title: string, text: string, iconPath: string, timeout?: number): Promise<string>;
	public playMedia(path: string, duration: number): Promise<string>;
}

declare type ExitWinMode = 'logoff'| 'shutdown'| 'reboot'| 'poweroff'| 'cancel'| 'sleep'| 'standby'| 'hibernate';

declare type MonitorMode = 'off'| 'on'| 'low';

declare type KeypressMode = 'press'| 'down'| 'up';

declare type MousepressMode = KeypressMode | 'dblclick';

declare type MouseMode = 'left'| 'right'| 'middle'| 'wheel';

declare type filterData = {
    name: string;
    ext: string;
}

declare type Response = {
	exitCode: number;
	msgOut: string;
	msgErr: string;
	isError: boolean;
	data: ReturnButton | string | string[] | any;
};

declare type ReturnButton =
	| 'OK'
	| 'CANCEL'
	| 'ABORT'
	| 'RETRY'
	| 'IGNORE'
	| 'YES'
	| 'NO';

declare type ButtonString =
	| 'OK'
	| 'OK_CANCEL'
	| 'ABORT_RETRY_IGNORE'
	| 'YES_NO_CANCEL'
	| 'YES_NO'
	| 'RETRY_CANCEL'
	| 'DEFAULT';

declare type IconString =
	| 'ERROR'
	| 'QUESTION'
	| 'WARNING'
	| 'INFORMATION'
	| 'NONE';

declare type ButtonDefaultString =
	| 'FIRST'
	| 'SECOND'
	| 'THIRD'
	| 'FOURTH'
	| 'DEFAULT';

declare type MessageTypeString = 'APPLICATION' | 'SYSTEM' | 'DEFAULT';

export = Dialog;
