/* iox prototypes */
String.prototype.replaceAll = function(search, replacement) {
    return this.split(search).join(replacement);
};
String.prototype.nl2br = function() {
    return this.replaceAll('\n','<br />');
};
String.prototype.toFilterable = function() {
    return $.normal(this).replaceAll(' ','').toLowerCase().replaceAll('á','a').replaceAll('é','e').replaceAll('í','i').replaceAll('ó','o').replaceAll('ú','u').replaceAll('ñ','n');
};
String.prototype.contains = function(search) {
    return this.indexOf(search)>=0;
};
String.prototype.toDate = function(){
	var d = this.split('-');
		d[0] = parseInt(d[0],10);
		d[1] = parseInt(d[1],10);
		d[2] = parseInt(d[2],10);

		d[0] = isNaN(d[0])?0:d[0];
		d[1] = isNaN(d[1])?0:(d[1]-1);
		d[2] = isNaN(d[2])?0:d[2]; 

	var isInvalidDate = (
		d[0]==0
		||
		d[1]==0
		||
		d[2]==0
	);
	return isInvalidDate?new Date():new Date(d[0],d[1],d[2]);
};
String.prototype.toURLFriendly = function(){
	return this.toLowerCase().replaceAll('á','a').replaceAll('é','e').replaceAll('í','i').replaceAll('ó','o').replaceAll('ú','u').replaceAll('ñ','n').replaceAll('ç','c').replaceAll(' ','-').replace(/[^a-z0-9-]/gi, '');
};
String.prototype.getExtension = function(){ 
	return (/(?:\.([^.]+))?$/).exec(this)[1];
};
String.prototype.normalize = function(){ 
	if(this===0){return '0';}
	if(this===false){return 'false';}
	if(this===true){return 'true';}
	return ((this?(this.replace?$('<div></div>').html(this.replace(/<br\s*\/?>/mg,"\n")).text():this):'')+'').toString();
};
Array.prototype.mapID = function(varName,property) {
    return varName + this.map(function(e){ return '['+e[property]+']'; }).join('');
};
Array.prototype.clone = function() {
	return this.slice(0);
};
Array.prototype.paginate = function(rpp,p){
	p--;
	return this.clone().slice(p * rpp, (p + 1) * rpp);
};
Array.prototype.contains = function(search) {
    return this.indexOf(search)>=0;
};
Array.prototype.swap = function(index_A, index_B) {
    var input = this; 
    var temp = input[index_A];
    input[index_A] = input[index_B];
    input[index_B] = temp;
};
Array.prototype.random = function(){
	return this.sort(function(){
	  return 0.5 - Math.random();
	});
};
Array.prototype.$ = function(){
	return $(this.join(''));
};
Array.prototype.slider = function(){
    var pop = [
        '<div class="io-full">',
            '<div class="io-full-slider owl-carousel"></div>',
            '<div class="io-full-slider-close fa fa-times"></div>',
        '</div>'
    ].$();
    var ioFullSliderList = pop.find('.io-full-slider');
    $.each(this,function(i,imageURL){
        ['<div class="io-full-slider-image" style="background-image:url(\''+imageURL+'\');"></div>'].$().appendTo(ioFullSliderList);
    });
    ioFullSliderList.owlCarousel({
        nav:this.length>1,
        items:1
    });
    pop.appendTo('body');
    pop.find('.io-full-slider-close').on('click',function(e){
        e.preventDefault();
        pop.removeClass('open');
        setTimeout(function(){
            pop.remove();
        },301)
    });
    setTimeout(function(){
        pop.addClass('open');
    },10);
};
Array.prototype.normalize = function(){ 
	return this.toString().normalize();
};
Number.prototype.replaceAll = function(search,replacement){
	return (this.valueOf()+"").replaceAll(search,replacement);
};
Number.prototype.toFilterable = function(){
	return (this.valueOf()+"").toFilterable();
};
Number.prototype.nl2br = function(){
	return (this.valueOf()+"").nl2br();
};
Number.prototype.round = function(decimals){
	decimals = decimals?decimals:0;
	return Math.round(this.valueOf()*Math.pow(10,decimals))/Math.pow(10,decimals);
};
Number.prototype.toPercent = function(totalPercent,decimals){
	totalPercent = totalPercent?totalPercent:1;
	return ((this.valueOf()*100)/totalPercent).round(decimals);
};
Number.prototype.toDate = function(){
	return new Date(this.valueOf());
};
Number.prototype.normalize = function(){ 
	return this.toString().normalize();
};
Date.prototype.toDate = function(){
	return this.toDateString().toDate();
};
Date.prototype.toDateString = function(){
	var m = this.getMonth()+1; 
		m = [(m<10?'0':''),m].join('');
	var d = this.getDate();
		d = [(d<10?'0':''),d].join('');
	return [this.getFullYear(),m,d].join('-');
};
Date.prototype.diffDays = function(otherDate){ 
	return ((otherDate.toDate().getTime()-this.getTime())/(1000 * 3600 * 24))+1;
};
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}; 
Date.prototype.normalize = function(){ 
	return this.toString().normalize();
};