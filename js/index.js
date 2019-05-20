var $vm = new Vue({
	el: '#main',
	data: {
		boardArr: [], //棋盘数组
		breadth: 8, //行数
		length: 4, //列数
		typeLen: 9, //几个图片
		objIJ: [-1, -1],
		hoverIJ: [-1, -1],
	},
	created: function() {
		var self = this;
		self.creatGame();
	},
	mounted () {
		FastClick.attach( document.body );
	},
	methods: {
		//点击操作
		doTouch: function(i, j) {
			var self = this;
			if(self.boardArr[i][j].name == 0) {
				return;
			}
			if(self.objIJ[0] >= 0) {
				if(self.objIJ[0] == i && self.objIJ[1] == j) {
					return;
				}
				self.clickSucceed(i, j);
			} else {
				self.clickFirst(i, j);
			}
		},
		doHover: function(i, j) {
			var self = this;
			self.hoverIJ = [i, j];
		},
		doBlur: function(i, j) {
			var self = this;
			self.hoverIJ = [-1, -1];
		},
		clickFirst: function(i, j) {
			var self = this;
			self.objIJ = [i, j];
		},
		//判断是否移除
		checkRemove: function(data1, data2) {
			var self = this;
			if(self.boardArr[data1[0]][data1[1]].name != self.boardArr[data2[0]][data2[1]].name) {
				_inputQueue.pushMessage("http://files.iiierp.com/voice/du.mp3");
				return;
			}
			if(data1[0] === data2[0]) {
				//检验水平
				if(self.checkStandard(data1, data2,self.doStandard)){
					self.removeData(data1, data2);
					console.log('检验水平');
					return;
				}
			}
			if(data1[1] === data2[1]) {
				//检验垂直
				if(self.checkVertical(data1, data2,self.doVertical)) {
					self.removeData(data1, data2);
					console.log('检验垂直');
					return;
				}	
			}
			if(self.checkCorner(data1, data2,self.doCorner)) {
				self.removeData(data1, data2);
				console.log('检验拐角');
				return;
			} else {
				if(self.checkRecursive(data1, data2)) {
					self.removeData(data1, data2);
					console.log('检验多拐角');
					return;
				}
			}
			_inputQueue.pushMessage("http://files.iiierp.com/voice/du.mp3");
			//playVoice("http://files.iiierp.com/voice/du.mp3");
		},
		//水平路径
		doStandard:function(data1, data2){
			var self = this;
			if(data1[1] > data2[1]){
				if(!self.checkoutChange(self.boardArr[data1[0]][data1[1]].bg)){
					self.boardArr[data1[0]][data1[1]].bg = 'bgd';
				}
				if(!self.checkoutChange(self.boardArr[data2[0]][data2[1]].bg)){
					self.boardArr[data2[0]][data2[1]].bg = 'bgb';
				}
				
			}else{
				if(!self.checkoutChange(self.boardArr[data2[0]][data2[1]].bg)){
					self.boardArr[data2[0]][data2[1]].bg = 'bgd';
				}
				if(!self.checkoutChange(self.boardArr[data1[0]][data1[1]].bg)){
					self.boardArr[data1[0]][data1[1]].bg = 'bgb';
				}
			}
			var start = data1[1] > data2[1] ? data2[1] : data1[1];
			var end = data1[1] < data2[1] ? data2[1] : data1[1];
			var i = data1[0];
			for(var j = start + 1; j < end; j++) {
				if(self.checkoutChange(self.boardArr[i][j].bg)){
					continue;
				}
				self.boardArr[i][j].bg = 'bgf';
			}
		},
		//垂直路径
		doVertical:function(data1, data2){
			var self = this;
			if(data1[0] > data2[0]){
				if(!self.checkoutChange(self.boardArr[data1[0]][data1[1]].bg)){
					self.boardArr[data1[0]][data1[1]].bg = 'bga';
				}
				if(!self.checkoutChange(self.boardArr[data2[0]][data2[1]].bg)){
					self.boardArr[data2[0]][data2[1]].bg = 'bgc';
				}
			}else{
				if(!self.checkoutChange(self.boardArr[data2[0]][data2[1]].bg)){
					self.boardArr[data2[0]][data2[1]].bg = 'bga';
				}
				if(!self.checkoutChange(self.boardArr[data1[0]][data1[1]].bg)){
					self.boardArr[data1[0]][data1[1]].bg = 'bgc';
				}
			}
			var start = data1[0] > data2[0] ? data2[0] : data1[0];
			var end = data1[0] < data2[0] ? data2[0] : data1[0];
			var j = data1[1];
			for(var i = start + 1; i < end; i++) {
				if(self.checkoutChange(self.boardArr[i][j].bg)){
					continue;
				}
				self.boardArr[i][j].bg = 'bge';
			}
		},
		//拐角路径
		doCorner:function(data1, data2,data3){
			var self = this;
			if(data1[0] == data3[0]){
				self.doStandard(data1, data3);
				self.doVertical(data2, data3);
				if(data3[1] > data1[1] && data3[0] > data2[0]){
					if(self.checkoutChange(self.boardArr[data3[0]][data3[1]].bg)){
						return;
					}
					self.boardArr[data3[0]][data3[1]].bg = 'bgj';
				}
				if(data3[1] > data1[1] && data3[0] < data2[0]){
					if(self.checkoutChange(self.boardArr[data3[0]][data3[1]].bg)){
						return;
					}
					self.boardArr[data3[0]][data3[1]].bg = 'bgi';
				}
				if(data3[1] < data1[1] && data3[0] > data2[0]){
					if(self.checkoutChange(self.boardArr[data3[0]][data3[1]].bg)){
						return;
					}
					self.boardArr[data3[0]][data3[1]].bg = 'bgg';
				}
				if(data3[1] < data1[1] && data3[0] < data2[0]){
					if(self.checkoutChange(self.boardArr[data3[0]][data3[1]].bg)){
						return;
					}
					self.boardArr[data3[0]][data3[1]].bg = 'bgh';
				}
			}else{
				self.doVertical(data1, data3);
				self.doStandard(data2, data3);
				if(data3[1] > data2[1] && data3[0] > data1[0]){
					if(self.checkoutChange(self.boardArr[data3[0]][data3[1]].bg)){
						return;
					}
					self.boardArr[data3[0]][data3[1]].bg = 'bgj';
				}
				if(data3[1] > data2[1] && data3[0] < data1[0]){
					if(self.checkoutChange(self.boardArr[data3[0]][data3[1]].bg)){
						return;
					}
					self.boardArr[data3[0]][data3[1]].bg = 'bgi';
				}
				if(data3[1] < data2[1] && data3[0] > data1[0]){
					if(self.checkoutChange(self.boardArr[data3[0]][data3[1]].bg)){
						return;
					}
					self.boardArr[data3[0]][data3[1]].bg = 'bgg';
				}
				if(data3[1] < data2[1] && data3[0] < data1[0]){
					if(self.checkoutChange(self.boardArr[data3[0]][data3[1]].bg)){
						return;
					}
					self.boardArr[data3[0]][data3[1]].bg = 'bgh';
				}
			}
		},
		//判断是否需要覆盖
		checkoutChange:function(data){
			return data == 'bgj' || data == 'bgi'|| data == 'bgg'|| data == 'bgh';
		},
		//判断水平
		checkStandard: function(data1, data2,func) {
			var self = this;
			var start = data1[1] > data2[1] ? data2[1] : data1[1];
			var end = data1[1] < data2[1] ? data2[1] : data1[1];
			var i = data1[0];
			for(var j = start + 1; j < end; j++) {
				if(self.boardArr[i][j].name != 0) {
					return false;
				}
			}
			if(typeof func == "function"){
				func(data1, data2);
			}
			return true;
		},
		//判断垂直
		checkVertical: function(data1, data2,func) {
			var self = this;
			var start = data1[0] > data2[0] ? data2[0] : data1[0];
			var end = data1[0] < data2[0] ? data2[0] : data1[0];
			var j = data1[1];
			for(var i = start + 1; i < end; i++) {
				if(self.boardArr[i][j].name != 0) {
					return false;
				}
			}
			if(typeof func == "function"){
				func(data1, data2);
			}
			return true;
		},
		//判断多个拐角
		checkRecursive: function(data1, data2) {
			var self = this;
			for(var i = 0; i < self.breadth; i++) {
				for(var j = 0; j < self.length; j++) {
					if(self.boardArr[i][j].name != 0) {
						continue;
					}
					if(i != data1[0] && i != data2[0] && j != data1[1] && j != data2[1]) {
						continue;
					}

					if((i == data1[0] && j == data1[1]) || (i == data2[0] && j == data2[1])) {
						continue;
					}
					var data3 = [i, j];
					if(data2[0] === data3[0] && self.checkStandard(data2, data3) &&  self.checkCorner(data1, data3,self.doCorner)) {
						var data4 = [data1[0],data3[1]];
						self.checkCorner(data2, data4,self.doCorner);
						return true;
					}
					if(data2[1] === data3[1] && self.checkVertical(data2, data3) && self.checkCorner(data1, data3,self.doCorner)) {
						var data4 = [data3[0],data1[1]];
						self.checkCorner(data2, data4,self.doCorner);
						return true;
					}
					if(data1[0] === data3[0] && self.checkStandard(data1, data3) &&  self.checkCorner(data2, data3,self.doCorner)) {
						var data4 = [data2[0],data3[1]];
						self.checkCorner(data1, data4,self.doCorner);
						return true;
					}
					if(data1[1] === data3[1] && self.checkVertical(data1, data3) && self.checkCorner(data2, data3,self.doCorner)) {
						var data4 = [data3[0],data2[1]];
						self.checkCorner(data1, data4,self.doCorner);
						return true;
					}
				}
			}
			return false;
		},
		//判断1个拐角
		checkCorner: function(data1, data2,func) {
			var self = this;
			var data3 = [data1[0], data2[1]];
			var data4 = [data2[0], data1[1]];
			if(self.boardArr[data3[0]][data3[1]].name == 0) {
				if(self.checkStandard(data1, data3) && self.checkVertical(data2, data3)) {
					if(typeof func == "function"){
						func(data1, data2,data3);
					}
					return true;
				}
			}
			if(self.boardArr[data4[0]][data4[1]].name == 0) {
				if(self.checkStandard(data2, data4) && self.checkVertical(data1, data4)) {
					if(typeof func == "function"){
						func(data1, data2,data4);
					}
					return true;
				}
			}
			return false;
		},
		//判断是否结束
		checkEnd: function() {
			var self = this;
			for(var i = 0; i < self.breadth; i++) {
				for(var j = 0; j < self.length; j++) {
					if(self.boardArr[i][j].name != 0) {
						return false;
					}
				}
			}
			return true;
		},
		//点击匹配操作
		clickSucceed: function(i, j) {
			var self = this;
			var data1 = self.deepClone(self.objIJ);
			var data2 = [i, j]
			self.objIJ = [-1, -1];
			self.checkRemove(data1, data2);
		},
		//移除操作
		removeData: function(data1, data2) {
			var self = this;
			self.boardArr[data1[0]][data1[1]].name = 0;
			self.boardArr[data2[0]][data2[1]].name = 0;
			
			_inputQueue.pushMessage("http://files.iiierp.com/voice/ju.mp3");
			setTimeout(function(){
				for(var i = 0; i < self.breadth; i++) {
					for(var j = 0; j < self.length; j++) {
						self.boardArr[i][j].bg = '';
					}
				}
				if(self.checkEnd()) {
					alert('过关啦');
					_inputQueue.pushMessage("http://files.iiierp.com/voice/alert.wav");
					self.breadth -= 2;
					self.length -= 2;
					self.creatGame();
				}
			},200);
		},
		//创建新游戏
		creatGame: function() { 
			var self = this;
			self.boardArr = [];
			var temporaryArr = self.gettemporaryArr(); //临时数组
			console.log(temporaryArr);
			for(var i = 0; i < self.breadth; i++) {
				self.boardArr.push([]);
				for(var j = 0; j < self.length; j++) {
					var k = temporaryArr.length;
					var eq = Math.ceil(Math.random() * k);
					while(eq === 0) {
						eq = Math.ceil(Math.random() * k);
					}
					self.boardArr[i].push({
						name:temporaryArr[eq - 1],
						bg:''
					});
					temporaryArr.splice(eq - 1, 1)
				};
				self.boardArr[i].unshift({
					name:0,
					bg:'',
				});
				self.boardArr[i].push({
					name:0,
					bg:'',
				});
			};
			var arr;
			arr = [];
			for(var j = 0; j < self.length + 2; j++) {
				arr.push({
					name:0,
					bg:'',
				});
			};
			self.boardArr.unshift(self.deepClone(arr));
			self.boardArr.push(self.deepClone(arr));
			self.breadth += 2;
			self.length += 2;
		},
		gettemporaryArr: function() {
			var self = this;
			var temporaryArr = []; //临时数组
			var temporaryLen = self.breadth * self.length / 2; //临时数组长度
			for(var i = 0; i < temporaryLen; i++) {
				if(i + 1 <= self.typeLen) {
					temporaryArr.push(i + 1);
				} else {
					var randomNum = Math.ceil(Math.random() * self.typeLen);
					while(randomNum === 0) {
						randomNum = Math.ceil(Math.random() * self.typeLen);
					}
					temporaryArr.push(randomNum);
				}
			};
			temporaryArr = temporaryArr.concat(temporaryArr);
			return temporaryArr;
		},
		deepClone: function(obj) { //深拷贝
			let _obj = JSON.stringify(obj),
				objClone = JSON.parse(_obj);
			return objClone
		},
		autoPlay:function(){
			var self = this;
			for(var i = 0; i < self.breadth; i++) {
				for(var j = 0; j < self.length; j++) {
					if(self.boardArr[i][j].name !=0 && !self.autoCheck([i,j])){
						return true;
					}
				}
			}
			return false;
		},
		autoCheck:function(data){
			var self = this;
			console.log(data);
			for(var i = 0; i < self.breadth; i++) {
				for(var j = 0; j < self.length; j++) {
					if(data[0] == i && data[1] == j){
						continue;
					}
					if(!self.checkStandard(data,[i,j]) && !self.checkVertical(data,[i,j])&& !self.checkCorner(data,[i,j])&& !self.checkRecursive(data,[i,j])){
						return false;
					}
				}
			}
			return true;
		},
	},
})

