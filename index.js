const child = require('child_process');
const path = require('path');
const fs = require('fs');

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
				data: stdout.replace(/\r\n/gi, '\n').split('\n'),
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
		if (!type_) throw new Error('Invalid messageType ' + type);
	}
	if (typeof button === 'number') {
		const button_ = Button[button];
		if (!button_) throw new Error('Invalid Button ' + button);
	}
	if (typeof defaultButton === 'number') {
		const defaultButton_ = buttonDefault[defaultButton];
		if (!defaultButton_)
			throw new Error('Invalid buttonDefault ' + defaultButton);
	}
	if (typeof icon === 'number') {
		const icon_ = Icon[icon];
		if (!icon_) throw new Error('Invalid Icon ' + icon);
	}
	if (typeof type === 'string') {
		const type_ = messageType[type];
		if (!type_) throw new Error('Invalid messageType ' + type);
		type = type_;
	}
	if (typeof button === 'string') {
		const button_ = Button[button];
		if (!button_) throw new Error('Invalid Button ' + button);
		button = button_;
	}
	if (typeof defaultButton === 'string') {
		const defaultButton_ = buttonDefault[defaultButton];
		if (!defaultButton_)
			throw new Error('Invalid buttonDefault ' + defaultButton);
		defaultButton = defaultButton_;
	}
	if (typeof icon === 'string') {
		const icon_ = Icon[icon];
		if (!icon_) throw new Error('Invalid Icon ' + icon);
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

function copyFiles(dest) {
	const files = ['dialog.vbs', 'input.vbs'];
	for (const file of files) {
		fs.copyFileSync(
			path.join('.', file),
			path.join(dest, file),
		);
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
		let dialog = `<# : chooser.bat
:: launches a File... Open sort of file chooser and outputs choice(s) to the console
:: https://stackoverflow.com/a/15885133/1683264

@echo off
setlocal
for /f "delims=" %%I in ('powershell -noprofile "iex (\${%~f0} | out-string)"') do (
    echo %%~I
)
goto :EOF

: end Batch portion / begin PowerShell hybrid chimera #>

Add-Type -AssemblyName System.Windows.Forms
$f = new-object Windows.Forms.OpenFileDialog
$f.InitialDirectory = pwd
$f.Title = "${title}"
$f.Filter = "${filter}All Files (*.*)|*.*"
$f.ShowHelp = $true
$f.Multiselect = $${Boolean(multiFile)}
[void]$f.ShowDialog()
if ($f.Multiselect) { $f.FileNames } else { $f.FileName }`
		// write file
		resolve(writeFile(workingDir, 'file.bat', dialog))
	});
}

function getFolderChoose(workingDir, description = 'Please choose a folder.') {
	return new Promise((resolve, reject) => {
		let dialog = `:: fchooser.bat
:: launches a folder chooser and outputs choice to the console
:: https://stackoverflow.com/a/15885133/1683264

@echo off
setlocal

set "psCommand="(new-object -COM 'Shell.Application')^
.BrowseForFolder(0,'${description}',0,0).self.path""

for /f "usebackq delims=" %%I in (\`powershell %psCommand%\`) do set "folder=%%I"

setlocal enabledelayedexpansion
echo !folder!
endlocal`
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
		copyFiles(this.workingDir);
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
	async showFolderDialog(description) {
		if (description !== undefined && typeof description !== 'string') {
			throw new Error('Description must be a string');
		}
		await getFolderChoose(this.workingDir, description);
		return _runFolder(path.resolve(this.workingDir, 'folder.bat'));
	}
}

module.exports = Dialog;
