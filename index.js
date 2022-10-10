const child = require('child_process');
const path = require('path');
const fs = require('fs');
const WinTools = require('./WinTools.js');
const config = require('./config.js');

const Button = {
	OK: 0,
	OK_CANCEL: 1,
	ABORT_RETRY_IGNORE: 2,
	YES_NO_CANCEL: 3,
	YES_NO: 4,
	RETRY_CANCEL: 5,
	0: 'OK',
	1: 'OK_CANCEL',
	2: 'ABORT_RETRY_IGNORE',
	3: 'YES_NO_CANCEL',
	4: 'YES_NO',
	5: 'RETRY_CANCEL',
	DEFAULT: 0,
};

const Icon = {
	ERROR: 16,
	QUESTION: 32,
	WARNING: 48,
	INFORMATION: 64,
	16: 'ERROR',
	32: 'QUESTION',
	48: 'WARNING',
	64: 'INFORMATION',
	DEFAULT: 0,
	NONE: 0,
	0: 'NONE',
};

const buttonDefault = {
	FIRST: 0,
	SECOND: 256,
	THIRD: 512,
	FOURTH: 768,
	0: 'FIRST',
	256: 'SECOND',
	512: 'THIRD',
	768: 'FOURTH',
	DEFAULT: 0,
};

const messageType = {
	APPLICATION: 0,
	SYSTEM: 4096,
	0: 'APPLICATION',
	4096: 'SYSTEM',
	DEFAULT: 0,
};

const returnButton = {
	1: 'OK',
	2: 'CANCEL',
	3: 'ABORT',
	4: 'RETRY',
	5: 'IGNORE',
	6: 'YES',
	7: 'NO',
};


function _runFile(...args) {
	args = args.flat(2);
	return new Promise(async (resolve, reject) => {
		await child.exec(args.join(' '), (err, stdout, stderr) => {
			resolve({
				exitCode: 0,
				msgOut: stdout,
				msgErr: stderr,
				isError: Boolean(stderr),
				data: stdout.replace(/\r\n/gi, '\n').split('\n').filter(f => f.length > 0),
			});
		});
	});
}

function _runFolder(...args) {
	args = args.flat(2);
	return new Promise(async (resolve, reject) => {
		await child.exec(args.join(' '), (err, stdout, stderr) => {
			resolve({
				exitCode: 0,
				msgOut: stdout,
				msgErr: '',
				isError: false,
				data: stdout.includes('ECHO is off.') ? undefined : stdout.replace(/\r\n/gi, ''),
			});
		});
	});
}

function parseOptionDialog(type, button, defaultButton, icon) {
	if (type === undefined) {
		type = messageType.DEFAULT;
	}
	if (button === undefined) {
		button = Button.DEFAULT;
	}
	if (defaultButton === undefined) {
		defaultButton = buttonDefault.DEFAULT;
	}
	if (icon === undefined) {
		icon = Icon.DEFAULT;
	}
	if (typeof type === 'number') {
		const type_ = messageType[type];
		if (type_ === undefined) throw new Error('Invalid messageType ' + type);
	}
	if (typeof button === 'number') {
		const button_ = Button[button];
		if (button_ === undefined) throw new Error('Invalid Button ' + button);
	}
	if (typeof defaultButton === 'number') {
		const defaultButton_ = buttonDefault[defaultButton];
		if (defaultButton_ === undefined)
			throw new Error('Invalid buttonDefault ' + defaultButton);
	}
	if (typeof icon === 'number') {
		const icon_ = Icon[icon];
		if (icon_ === undefined) throw new Error('Invalid Icon ' + icon);
	}
	if (typeof type === 'string') {
		const type_ = messageType[type];
		if (type_ === undefined) throw new Error('Invalid messageType ' + type);
		type = type_;
	}
	if (typeof button === 'string') {
		const button_ = Button[button];
		if (button_ === undefined) throw new Error('Invalid Button ' + button);
		button = button_;
	}
	if (typeof defaultButton === 'string') {
		const defaultButton_ = buttonDefault[defaultButton];
		if (defaultButton_ === undefined)
			throw new Error('Invalid buttonDefault ' + defaultButton);
		defaultButton = defaultButton_;
	}
	if (typeof icon === 'string') {
		const icon_ = Icon[icon];
		if (icon_ === undefined) throw new Error('Invalid Icon ' + icon);
		icon = icon_;
	}
	return type + button + defaultButton + icon;
}

