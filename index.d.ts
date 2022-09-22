declare class Dialog {
	constructor();
	public workingDir: string;
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

	public showFolderDialog(
        description?: string,
    ): Promise<Response>;
}

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
