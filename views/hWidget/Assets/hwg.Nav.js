(function($){
$.widget("PH_utils.hwgNav", $.PH_utils.uiBase, {
	version: "1.0",
	_create: function(){
		var wgThis = this;
		
		this._super();
		this._addClass("hwgNavigation hwgNav" + this.options.navType);
		
		this.options.resetsize = function(e, d) { wgThis._resetSize(e, d); }
		this.options.data = this.options.data && JSON.parse(this.options.data);
		
		/** chi 1 trong 2
			//neu thuc hien ngay luc su dung wiget thi co the cai li_click tai day
				this.options.li_click = function(e, d) {
					console.log('run from options.li_click: ', e, d);
					//if (d.li.id = 111) doAjax(xxx)
				}
			//neu khong, co the cai event tuong tu nhu : $('#idOfNav').on('hwgnavli_click', function(e, d) {...});
		/**/
		
		this._evalClientEvent();
		
		this._on( this.element, {
		  mouseup: function( event ) {
			var evtName = $(event.target).parentsUntil('li').parent().attr('data-hwg-event');
			if (evtName) {
				// Pass the original event so that the custom search event has
				// useful information, such as keyCode
				this._trigger( evtName, event, {
				  // Pass additional information unique to this event
				  value: this.element.val(),
				  withAllNav: wgThis.options.resetSiseAllNav !== undefined ? wgThis.options.resetSiseAllNav : true,
				});
			}
		  }
		});
		/*
		this._on(this.element, {
			resetsize: function(e){
				this._trigger('resetsize', e, {
						value: this.element.val(),
						withAllNav: wgThis.options.resetSiseAllNav !== undefined ? wgThis.options.resetSiseAllNav : true,
					} );
				return true;
			}
		});
		*/
		
		/** * chi 1 trong 2, neu ca 2 thi se thu tu chay hwgnavli_click roi den options.li_click  
			* Note: user phai cai dat on nhu ex sau:  
			*		$('#custNavId').on('hwgnavli_click', function(e, d) {console.log(222, e, d);})
			* co nhu vay thi khi click vao li se chay "on" tren.
			* Warning: neu khong co tiep dau ngu "hwgnav" thi khi click se khong chay "on"-custom, ma chi chay "on"-Original
		**/
		/*this._on(this.element, {
			li_click: function(e, d){
console.log('chay trong _on.li_click : ', e, d);
				this._trigger('li_click', !e || e && !$(e).parent('li').length ? wgThis.values('currLiInfo.li') : e, d && d.hasOwnProperty('li') ? d : wgThis.values('currLiInfo'));
			}
		})
		*/
		
		this.options.draggable && this._mkDragDrop();
		
		if (!this.pluginStopped ) {
			//$.proxy(
			//this._initWrapElem()
			;//, this);
			
			//$.proxy(
			//this._initSetEvent()
			;//, this);
		}
		else {
		  //this._promptPlaceHolderShow(); 
		}
	  },
	_destroy: function(){
		this.element.parent().resizable('destroy');
		this._removeClass("hwgNavigation hwgNav" + this.options.navType);
		this._super();
	  },
	_init: function() {
		this._super();
		var wgThis = this;
		
		$(this.element.children('div')[0]).css({"--bs-body-bg": this.element.css("background-color"), "--bs-body-color": this.element.css("color"),
												 "--bs-dropdown-link-active-bg": this.element.css("background-color"), "--bs-dropdown-link-active-color": 'lightyellow' 
												});
		
		//this.element.find('.dropdown-item')......
		
		if (this.isMobile('any')) {
			this.element.parent().css("width","");
			this.options.noGToggle = false;
		}

		
		function doHideLabel(ee, d) {
			var e = {data: ee.data};
			if (e.data === undefined || typeof e.data !== 'object' || !e.data.wgThis) return false;
			if (e.data.wgThis.values('doingHideLabel')) return false;
			e.data.wgThis.values('doingHideLabel',true)
			
			var $m = e.data.menu, mOpts = $m.hwgNav('values','.options'), mw = parseFloat($m.parent().attr('hasResize')) || parseInt(e.data.wgThis.values('orgMenuWidth'))
				, $p = $($m.parent().parent().find('.container')[0]), pw = $p.outerWidth(), n = parseInt(e.data.wgThis.values('minMenuWidth'));
			
			$m.find('.dropdown-menu').each(function() {
				if (parseInt($(this).attr('data-node-level')) >= 1)
				$(this).dropdown('hide');
			});
			
			e.data.el.toggleClass('collapsed'); 
			
			if (e.data.el.hasClass('collapsed')) {
				$m.find('.a-label,.dropdown-toggle').addClass('d-none'); 
				if (mOpts.isMainNav) {
					$m.animate({width: n+'px'}, {complete: 
						function(nn,t){
							if (e.data.wgThis.isMobile('any') && !mOpts.menuAlwayIconMin) {$m.addClass('d-none'); $m.removeClass('invisible'); e.data.wgThis.values('doingHideLabel',false);
							} else {
								$m.removeClass('invisible');
								$m.removeClass('d-none'); 
								if ($m.parent().css('position')=='absolute') {
									$m.parent().css({width: n, position: ''});
									e.data.wgThis.values('doingHideLabel',false);
								} else $m.parent().animate({width: n+'px'},function(){e.data.wgThis.values('doingHideLabel',false)});
							}
						}
					});
				} else {
					$m.parent().animate({width: n+'px'}, {
						complete: function(){
							
							if (e.data.wgThis.values('isRightMenu') && e.data.wgThis.isMobile('any')) {
								$(this).animate({left: screen.width-n +'px'}, function(){$(this).css({position: ''});});
							}
							
							if (e.data.wgThis.isMobile('any') && !mOpts.menuAlwayIconMin) {
								$m.removeClass('invisible');
							} else {
								$m.removeClass('invisible');
								$m.removeClass('d-none'); 
								/*if ($m.parent().css('position')=='absolute') {
									$m.parent().css({width: n, position: ''});
								}*/
							}
							if (!e.data.wgThis.values('isRightMenu') && $m.parent().css('position')=='absolute') {
								$m.parent().css({width: n, position: ''});
							}
							e.data.wgThis.values('doingHideLabel',false);
						}
					})
				}
			} else {
				$m.removeClass('d-none');
				if (mOpts.isMainNav) {
					$m.animate({width: mw+'px'}, {complete: 
						function(nn,t){
							$m.find('.a-label,.dropdown-toggle').removeClass('d-none');
							if (e.data.wgThis.isMobile('any')) e.data.wgThis.values('doingHideLabel',false); 
								else $m.parent().animate({width: mw+'px'},function(){
									//!$m.parent().attr('hasResize') && $(this).css('width', ''); 
									e.data.wgThis.values('doingHideLabel',false)});
						}});
				} else {
					function mExpand() {
						function mComplete(){
							$m.find('.a-label,.dropdown-toggle').removeClass('d-none');
							//!$m.parent().attr('hasResize') && $(this).css('width', '');
							e.data.wgThis.values('doingHideLabel',false);
						}
						$m.parent().animate({width: mw+'px'}, mComplete);
					}
					
					if (e.data.wgThis.values('isRightMenu') && e.data.wgThis.isMobile('any')) {
						$m.parent().css({position: 'absolute'});
						$m.parent().animate({left: screen.width-mw +'px'}, function(){
							mExpand();
						});
						return;
					}
					
					e.data.wgThis.isMobile('any') && $m.parent().css({position: 'absolute'});
					mExpand();
				}
			}
		}
		
		
		if (!this.options.isMainNav && this.options.navType == 'menu') {
			
			var $ePar = this.element.parent(), classMarkContent = 'ps-3';
			
			wgThis.element.find('li.nav-item').removeClass('ms-4').addClass('ps-2 ms-1').find('i.bi').removeClass('pe-2').addClass('pe-1');		
			wgThis.element.css({'margin-left':''}).removeClass('invisible position-fixed').addClass('pt-0');
			
			$ePar.css({"margin-left": this.element.css("margin-left"), "z-index": 998}).removeClass('d-none');
			
			wgThis.element.parent().next().addClass(classMarkContent);
			if (wgThis.values('isRightMenu') || wgThis.element.parent().prev().hasClass(classMarkContent)) {
				wgThis.values('isRightMenu',true);
				
				wgThis.element.parent().prev().addClass('pe-' + classMarkContent.split('-')[1]);
				var $btn = wgThis.element.find('[aria-controls="' + wgThis.element.attr('id') + '"]');
				$btn.next().addClass('pt-0 pb-0');
				$btn.removeClass('me-1 mt-1').addClass('float-right me-2 mt-2 pt-0').insertAfter($btn.next());
				if (wgThis.isMobile('any')) {
					//wgThis.options.noGToggle = false;
					wgThis.element.parent().css('z-index', 997);
				}
			}
			
			var $el = wgThis.element.find('[aria-controls="' + wgThis.element.attr('id') + '"]');
			
			wgThis.values('orgMenuWidth', wgThis.element.outerWidth());
			
			findSlideM(wgThis.element, $el, 'click');
		}

		
		if (this.options.navType == 'menu') {
			if (this.options.isMainNav) {
				wgThis.isMobile('any') && this.element.parentsUntil('.row').parent().addClass('gx-0');
				var $ePar = this.element.parent();
				$ePar.css({"margin-left": this.element.css("margin-left"), "z-index": 999, position: "absolute"}).removeClass('d-none');
				this.element.css({'width': $ePar.innerWidth()-parseInt($ePar.css('padding-right'))-parseInt($ePar.css('padding-left'))
							-parseInt($ePar.parent().css('padding-left'))}).children('.container-fluid').css('margin-top', '0.5em');
							
				if (!wgThis.options.noTopFixed && $($('.hwgNavmenu')[0]).attr('id') == this.options.id) {
					$('.footer').css({"z-index": 1000});
					//*
					wgThis.options.timerIdSec = 0;
					wgThis.options.timerIdBusy = false;
					wgThis.options.timerId = window.setInterval(function(wgThis) {
						if (wgThis.options.timerIdBusy) return;
						wgThis.options.timerIdBusy = true;
						if ($('.hwgNavbar').length) {
							wgThis.element.css({'padding-top': $($('.hwgNavbar')[0]).outerHeight() || 0, 'top': 0, 'left': 0})
							if ((!wgThis.isMobile('any') && !wgThis.options.menuInitMin) || wgThis.options.menuAlwayIconMin) wgThis.element.removeClass('invisible');
							window.clearInterval(wgThis.options.timerId);
							wgThis.options.timerIdBusy = false;
							return;
						}
						if (wgThis.options.timerIdSec++ > 15) {
							wgThis.element.removeClass('invisible');
							$ePar.css('position','');
							window.clearInterval(wgThis.options.timerId);
						}
						wgThis.options.timerIdBusy = false;
					}, 300, wgThis);
					//*/
				}
			}
		} else {
			wgThis.isMobile('any') && this.element.find('.dropdown-menu').addClass('me-auto border border-0');
			this.element.parent().addClass('ps-0 pe-0');
			
			this.element.find('.full-row-hover').each(function() { 
				var $li = $(this).parent().parent(), $btnLvl = $($(this).parentsUntil('.navbar-collapse').parent().parent().children('.dropdown-toggle[data-node-level]')[0]).attr('data-node-level') || 999;
				if (!$li.parent('.dropdown-menu').length) {
					$(this).css({left: 'unset', width: $li.outerWidth()+parseFloat($li.css('margin-left'))});
				} else {
					if ($li.hasClass('dropdown'))
						$(this).css({"margin-left": 0, left: '-12%', width: '110%'});
					else $(this).css({"margin-left": 0});
				}
			});
			
			var $r = $('main>.row').find('.col>.container');
			if ($r.length && $('.hwgNavbar').length && !wgThis.options.noTopFixed && wgThis.options.isMainNav) {
				$('.hwgNavbar').each(function() {
					if ($(this).hwgNav('values', '.options').isMainNav) {
						$('main>.row').addClass('mt-3').css({'padding-top': $(this).outerHeight() || 0, 'top': 0, 'left': 0});
						return false;
					}
				});
			}
			
			if (!$('.mark-has-btn-menu').length) {
				if (wgThis.options.isMainNav) {
					findSlideM();
				}/* else {
					if (wgThis.isMobile('any')) {
						wgThis.element.addClass('mb-3');
						wgThis.element.css({"margin-right": "-0.9em"});
					}
					var $findCont = wgThis.element.parent().parentsUntil('.container');
					$findCont.length && $findCont.parent().parent().addClass('ps-2');
				}*/
			}
			
			if (!wgThis.options.isMainNav) {
				if (wgThis.isMobile('any')) {
					wgThis.element.addClass('mb-3');
					//wgThis.element.css({"margin-right": "-0.9em"});
				} else {
				var $findCont = wgThis.element.parentsUntil('.container');
				$findCont.length && $findCont.parent().parent().addClass('ps-2');
				}
			}
		}
		
		
		function findSlideM($mm, $eel, evt) {
				wgThis.options.timerIdSec = 0;
				wgThis.options.timerIdBusy = false;
				wgThis.options.timerId = window.setInterval(function(wgThis, doHideLabel) {
					if (wgThis.options.timerIdBusy) return;
					wgThis.options.timerIdBusy = true;
					if ($('.hwgNavmenu').length) {
						var $m = $mm || $($('.hwgNavmenu')[0]) , $el = $eel || wgThis.element.find('.mark-for-menu'), mOpts = $m.hwgNav('values','.options');
						if (!$mm) $('.hwgNavmenu').each(function(){
							$m = $(this);
							mOpts = $m.hwgNav('values','.options');
							if (mOpts.isMainNav) return false;
						});
						if (!mOpts.isMainNav && !$mm) {
							window.clearInterval(wgThis.options.timerId);
							return;
						}
						
						!wgThis.values('minMenuWidth') && wgThis.values('minMenuWidth', !wgThis.options.isMainNav ? (wgThis.isMobile('any') ? 53 : 46 ) : 62);
						
						if (wgThis.isMobile('any') && !mOpts.isMainNav) {
							$m.addClass('ps-1').removeClass('h-100').parent().css({'margin-top': '-1em'});
							var $findCont = $m.parent().parentsUntil('.container');
							if ($findCont.length) $findCont = $findCont.parent(); else $findCont = false;
							$findCont && $findCont.addClass('ps-0');
						}
						
						$el.attr('data-bs-target', '.navbar_'+$m.attr('id'));
						$el.attr('aria-controls', $m.attr('id'));
						$el.addClass('d-inline-block mark-has-btn-menu');
						$(wgThis.element.find('.navbar-brand')[0]).addClass('ms-3');
						!wgThis.values('orgMenuWidth') && wgThis.values('orgMenuWidth', $m.outerWidth());
						$el.on(evt || 'click', {el: $el, menu: $m, wgThis: wgThis}, doHideLabel);
						window.clearInterval(wgThis.options.timerId);
						if ((wgThis.isMobile('any') /* alway min on phone... && mOpts.isMainNav*/) || mOpts.menuInitMin) {
							$el.trigger(evt || 'click', {senderCode: 2});
						} else {
							$m.parent().css('position','');
						}
						return;
					}
					if (wgThis.options.timerIdSec++ > 15) {
						window.clearInterval(wgThis.options.timerId);
						$m.parent().css('position','');
					}
					wgThis.options.timerIdBusy = false;
				}, 300, wgThis, doHideLabel);
			}
		
		
		function adjPos($this, $li, isClickSender) {
			wgThis.values('doingHidePrev',true);
			
			$this = $li.find('[aria-labelledby="' + $this.attr('id') + '"]');
			if (parseInt(wgThis.values('prevExpandedLevel')) <= 1) {
				wgThis.values('currUlWidth', $this.width());
				wgThis.values('currUlLeft', $this.offset().left);
				if (!isClickSender) {
					wgThis.values('doingHidePrev', false);
					return;
				}
			}
			var lf;
			lf = $li.outerWidth()-parseInt($li.css('margin-right'))-5;
			$this.css({'postion': 'absolute !important', 'left' : lf, 'top': 5}).addClass('invisible');
			if ((wgThis.options.flatMenu && $this.offset().left>0) || $this.offset().left + $this.outerWidth() > window.screen.width) {			
				lf = -$this.outerWidth()-parseInt($li.css('margin-left'))+5;
				$this.css({'left' : lf});
				
				if ($this.offset().left<0) {
					lf += $this.offset().left;
					$this.css('left', lf);
				}
			}
			$this.removeClass('invisible').addClass('shadow');
			wgThis.values('doingHidePrev', false);
		}

		
		function doHidePrev($this, $doShow, internal) {
			if (wgThis.values('doingHidePrev')) return;
			wgThis.values('doingHidePrev', true);
			
			var liInf = wgThis._li_info($this);
			
			var $prevNode, mrkLv1 = false;
			if (wgThis.values('prevExpanded')) {
				if ( liInf.level == 1 &&  wgThis.values('prevExpandedLevel_1') !== liInf.btn.attr('id')) {
					$prevNode = $('#'+wgThis.values('prevExpandedLevel_1')); 
					mrkLv1 = true;
				} else {
					$prevNode = $('#'+wgThis.values('prevExpanded'));
				}
				if (parseInt(wgThis.values('prevExpandedLevel')) >= liInf.level || mrkLv1 ){
					var liInf0 = wgThis._li_info($prevNode);
					liInf0.ulParent.find('.dropdown-menu.show').removeClass('shadow').dropdown('hide');
					liInf0.ulParent.children('a.nav-link').removeClass('active leaf');
					liInf0.btn.removeClass('active show').attr('aria-current','false').attr('aria-expanded', 'false');
				}
			};
			
			
			wgThis.values('prevExpanded', liInf.btn.attr('id'));
			wgThis.values('prevExpandedLevel', liInf.level);
			
			if (liInf.level == 1) wgThis.values('prevExpandedLevel_1', liInf.btn.attr('id'));
			
			liInf.ulParent.parent().children('a.nav-link').removeClass('active leaf');
			if (liInf.level >= 1) {
				liInf.ulParent.find('.dropdown-menu.show').removeClass('shadow').dropdown('hide');
				liInf.ulParent.children('a.nav-link').removeClass('active leaf');				
			}
			$doShow && liInf.btn.trigger('click', {senderCode: 1});		
			wgThis.values('hasToggleOnce', true);
			
			setTimeout(function (liInf, currLiInf) {
				currLiInf.expanded = liInf.ulChild.hasClass('show');
				if (currLiInf.expanded) {
					$(liInf.li.find('a.nav-link')[0]).addClass('active');
					liInf.btn.addClass('active').attr('aria-current','true');
				} else {
					$(liInf.li.find('a.nav-link')[0]).removeClass('active leaf');
					liInf.btn.removeClass('active').attr('aria-current','false');
				}
			}, 51, liInf, wgThis.options._values.currLiInfo);
			
			if (internal) {
				wgThis.values('doingHidePrev', false);
				return;
			}
			
			if (wgThis.options.navType == 'menu') {
				var $el = $('.navbar-toggler[aria-controls="'+ wgThis.options.id +'"]');
				if ($el.hasClass('collapsed')) {
					$el.trigger('click');
					liInf.btn.trigger('click', {senderCode: 1});
				}
				wgThis.values('doingHidePrev', false);
				return;
			}
			
			if (wgThis.isMobile('any')) {
				wgThis.values('doingHidePrev', false);
				return;
			}
			
			adjPos(liInf.btn, liInf.li); 
		}
	
	
		this.element.find('.dropdown-menu').on('show.bs.dropdown', function(e){
			doHidePrev($(e.target));
		}).on('hide.bs.dropdown', function(e){
			var $this = $(e.target), $li = $this.parent().prop('tagName') === 'LI' ? $this.parent() : $this.parentsUntil('li').parent();
			$li.find('a.nav-link.active').removeClass('active');
			$li.find('.show[aria-expanded]').attr('aria-expanded', 'false').removeClass('show');
		});
		
		
		this.element.find('.dropdown-toggle').on('click', function(e, d){
			if (d && d.senderCode == 1) return true;
			var $this = $(e.target), liInf = wgThis._li_info($this);
			
			window.setTimeout(function($this, doHidePrev, wgThis, liInf) {
				var isExpanded = liInf.ulParent.hasClass('show');
				if (parseInt(wgThis.values('prevExpandedLevel')) < liInf.level) return;
				doHidePrev($this,  !wgThis.values('toggleFirstClick') || (wgThis.isMobile('any') && liInf.level <= 1 && wgThis.options.navType!=='menu') ? false : !isExpanded);
				
				wgThis._trigger('li_click', e, wgThis._li_info($this, true));
				wgThis.values('toggleFirstClick', !wgThis.values('toggleFirstClick'));
				
			},151, $this, doHidePrev, wgThis, liInf);
			if (!d) {
				wgThis.values('prevExpandedLevel', 1);
				liInf.level > 1 && !wgThis.values('doingHidePrev') && adjPos($this, liInf.li, true);
				wgThis._trigger('li_click', e, wgThis._li_info($this, true));
				return true;
			}
			e.stopImmediatePropagation();
			return false;
		}).on('mouseenter',function(e){
			if (wgThis.options.navType === 'menu' && !wgThis.options.menuAutoToggle) return true;
			var $this = $(e.target);
			if (wgThis.values('hasToggleOnce')) {
				doHidePrev($this, true);
				e.stopImmediatePropagation();
				return false;
			}
		});
	
	
		this.element.on('mouseleave', function(e, d){
			!d && (d = {senderCode: 0})
			if (!wgThis.values('hasToggleOnce')) return true;
			wgThis.values('hasToggleOnce', false);
			if (d.senderCode != 1 && wgThis.options.navType === 'menu' && !wgThis.options.menuAutoToggle) return true;
		
			wgThis.element.find('[aria-controls]').each(function() {
				if (!$(this).hasClass('mark-has-btn-menu')) {
					$('#'+$(this).attr('aria-controls')).parent().find('.dropdown-menu.show').dropdown('hide');
				}
			});
			e.stopImmediatePropagation();
			return false;
		});
	
	
		this.element.find('.navbar-toggler').on('click',  function(e,d ){ //for mobile
			if (d && d.senderId == wgThis.options.id) return false;
			var prevWgNavId = window.prevAriaToggleMenu || '';
			prevWgNavId && (prevWgNavId = '#'+prevWgNavId);
			if (prevWgNavId && $(prevWgNavId).hasClass('phone-nav')) prevWgNavId = '#'+window.prevAriaToggleMenu.substr(1);
			if (prevWgNavId && (!$(prevWgNavId).length || !$(prevWgNavId).hwgNav('values','.options.noGToggle')) && prevWgNavId !== '#'+$(this).attr('aria-controls')) {
				var $btn = $('.navbar-toggler[aria-controls="'+window.prevAriaToggleMenu+'"]');
				if (!$btn.hasClass('collapsed')) {
					if (!$btn.hasClass('mark-has-btn-menu')) {
						$('#'+window.prevAriaToggleMenu).find($btn.attr('data-bs-target')).removeClass('show');
						$btn.addClass('collapsed').attr('aria-expanded', 'false');
					} else $btn.trigger('click', {senderId: window.prevAriaToggleMenu});
				}
			}
			window.prevAriaToggleMenu = $(this).attr('aria-controls');
			wgThis.element.trigger('mouseleave', {senderCode: 1});
			return false;
		});
			
		
		this.element.find('.virt-dropdown-toggle').on('click',function(e){
			var liInf = wgThis._li_info($(this));
			doHidePrev(liInf.ulChild, !liInf.ulChild.hasClass('show'));
			
			liInf = wgThis._li_info($(this), true);
			
			wgThis._trigger('li_click', e, liInf);
			e.stopImmediatePropagation();
			return false;
		}).on('mouseenter',function(e){
			var liInf = wgThis._li_info($(this));
			var $this = $(liInf.li.find('.dropdown-toggle')[0]);
			if (wgThis.values('prevExpanded') == $this.attr('id') || wgThis.options.navType === 'menu' && !wgThis.options.menuAutoToggle) {
				e.stopImmediatePropagation();
				return false;
			}
			if (wgThis.values('hasToggleOnce')) {
				doHidePrev($this, true);
				e.stopImmediatePropagation();
				return false;
			}
		});

		
		wgThis.options.customLiEvent && this.element.find('button.dropdown-item,a.dropdown-item,button.nav-link,a.nav-link').on('click',function(e){
			var liInf = wgThis._li_info($(this));
			
			window.setTimeout(function($ethis, wgThis, liInf) {
				wgThis.document.find('li').find('button.dropdown-item.active.leaf,a.dropdown-item.active.leaf,button.nav-link.active.leaf,a.nav-link.active.leaf').removeClass('active leaf');
				$ethis.addClass('active leaf');
			}, 0, $(this), wgThis, liInf);
			
			
			liInf = wgThis._li_info($(this), true);
			
			if (liInf.li.hasClass('dropdown')) return true;
			
			liInf.leaf = true;
			window.setTimeout(function(wgThis) {
				$('#'+wgThis.element.attr('id') + ' li.hwg-li-drop-active').removeClass('hwg-li-drop-active');
			},0, wgThis);
			
			liInf.href = $(this).attr('href') || false;
			liInf.href && (liInf.href = decodeURIComponent(liInf.href).replace('/index.php?','/?')); 
			liInf.click = $(this).attr('onclick') && $(this).attr('onclick').trim().indexOf('void(')!==0 ? $(this).attr('onclick') : false;
			if (liInf.click && typeof liInf.click === 'string') liInf.click = eval('(function(event){function __(event){'+liInf.click+'} return __(event)})');
			$(this).removeAttr('href');
			liInf.click && $(this).attr('onclick','void(0);');
			
			
			//*
			!liInf.click && (liInf.click = $(this).data('hwg-click'));
			//change href to func-event
			if (liInf.href) {
				liInf.click = eval('(function(){location.href = "' + liInf.href + '"; return false;})');
				liInf.href = null;
				$(this).data('hwg-click',liInf.click);
			}
			//*/
			
			wgThis.values('currLiInfo.leaf',true);
			
			wgThis.values('currLiInfo.href',liInf.href);
			wgThis.values('currLiInfo.click',liInf.click,'onlySetFunc');
			//wgThis.options._values.currLiInfo.click = liInf.click;
			
			wgThis._trigger('li_click', e, liInf);
			e.stopImmediatePropagation();
			return false;
		})
		
		if (wgThis.options.isMainNav) 
		if (this.options.navType == 'bar' && wgThis.isMobile('any')) {
			$(this.element.children('div')[0]).children('.w-auto').addClass('w-100').removeClass('w-auto');
			if (!this.options.barAlwayIconMin) { 
				var n = 0, drk = this.element.hasClass('bg-dark') ? 'bg-dark' : (this.element.hasClass('bg-light') ? 'bg-light' : ''),
					//$el = $('<div id="p' + (this.element.attr('id')) + '" class="row gx-0  phone-nav pe-2 position-absolute ' + drk + ' col-10" data-bs-theme="' + (this.element.attr('data-bs-theme') + '" style="z-index:999; ' +  (this.element.attr('style') || '')) + '"><div class="col navbar pt-0 pb-0"></div></div>');
					$el = $('<div id="p' + (this.element.attr('id')) + '"  data-bs-theme="' + (this.element.attr('data-bs-theme') + '" style="z-index:999; ' +  (this.element.attr('style') || '')) + '"><div class="col navbar pt-0 pb-0"></div></div>');
				
				$el.addClass(this.element.attr('class') + ' row gx-0 phone-nav pe-2 position-absolute col-10'
						//this.element.removeClass(function (index, className) {
						//	return/*(className.match ((/((^|\s)*nav[^\s]+|(^|\s)*hwg[^\s]+)/gi)) || []).join(' ') +*/ ' ph-utils-ui-base Xfixed-top';
						//}).attr('class')
						//this.element.attr('class').match ((/((^|\s)*nav[^\s]+|(^|\s)*hwg[^\s]+)/gi)) || []).join(' ') + ' ph-utils-ui-base fixed-top';
					).removeClass(function (index, className) {
						 return (className.match ((/((^|\s)*nav[^\s]+|(^|\s)*hwg[^\s]+)/gi)) || []).join(' ') + ' ph-utils-ui-base fixed-top';
					});
					
				
				$el.insertAfter(this.element);
				$elz = $el.find('div :first-child');
				$el.css({top: this.element.outerHeight()-2+'px', 'left': screen.width-$elz.outerWidth()-8+'px'});
				var last;
				this.element.find('[aria-controls="' + this.element.attr('id') + '"]').attr('aria-controls', 'p'+this.element.attr('id'));
				$(this.element.children('div')[0]).children().each(function(){
					if (this.tagName == 'DIV' || this.tagName == 'FORM') {
						if  (n==0) $(this).addClass('pt-2');
						//if ($(this).hasClass('w-auto')) $(this).removeClass('w-auto').addClass('w-100');
						$elz.append(this);
						n++;
						last = this;
					}
				});
				last && $(last).find('.navbar-collapse:last-child').addClass('pb-2');
				$elz.find('ul').addClass('border border-0');
			}
		}
		
		
		!wgThis.isMobile('any') && this._mkResizeAble();
		
		//this.refresh($.proxy(function(){
				//
		//}, this));
		
	  },

	resize: function(a,b,c) {
		//this._superApply( arguments );
	},
	refresh: function(succOnloadCb) {
		this._trigger('resetsize', null, Object.assign(succOnloadCb || {}, {value: this.value, withAllNav: false}));
	},
	isMobile: function(m){ 
		return phUtils.isMobile(m);
	},
	_li_info: function($this, saveLastLiInfo) {
		saveLastLiInfo && (this.options._values.lastLiInfo = this.options._values.currLiInfo);
		var $li = $this.prop('tagName') === 'LI' ? $this : $this.parent().prop('tagName') === 'LI' ? $this.parent() : $this.parentsUntil('li').parent(),
			$btn = $($li.children('.dropdown-toggle')[0]), $ulChild = $($li.find('.dropdown-menu')[0]);
		this.options._values.currLiInfo = {
				li: $li,
				level: parseInt($li.attr('data-node-level')||-1),
				ulParent: $li.parent('ul'),
				ulChild: $ulChild,
				expanded: $ulChild.hasClass('show'),
				btn: $btn,
			};
		return this.options._values.currLiInfo;
	},
	_mkResizeAble: function() {
		var wgThis = this;
		this.options.resizable && this.element.parent().resizable({handles: !this.options.isRightMenu ? 'e' : 'w',
				minWidth: 46, 
				start: function(e, ui) {
					wgThis.element.css('width', '');
				}, 
				stop: function(e, ui){
						ui.element.attr('hasResize', ui.size.width)
						if (!ui.element.attr('hasOrgSize')) ui.element.attr('hasOrgSize',ui.originalSize.width);
						
						if (!wgThis.options.isRightMenu) {
							return;
						}
						ui.element.css({'left': 0});
				}, 
				resize: function(e, ui) {
					wgThis.options.isMainNav && wgThis.element.css('width', ui.size.width);
					if (wgThis.options.isRightMenu) {
						ui.element.css({'left': 0});
					}
					
					var $btn = wgThis.element.find('[aria-controls="' + wgThis.element.attr('id') + '"]');
			
					
					if (ui.size.width < 120) {
						if (!ui.element.resizable('option','hasToggleTitleHide')) {
							ui.element.resizable('option','hasToggleTitleHide', true);
							wgThis.element.find('.a-label,.dropdown-toggle').addClass('d-none');
							$btn.addClass('collapsed');
							ui.element.resizable('option','hasToggleTitleShow', false)
						}
					} else {
						if (!ui.element.resizable('option','hasToggleTitleShow')) {
							ui.element.resizable('option','hasToggleTitleShow', true)
							wgThis.element.find('.a-label,.dropdown-toggle').removeClass('d-none'); 
							$btn.removeClass('collapsed');
							ui.element.resizable('option','hasToggleTitleHide', false);
						}
					}
				},
			});
	},
	_resetSize: function(e, d) {
		var $btn = this.element.find('[aria-controls="' + this.element.attr('id') + '"]');
		var hasSz = parseInt(this.element.parent().attr('hasResize')||0), mw = parseInt(this.values('orgMenuWidth') || 0);

		this.element.parent().attr('hasResize', mw);
		if (!$btn.hasClass('collapsed') && hasSz != mw) {
			$btn.trigger('click');
			window.setTimeout(function($btn){
				$btn.trigger('click');
			},500,$btn);
		}
		if (e.data && e.data.senderId === this.element.attr('id')) return;
		if (d && d.withAllNav) {
			var wgThis = this;
			$('.hwgNavigation').each(function() {
				if ($(this).attr('id') !== wgThis.element.attr('id')) $('#'+$(this).attr('id')).hwgNav('values','.options.resetsize',{data:{senderId: $(this).attr('id')}},{withAllNav: false});
			});
		}
	},
	_mkDragDrop: function() {
		var wgThis = this;
	//if (this.options.draggable) {
		$.widget('PH_utils.e_draggable', $.PH_utils.uiBase, $.ui.draggable, {});
		$.widget('PH_utils.e_droppable', $.PH_utils.uiBase, $.ui.droppable, {});
		
		wgThis.options.drag_opts = {
			revert: wgThis.options.dragRevert || false,
			axis: wgThis.options.dragRevert ? false : "y",
			cursor: 'grab',
			///cursorAt: {bottom: 0},
			cursorAt: {top: 0},
			distance: 2,
			snap: '.hwg-li-drop-snap',
			snapMode: 'outer',
			////snapTolerance: 1,
			refreshPositions: true,
			opacity: wgThis.options.dragRevert ? 1 : 1.001,
			containment: wgThis.options.dragRevert ? 'document' : '#'+wgThis.element.attr('id'),
			create: function(e, ui) {
				!this.options && (this.options = {});
				$(e.target).addClass('hwg-li-drag');
			},
			helper: //function() {return $('<div class="hwg-drop-indicator" style="text-align: center; width:100%; color: blue;"><div class="bi-caret-down-fill" style="margin-top:-1.0em; height: 0.8em">&nbsp;</div><div class="bi-caret-up-fill" style="display:inline-block">&nbsp;</div></div>')},
					function() {return $('<div class="hwg-drop-indicator" style="text-align: center; width:100%; color: blue;"><div class="bi-border-width">&nbsp;</div></div>')},
					//function() {return $('<div class="hwg-drop-indicator" style="text-align: center; width:100%; color: green; opacity:0.1; margin-top:-2.5em;">drop</div>')},
					//'clone',
					//'original',
			start: function(e, ui) {
				//ui.helper.addClass('hwg-li-drag-hint');
				$(e.target).addClass('hwg-li-drag-hint');
				if ($(e.target).hasClass('dropdown')) {
					$($(e.target).children('ul')[0]).removeClass('show');
				}
			},
			drag: function(e, ui) {
				//ui.position.left = this.options.orgLeft;
			},
			stop: function(e, ui) {
				//ui.helper.removeClass('hwg-li-drag-hint');
				$(e.target).removeClass('hwg-li-drag-hint');
				$(wgThis.options._itemClonedQuery).remove();
				$( '#'+wgThis.element.attr('id')+' .hwg-li-drop-hint,.hwg-li-drop-hint-before').removeClass('hwg-li-drop-hint hwg-li-drop-hint-before');
			},
		}
		
		wgThis.options._itemClonedQuery = '#' + wgThis.element.attr('id')+' .hwg-drag-cloned';
		wgThis.options._itemHintQuery = '#' + wgThis.element.attr('id')+' .hwg-li-drop-hint,.hwg-li-drop-hint-before,.hwg-li-drop-active';
		
		wgThis._clearDragCloned = function(e, ui, uiThis, callback) {
					$(wgThis.options._itemHintQuery).removeClass('hwg-li-drop-hint hwg-li-drop-hint-before hwg-li-drop-active');
					$(wgThis.options._itemClonedQuery).remove();
					uiThis.options.dragCloned = false;
					uiThis.options.hasDrawClone = false;
					if (typeof callback === 'function') callback(e, ui, uiThis);
				}
				
		wgThis._doDragOver = function(e, ui, uiThis) {
			window.setTimeout(function(e, ui, xthis, wgThis) {
				!xthis.options.hasDrawClone && wgThis._clearDragCloned(e, ui, xthis, function(e, ui, uiThis){
					xthis.options.hasDrawClone = true;
					
					xthis.options.hint = $(e.target);
					
					/*if (ui.draggable.hasClass('dropdown')) {
						$(ui.draggable.children('ul')[0]).removeClass('show');
					}*/
					
					if (xthis.options.hint.hasClass('dropdown')) {
						var ul$ = $(xthis.options.hint.children('ul')[0]).addClass('show');
						ul$.children('li').children('ul').removeClass('show');
					} 
					
					//xthis.options.hint.addClass('hwg-li-drop-hint');
					xthis.options.hint.addClass('hwg-li-drop-hint-before');
					
					xthis.options.dragCloned = ui.draggable.removeClass('.hwg-drag-cloned').clone();
					//xthis.options.dragCloned.insertAfter(xthis.options.hint);
					xthis.options.dragCloned.insertBefore(xthis.options.hint);
					xthis.options.dragCloned.addClass('hwg-li-drag-hint hwg-drag-cloned').css({'position': 'unset', 'top': '', 'opacity': 'unset'})
											.removeClass('hwg-li-drag hwg-li-drop-snap hwg-li-drop-active ui-draggable ui-draggable-handle ui-droppable-active ui-droppable ui-draggable-dragging')
											;
				});
			},0, e, ui, uiThis, wgThis);
		}
		
		wgThis.options.drop_opts = {
			accept: '.hwg-li-drag',
			tolerance: 'pointer',
			create: function(e, ui) {
				!this.options && (this.options = {}); 
				$(e.target).addClass('hwg-li-drop-snap');
			},
			activate: function(e, ui) {
//console.log(e,ui);
//				$(e.target).css("top", '30px');
				//wgThis.element.find('.container-fluid').prepend('<div class="hwg-drag-cloned" style="height: 2.5rem"></div>');
				
				//var $el = $('<div class="hwg-drop-fake" style="height: 2.5em"></div>'); 
				//!wgThis.element.find('ul .hwg-drop-fake').length && $(wgThis.element.find('ul')[0]).prepend($el);
				
			},
			drop: function(e, ui) {
				wgThis._clearDragCloned(e, ui, this, function(e, ui, xthis){
					//wgThis.element.find('ul>.hwg-drop-fake').remove();
					
					//ui.draggable.insertAfter(xthis.options.hint);
					ui.draggable.insertBefore(xthis.options.hint)
					//xthis.options.hint.next()
					//xthis.options.hint.prev()
						.css({'position': '', 'top': '', 'opacity': ''}).removeClass('hwg-li-drag-hint hwg-li-drag-hint-before hwg-li-drop-hint ui-droppable-active ui-draggable-dragging')
						.addClass('hwg-li-drop-active')
						;
					
					//api thong tin ul parent, li curr, ord-sort, v.v... 
					if (xthis.options.hint !== $(e.target)) wgThis._trigger('li_change_parent', e, {});
				});
			},
			over: function(e, ui) {
				wgThis._doDragOver(e, ui, this);
			},
			out: function(e, ui) {
				this.options.hasDrawClone = false;
			},
		}
		
		
		this.element.find('ul').each(function() {
			$(this).children('li').draggable(wgThis.options.drag_opts);
			$(this).children('li').droppable(wgThis.options.drop_opts);
		});
	},
})/*.bind( "hwgnavli_click", function( event, data ) {
	console.log( "View data: ", data );
	alert( "Events bubble and support many handlers for extreme flexibility." );
})*/
/*.bind( "hwgnavresetsize", function( event, data ) {
	alert( "Events bubble and support many handlers for extreme flexibility." );
	alert( "The progress bar value is " + data.value );
})*/
})(jQuery);
