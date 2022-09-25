# node-win-dialog

> ## Install
> **Warning**
> Windows only !!!
```
$ npm i node-win-dialog@latest
```

## Screenshots

![Screenshot](https://cdn.discordapp.com/attachments/820557032016969751/1022527557960208497/unknown.png)

## Usage

```js
const Dialog = require('node-win-dialog');

const log = new Dialog();

log.showDialog('Hello wolrd', 'title');

log.showInputBox('Hello wolrd', 'title', 'default text')

log.showOpenFileDialog(false, 'title');

log.showFolderDialog('Description');
```

## Properties

### `WinTools`

> See [WinTools]()

## Methods

### `showDialog`

| Param | Type | Optional | Default | Description |
| --- | --- | --- | --- | --- |
| message | ?[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | ✅ | `none` | Message to display |
| title | ?[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | ✅ | `none` | Title of the dialog |
| type | ?[`MessageTypeString`](#MessageTypeString) | ✅ | `DEFAULT` | Type of the dialog |
| button | ?[`ButtonString`](#ButtonString) | ✅ | `DEFAULT` | Buttons of the dialog |
| defaultButton | ?[`ButtonDefaultString`](#ButtonDefaultString) | ✅ | `DEFAULT` | Default button of the dialog |
| icon | ?[`IconString`](#IconString) | ✅ | `DEFAULT` | Icon of the dialog |

> **Note**
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Response](#response)>

### `showInputBox`

| Param | Type | Optional | Default | Description |
| --- | --- | --- | --- | --- |
| message | ?[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | ✅ | `none` | Message to display |
| title | ?[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | ✅ | `none` | Title of the dialog |
| defaultText | ?[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | ✅ | `none` | Default text of the input box |
| xPos | ?[`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | ✅ | `none` | X position of the dialog |
| yPos | ?[`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | ✅ | `none` | Y position of the dialog |

> **Note**
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Response](#response)>

### `showOpenFileDialog`

| Param | Type | Optional | Default | Description |
| --- | --- | --- | --- | --- |
| multiFile | ?[`boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) | ✅ | `none` | Allow multi select |
| title | ?[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | ✅ | `Open` | Title of the dialog |
| ...filterData | ?[`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[`filterData`](#filterData)> | ✅ | `none` | File type filter |

> **Note**
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Response](#response)>

### `showFolderDialog`

| Param | Type | Optional | Default | Description |
| --- | --- | --- | --- | --- |
| description | ?[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | ✅ | `Please choose a folder.` | Description of the dialog |


> **Note**
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[Response](#response)>

## Typedefs

### `Response`

**Types**

 + [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

| Param | Type|
| --- | --- |
| exitCode | [`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)|
| msgOut | [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |
| msgErr | [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)  |
| isError | [`boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) |
| data | ?[`ReturnButton`](#ReturnButton) or [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) or [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)<[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)> |


### `filterData`

**Types**

 + [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

| Param | Type|
| --- | --- |
| name | [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |
| ext | [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)  |

### `ReturnButton`

+ `OK`
+ `CANCEL`
+ `YES`
+ `NO`
+ `ABORT`
+ `RETRY`
+ `IGNORE`

**Types** 
+ [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)


### `ButtonString`

+ `OK`
+ `OK_CANCEL`
+ `YES_NO`
+ `YES_NO_CANCEL`
+ `ABORT_RETRY_IGNORE`
+ `RETRY_CANCEL`
+ `DEFAULT`

**Types** 
+ [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

### `IconString`

+ `NONE`
+ `ERROR`
+ `WARNING`
+ `INFORMATION`
+ `QUESTION`

**Types**
+ [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

### `ButtonDefaultString`

+ `FIRST`
+ `SECOND`
+ `THIRD`
+ `FOURTH`
+ `DEFAULT`

**Types**
+ [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

### `MessageTypeString`

+ `DEFAULT`
+ `APPLICATION`
+ `SYSTEM`

**Types**
+ [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)