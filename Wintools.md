### Copyright Nirsoft (Nircmd). All rights reserved.

## Example

> See [here](https://github.com/aiko-chan-ai/node-win-dialog/blob/main/test/wintool.js)
## Method

### `setup`

> Return
> [Undefined]()

### `exitWin`

| Param | Type | Optional | Default |
| --- | --- | --- | --- |
| mode | ?[`ExitWinMode`](#ExitWinMode) | ✅ | `poweroff` |
| force | ?[`boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) | ✅ | `false` |

> Return
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

### `monitor`

| Param | Type | Optional | Default |
| --- | --- | --- | --- |
| mode | ?[`MonitorMode`](#MonitorMode) | ✅ | `on` |

> Return
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

### `restartExplorer`

> Return
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

### `beep`

| Param | Type | Optional | Default |
| --- | --- | --- | --- |
| freq | [`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |  | `none` |
| duration | [`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |  | `none` |

> Return
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

### `windowsBeep`

> Return
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

### `cdrom`

| Param | Type | Optional | Default |
| --- | --- | --- | --- |
| open | ?[`boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) | ✅ | `true` |
| drive | ?[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | ✅ | `none` |

> Return
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

### `mute`

> Return
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>
### `unmute`

> Return
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>
### `setVolume`

| Param | Type | Optional | Default |
| --- | --- | --- | --- |
| volume | [`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |  | `none` |

> Return
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

### `setCursor`

| Param | Type | Optional | Default |
| --- | --- | --- | --- |
| x | [`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |  | `none` |
| y | [`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |  | `none` |

> Return
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

### `moveCursor`

| Param | Type | Optional | Default |
| --- | --- | --- | --- |
| x | [`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |  | `none` |
| y | [`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |  | `none` |

> Return
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

### `fakeKey`

| Param | Type | Optional | Default |
| --- | --- | --- | --- |
| key | [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |  | `none` |
| mode | ?[`KeypressMode`](#KeypressMode) |  ✅  | `press` |

> Return
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

### `fakeMouse`

| Param | Type | Optional | Default |
| --- | --- | --- | --- |
| key | ?[`MouseMode`](#MouseMode) |  ✅ | `left` |
| mode | ?[`KeypressMode`](#KeypressMode) |  ✅ | `press` |

> Return
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

### `trayBalloon`

| Param | Type | Optional | Default |
| --- | --- | --- | --- |
| title | ?[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |  | `none` | 
| text | ?[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |  | `none` |
| iconPath | ?[`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |  | `none` |
| timeout | ?[`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | ✅ | `1000` |

> Return
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

### `playMedia`

| Param | Type | Optional | Default |
| --- | --- | --- | --- |
| path | [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) |  | `none` |
| duration | [`number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) |  | `none` |

> Return
> [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>

## Typedef

### `ExitWinMode`

+ `logoff`
+ `shutdown`
+ `reboot`
+ `poweroff`
+ `cancel`
+ `sleep`
+ `standby`
+ `hibernate`

**Types** 
+ [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)


### `MonitorMode`

+ `on`
+ `off`
+ `low`

**Types**
+ [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

### `KeypressMode`

+ `down`
+ `up`
+ `press`

**Types**
+ [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

### `MousepressMode`

+ `down`
+ `up`
+ `press`
+ `dblclick`

**Types**
+ [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)

### `MouseMode`

+ `left`
+ `right`
+ `middle`
+ `wheel`

**Types**
+ [`string`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)