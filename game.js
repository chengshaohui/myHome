$(function () {
	function Game() {
		this.$box = $('.box')
		this.arr = [
			{value:'A', src: 'A.png'},
			{value:'B', src: 'B.png'},
			{value:'C', src: 'C.png'},
			{value:'D', src: 'D.png'},
			{value:'E', src: 'E.png'},
			{value:'F', src: 'F.png'},
			{value:'G', src: 'G.png'},
			{value:'H', src: 'H.png'},
			{value:'I', src: 'I.png'},
			{value:'J', src: 'J.png'},
			{value:'K', src: 'K.png'},
			{value:'L', src: 'L.png'},
			{value:'M', src: 'M.png'},
			{value:'N', src: 'N.png'},
			{value:'O', src: 'O.png'},
			{value:'P', src: 'P.png'},
			{value:'Q', src: 'Q.png'},
			{value:'R', src: 'R.png'},
			{value:'S', src: 'S.png'},
			{value:'T', src: 'T.png'},
			{value:'U', src: 'U.png'},
			{value:'V', src: 'V.png'},
			{value:'W', src: 'W.png'},
			{value:'X', src: 'X.png'},
			{value:'Y', src: 'Y.png'},
			{value:'Z', src: 'Z.png'}
		]
		this.current = []
		this.count = 3
		this.height = this.$box.height() - 77
		this.width = this.$box.width() - 53
		this.currentDom = []
		this.speed = 2
		this.t = ''
		this.$countDiv = $('.count')
		this.$liveDiv = $('.live-val')
		this.fenshu = 0
		this.live = 10
		this.gif = $('.gif img')
	}
	Game.prototype = {
		play: function () {
			var that = this
			this.drawImg()
			this.setImg()
			this.t = setInterval(function () {
				that.move()
			}, 20)
			this.keyDown()
		},
		/*********************************绘制img*********************************/
		drawImg: function () {
			var that = this
			//取得当前取得的三个元素的新数组
			while (this.current.length < this.count) {
				var index = Math.floor(Math.random()*this.arr.length)
				if (!this.check(index)) {				
					this.current.push(this.arr[index])
				}	
			}
			//根据这个新数组去在文档在添加img元素
			this.current.forEach(function (value) {
				var $img = $('<img>')
				$img.attr('src',`A_Z/${value.src}`)
				that.$box.append($img)
			})
		},
		/*******检测新得到的index对应的对象在当前数组this.current中是否存在******/
		check: function (index) {
			var that = this
			return this.current.some(function (val) {
				return that.arr[index].value == val.value
			})
		},
		/************************设置最初的每个img的位置****************************/
		setImg: function () {
			var that = this
			var $imgs = $('img', this.$box)
			//设置最初的每个img的位置
			$imgs.each(function(index, value) {
				var left = Math.floor(Math.random() * that.width)
				var tops = Math.floor(Math.random() * 100)
				$(this).css({top: tops})
				$(this).css({left: left})
				that.currentDom.push(value)
			})
		},
		/************移动img并判断如果超出box则自动消失,并且再增加一个img*************/
		move: function () {
			var that = this
			//循环保存着3个<img>Dom对象的this.currentDom数组,取得每一个img对象,给他们设置top值
			this.currentDom.forEach(function (value, index) {
				var tops = value.offsetTop
				if (tops < that.height) {
					value.style.top = tops + that.speed + 'px'
				} else {
					that.$box[0].removeChild(value)
					that.currentDom.splice(index,1)
					that.current.splice(index,1)
					that.getNewOne()
					that.live--
					that.gif.eq(that.live).show()
					that.$liveDiv.val(that.live / 10)

					if (that.$liveDiv.val() == 0) {
						alert(`游戏结束,你的分数为${that.fenshu}分`)
						that.current = []
						that.currentDom = []
						that.fenshu = 0
						that.live = 10
						that.$box.html('')
						return
					}
				}
			})
		},
		/*******************************得到新的img并加到页面中*********************************/
		getNewOne: function () {
			do {
				var index = Math.floor(Math.random()*this.arr.length)
			} while(this.check(index))
			this.current.push(this.arr[index])

			//把获得的
			var $img = $('<img>')
			$img.attr('src',`A_Z/${this.arr[index].src}`)
			this.$box.append($img)

			console.log(this.$box)

			var left = Math.floor(Math.random() * this.width)
			var tops = Math.floor(Math.random() * 100)
			$img.css({top: tops})
			$img.css({left: left})
			this.currentDom.push($img[0])
		},
		keyDown : function () {
			var that = this
			document.onkeydown = function (e) {
				var keys = e.key
				var key = keys.toUpperCase()
				that.current.forEach(function (val, index) {	
					if (key == val.value) {
						that.$box[0].removeChild(that.currentDom[index])
						that.current.splice(index,1)
						that.currentDom.splice(index, 1)
						that.fenshu++
						that.$countDiv.text(that.fenshu)
						that.getNewOne()
					}
				})
			}
		}
	}
	var game = new Game()
	var $start = $('.start')
	$start.click(function (e) {
		game.play()
		$(this).text('重新开始').click(function () {
			game.$box.empty()
			game.current = []
			game.currentDom = []
			game.fenshu = 0
			game.live = 10
			game.gif.hide()
			clearInterval(game.t)
			game.$countDiv.text(0)
			game.$liveDiv.val(1)
			game.drawImg()
			game.setImg()
			game.keyDown()
		})
	})
})