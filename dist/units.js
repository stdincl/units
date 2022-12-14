$.fn.hasAttr = function(name) {  
	return this.attr(name) !== undefined && this.attr(name) !== false;
};
$.fn.fill = function(data){
	return this.each(function(i,f){
		f = $(f);
		$.each(data,function(name,value){
			f.find('[name='+name+']').val((value).toString().normalize());
		});
		f.find('select,[type=file]').trigger('update');
	});
};
$.fn.unitUpdateListeners = function(){
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
	return this.trigger('units-modal-close');
};
const BridePromisePlaceholder = function(){
	this.thens = [];
	this.catchs = [];
	this.finallys = [];
	this.then = function(fn){ this.thens.push(fn); return this; };
	this.catch = function(fn){ this.catchs.push(fn); return this; };
	this.finally = function(fn){ this.finallys.push(fn); return this; };
};
$.fn.bridge = function(path,options){
	var bridge = new BridePromisePlaceholder();
	$(this).on('submit',function(e){
		e.preventDefault();
		var optionsOverride = $.extend(Units.defaultBridgeOptions,options);
		optionsOverride.data = new FormData(this);
		var connection = Units.bridge(path,optionsOverride);
		bridge.thens.forEach((fn)=>connection.then(fn));
		bridge.catchs.forEach((fn)=>connection.catch(fn));
		bridge.finallys.forEach((fn)=>connection.finally(fn));
		return false;
	});
	return bridge;
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
		var _self = $(element);
		var w = [
			'<div class="units-modal units-disabled">',
				'<div class="units-modal-content units-modal-content-placeholder">',
				'</div>',
			'</div>'
		].$().on('units-modal-show',function(){
			_self.trigger('show');
			setTimeout(()=>{
				$(this).removeClass('units-disabled');
			},2);
		}).on('units-modal-hide',function(){
			_self.trigger('hide');
			$(this).addClass('units-disabled');
		}).on('units-modal-close',function(){
			$(this).addClass('units-disabled');
			_self.trigger('close');
			setTimeout(()=>{
				w.remove();
			},300);
		});
		_self.appendTo(w.find('.units-modal-content-placeholder'));
		w.appendTo('body');
		w.trigger('units-modal-show');
	});
};
window.Units = {
	server:'',
	credentials:{},
	alert:function(options){
		var settings = $.extend({
			title:'Mensaje',
			message:''
		},typeof options==='string'?{
			message:options
		}:options);
		/* 
			Returns: 
				close: on window closes (removed from DOM),
			Options:
				title
				message
			Events 
				[$.fn.modal..]events
		*/
		var w = [
			'<div class="units-window">',
				'<div class="units-head">',
					'<div class="units-title">',
						Units.translate(settings.title),
					'</div>',
				'</div>',
				'<div class="units-body">',
					'<div class="units-wrap">',
						'<div class="units-data"><p>',Units.translate(settings.message).nl2br(),'</p></div>',
					'</div>',
				'</div>',
				'<div class="units-foot">',
					'<div class="units-actions units-inline">',
						'<div><a href="#" class="units-primary units-modal-close-button">Entendido</a></div>',
					'</div>',
				'</div>',
			'</div>'
		].$().modal();
		w.find('.units-modal-close-button').on('click',function(e){
			e.preventDefault();
			w.close();
		}).get(0).focus();
		return w;
	},
	confirm:function(options){
		/* 
			Returns: 
				DOM Element
			confirm:Options
				title : Window title : default 'Confirmar'
				message : Window message : default ''
			confirm:Events 
				[$.fn.modal..]events
				resolve(e:event, accept:bool): on resolve message
				cancel: on cancel message
				accept: on accept message
		*/
		var settings = $.extend({
			title:'Confirmar',
			message:'',
			accept:'Aceptar',
			cancel:'Cancelar'
		},typeof options==='string'?{
			message:options
		}:options);
		var w = [
			'<div class="units-window">',
				'<div class="units-head">',
					'<div class="units-title">',
						Units.translate(settings.title),
					'</div>',
				'</div>',
				'<div class="units-body">',
					'<div class="units-wrap">',
						'<div class="units-data"><p>',Units.translate(settings.message).nl2br(),'</p></div>',
					'</div>',
				'</div>',
				'<div class="units-foot">',
					'<div class="units-actions units-inline">',
						'<div><a href="#" class="units-primary  units-modal-accept-button">',settings.accept,'</a></div>',
					'</div>',
					'<div class="units-actions units-inline">',
						'<div><a href="#" class="units-modal-cancel-button">',settings.cancel,'</a></div>',
					'</div>',
				'</div>',
			'</div>'
		].$().modal();
		w.find('.units-modal-cancel-button').on('click',function(e){
			e.preventDefault();
			w.trigger('cancel').trigger('resolve',[false]).close();
		}).get(0).focus();;
		w.find('.units-modal-accept-button').on('click',function(e){
			e.preventDefault();
			w.trigger('accept').trigger('resolve',[true]).close();
		});
		return w;
	},
	formInput:function(rowInputSettings){
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
				'<div class="units-input ',inputSettings.custom,'"></div>'
			].$();
		}
		var formHtmlInput = '<input type="'+inputSettings.type+'" class="units-input-component" />';
		if(inputSettings.type=='hidden'){
			formHtmlInput = $(formHtmlInput);
			formHtmlInput.attr({
				'name':inputSettings.name,
				'placeholder':inputSettings.placeholder,
			}).val(inputSettings.value);
			return formHtmlInput;
		}
		var requiresExtraLabel = false;
		var requiresLabelLink = false;
		switch(inputSettings.type){
			case 'select':
				formHtmlInput = '<select class="units-input-component"></select>';
				requiresExtraLabel = true;
			break;
			case 'button':
				formHtmlInput = '<button class="units-input-component"></button>';
			break;
			case 'textarea':
				formHtmlInput = '<textarea class="units-input-component"></textarea>';
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
			'<div class="units-input ',inputSettings.custom,'">',
				(inputSettings.label!=''?('<label>'+inputSettings.label+'</label>'):''),
				formHtmlInput,
				(requiresExtraLabel?'<label class="units-input-override-label"></label>':''),
			'</div>'
		].$();
		if(inputSettings.type=='submit'){
			formInput.addClass('units-primary');
		}
		inputSettings.options.forEach((option)=>{
			Units.option(option.value,option.text).appendTo(formInput.find('select'));
		});
		var formInputComponent = formInput.find('.units-input-component');
		formInputComponent.attr({
			'name':inputSettings.name,
			'placeholder':inputSettings.placeholder,
		}).val(inputSettings.value);
		formInputComponent.val(formInputComponent.val());
		formInput.find('select,[type=file]').unitUpdateListeners();
		if(requiresLabelLink){
			var generationKey = 'units-form-'+Date.now();
			while($('#'+generationKey).length>0){
				generationKey = 'units-form-'+Date.now()+'-'+Math.round(Math.random()*1000000000);
			}
			formInput.find('.units-input-component').attr('id',generationKey);
			formInput.find('.units-input-override-label').attr('for',generationKey).text(inputSettings.placeholder);
		}
		return formInput;
	},
	form:function(){
		let formRows = Array.from(arguments);
		var unitForm = ['<form class="units-form"></form>'].$();
		formRows = Array.isArray(formRows)?formRows:[];
		formRows.forEach((formRowInputs)=>{
			var formRow = ['<div class="units-fields"></div>'].$();
			formRowInputs.forEach((rowInputSettings)=>{
				Units.formInput(rowInputSettings).appendTo(formRow);
			});
			formRow.appendTo(unitForm);
		});
		return unitForm;
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
		return ['<option value="',value,'">',text,'</option>'].$();
	},
	location:function(href,code){ 
		Units.loader(code);
		location.href = href;
	},
	reload:function(code){ 
		Units.loader(code);
		location.reload();
	},
    loader:function(showProgressBar){
    	showProgressBar = showProgressBar?true:false;
      	return [
      		'<div class="units-loader">',
				'<b class="fa fa-circle-notch fa-spin fa-3x fa-fw"></b>',
				(showProgressBar?'<div class="units-loading-bar"><div class="units-loading-progress"></div></div>':''),
			'</div>'
      	].$().on('progress',function(e,progress){
      		$(this).find('.units-loading-progress').css('width',progress+'%');
      	}).appendTo('body');
    },
	translate:function(c){
		c = (c+'').toString();
		window.lang = window.lang?window.lang:{};
		return (window.lang[c]?window.lang[c]:c).normalize();
	},
	defaultBridgeOptions:{
		method:'POST',
		loader:true,
		headers:{},
		data:{}
	},
	bridge:function(path,options){
		/* 
			Options 
				loader: bool : Shows loader
				method: POST GET PULL ... http method
				headers: {},
				data:{}
			Returns Promise
		*/
		this.path = path;
		this.settings = $.extend(Units.defaultBridgeOptions,options);
		if(!(this.settings.data instanceof FormData)){
			this.settings.data = $.extend({},this.settings.data);
			var formDataCollector = new FormData();
			$.each(this.settings.data,function(k,d){
				formDataCollector.append(k,d);
			});
			this.settings.data = formDataCollector;
		}
		this.settings.hasFiles = Array.from(this.settings.data.values()).filter((value)=>value.name?true:false).length>0;
		if(this.settings.loader){
			this.settings.loaderElement = Units.loader(this.settings.hasFiles);
		}
		return new Promise((resolve,reject)=>{
			const ajaxSetup = {
				type:this.settings.method,
				url:Units.server+'/bridge/'+this.path+'/',
				data:this.settings.data,
				cache: false,
			    contentType: false,
			    processData: false,
				beforeSend:(request)=>{
				    request.setRequestHeader('cache-control', 'no-cache, must-revalidate, post-check=0, pre-check=0');
					request.setRequestHeader('cache-control', 'max-age=0');
					request.setRequestHeader('expires', '0');
					request.setRequestHeader('expires', 'Tue, 01 Jan 1981 1:00:00 GMT');
					request.setRequestHeader('pragma', 'no-cache');
					Object.keys(Units.credentials).forEach((credentialKey)=>{
						request.setRequestHeader('Auth',credentialKey+' ' + Units.credentials[credentialKey]);
					});
					Object.keys(this.settings.headers).forEach((headerKey)=>{
						request.setRequestHeader(headerKey,this.settings.headers[headerKey]);
					});
				    request.withCredentials = 'true';
				},
				xhr:()=>{
	                var xhr = new window.XMLHttpRequest();
					if(this.settings.hasFiles && this.settings.loader){
		                xhr.upload.addEventListener('progress',(evt)=>{
			                this.settings.loaderElement.trigger('progress',[((evt.loaded/evt.total)*100)]);
		                },false);
					}
	                return xhr;
	            },
			};
			$.ajax(ajaxSetup).done((response)=>{
				resolve(response);
			}).fail((response)=>{ 
				if(!response.responseJSON){
					response = {
						responseJSON:{
							error:Units.translate('.service-unavailable'),
							error_code:'.service-unavailable'
						}
					};
				}
				reject(response.responseJSON);
			}).always(()=>{
				if(this.settings.loader){
					this.settings.loaderElement.remove();
				}
			});
		}); 
	}
};
$(()=>{
	$('.units-input select,.units-input [type=file]').unitUpdateListeners();
	((typeof feather)!=='undefined')?feather.replace():null;
});