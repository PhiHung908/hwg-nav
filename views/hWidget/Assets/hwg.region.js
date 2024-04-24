(function($){
$.widget("PH_utils.hwgRegion",  $.PH_utils.uiBase, {
	version: "1.0",
	
	_create: function(){
		this._addClass("hwgRegion");
		
		this._super( this.options );
		
	  },
	_destroy: function(){
		this._removeClass("hwgRegion");
		this._super();
	  },
	_init: function(o) {
		//
	  },

	resize: function() {
		//
	},
	refresh: function(succOnloadCb) {
		//
	},

});
})(jQuery);
