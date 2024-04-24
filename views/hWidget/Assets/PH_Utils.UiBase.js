(function($){
$.widget("PH_utils.uiBase", {
	version: "1.0",
	options: {_values:{}, clientEvent:{}},
	_m:{}, //chứa widget nên cần phải khởi tạo trước
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
		} else if (typeof k === undefined) {
			return this.options._values;
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
		
			if (typeof v === 'function' && keyRoot == 'onlySetFunc') {
				eval ("this._values = v;".replaceAll("._values",_values));
				return v;
			}
			
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
			val = v === null ? v : v && Array.isArray(v) ? v : typeof v !== 'object' ? typeof v === 'boolean' ? v : v || '' : v, func = false;
			
			
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
				if (val !== null && !(val instanceof jQuery || val.jquery) \
					&& typeof val === 'object' && typeof val !== 'boolean' && !Array.isArray(val)\
					&& typeof this._values" + kkk + " === 'object' && typeof this._values" + kkk + " !== 'boolean') {\
					  eval('Object.assign(this._values" + kkk + ", val)')\
					} else {\
						this._values" + kkk +" = val;\
					}\
				} else {\
					eval('val = this._values" + kkk + " === false ? false : this._values" + kkk + " === null ? null : this._values" + kkk + " || \"\"')\
				}"
			).replaceAll("._values",_values));
	 
//console.log('after func...', func, val)				
			//func = this._kIsWidget(a, _values); 
			
//console.log(('if (typeof this._values.'+a.join('.')+' === "function") func = 1; else func = 2;').replaceAll("._values",_values));

			//eval(('if (/*typeof this._values.'+a.join('.')+' instanceof jQuery &&*/ typeof this._values.'+a.join('.')+' === "function") func = 1; else func = 2;').replaceAll("._values",_values));
//console.log(tt, func);		
			if (func == 1) {
				/*if (v.toString().indexOf('onlySetFunc)')>0) {
					v = v.toString().replace('onlySetFunc)',')');
					eval(("this._values" + kkk +" = v").replaceAll("._values",_values));
					return v;
				}
				else*/ return this._kSetWgVal(a, _values, val, keyRoot);
			} else if (typeof val === 'function') {
				//return val(v);
			}
	
			if (v !== null && typeof v === 'object' && (typeof v.width !== 'undefined' || typeof v.height !== 'undefined') ) {
				(typeof v.width !== 'undefined') && (this.width = v.width);
				(typeof v.height !== 'undefined') && (this.height = v.height)
				this.resize();
			}
//console.log(val);
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
		  this._super( key, value );
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
		  this._super( options, rs );
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

	_create: function(event, ui){
		this.element.addClass('ph-utils-ui-base');
	  },
	_destroy: function(){
		this.element.removeClass( "ph-utils-ui-base" );
		/*$('.ph-utils-ui-base').removeClass (function (index, className) {
				return (className.match (/(^|\s)hwg[^\s]+/g) || []).join(' ') + ' ph-utils-ui-base';
		});*/
	  },
	_init: function(opts, that) {
		Object.assign(this.options,opts || {});
	},
	_evalClientEvent: function() {
		var wgThis = this;
		Object.entries(this.options.clientEvent).forEach(function([k, v]) {
			if (typeof v === 'string') {
				wgThis.options[k] = eval('('+v+')');
				//wgThis.options.clientEvent[k] = false;
			} else if (typeof v === 'function') {
				wgThis.options[k] = v;
			} else {
				//wgThis.options.clientEvent[k] = false;
			}
			wgThis.options.clientEvent[k] = false;
		});
	},
});
})(jQuery);