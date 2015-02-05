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
			this.$board = $(this.option.board);

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
			$(this.$root).on('touchstart', '.target', $.proxy(function(e){

				var v = $(e.currentTarget).data('value'),
					$board = this.$board;
				
				this.option.mark += v;

				$board.text(this.option.mark);
				
				$(e.currentTarget).addClass('bingo');

				setTimeout(function(_this){
					_this.remove()
				}, 200, $(e.currentTarget));

			}, this))
		},

		timer : function(time) {
			this.option.time -= time;

			setTimeout(function(_this){
				_this.newItem();
				if(_this.option.time > 0) 
					_this.render();
				else {
					$(_this.option.modal).trigger('showmodal', _this.option.mark);
				}
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
			}

			return loc;
		},
	}
	
	$('.game-box').beatFalling({
		//item: [{c:'target-one',v:30}, {c:'target-two', v:60}],
		item: [{c:'target-one',v:1}],
		time: 1500,
		speed: ['fast','normal','slow'],
		board: 'h2',
		modal: '#game',
		mark: 0,
	});

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}


	// ----------------------------------------
	// ! the modal
	// ----------------------------------------
	$(document).on('showmodal', '.modal', function(e, mark){
		$(this).addClass('show').find('p span').text(mark);
	})
})