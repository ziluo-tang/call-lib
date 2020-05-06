### Installation

```
npm install custom-player --save-dev
//or
<script src="custom-player"></script>
SZPlayer.createPlayer();
```

### Demo

```
<div id="container"></div>
```

```
import FlvPlayer from 'custom-player';
//直播
const container = document.getElementById('container');
const player = FlvPlayer.createPlayer(container, {
      mode: 'real',
      options: {
        stream: 'http://192.168.2.155:1945/34020000001320000145_771/playback.flv',
        reconnectServer: '',
        deviceId: '',
        appId: ''
      }
    });

//回放
const player = FlvPlayer.createPlayer(container, {
      mode: 'playback',
      options: {
        startServer: '',
        stopServer: '',
        beginTimeStamp: '',
        endTimeStamp: '',
        reconnectServer: '',
        deviceId: '',
        appId: ''
      }
    });
```

### Params

key | value
---|---
mode | 'real'：直播模式；'playback'：回放模式；必填
stream | 直播流地址，直播模式必填
reconnectServer | 断流重连服务
deviceId | 设备ID，回放模式和断流重连必填
appId | 断流重连必填
startServer | 起流服务，回放模式必填
stopServer | 停流服务，回放模式必填
beginTimeStamp | 回放流起始时间戳，精确到秒（s）
endTimeStamp | 回放流终止时间戳，精确到秒（s）
streamType | 回放流类型，默认是flv
recordType | 录像类型 1 手动录像 2 报警录像 4 录像计划 0或不传 表示所有，选填
saveType | 1 device or 2 oss，选填

### API
```
const player = FlvPlayer.createPlayer(dom, {
      mode: 'real',
      options: {
        ...
      }
    });
```
> getCurrentTime：获取当前播放时间；

```
player.getCurrentTime();
```

> screenshot：截图，返回base64图片数据；

```
player.screenshot();
```

> replaceDevice：设备切换，参数 deviceId，appId **回放模式下有效**；

```
player.replaceDevice(deviceId, appId);
```

> replaceStream：视频流切换，参数 stream，deviceId, appId **直播模式下有效**；

```
player.replaceStream(stream, deviceId, appId);
```
