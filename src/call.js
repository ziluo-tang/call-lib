export default class Recorder{
    constructor(config={}) {
        this.isRecorder = false;
        this.config = {
            sampleBits: config.sampleBits || 16,
            sampleRate: config.sampleRate || 8000,
            inputSampleBits: 16
        };
    }
    async open({bufferSize = 4096, numberOfInputChannels = 2, numberOfOutputChannels = 2} = {}) {
        if(navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }
        if(navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function(constraints) {
              let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
              if (!getUserMedia) {
                console.error('当前浏览器不支持录音功能');
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
              }
              return new Promise(function(resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
              });
            }
        }
        const result =  await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true
        }).then(stream => {
            this.audioContext = new AudioContext();
            this.audioInput = this.audioContext.createMediaStreamSource(stream);
            this.recorder = this.audioContext.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
            this.stream = stream;
            this.isRecorder = true;
        }).catch(err => {
            this.isRecorder = false;
            switch (err.code || err.name) {  
                case 'PERMISSION_DENIED':  
                case 'PermissionDeniedError':  
                    console.error('用户拒绝提供信息');  
                    break;  
                case 'NOT_SUPPORTED_ERROR':  
                case 'NotSupportedError':  
                    console.error('浏览器不支持硬件设备');  
                    break;  
                case 'MANDATORY_UNSATISFIED_ERROR':  
                case 'MandatoryUnsatisfiedError':  
                    console.error('无法发现指定的硬件设备');  
                    break;  
                default:  
                    console.error(`无法打开麦克风，异常信息: (${err.code || err.name})`);  
                    break;  
            }
        });
        return result;
    }
    start(callback) {
        if(this.isRecorder){
            this.audioInput.connect(this.recorder);  
            this.recorder.connect(this.audioContext.destination);
            this.recorder.onaudioprocess = e => {
                let analogData = e.inputBuffer.getChannelData(0);
                if(callback && typeof callback === "function") {
                    callback(this.trans([new Float32Array(analogData)], analogData.length));
                }
            }
        }
    }
    stop() {
        this.recorder && this.recorder.disconnect();
    }
    close() {
        this.stream && this.stream.getTracks()[0].stop();
    }
    trans(analogData, size) {
        let sampleBits = Math.min(this.config.inputSampleBits, this.config.sampleBits);  
        let bytes = this.decompress(analogData, size);  
        let dataLength = bytes.length * (sampleBits / 8);  
        let buffer = new ArrayBuffer(dataLength);  
        let data = new DataView(buffer);  
        data = this.reshapeWavData(sampleBits, 0, bytes, data);
        return new Blob([data], { type: 'audio/wav' });
    }
    decompress(analogData, size) {
        // 合并
        let data = new Float32Array(size);
        let offset = 0; 
        // 偏移量计算
        // 将二维数据，转成一维数据
        for (let i = 0; i < analogData.length; i++) {
            data.set(analogData[i], offset);
            offset += analogData[i].length;
        }
         //压缩
         const getRawDataion = parseInt(this.audioContext.sampleRate / this.config.sampleRate);  
         let length = data.length / getRawDataion;  
         let result = new Float32Array(length);  
         let index = 0, j = 0;  
         while (index < length) {  
             result[index] = data[j];  
             j += getRawDataion;  
             index++;  
         }  
        return result;
    }
    reshapeWavData(sampleBits, offset, iBytes, oData) {
        if(sampleBits === 8) {  
            for (let i = 0; i < iBytes.length; i++, offset++) {  
                let s = Math.max(-1, Math.min(1, iBytes[i]));  
                let val = s < 0 ? s * 0x8000 : s * 0x7FFF;  
                val = parseInt(255 / (65535 / (val + 32768)));  
                oData.setInt8(offset, val, true);  
            }  
        } else {  
            for (let i = 0; i < iBytes.length; i++, offset += 2) {  
                let s = Math.max(-1, Math.min(1, iBytes[i]));  
                oData.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);  
            }  
        } 
        return oData;
    }
}