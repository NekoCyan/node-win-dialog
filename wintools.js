const fs = require('fs');
const path = require('path');
const child = require('child_process');
const config = require('./config.js');

const ExitWinMode = [
	'logoff',
	'shutdown',
	'reboot',
	'poweroff',
	'cancel',
	'sleep',
	'standby',
	'hibernate',
];

const MonitorMode = ['off', 'on', 'low'];

const KeypressMode = ['press', 'down', 'up'];

const MousepressMode = [...KeypressMode, 'dblclick'];

const MouseMode = ['left', 'right', 'middle', 'wheel'];

class WinTools {
	constructor(client) {
		Object.defineProperty(this, 'client', {
			value: client,
			writable: false,
			enumerable: false,
			configurable: false,
		});
	}
	/**
	 * @type {boolean}
	 * @readonly
	 */
	get ready() {
		return Boolean(this._workingFile);
	}
	setup() {
		const f = path.join(this.client.workingDir, 'wintools.exe');
		fs.writeFileSync(f, config.nircmd, 'base64');
		const f_ = path.join(this.client.workingDir, 'nsudo.exe');
		fs.writeFileSync(f_, config.nsudo, 'base64');
		this._workingFile = f;
		this._nsudo = f_;
		return this;
	}
	runCommand(command) {
		if (!this.ready) throw new Error('WinTools is not ready');
		return new Promise((resolve, reject) => {
			child.exec(
				`${this._workingFile} ${command}`,
				(error, stdout, stderr) => {
					resolve(stdout);
				},
			);
		});
	}
    /**
     * This command terminates the current session of Windows. 
     * @param {?ExitWinMode} mode 
     * @param {?boolean} force 
     * @returns {Promise<string>}
     */
	exitWin(mode = 'poweroff', force = false) {
		if (!ExitWinMode.includes(mode)) throw new Error('Invalid mode');
		if (typeof force !== 'boolean') force = false;
		switch (mode) {
			case 'cancel':
				return this.runCommand('abortshutdown');
			case 'standby':
			case 'sleep':
				return this.runCommand(`standby ${force ? 'force' : ''}`);
			case 'hibernate':
				return this.runCommand(`hibernate ${force ? 'force' : ''}`);
			default:
				return this.runCommand(
					`exitwin ${mode} ${force ? 'force' : ''}`,
				);
		}
	}
    /**
     * Changes the state of the display monitor.
     * @param {MonitorMode} mode 
     * @returns {Promise<string>}
     */
	monitor(mode = 'on') {
		if (!MonitorMode.includes(mode)) throw new Error('Invalid mode');
		return this.runCommand(`monitor async_${mode}`);
	}
    /**
     * Restarts Windows Explorer gracefully.
     * @returns {Promise<string>}
     */
	restartExplorer() {
		return this.runCommand('restartexplorer');
	}
    /**
     * Plays a beep. The [Freq] parameter specifies the frequency, in hertz. The [Duration] parameter specifies the duration of the sound in milliseconds.
     * @param {number} freq 
     * @param {number} duration 
     * @returns {Promise<string>}
     */
	beep(freq, duration) {
		if (typeof freq !== 'number' || freq < 1 || freq > 22000)
			throw new Error('Invalid frequency');
		if (typeof duration !== 'number' || duration < 1)
			throw new Error('Invalid duration');
		return this.runCommand(`beep ${freq} ${duration}`);
	}
    /**
     * Plays the standard beep of Windows.
     * @returns {Promise<string>}
     */
	windowsBeep() {
		return this.runCommand('stdbeep');
	}
    /**
     * This command allows you to open and close the door of your CD-ROM drive. 
     * @param {?boolean} open 
     * @param {?string} name 
     * @returns {Promise<string>}
     */
	cdrom(open = true, name) {
		if (typeof name !== 'string' || /[a-zA-Z]:/.test(name))
			name = undefined;
		if (typeof open !== 'boolean') throw new Error('Invalid open option');
		return this.runCommand(
			`cdrom ${open ? 'open' : 'close'} ${name || ''}`,
		);
	}
    /**
     * Mute the system volume.
     * @returns {Promise<string>}
     */
	mute() {
		return this.runCommand('mutesysvolume 1');
	}
    /**
     * Unmute the system volume.
     * @returns {Promise<string>}
     */
	unmute() {
		return this.runCommand('mutesysvolume 0');
	}
    /**
     * Set the sound volume for your system. Changing this value also affects the sound volume settings under 'Control Panel'. The [volume] parameter should contain a value between 0 (silence) and 100 (full volume).
     * @param {number} volume 
     * @returns {Promise<string>}
     */
	setVolume(volume) {
		if (typeof volume !== 'number' || volume < 0 || volume > 100)
			throw new Error('Invalid volume');
		return this.runCommand(
			`setsysvolume ${Math.floor((volume / 100) * 65535)}`,
		);
	}
	/**
	 * Set the position of mouse cursor. The [X] and [Y] parameters specifies the desired cursor position.
	 * @param {number} x
	 * @param {number} y
	 * @returns {Promise<string>}
	 */
	setCursor(x, y) {
		if (typeof x !== 'number' || x < 0) throw new Error('Invalid x');
		if (typeof y !== 'number' || y < 0) throw new Error('Invalid y');
		return this.runCommand(`setcursor ${x} ${y}`);
	}
	/**
	 * Move the mouse cursor. The [X] and [Y] parameters specifies the number of pixels to move.
	 * @param {number} x
	 * @param {number} y
	 * @returns {Promise<string>}
	 */
	moveCursor(x, y) {
		if (typeof x !== 'number') throw new Error('Invalid x');
		if (typeof y !== 'number') throw new Error('Invalid y');
		return this.runCommand(`movecursor ${x} ${y}`);
	}
	/**
	 * Sends a keystroke to the system. The operating system will behave exactly as the user really pressed the specified keys.
     * The [Key] parameter specifies the key as virtual key code (For example: 0x2e for Delete key), or as one of the following predefined values: a - z and 0 - 9 (for alphanumeric keys), F1 - F24 (for Fxx keys), shift, ctrl, alt, enter, esc ,leftshift, rightshift, leftctrl, rightctrl, leftmenu, rightmenu, spc (space), down, up, left, right, home, end, insert, delete, plus, comma, minus, period, lwin, rwin (Windows key), apps, pageup, pagedown, tab, multiply, add, subtract, seperator, divide, backspace, pause, capslock, numlock, scroll, printscreen.
     * The second parameter specifies the key action: 'press', 'down', or 'up'. For each key down action, you should also add the appropriate key up action.
	 * @param {string} key
	 * @param {?KeypressMode} mode
	 * @returns {Promise<string>}
	 */
	sendKey(key, mode = 'press') {
		if (typeof key !== 'string') throw new Error('Invalid key');
		if (!KeypressMode.includes(mode)) throw new Error('Invalid mode');
		return this.runCommand(`sendkeypress ${key} ${mode}`);
	}
	/**
	 * Sends the specified mouse event to the system. The operating system will behave exactly as the user really made the specified mouse action.
	 * @param {?MouseMode} mouse
	 * @param {?MousepressMode} mode
	 * @returns {Promise<string>}
	 */
	sendMouse(mouse = 'left', mode = 'press') {
		if (!MouseMode.includes(mouse)) throw new Error('Invalid mouse');
		switch (mouse) {
			case 'wheel':
				if (typeof mode !== 'number') throw new Error('Invalid mode');
				return this.runCommand(`sendmouse wheel ${mode}`);
			default:
				if (!MousepressMode.includes(mode))
					throw new Error('Invalid mode');
				return this.runCommand(`sendmouse ${mouse} ${mode}`);
		}
	}
	/**
	 * Displays a tray balloon (For Windows XP and above)
	 * @param {string} title
	 * @param {string} text
	 * @param {string} icon
	 * @param {?number} timeout
	 * @returns {Promise<string>}
	 */
	trayBalloon(title, text, icon, timeout = 1_000) {
		if (typeof title !== 'string') throw new Error('Invalid title');
		if (typeof text !== 'string') throw new Error('Invalid text');
		if (
			icon &&
			(!fs.existsSync(path.resolve(icon)) || !icon.endsWith('.ico'))
		)
			throw new Error('Invalid icon');
		if (typeof timeout !== 'number' || timeout < 1)
			throw new Error('Invalid timeout');
		return this.runCommand(
			`trayballoon "${title}" "${text}" ${icon} ${timeout}`,
		);
	}
	/**
	 * Plays the specified audio file (.mp3, .wav, and so on) for the specified number of milliseconds.
	 * @param {string} file
	 * @param {number} duration
	 * @returns {Promise<string>}
	 */
	playMedia(file, duration) {
		if (!fs.existsSync(path.resolve(file))) throw new Error('Invalid file');
		if (typeof duration !== 'number') throw new Error('Invalid duration');
		return this.runCommand(`mediaplay ${duration} "${file}"`);
	}

	/**
	 * Run file with TrustedInstaller permissions.
	 * @param {string} command
	 * @param {?WindowMode} ShowWindowMode 
	 * @param {?string} CurrentDirectory 
	 * @returns {Promise<undefined>}
	 */
	async sudo(
		command = 'cmd',
		ShowWindowMode = 'Show',
		CurrentDirectory = "",
	) {
		let commandString = `-U:T -P:E -M:S`;
		const mode = ["Hide", "Show", "Minimize", "Maximize"];
		if (ShowWindowMode && ShowWindowMode.includes(mode)) {
			commandString += ` -ShowWindowMode:${ShowWindowMode}`;
		}
		if (CurrentDirectory) {
			commandString += ` -CurrentDirectory:"${path.resolve(CurrentDirectory)}"`;
		}
		commandString += ` ${command}`;

		await this.client.runAsAdmin(this._nsudo, [commandString], null, "Hide");

		return undefined;
	}
}

module.exports = WinTools;
