$(()=>{
	$('#custom-user-profile-button').on('click',function(e){
		e.preventDefault();
		$('#custom-user-profile-view').addClass('unit-active');
	});
	$('#custom-user-profile-close-button').on('click',function(e){
		e.preventDefault();
		$('#custom-user-profile-view').removeClass('unit-active');
	});

})