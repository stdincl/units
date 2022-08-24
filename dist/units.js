$.extend({
    bridgeURL:function(service,method){
        var idfile = Math.ceil(Math.random()*1000000000000)+''+new Date().getTime()+''+Math.ceil(Math.random()*1000000000000);
        return $.server+'/bridge/'+service+'/'+method+'/'+idfile+'.json';
    },
	moneyGlobal:function(n){
		n = parseFloat(n);
		var c = (n+0.0).toFixed(2).split('.')[1];
			c = c=='00'?0:c.length;
		return n.toFixed(c).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,').replaceAll(',','[*]').replaceAll('.',',').replaceAll('[*]','.');
	},
	money:function(n, c, d, t) {
		var c = isNaN(c = Math.abs(c)) ? 0 : c,
		d = d == undefined ? "," : d,
		t = t == undefined ? "." : t,
		s = n < 0 ? "-" : "",
		i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
		j = (j = i.length) > 3 ? j % 3 : 0;
		return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	},
	isMobile:function(){ 
		return (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
	},
	option:function(value,text){
		return $(['<option value="',value,'">',text,'</option>'].join(''));
	},
	location:function(href,code){ 
		$.loader(code);
		location.href = href;
	},
	reload:function(code){ 
		$.loader(code);
		location.reload();
	},
    loader:function(code,withProgress){
      	var loader=$('<div class="io-loading animated aparison">'+(withProgress?'<div class="io-loading-progress"></div>':'')+'<b class="fa fa-circle-notch fa-spin fa-3x fa-fw"></b><span>'+(code?code:'')+'</span></div>').appendTo('body');
      	return loader;
    },
    normal:function(m){
    	if(m===0){return '0';}
    	if(m===false){return 'false';}
    	if(m===true){return 'true';}
		return ((m?(m.replace?$('<div></div>').html(m.replace(/<br\s*\/?>/mg,"\n")).text():m):'')+'').toString();
	},
	_:function(c){
		window.lang = window.lang?window.lang:{};
		return $.normal(window.lang[c]?window.lang[c]:c);
	}
});


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
$.fn.close = function(){
	return this.trigger('unit-modal-close');
};

$.fn.modal = function(options){
	/* 
		Events 
			close: on window closes (removed from DOM),
			hide: on window is hidded (not removed from DOM),
			show: on window is showed
	*/
	var settings = $.extend({},options);
	return this.each((i,element)=>{
		var w = [
			'<div class="unit-modal unit-disabled">',
				'<div class="unit-modal-content unit-modal-content-placeholder">',
				'</div>',
			'</div>'
		].$().on('unit-modal-show',function(){
			$(this).find('.unit-modal-content-placeholder > *').trigger('show');
			setTimeout(()=>{
				$(this).removeClass('unit-disabled');
			},2);
		}).on('unit-modal-hide',function(){
			$(this).find('.unit-modal-content-placeholder > *').trigger('hide');
			$(this).addClass('unit-disabled');
		}).on('unit-modal-close',function(){
			$(this).addClass('unit-disabled');
			setTimeout(()=>{
				$(this).find('.unit-modal-content-placeholder > *').trigger('close').remove();
			},300);
		});
		$(element).appendTo(w.find('.unit-modal-content-placeholder'));
		w.appendTo('body');
		w.trigger('unit-modal-show');
	});
};
$.fn.window = function(options){
	/* 
		Options:
			...$.fn.modal
			title : Window title : defaults '',
			closable : If windows can be closed with the X corner button : default true
		Events 
			...$.fn.modal
	*/
	var settings = $.extend({
		title:'',
		closable:true
	},options);
	return this.each((i,element)=>{
		var w = [
			'<div class="unit-card">',
				'<div class="unit-head">',
					'<div class="unit-heading">',
						'<label>',$._(settings.title),'</label>',
					'</div>',
					(settings.closable?'<a class="unit-icon unit-modal-close"><i class="fa fa-times"></i></a>':''),
				'</div>',
				'<div class="unit-body">',
					'<div class="unit-wrap unit-modal-content-placeholder"></div>',
				'</div>',
			'</div>'
		].$();
		w.modal(options).find('.unit-modal-close').on('click',function(e){
			e.preventDefault();
			w.close();
		});
		$(element).appendTo(w.find('.unit-modal-content-placeholder'));
		return w;
	});
};

window.unit = window.unit?window.unit:{};
window.unit.alert = function(options){
	var settings = $.extend({
		title:'Mensaje',
		message:''
	},options);
	/* 
		confirm:Events 
			close: on window closes (removed from DOM),
			hide: on window is hidded (not removed from DOM),
			show: on window is showed
	*/
	var w = [
		'<div class="unit-card">',
			'<div class="unit-head">',
				'<div class="unit-heading">',
					'<label>',$._(title.title),'</label>',
				'</div>',
			'</div>',
			'<div class="unit-body">',
				'<div class="unit-wrap">',
					'<p>',$._(title.message).nl2br(),'</p>',
				'</div>',
			'</div>',
			'<div class="unit-foot">', 
				'<div class="unit-actions unit-actions-inline unit-small">',
					'<div>',
						'<a class="unit-primary unit-modal-close-button">Entendido</a>',
					'</div>',
				'</div>',  
			'</div>',
		'</div>'
	].$().modal();
	w.find('.unit-modal-close-button').on('click',function(e){
		e.preventDefault();
		w.close();
	});
	return w;
};
window.unit.confirm = function(options){
	/* 
		confirm:Options
			title : Window title : default 'Confirmar'
			message : Window message : default ''
			cancelIsDestructive : Cancel button causes destructive action : default false
			cancelIsConstructive : Cancel button causes constructive action : default false
			acceptIsDestructive : Accept button causes destructive action : default false
			acceptIsConstructive : Accept button causes constructive action : default false
		confirm:Events 
			close: on window closes (removed from DOM),
			hide: on window is hidded (not removed from DOM),
			show: on window is showed
			resolve: when message is canceled or canceled, boolean param is passed (e,accepted)=>{}
			cancel: when message is canceled
			accept: when message is accepted
	*/
	var settings = $.extend({
		title:'Confirmar',
		message:'',
		acceptIsDestructive:false,
		cancelIsDestructive:false,
		acceptIsConstructive:false,
		cancelIsConstructive:false
	},options);
	var cancelExtraClass = settings.cancelIsDestructive?'unit-destructive':(settings.cancelIsConstructive?'unit-constructive':'');
	var acceptExtraClass = settings.acceptIsDestructive?'unit-destructive':(settings.acceptIsConstructive?'unit-constructive':' unit-primary');
	var w = [
		'<div class="unit-card">',
			'<div class="unit-head">',
				'<div class="unit-heading">',
					'<label>',$._(settings.title),'</label>',
				'</div>',
			'</div>',
			'<div class="unit-body">',
				'<div class="unit-wrap">',
					'<p>',$._(settings.message).nl2br(),'</p>',
				'</div>',
			'</div>',
			'<div class="unit-foot">', 
				'<div class="unit-actions unit-actions-inline unit-small">',
					'<div>',
						'<a class="unit-modal-accept-button ',acceptExtraClass,'">Aceptar</a>',
					'</div>',
				'</div>',  
				'<div class="unit-actions unit-actions-inline unit-small">',
					'<div>',
						'<a class="unit-modal-cancel-button ',cancelExtraClass,'">Cancelar</a>',
					'</div>',
				'</div>',  
			'</div>',
		'</div>',
	].$().modal();
	w.find('.unit-modal-cancel-button').on('click',function(e){
		e.preventDefault();
		w.trigger('cancel').trigger('resolve',[false]).close();
	});
	w.find('.unit-modal-accept-button').on('click',function(e){
		e.preventDefault();
		w.trigger('accept').trigger('resolve',[true]).close();
	});
	return w;
};

window.unit.formInput = function(rowInputSettings){
	var inputSettings = $.extend({
		label:'',
		type:'',
		options:[], // {{value:1.text:text},...}
		name:'',
		value:'',
		custom:'',
		placeholder:''
	},rowInputSettings);
	if(inputSettings.type==''){
		return [
			'<div class="unit-input ',inputSettings.custom,'"></div>'
		].$();
	}

	var formHtmlInput = '<input type="'+inputSettings.type+'" class="unit-input-component" />';
	var requiresExtraLabel = false;
	var requiresLabelLink = false;
	switch(inputSettings.type){
		case 'select':
			formHtmlInput = '<select class="unit-input-component"></select>';
			requiresExtraLabel = true;
		break;
		case 'button':
			formHtmlInput = '<button class="unit-input-component"></button>';
		break;
		case 'textarea':
			formHtmlInput = '<textarea class="unit-input-component"></textarea>';
		break;
		case 'file':
			requiresExtraLabel = true;
		break;
		case 'checkbox':
			requiresExtraLabel = true;
			requiresLabelLink = true;
		break;
		case 'radio':
			requiresExtraLabel = true;
			requiresLabelLink = true;
		break;
	}
	var formInput = [
		'<div class="unit-input ',inputSettings.custom,'">',
			(inputSettings.label!=''?('<label>'+inputSettings.label+'</label>'):''),
			formHtmlInput,
			(requiresExtraLabel?'<label class="unit-input-override-label"></label>':''),
		'</div>'
	].$();
	if(inputSettings.type=='submit'){
		formInput.addClass('unit-primary');
	}
	inputSettings.options.forEach((option)=>{
		$.option(option.value,option.text).appendTo(formInput.find('select'));
	});
	formInput.find('.unit-input-component').attr({
		'name':inputSettings.name,
		'placeholder':inputSettings.placeholder,
	}).val(inputSettings.value);
	formInput.find('select,[type=file]').unitUpdateListeners();
	if(requiresLabelLink){
		var generationKey = 'unit-form-'+Date.now();
		while($('#'+generationKey).length>0){
			generationKey = 'unit-form-'+Date.now()+'-'+Math.round(Math.random()*1000000000);
		}
		formInput.find('.unit-input-component').attr('id',generationKey);
		formInput.find('.unit-input-override-label').attr('for',generationKey).text(inputSettings.placeholder);
	}
	return formInput;
};
window.unit.form = function(){
	let formRows = Array.from(arguments);
	var unitForm = ['<div class="unit-form"></div>'].$();
	formRows = Array.isArray(formRows)?formRows:[];
	formRows.forEach((formRowInputs)=>{
		var formRow = ['<div class="unit-form-row"></div>'].$();
		formRowInputs.forEach((rowInputSettings)=>{
			unit.formInput(rowInputSettings).appendTo(formRow);
		});
		formRow.appendTo(unitForm);
	});
	return unitForm;
};


$(()=>{
	$('.unit-input select,.unit-input [type=file]').unitUpdateListeners();
});