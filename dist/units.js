
$.fn.hasAttr = function(name) {  
	return this.attr(name) !== undefined && this.attr(name) !== false;
};
$.fn.num = function(o){
	var v = parseFloat($(this).val().replaceAll(',','.'));
	v = isNaN(v)?0:v;
	return v;
};
$.fn.fill = function(data){
	return this.each(function(i,f){
		f = $(f);
		$.each(data,function(name,value){
			f.find('[name='+name+']').val($.normal(value));
		});
		f.find('select,[type=file]').trigger('update');
	});
};
$.fn.unitUpdateListeners = function(data){
	return this.each(function(i,f){
		return $(f).on('update',function(){
			var t = '&nbsp;';
			var d = $(this).attr('placeholder')?$(this).attr('placeholder'):'Seleccionar';
			if($(this).prop("tagName").toLowerCase()=='select'){
				t = $(this).find('option:selected').html();
			}else{
				t = $(this).val();
				t = t.replaceAll('\\','/');
				t = t.split('/');
				t = t[t.length-1];
			}
			t = t==undefined?d:t;
			$(this).next('*').html((t=='&nbsp;'||t=='')?d:t);
		}).on('change',function(){
			$(this).trigger('update');
		}).trigger('update');
	});
};
$.fn.close = function(o){
	return this.trigger('close');
};
$(()=>{
	$('.unit-input select,.unit-input [type=file]').unitUpdateListeners();
});