function convertStringToVBSString(str) {
	if (!str) return '';
	else return str.replace(/"/g, "''");
}

function verifyStringMessage(message) {
	if (message.length > 1024) {
		throw new Error('Message length must be less than 1024 characters');
	}
}

function _runVBS(cmd, ...args) {
	args = ['/nologo', ...args.flat(2)]
		.filter(c => typeof c == 'number' || c?.length > 0);

	return new Promise((resolve, reject) => {
		const spawn = child.spawn(cmd, args, { detached: true });
		let error = false;
		let stdout = '';
		let stderr = '';
		spawn.stdout.on('data', function (data) {
			stdout += data.toString();
		});
		spawn.stderr.on('data', function (data) {
			error = true;
			stderr += data.toString();
		});
		spawn.on('exit', function (code) {
			resolve({
				exitCode: code,
				msgOut: stdout,
				msgErr: stderr,
				isError: error,
				data: error ? undefined : returnButton[stdout] ?? stdout,
			});
		});
	});
}

function writeFile(workingDir, fileName, data) {
	return new Promise((resolve, reject) => {
		fs.writeFile(path.join(workingDir, fileName), data, (err) => {
			if (err) reject(err);
			else resolve();
		});
	});
}

function getFileChoose(workingDir, multiFile = false, title = 'Open', ...filterData) {
	const invalidFilter = (f) => {
		if (typeof f.name !== 'string') return false
		if (typeof f.ext !== 'string') return false
		// Test f.ext (*.*) regex
		f.ext = f.ext.split(';').filter((e) => /^\*\.[a-zA-Z0-9*]+$/.test(e)).join(';');
		if (f.ext.length === 0) return false
		return true
	}
	let filter = filterData.flat(2).filter(invalidFilter).map(f => `${f.name}|${f.ext}`).join('|');
	if (filter) filter += '|'
	return new Promise((resolve, reject) => {
		const dialog = config.filebox(title, filter, multiFile);
		// write file
		resolve(writeFile(workingDir, 'file.bat', dialog))
	});
}

function getFolderChoose(workingDir, description = 'Please choose a folder.') {
	return new Promise((resolve, reject) => {
		const dialog = config.folderbox(description);
		// write file
		resolve(writeFile(workingDir, 'folder.bat', dialog))
	});
}

class Dialog {
	constructor() {
		if (process.platform !== 'win32') {
			throw new Error('This script only works on Windows');
		}
		this.workingDir = this.createFolder();
		/**
		 * @type {WinTools}
		 */
		this.WinTools = new WinTools(this);
		this.start();
	}
	start() {
		const dialog_ = config.msgbox;
		writeFile(this.workingDir, 'dialog.vbs', dialog_);
		const input_ = config.inputbox;
		writeFile(this.workingDir, 'input.vbs', input_);
	}
	createFolder() {
		// Temp folder/ uuid
		const tempFolder = path.join(
			process.env.TEMP || process.env.TMP,
			'node-win-dialog',
		);
		fs.mkdirSync(tempFolder, { recursive: true });
		return tempFolder;
	}
	/**
	 * Create a message box
	 * @param {?string} message 
	 * @param {?string} title 
	 * @param {?MessageTypeString} type 
	 * @param {?ButtonString} button 
	 * @param {?ButtonDefaultString} defaultButton 
	 * @param {?IconString} icon 
	 * @returns {Promise<Response>}
	 * @example
	 * const Dialog = require('node-win-dialog');
	 * const log = new Dialog();
	 * log.showDialog('Hello wolrd', 'title');
	 */
	showDialog(
		message = ' ',
		title = ' ',
		type = messageType.DEFAULT,
		button = Button.DEFAULT,
		defaultButton = buttonDefault.DEFAULT,
		icon = Icon.DEFAULT,
	) {
		if (typeof message !== 'string') {
			throw new Error('Message must be a string');
		}
		// Verify type
		if (!message) {
			message = ' ';
		}
		if (!title) {
			title = ' ';
		}
		verifyStringMessage(message);
		// Option
		const option = parseOptionDialog(type, button, defaultButton, icon);
		return _runVBS(
			'cscript',
			path.resolve(this.workingDir, 'dialog.vbs'),
			convertStringToVBSString(message),
			option,
			convertStringToVBSString(title),
		);
	}
	/**
	 * Create a input box
	 * @param {?string} message 
	 * @param {?string} title 
	 * @param {?string} defaultText 
	 * @param {?number} xPos 
	 * @param {?number} yPos 
	 * @returns {Promise<Response>}
	 * @example
	 * const Dialog = require('node-win-dialog');
	 * const log = new Dialog();
	 * log.showInputBox('Hello wolrd', 'title', 'default text')
	 */
	showInputBox(message = '', title = '', defaultText = '', xPos, yPos) {
		if (typeof message !== 'string') {
			throw new Error('Message must be a string');
		}
		verifyStringMessage(message);
		if (title !== undefined && typeof title !== 'string') {
			throw new Error('Title must be a string');
		}
		if (defaultText !== undefined && typeof defaultText !== 'string') {
			throw new Error('Default text must be a string');
		}
		if (xPos !== undefined && typeof xPos !== 'number') {
			throw new Error('X position must be a number');
		}
		if (yPos !== undefined && typeof yPos !== 'number') {
			throw new Error('Y position must be a number');
		}
		const path_ = path.resolve(this.workingDir, 'input.vbs');
		return _runVBS(
			'cscript',
			path_,
			convertStringToVBSString(message),
			convertStringToVBSString(title),
			convertStringToVBSString(defaultText),
			xPos,
			yPos,
		);
	}
	/**
	 * Show a file choose dialog
	 * @param {?boolean} multiFile 
	 * @param {?string} title 
	 * @param  {...filterData} filterData 
	 * @returns {Promise<Response>}
	 * @example
	 * const Dialog = require('node-win-dialog');
	 * const log = new Dialog();
	 * log.showOpenFileDialog(false, 'title');
	 */
	async showOpenFileDialog(multiFile, title, ...filterData) {
		if (multiFile !== undefined && typeof multiFile !== 'boolean') {
			throw new Error('Multifile option must be a boolean');
		}
		if (title !== undefined && typeof title !== 'string') {
			throw new Error('Title must be a string');
		}
		await getFileChoose(this.workingDir, multiFile, title, filterData);
		return _runFile(path.resolve(this.workingDir, 'file.bat'));
	}
	/**
	 * Display a folder choose dialog
	 * @param {?string} description 
	 * @returns {Promise<Response>}
	 * @example
	 * const Dialog = require('node-win-dialog');
	 * const log = new Dialog();
	 * log.showFolderDialog('Description');
	 */
	async showFolderDialog(description) {
		if (description !== undefined && typeof description !== 'string') {
			throw new Error('Description must be a string');
		}
		await getFolderChoose(this.workingDir, description);
		return _runFolder(path.resolve(this.workingDir, 'folder.bat'));
	}
	/**
	 * Show windows mode
	 * * `Hide`
	 * * `Show`
	 * * `Minimize`
	 * * `Maximize`
	 * @typedef {String} WindowMode
	 */

	/**
	 * Run a command (Admin)
	 * @param {string} command 
	 * @param {?string[]} args 
	 * @param {?string} workingDir 
	 * @param {?WindowMode} showWindow 
	 * @returns {Promise<undefined>}
	 */
	async runAsAdmin(
		command = 'cmd.exe',
		args = [],
		workingDir = "",
		showWindow = 'Show',
	) {
		args = args.flat(2);
		args = args.join(" ");
		args = args.replace(/"/g, '""');
		const mode = ["Hide", "Show", "Minimize", "Maximize"];
		// String
		showWindow = mode.indexOf(showWindow);
		if (showWindow == -1) {
			throw new Error('Invalid show window mode');
		}
		const path_ = path.resolve(this.workingDir, 'runasadmin.vbs');
		const script = config.runAsAdmin(command, args, workingDir, showWindow);
		writeFile(this.workingDir, 'runasadmin.vbs', script);
		await _runVBS(
			'cscript',
			path_,
		);
		return undefined
	}
}

module.exports = Dialog;
