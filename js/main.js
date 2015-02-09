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
			this.option.countDown.total = this.option.time/1000;
			this.option.countDown.last = this.option.countDown.total;
			this.$root = _this;
			this.$board = $(this.option.board);
			this.option.mark = this.$board.data('num');

			this.render();
			
			this.countDown();
			this.option.countDown.$bar
			.css({
				'-webkit-animation-duration': this.option.countDown.total+'s',
          		'animation-duration': this.option.countDown.total+'s'
			});

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

				$board.data('num', this.option.mark).trigger('refreshNumBoard');
				
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

		countDown : function() {

			this.option.countDown.$board.text(this.option.countDown.last);
			// this.option.countDown.$bar
			// .width((this.option.countDown.total-this.option.countDown.last)/this.option.countDown.total*100+'%');

			setTimeout(function(_this){
				_this.option.countDown.last -= 1;
				if(_this.option.countDown.last >= 0) {
					_this.countDown();
				}
			},1000,this)
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
		time: 15000,
		speed: ['fast','normal','slow'],
		board: '.count .digital-board',
		modal: '#game',
		countDown: {
			$board: $('.game-state .time span'),
			$bar: $('.game-state .state-bar .inner'),
		}
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

	// ----------------------------------------
	// ! board of number
	// ----------------------------------------
	$(document)
	.on('refreshNumBoard', '.digital-board', function(){
		var v = $(this).data('num').toString().split(''),
			n = v.length;

		for(var i=1; i<=n; i++) {
			var _v = v.pop();
			if( _v )
				$(this).find('.num:nth-last-child('+i+') .inner').text(_v);
		}
	})
	.on('rendNumBoard', '.digital-board', function(){
		var n = $(this).data('digitalNum');
		
		for(var i=1; i<=n; i++) {
			$('<div class="num col-'+12/n+'"><div class="inner"></div></div>').appendTo($(this));
		}
	})

	$('.digital-board')
	.trigger('rendNumBoard')
	.trigger('refreshNumBoard');

	// ----------------------------------------
	// ! simple slideshow
	// ----------------------------------------
	var carousel = function() {
		var $root = $('.ty-carousel'),
			$wrapper = $root.find('.inner'),
			width = $wrapper.width(),
			distance = 0,
			l = 0,
			current = 0,
			max = 1 - $wrapper.find('.item').size(),
			c;

		if( $root.size() <= 0 ) {
			return;
		}

		c = new Hammer($root[0]);

		c.on('panmove', function(e){
			distance = e.deltaX;

			if( ( distance>0 && current<0 ) || (distance < 0 && current > max) ) {
				update();
			}
		})

		c.on("hammer.input", function(ev) {
		    if(ev.isFinal) {
		    	if( ( distance>0 && current<0 ) || (distance < 0 && current > max) ) {
		    		if( distance/width > .1 ) {
		    			current += 1;
		    			next('animation');
		    		}

		    		else if (distance/width < -0.1) {
		    			current -= 1;
		    			next('animation');
		    		}

		    		else {
		    			next();
		    		}
		    	}
		    }
		});


		function update() {
			$wrapper.css('left', l + distance);
		}

		function next(param) {
			l = current * width;
			
			if( param == 'animation' ) {
				TweenMax.to($wrapper, .5, {left: l});
			}

			else {
				$wrapper.css('left', l)
			}

			updateController();
		}

		function updateController() {
			var index = 0 - current;

			$root.find('.controller a.active').removeClass('active');
			$root.find('.controller a').eq(index).addClass('active');
		}

		updateController();
	}

	new carousel();
})