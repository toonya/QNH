Zepto(function($){

	"use strict";
	
	$.fn.beatFalling = function(options) {
		return this.each(function(){
			// jQuery only
			// var data = $(this).data();
			// var options = $.extend({}, options, data);
			// options.$this = $(this);

			new beat_falling(options, $(this));
		})
	}
	
	var beat_falling = function(options, _this){
		this.init(options, _this);
	}
	
	beat_falling.prototype = {
	    init : function(options, _this){
			this.option = options;
			this.$root = _this;

			this.render();
			this.bind();
		},

		render : function() {
			var time = getRandomInt(200,400);
			// var time = 0;
			// if(this.option.time > 10000)
			// 	time = getRandomInt(150,500);
			// else if (this.option.time < 10000 && this.option.time > 5000)
			// 	time = getRandomInt(100,450);
			// else
			// 	time = getRandomInt(50,400);
			this.timer(time);
		},

		bind : function() {
			$(this.$root).on('touchstart', '.target', function(e){
				var v = $(this).data('value'),
					$board = $('h2'),
					current = $board.data('value');

				$board.data('value', current+v).text($board.data('value'));
				
				$(this).addClass('bingo');

				setTimeout(function(_this){
					_this.remove()
				}, 200, $(this));
			})
		},

		timer : function(time) {
			this.option.time -= time;

			setTimeout(function(_this){
				_this.newItem();
				if(_this.option.time > 0) 
					_this.render();
			},time, this);
		},

		renderItem : function(item) {
			this.$root.append(item);
		},

		newItem : function() {
			var $item = $('<div class="target">'),
				option = this.randomItem(),
				loc = this.randomLoc();

			$item
			.addClass(option.c)
			.addClass(this.option.speed[getRandomInt(0,3)])
			.css(loc.d, loc.l+'%')
			.data('value', option.v);

			$('<div class="the-value">').text('+'+option.v).appendTo($item);

			this.renderItem($item);
			this.runItem($item);
			this.bindItem($item);
		},

		bindItem : function(item) {
			item.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
				$(this).remove();
			})
		},

		runItem : function(item) {
			item.addClass('start');
		},

		randomItem : function() {
			return this.option.item[getRandomInt(0, this.option.item.length)];
		},

		randomLoc : function() {
			var loc = {
				d : 'left',
				l : getRandomInt(0,50)
			}

			if ( getRandomInt(0,2) ) {
				loc.d = 'right';
				console.log(loc.d);
			}

			return loc;
		},
	}
	
	$('.game-box').beatFalling({
		item: [{c:'target-one',v:30}, {c:'target-two', v:60}],
		time: 15000,
		speed: ['fast','normal','slow']
	});

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}
})