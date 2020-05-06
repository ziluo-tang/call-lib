### Installation

```
npm install call-lib --save-dev
//or
yarn add call-lib
```
### Demo

```
let audio = new TRecorder();
audio.open().then(() => {
    //麦克风打开成功
});
```
### API
```
let audio = new TRecorder();
```
> open：打开麦克风，返回promise

```
audio.open().then(() => {
    //麦克风打开成功
});
```

> start：开始对话，参数是一个callback，获取实时音频数据（PCM格式）

```
audio.start(data => {
  this.socket.sendMessage(data);
});
```

> stop：停止对话

```
audio.stop();
```

> close：关闭麦克风

```
audio.close();
```
