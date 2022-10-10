const Dialog = require('../index.js');

const log = new Dialog();

log.showDialog('Hello wolrd', 'title');

log.showInputBox('Hello wolrd', 'title', 'default text');

log.showOpenFileDialog(false, 'title');

log.showFolderDialog('Description');

log.runAsAdmin('cmd', undefined, undefined, "Show");