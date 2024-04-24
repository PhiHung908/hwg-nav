class phUtilsBase {
	
	constructor(opts) {
		this.objMethod._create(this);
		return this.objMethod._init(opts, this);
	}
			
	objMethod = {
		version: "1.0",
		options: {},
		value: function(k, v, keyRoot) { //readonly, resut = element$, nếu setvalue cho widget, keyRoot phải là mảng các giá trị hoặc object truyền vào set_widget
			var rs = {};
			if (typeof k === 'undefined' && typeof v === 'undefined') rs = this.values("value", undefined, keyRoot);
			else if (typeof v === 'undefined') rs = this.values(k, undefined, keyRoot);
			else rs = this.values(k, v, keyRoot);
			return rs;
		},
		
		values: function(k,v, keyRoot, trapRecurs) {
			const fromRoot = typeof k === 'string' && k.substr(0,1)=="." || typeof keyRoot === 'string' && keyRoot.substr(0,1) == ".";
			var _values = typeof keyRoot == "string" ? keyRoot.replace(/^\.+/,'') : typeof k === 'string' && k.substr(0,1) == "." ? /*k == ".options" ? "options" :*/ "" : "options._values";
			(typeof k === 'string') && (k = k.replace(/^\.+/,''))
			if (!k) {
				k = undefined;
			} /*else {
				if (typeof k === 'string') {
					if (k.substr(0,1) == '.' && (!keyRoot || typeof keyRoot==='string')) {
						k = k + '.'+ (""+keyRoot).replace(/^\.+/,'');
						keyRoot = undefined;
					}
				}
			}*/
			
			if (typeof k === 'object') {
				Object.assign(this.options._values, k);
				return k;
			}

			_values && (_values = "."+_values); 
			if (!v && keyRoot==".") v = undefined;
			
			if (_values.indexOf('.',1) > 0) {
				_values = _values.substr(1);
				const a = _values.split('.'), kk = [], val = true;
				for (var i = 0; i<a.length; i++) {
				  if (!a[i]) continue;
				  kk.push(a[i]);
					////thay dong duoi neu khong cho tao_key_if_no_key khi doc du lieu...  eval('if (typeof this.' + kk.join('.') + ' === "undefined") {if (typeof v === "undefined") val = false; else if (val){this.' + kk.join('.') + ' = {};}}');
					eval('if (typeof this.' + kk.join('.') + ' === "undefined") this.' + kk.join('.') + ' = {}');
				}
				if (!val) return "";
				_values = '.' + _values;
			}
			

			
			if (typeof k === 'string') {
				var val;
				if (k=="value" && (typeof v === 'undefined' || typeof v === 'string')) {
					eval("\
					if (typeof v === 'undefine') {if (typeof this._value.value === 'undefined') this._value.value = this.value; val = this._values.value;}\
					else {\
					this._values.value = v;\
					this.value = v;\
					val = this._values.value;\
					}\
					".replaceAll("._values",_values));
					return val;
				}
				
				/*
				eval("if (typeof this."+k+" === 'function') val = true; else val = false;");
				if (val) {
					eval("val = this."+k+"(v);");
					return val;
				}
				*/
				
				val = true;
				var a = k.split('.');
				if (k.indexOf('.') >= 0) {
					const kk=[];
					for(var i = 0; i<a.length-1; i++) {
						if (!val) break;
						if (!a[i]) continue;
						kk.push(a[i]);
						//thay dong duoi neu khong cho tao_key_if_no_key khi doc du lieu... eval(('if (typeof this._values.' + kk.join('.') + ' === "undefined") {if (typeof v==="undefined") {val = false;} else if (val) {this._values.' + kk.join('.') + ' = {};}}').replaceAll("._values",_values));
						eval(('if (typeof this._values.' + kk.join('.') + ' === "undefined") {if (typeof v==="undefined") val = false; this._values.' + kk.join('.') + ' = {};}').replaceAll("._values",_values));
					}
				}
	//console.log("view key...", k, a, keyRoot, v);
				if (!val) return "";
				val = v && Array.isArray(v) ? v : typeof v !== 'object' ? typeof v === 'boolean' ? v : v || '' : v, func = false;
				
				
				//trap ext error : $('#P0_NEW_2').lovAsMenu("values",".options", "usePopup") <-- bad param , ...("values", ".options.userPopup", varXXX) <-- ok
				if (!trapRecurs && fromRoot && a.length && (a[0]=="option" || a[0]=="options")) {
					var x = Object.values(arguments), vvv;
					if (x.length>2) {vvv=arguments[x.length-1]; x.pop();}
					//if (x.length>1) {vvv=arguments[x.length-1]; x.pop();}
					if (x.length && typeof x[x.length-1] === 'string')
					return this.values("."+x.join('.'),vvv, false, true);
				}
				
				 
				var kkk = parseInt(k) == k ? '["'+k+'"]' : "."+k;
				//var kkk = "."+k;
				//*
				func = this._kIsWidget(a,_values);
				if (func !== 1 || typeof v === 'undefined')
				eval(
				("if (typeof v !== 'undefined') {\
					if (!(val instanceof jQuery || val.jquery) \
						&& typeof val === 'object' && typeof val !== 'boolean' && !Array.isArray(val)\
						&& typeof this._values" + kkk + " === 'object' && typeof this._values" + kkk + " !== 'boolean') {\
						  eval('Object.assign(this._values" + kkk + ", val)')\
						} else {\
							this._values" + kkk +" = val;\
						}\
					} else {\
						eval('val = this._values" + kkk + " === false ? false : this._values" + kkk + " || \"\"')\
					}"
				).replaceAll("._values",_values));
		 
	//console.log('after func...', func, val)				
				//func = this._kIsWidget(a, _values); 
				
	//console.log(('if (typeof this._values.'+a.join('.')+' === "function") func = 1; else func = 2;').replaceAll("._values",_values));

				//eval(('if (/*typeof this._values.'+a.join('.')+' instanceof jQuery &&*/ typeof this._values.'+a.join('.')+' === "function") func = 1; else func = 2;').replaceAll("._values",_values));
	//console.log(tt, func);		
				if (func == 1) {
					return this._kSetWgVal(a, _values, val, keyRoot);
				} else if (typeof val === 'function') {
					//return val(v);
				}
		
				if (typeof v === 'object' && (typeof v.width !== 'undefined' || typeof v.height !== 'undefined') ) {
					(typeof v.width !== 'undefined') && (this.width = v.width);
					(typeof v.height !== 'undefined') && (this.height = v.height)
					this.resize();
				}
			  
				return val;
			} else if (typeof k === 'object' /* || Array.isArray(k)*/) { //vao ["get1", "get"2, ...] hoac chỉ vào 1 level ex: lấy các giá trị {get1:undefined, get2:undefined}, set cac gia tri: {set1: 5, set2: false} hoac {get1.get2.getxxxL 5} hoac set {".set1.set2": undefined, ".set1b.set2b": 777
				var that = this, rs = {}, resize = false, kk=[];
				if (Array.isArray(k)) {
					for (var i = 0; i<k.length; i++) {
						//eval('if (typeof this._values[k[i]] === "undefined") rs[k[i]] = null; else rs[k[i]] = this._values[k[i]]'.replaceAll("._values",_values));
						eval('rs[k[i]] = this.values(k[i], undefined, keyRoot)'.replaceAll("._values",_values));
						
					}
				} else {
					$.each( k, function( key, value ) {
						kk.push(key);
						eval("rs[key] = this.values(this._values." + kk.join('.') + ", value, keyRoot)".replaceAll("._values",_values));
						/*
						if (typeof value === 'undefined') {
						  //eval("if (typeof that._values[key] === 'undefined') rs[key] = null; else rs[key] = value".replaceAll("._values",_values));
						  eval("if (typeof that._values[key] === 'undefined') rs[key] = ''; else rs[key] = this.values(this._values." + kk.join('.') + ", value, keyRoot)".replaceAll("._values",_values));
						} else {
							 
							eval(`
							that._values[key] = (typeof v !== 'undefined' && v[key]) || value;
							rs[key] = value;
							`.replaceAll("._values",_values));
							 
							if (key == "width" || key == "height") {
								const z = (typeof v !== 'undefined' && v[key]) || value;
								z && (that[key] = z);
								resize = true;
							}
						} */
					});
					//resize && this.resize();
				}
				return rs;
			}
			
		//	if (!_values) {return Object.assign({},this);}
			eval("rs = this._values".replaceAll("._values",_values));
			return rs;
		},
		_kIsWidget: function(a, _values) {
			var func = 0;
			//eval(('if (typeof this._values.'+a.join('.')+' instanceof jQuery && typeof this._values.'+a.join('.')+' === "function") func = 1; else func = 2;').replaceAll("._values",_values));
			try {
			eval(('if (typeof this._values'+ (a.length ==1 ? '["'+a[0]+'"]' :  "."+a.join('.') ) +' === "function") func = 1; else func = 2;').replaceAll("._values",_values));
			} catch(e) {
	console.log("error...", ('if (typeof this._values'+ (a.length ==1 ? '["'+a[0]+'"]' :  "."+a.join('.') ) +' === "function") func = 1; else func = 2;').replaceAll("._values",_values));
			}
			return func;
		},
		_kSetWgVal: function(a, _values, val_, keyRoot) {
			var val = val_
			eval(('val = ' + 'this._values.'+a.join('.')).replaceAll("._values",_values)+'(val' + (typeof keyRoot === 'array' ? ',' + keyRoot.join(',') : typeof keyRoot === 'object' ? ',keyRoot' : '') +')');
			return val;
		},
		
		_setOption: function( key, value) {
			  const rs = this.values(key, value, '.options');
			  this._superApply( arguments );
			  return rs;
			  /*////
			  if ( key === "title" ) {
				this./*element* /values("_wg.ipClone$").find( "h3" ).text( value );
			  }
			  this._superApply( arguments );
			  */
		  },
		_setOptions: function( options, v) {
			  const rs = this.values(options, v, '.options');
			  this._superApply( arguments );
			  return rs; 
			  /////
			  /*
			  var that = this,
				resize = false;
			 
			  $.each( options, function( key, value ) {
				that._setOption( key, value );
				if ( key === "height" || key === "width" ) {
				  resize = true;
				}
			  });
			 
			  if ( resize ) {
				this.resize();
			  }
			  this._superApply( arguments );
			  */
		  },

		_create: function(thisClass){
	//console.log('create... nav');
	//console.log(this.options.data);
			this._m = {} //chứa widget nên cần phải khởi tạo trước
			  //this.options._values = {}
		  },
		_destroy: function(){
	//console.log("destroy...");
		  },
		_init: function(opts) {
			Object.assign(this.options,opts);
			return this;
		},
		isMobile: function(func) { const isMobile = {
				Android: function() {
					return navigator.userAgent.match(/Android/i);
				},
				BlackBerry: function() {
					return navigator.userAgent.match(/BlackBerry/i);
				},
				iOS: function() {
					return navigator.userAgent.match(/iPhone|iPad|iPod/i);
				},
				Opera: function() {
					return navigator.userAgent.match(/Opera Mini/i);
				},
				Windows: function() {
					return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
				},
				any: function() {
					return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
				}
			}
			return isMobile[func || 'any'](Array.prototype.slice.call(arguments, 1));
		},
		vi2e: function (s, wMode) { 
			var
			  a_   = ['x','a','à','á','ả','ã','ạ'],
			  aw_  = ['x','ă','ằ','ắ','ẳ','ẵ','ặ'],
			  aa_  = ['x','â','ầ','ấ','ẩ','ẫ','ậ'],
			  d_   = ['x','d','đ','đ','đ','đ','đ'],
			  e_   = ['x','e','è','é','ẻ','ẽ','ẹ'],
			  ee_  = ['x','ê','ề','ế','ể','ễ','ệ'],
			  i_   = ['x','i','ì','í','ỉ','ĩ','ị'],
			  o_   = ['x','o','ò','ó','ỏ','õ','ọ'],
			  oo_  = ['x','ô','ồ','ố','ổ','ỗ','ộ'],
			  ow_  = ['x','ơ','ờ','ớ','ở','ỡ','ợ'],
			  u_   = ['x','u','ù','ú','ủ','ũ','ụ'],
			  uw_  = ['x','ư','ừ','ứ','ử','ữ','ự'],
			  y_   = ['x','y','ỳ','ý','ỷ','ỹ','ỵ'],
			  
			  a__   = ['x','A','À','Á','Ả','Ã','Ạ'],
			  aw__  = ['x','Ă','Ằ','Ắ','Ẳ','Ẵ','Ặ'],
			  aa__  = ['x','Â','Ầ','Ấ','Ẩ','Ẫ','Ậ'],
			  d__   = ['x','D','Đ','Đ','Đ','Đ','Đ'],
			  e__   = ['x','E','È','É','Ẻ','Ẽ','Ẹ'],
			  ee__  = ['x','Ê','Ề','Ế','Ể','Ễ','Ệ'],
			  i__   = ['x','I','Ì','Í','Ỉ','Ĩ','Ị'],
			  o__   = ['x','O','Ò','Ó','Ỏ','Õ','Ọ'],
			  oo__  = ['x','Ô','Ồ','Ố','Ổ','Ỗ','Ộ'],
			  ow__  = ['x','Ơ','Ờ','Ớ','Ở','Ỡ','Ợ'],
			  u__   = ['x','U','Ù','Ú','Ủ','Ũ','Ụ'],
			  uw__  = ['x','Ư','Ừ','Ứ','Ử','Ữ','Ự'],
			  y__   = ['x','Y','Ỳ','Ý','Ỷ','Ỹ','Ỵ'],
			  
			  a_L = [[0],a_,aw_,aa_,d_,e_,ee_,i_,o_,oo_,ow_,u_,uw_,y_],
			  a_U = [[0],a__,aw__,aa__,d__,e__,ee__,i__,o__,oo__,ow__,u__,uw__,y__],
			  
			   ac,
			   stopC, 
			   uc,
			   convMode = wMode || 31;
			   
			   !s && (s="");
			   
			   if (!s.trim().length) return ''; 
			   
				ac = ('x'+s.trim()).split('');
				for (var i = 1; i<ac.length; i++) {
				  stopC = false;
				  if (ac[i] <= '~') {
					 if (convMode == 1 || convMode == 31)
					  ac[i] = ac[i].toLowerCase();
					else if (convMode == 2 || convMode == 32)  
					  ac[i] = ac[i].toUpperCase();
					else if (convMode == 21 || convMode == 321) {
					  if (i == 1)
						ac[i] = ac[i].toUpperCase();
					  else
						ac[i] = ac[i].toLowerCase(); 
					} else if (convMode == 22 || convMode == 322) {
					  if (i == 1 || ac[i-1]==' ') 
						ac[i] = ac[i].toUpperCase();
					  else
						ac[i] = ac[i].toLowerCase(); 
					};
					continue;
				  };
				  for (var u=1;  u < a_U.length; u++) {
					for (var c=1; c < a_.length; c++) {
					  if (ac[i] == a_U[u][c] || ac[i] == a_L[u][c]) {
						stopC = true;
						if (ac[i] == a_U[u][c]) uc = true; else uc = false; 
						if (convMode==1) 
						  ac[i] = a_L[u][c];
						else if (convMode==2) 
						  ac[i] = a_U[u][c];
						else if (convMode==21) {
						  if (i == 1) uc = true; else uc = false; 
						  ac[i] = uc ?  a_U[u][c] : a_L[u][c];
						} else if (convMode==22) {  
						  if (i == 1 || ac[i-1] == ' ') uc = true; else uc = false; 
						  ac[i] = uc ?  a_U[u][c] : a_L[u][c];
						} else {
						  if (convMode == 321) {
							if (i == 1) uc = true; else uc = false; 
						  } else if (convMode == 322) {
							if (i == 1 || ac[i-1] == ' ') uc = true; else uc = false; 
						  } else if (convMode == 31)
							uc = false;
						  else if (convMode == 32)
							uc = true; 
						
						  if (u <= 3) 
							ac[i] = uc ?  a__[1] : a_[1];
						  else if (u==4)
							ac[i] = uc ?  d__[1] : d_[1];
						  else if (u<=6)
							ac[i] = uc ?  e__[1] : e_[1];
						  else if (u==7)
							ac[i] = uc ?  i__[1] : i_[1];
						  else if (u<=10)
							ac[i] = uc ?  o__[1] : o_[1];
						  else if (u<=12)
							ac[i] = uc ?  u__[1] : u_[1]; 
						  else
							ac[i] = uc ?  y__[1] : y_[1]; 
						}
					  };
					  if (stopC) break;
					};
					if (stopC) break;  
				  }; 
				}; 
				ac[0] = '';
				return ac.join(''); 
		},
		md5: function(s) {
			//md5
			function md5cycle(x, k) {
			var a = x[0], b = x[1], c = x[2], d = x[3];

			a = ff(a, b, c, d, k[0], 7, -680876936);
			d = ff(d, a, b, c, k[1], 12, -389564586);
			c = ff(c, d, a, b, k[2], 17,  606105819);
			b = ff(b, c, d, a, k[3], 22, -1044525330);
			a = ff(a, b, c, d, k[4], 7, -176418897);
			d = ff(d, a, b, c, k[5], 12,  1200080426);
			c = ff(c, d, a, b, k[6], 17, -1473231341);
			b = ff(b, c, d, a, k[7], 22, -45705983);
			a = ff(a, b, c, d, k[8], 7,  1770035416);
			d = ff(d, a, b, c, k[9], 12, -1958414417);
			c = ff(c, d, a, b, k[10], 17, -42063);
			b = ff(b, c, d, a, k[11], 22, -1990404162);
			a = ff(a, b, c, d, k[12], 7,  1804603682);
			d = ff(d, a, b, c, k[13], 12, -40341101);
			c = ff(c, d, a, b, k[14], 17, -1502002290);
			b = ff(b, c, d, a, k[15], 22,  1236535329);

			a = gg(a, b, c, d, k[1], 5, -165796510);
			d = gg(d, a, b, c, k[6], 9, -1069501632);
			c = gg(c, d, a, b, k[11], 14,  643717713);
			b = gg(b, c, d, a, k[0], 20, -373897302);
			a = gg(a, b, c, d, k[5], 5, -701558691);
			d = gg(d, a, b, c, k[10], 9,  38016083);
			c = gg(c, d, a, b, k[15], 14, -660478335);
			b = gg(b, c, d, a, k[4], 20, -405537848);
			a = gg(a, b, c, d, k[9], 5,  568446438);
			d = gg(d, a, b, c, k[14], 9, -1019803690);
			c = gg(c, d, a, b, k[3], 14, -187363961);
			b = gg(b, c, d, a, k[8], 20,  1163531501);
			a = gg(a, b, c, d, k[13], 5, -1444681467);
			d = gg(d, a, b, c, k[2], 9, -51403784);
			c = gg(c, d, a, b, k[7], 14,  1735328473);
			b = gg(b, c, d, a, k[12], 20, -1926607734);

			a = hh(a, b, c, d, k[5], 4, -378558);
			d = hh(d, a, b, c, k[8], 11, -2022574463);
			c = hh(c, d, a, b, k[11], 16,  1839030562);
			b = hh(b, c, d, a, k[14], 23, -35309556);
			a = hh(a, b, c, d, k[1], 4, -1530992060);
			d = hh(d, a, b, c, k[4], 11,  1272893353);
			c = hh(c, d, a, b, k[7], 16, -155497632);
			b = hh(b, c, d, a, k[10], 23, -1094730640);
			a = hh(a, b, c, d, k[13], 4,  681279174);
			d = hh(d, a, b, c, k[0], 11, -358537222);
			c = hh(c, d, a, b, k[3], 16, -722521979);
			b = hh(b, c, d, a, k[6], 23,  76029189);
			a = hh(a, b, c, d, k[9], 4, -640364487);
			d = hh(d, a, b, c, k[12], 11, -421815835);
			c = hh(c, d, a, b, k[15], 16,  530742520);
			b = hh(b, c, d, a, k[2], 23, -995338651);

			a = ii(a, b, c, d, k[0], 6, -198630844);
			d = ii(d, a, b, c, k[7], 10,  1126891415);
			c = ii(c, d, a, b, k[14], 15, -1416354905);
			b = ii(b, c, d, a, k[5], 21, -57434055);
			a = ii(a, b, c, d, k[12], 6,  1700485571);
			d = ii(d, a, b, c, k[3], 10, -1894986606);
			c = ii(c, d, a, b, k[10], 15, -1051523);
			b = ii(b, c, d, a, k[1], 21, -2054922799);
			a = ii(a, b, c, d, k[8], 6,  1873313359);
			d = ii(d, a, b, c, k[15], 10, -30611744);
			c = ii(c, d, a, b, k[6], 15, -1560198380);
			b = ii(b, c, d, a, k[13], 21,  1309151649);
			a = ii(a, b, c, d, k[4], 6, -145523070);
			d = ii(d, a, b, c, k[11], 10, -1120210379);
			c = ii(c, d, a, b, k[2], 15,  718787259);
			b = ii(b, c, d, a, k[9], 21, -343485551);

			x[0] = add32(a, x[0]);
			x[1] = add32(b, x[1]);
			x[2] = add32(c, x[2]);
			x[3] = add32(d, x[3]);

			}

			function cmn(q, a, b, x, s, t) {
			a = add32(add32(a, q), add32(x, t));
			return add32((a << s) | (a >>> (32 - s)), b);
			}

			function ff(a, b, c, d, x, s, t) {
			return cmn((b & c) | ((~b) & d), a, b, x, s, t);
			}

			function gg(a, b, c, d, x, s, t) {
			return cmn((b & d) | (c & (~d)), a, b, x, s, t);
			}

			function hh(a, b, c, d, x, s, t) {
			return cmn(b ^ c ^ d, a, b, x, s, t);
			}

			function ii(a, b, c, d, x, s, t) {
			return cmn(c ^ (b | (~d)), a, b, x, s, t);
			}

			function md51(s) {
			var n = s.length,
			state = [1732584193, -271733879, -1732584194, 271733878], i;
			for (i=64; i<=s.length; i+=64) {
			md5cycle(state, md5blk(s.substring(i-64, i)));
			}
			s = s.substring(i-64);
			var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
			for (i=0; i<s.length; i++)
			tail[i>>2] |= s.charCodeAt(i) << ((i%4) << 3);
			tail[i>>2] |= 0x80 << ((i%4) << 3);
			if (i > 55) {
			md5cycle(state, tail);
			for (i=0; i<16; i++) tail[i] = 0;
			}
			tail[14] = n*8;
			md5cycle(state, tail);
			return state;
			}

			/* there needs to be support for Unicode here,
			 * unless we pretend that we can redefine the MD-5
			 * algorithm for multi-byte characters (perhaps
			 * by adding every four 16-bit characters and
			 * shortening the sum to 32 bits). Otherwise
			 * I suggest performing MD-5 as if every character
			 * was two bytes--e.g., 0040 0025 = @%--but then
			 * how will an ordinary MD-5 sum be matched?
			 * There is no way to standardize text to something
			 * like UTF-8 before transformation; speed cost is
			 * utterly prohibitive. The JavaScript standard
			 * itself needs to look at this: it should start
			 * providing access to strings as preformed UTF-8
			 * 8-bit unsigned value arrays.
			 */
			function md5blk(s) { /* I figured global was faster.   */
			var md5blks = [], i; /* Andy King said do it this way. */
			for (i=0; i<64; i+=4) {
			md5blks[i>>2] = s.charCodeAt(i)
			+ (s.charCodeAt(i+1) << 8)
			+ (s.charCodeAt(i+2) << 16)
			+ (s.charCodeAt(i+3) << 24);
			}
			return md5blks;
			}

			var hex_chr = '0123456789abcdef'.split('');

			function rhex(n)
			{
			var s='', j=0;
			for(; j<4; j++)
			s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
			+ hex_chr[(n >> (j * 8)) & 0x0F];
			return s;
			}

			function hex(x) {
			for (var i=0; i<x.length; i++)
			x[i] = rhex(x[i]);
			return x.join('');
			}

			function md5(s) {
			return hex(md51(s));
			}

			/* this function is much faster,
			so if possible we use it. Some IEs
			are the only ones I know of that
			need the idiotic second function,
			generated by an if clause.  */

			function add32(a, b) {
			return (a + b) & 0xFFFFFFFF;
			}
			/*
			if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
			function add32(x, y) {
			var lsw = (x & 0xFFFF) + (y & 0xFFFF),
			msw = (x >> 16) + (y >> 16) + (lsw >> 16);
			return (msw << 16) | (lsw & 0xFFFF);
			}
			}*/
			//End md5
			return md5(s);
		},
		//#dùng để mã hóa trên đường truyền đến máy chủ khi verify_pw
		md5Hash: function(p) {
				/*
				var o = Object.create({
					getRandomIntInclusive: function (min, max) {
					  min = Math.ceil(min);
					  max = Math.floor(max);
					  this.r = Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
					  delete this.getRandomIntInclusive;
					},
					doPw: function(p) {
						this.pw = md5(p), this.getRandomIntInclusive(2,5);
						this.pw = this.pw.substr(0,6) + String.fromCharCode(this.r+97) + this.pw.substr(7);
						this.pw = this.pw.substr(0,9+this.r) + this.pw.substr(9+this.r+7) + this.pw.substr(9+this.r,7);
		//console.log(this.r);
						if ((this.r % 2) == 1 && this.r != 7 ) this.pw = this.pw.substr(this.r-1,1) + this.pw.substr(1,this.r-2) + this.pw.substr(0,1) + this.pw.substr(this.r);
							//else this.pw = this.pw.substr(this.pw.length-14,3) + this.pw.substr(3,this.pw.length-14-3) + this.pw.substr(0,3) + this.pw.substr(this.pw.length-14+3); 
						delete this.r;
						delete this.doPw;
						return this.pw;
					}
				});
				var pw = o.doPw(p)
				//*/
				eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('E(x(p,a,c,k,e,r){e=x(c){y c.F(a)};z(!\'\'.A(/^/,B)){C(c--)r[e(c)]=k[c]||e(c);k=[x(e){y r[e]}];e=x(){y\'\\\\w+\'};c=1};C(c--)z(k[c])p=p.A(G H(\'\\\\b\'+e(c)+\'\\\\b\',\'g\'),k[c]);y p}(\'g o=j.k({d:h(a,b){a=c.l(a);b=c.i(b);3.r=c.i(c.m()*(b-a+1)+a);e 3.d},f:h(p){3.4=n(p),3.d(2,5);3.4=3.4.8(0,6)+q.s(3.r+t)+3.4.8(7);3.4=3.4.8(0,9+3.r)+3.4.8(9+3.r+7)+3.4.8(9+3.r,7);u(3.r%2==1&&3.r!=7)3.4=3.4.8(3.r-1,1)+3.4.8(1,3.r-2)+3.4.8(0,1)+3.4.8(3.r);e 3.r;e 3.f;v 3.4}});g 4=o.f(p);\',D,D,\'|||I|J||||K||L|M|N|O|P|Q|R|x|S|T|U|V|W|X|||B||Y|Z|z|y\'.10(\'|\'),0,{}))',62,63,'|||||||||||||||||||||||||||||||||function|return|if|replace|String|while|32|eval|toString|new|RegExp|this|pw|substr|min|max|Math|getRandomIntInclusive|delete|doPw|var|floor|Object|create|ceil|random|md5|fromCharCode|97|split'.split('|'),0,{}));		
				return pw;
		},
		//https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
		b64EncodeUnicode: function (str) {
			// first we use encodeURIComponent to get percent-encoded UTF-8,
			// then we convert the percent encodings into raw bytes which
			// can be fed into btoa.
			return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
				function toSolidBytes(match, p1) {
					return String.fromCharCode('0x' + p1);
			}));
		}, 
		b64DecodeUnicode: function b64DecodeUnicode(str) {
			// Going backwards: from bytestream, to percent-encoding, to original string.
			return decodeURIComponent(atob(str).split('').map(function(c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			}).join(''));
		},
		waitForElement: function (querySelector, timeout, boolCb, intervalTimer, oCbParam){
			if (this.values('ph_ig_func_unloading')) return;
			const startTime = new Date().getTime();  
			var waitForElm;
			return new Promise(function(resolve, reject){
			  var timer;
			  if (this.values('ph_ig_func_unloading')) { timer && clearInterval(timer); !!reject && reject(oCbParam); return; }
			  timer = setInterval(function(oCbParam){
				if (waitForElm) return;
				waitForElm = true;
				const now = new Date().getTime(); 
				oCbParam && (oCbParam.nowWaitFor = now);
				if(timeout && now - startTime >= timeout || this.values('ph_ig_func_unloading')){
				  clearInterval(timer);
				  timer = false;
				  !!reject && reject(oCbParam);
				} else if(querySelector && document.querySelector(querySelector) || typeof boolCb == 'function' /* && boolCb(oCbParam)*/ ){
				  //if (typeof boolCb == 'function' && !boolCb(oCbParam)) {waitForElm = false; return;} 
				  if (querySelector && typeof boolCb == 'function'  && boolCb(oCbParam)) {
					  //
				  } else if (!querySelector && !boolCb(oCbParam)) {
					  waitForElm = false;
					  return;
				  }
				  /*
				  if (typeof boolCb == 'function') {
					  if (!boolCb(oCbParam) || !(querySelector && document.querySelector(querySelector))) {
						  waitForElm = false;
						  return;
					  }
				  }
				  */
				  clearInterval(timer); 
				  timer = false;
				  !!resolve && resolve(oCbParam);
				} 
				waitForElm = false;
			  }, intervalTimer || 23, oCbParam);
			});
		},
		
		/** Tác giả : Phi Hùng - 2019
		  * @param 1 : Vào số từ input - format with localeString or StandarNumber
		  * @param 2 : false,emty = int, >=0 Số chữ số thập phân ; true = auto = 4 Số chữ số thập phân (1.2345)
		  * @Param 3 : (áp dụng kết hợp với param 2 , hoặc chế đô convert StandarNumber to local :
		  *				emty,1 : In/Out As StdNumber
		  *				2 : OutAsStrLocale (Convert ...)
		  */ 
		mkNum: function (n__, fixFloat, ioStrLocal, zrFloat_, gDec_) {	//!n__ && (n__='0');
			function isAllNum(n_){
				return ('' === n_.toString().replace(/[\s\d\,\.]+/g,''))
			}
			
			var  n_ = n__, x = parseFloat(2003/2).toLocaleString(), dec = x.substr(-2,1), nDec=x[1], 
				n,  gDec, s;
			
			var g_Var = this.values('gVar') || {cDeci: nDec+dec};
			
			//if (1==ioStrLocal) gDec_ = '.';
			if (gDec_) {
				nDec = gDec_[0];
				gDec = gDec_[1]; 
				
			} else {
				//detect from input
				x = 0;
				s = ""+n__;
				//if (!g_Var.hasJsDetectDeci /*fast*/) {
					if (s.split(dec).length >= 3) { // 1.234.567,6
						x = dec;
						dec = nDec;
						nDec = x;
						x = 1; //hassVerify input
					} else if (s.split(nDec).length >= 3) {
						x = 2;
					} else if (s.indexOf(dec)>-1 && s.indexOf(nDec)>-1) {
						n = s.indexOf(dec,-1);
						x = s.indexOf(nDec);
						if (n>x) {
							dec = s.substr(n,1);
							nDec = s.substr(x,1);
						} else {
							nDec = s.substr(n,1);
							dec = s.substr(x,1);
						}
						x = 3;
					} else if (s.substr(0,1) == nDec) {
						x = dec;
						dec = nDec;
						nDec = x;
						x = 4; 
					} else if (s.indexOf(dec)>-1 || s.indexOf(nDec)>-1) { //9.12 or 9.1204 or 1234.5 xac dinh duoc; 9,123 chua xac dinh duoc
						x = s.replace(/\d+/g,'').substr(-1);
						n = s.indexOf(x);
						if (s.substr(n).length != 4 || n>=4) {
							if (dec != x) {
								nDec = dec;
								dec = x;
							}
							x = 5;
						} else x = 0;
					}
				/*} else {
					nDec = g_Var.cDeci[0];
					dec = g_Var.cDeci[1];
					x = 99;
				}*/
		//console.log( {dec: dec, nDec: nDec, x: x});
				if (x > 0) {
					g_Var.cDeci = nDec+dec;
					gDec = dec;
					g_Var.hasJsDetectDeci = true; //mark for fast
				} else {
					gDec = g_Var.cDeci;
					if (!gDec) {Dect_Decimal(); gDec = g_Var.cDeci};  //Dect_Decimal(null) = không đồng bộ = false -> wait ket qua
					if(!n_ || !isAllNum(n_)) return n__;
					n_ = n_.toString(10).replace(/\s/gi,''); 
					if(!gDec){
						n = n_.indexOf(nDec);
						x = n_.indexOf(dec);
						if(-1<n && -1<x){
							if(n<x) gDec = dec; else gDec = nDec;
						}else if(0==x || 3<=x) gDec=dec; else if(0==n || 3<=n) gDec = nDec; 
					} else {
						nDec = gDec[0];
						gDec = gDec[1];
					}
				}
			}
			//notDeci = nDec_&& nDec_!==gDec ? nDec_ : (gDec == '.' ? ',' : '.') ; 
			
			var gD = RegExp('\\'+gDec,'g'), gDecZ = new RegExp('\\'+gDec+'0+$','g') ;

			if ('string' === typeof n__ ) n = n_.replace(gDecZ,'').replace(gD,'#').replace(/[\,\.]/g,'').replace('#','.'); //focus format doi thanh dang chuan
			else n=n_;
			
			try{
				x = false!==fixFloat ? parseFloat(n) : parseInt(n); 
		//console.log('*1=gDec',gDec, 'x=', x, 'org_n__=', n__)
				if (isNaN(x)) return n__; 
		//console.log('*2 x=',x, 'n=', n__)			
				if (false!==fixFloat && (!ioStrLocal || 1==ioStrLocal)) return (""+x).substr(0,1)=='.' ? parseFloat("0."+x) : x; //ra dang chuan
		//console.log('*3 fix=',fixFloat, 'n=', n)					
				if(0 != fixFloat && 'undefined' !== fixFloat){ 
					var iDot = (''+x).indexOf('.'); //1023.4
		//console.log('*4 iDot=',iDot)				
					//if (iDot<0)  return true===fixFloat ? x : (fixFloat<=0 ? '' + x  : x + gDec + '0000000000'.substr(1,fixFloat>10?fixFloat/10:fixFloat));
					n = '' + x;
					iDot = n.indexOf('.');
		//console.log('*5 n=',n , 'x=', x)				
					if (true===fixFloat) fixFloat=4;
					
					var kk = fixFloat;
					fixFloat = Math.abs(fixFloat);
					if (zrFloat_ && fixFloat.length<2) fixFloat += 10; //fix để cùng vào tham số như MkNum bên Apex
					(fixFloat >= 10) && (fixFloat = fixFloat/10);
					
		//console.log('*6 n=', n , 'x=', x)				
					x = (n+ (-1<iDot ? '000000' : '.000000')).replace('.','#');

					n = x.indexOf('#');
		//console.log('*7 fix=', fixFloat , 'x=', x, 'idx#=', n)	
					x = (x.substr(0,n).replace(/\B(?=(\d{3})+(?!\d))/g, nDec)+ (gDec ? gDec+x.substr(n+1,fixFloat) : '') ) ;
					/*if (!zrFloat) {
						if  (-1<x.indexOf(gDec)) x = x.replace(/0+$/,''); 
						x = x.replace(RegExp('\\'+gDec+'$'),''); 
					}*/
		//console.log('*8 kk=', kk , 'x=', x, 'gDec=', gDec)				
					if (gDec && kk<0 && x.indexOf(gDec)>-1) { //ngược với APEX, nếu vào số âm, sẽ như : 1.50 -> 1.5
						x = x.replace(/0+$/g,'');
					}
					x = x.replace(RegExp('\\'+gDec+'$'),''); 
				}
				return (""+x).substr(0,1)=='.' ? parseFloat("0."+x) : x;
			}
			catch(e){
		//console.log('err=',e,e.message)
				return n__;
			}
		},
		/** fetchGet
		  * ret: object {status: nunmber, blob: blobResult_if_status_200}
		**/
		fetchGet: function(href, callback) {
			function getHTTPObject() {
				if (typeof XMLHttpRequest !== 'undefined') {
					return new XMLHttpRequest();
				} try {
					return new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						return new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e) {}
				}
				return false;
			}
			const xhr = getHTTPObject();
			if (!xhr) { 
				callback({status: 404, blob: "Can't get HttpRequest"}); 
				return;
			}
			
			xhr.open("GET", href, true)
			xhr.responseType = "blob"
			xhr.onload = function(e) {
				if (this.status == 200) {
					const blobUrl = window.URL.createObjectURL(this.response) 
					fetch(blobUrl)
					   .then( function(response) {
							//return response.text();
							return response.blob();
						} )
					   .then( function(retVal) {
						   callback({status:200, blob: retVal});
						   window.URL.revokeObjectURL(blobUrl);
					   }).catch(function(){
						   callback({status:20000});
						   window.URL.revokeObjectURL(blobUrl);
						});
				} else {
					callback({status: this.status});
				}
			}
			xhr.send();
		},
		/*example:
			fetchGet('https://geocode.maps.co/reverse?lat=10.8628746&lon=106.6171657', function(o){
				if (o.status==200) o.blob.text().then(function(t){console.log(t)});
			})
		*/
	}
}
;
phUtils = new phUtilsBase();