// 播放声音
var playVoice = (function() {
	var voice;
    return function(url) {
    	if (voice) {
            voice.pause();
            voice.currentTime = 0;
            voice = null;
            _inputQueue.unLock();
        }
        if (url) {
        	console.log(url);
            voice = new Audio(url);
            voice.volume = 1;
            voice.play();
            _inputQueue.unLock();
        };
    };
})();

var _inputQueue = new inputQueue();

_inputQueue.sendNewMessage(function (message) {
    playVoice(message);
});

function inputQueue() {
    this.queue = [];
    this.isLocked = false;
    this.sendMessageFun = {};
    this.pushMessage = function (msg) {
        if (msg === undefined || msg === '') return;
        if (this.isLocked) {
            this.queue.unshift(msg); // 入栈
            console.log('消息队列' + this.queue.length);
        } else {
            this.isLocked = true;
            this.send(msg);
        }
    }
    this.unLock = function () {
        var item = this.queue.pop(); //出栈
        if (item === undefined) {
            this.isLocked = false;
            return;
        }
        this.isLocked = true;
        this.send(item);
    }
    this.send = function (msg) {
        if (typeof this.sendMessageFun === 'undefined') return;
        this.sendMessageFun(msg);
    }
    this.reset = function () {
        this.queue.length = 0;
        this.isLocked = false;
    }
    this.sendNewMessage = function (func) {
        this.sendMessageFun = func;
    }
}