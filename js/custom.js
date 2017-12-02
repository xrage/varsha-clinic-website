$(document).ready(function() {
	
	'use strict';
	
	/* ==== Event Target ==== */
	$('body').click(function(event){
		if ($(event.target).closest('.toggle-btn').length) return;
		$('.menu').removeClass('active');
		$('.toggle-btn').removeClass('open');
		event.stopPropagation();	
	});
	
	$(".tmp-item a").mouseenter(function(){
        var h = $(this).find('img').height();
        var h2 = $(".tmp-item").height();
        h = h-h2;
        $(this).find('img').css({
        	top: -h,
	        WebkitTransition : 'top 8s linear',
		    MozTransition    : 'top 8s linear',
		    MsTransition     : 'top 8s linear',
		    OTransition      : 'top 8s linear',
		    transition       : 'top 8s linear'
        });
    });

    $(".tmp-item a").mouseleave(function(){
        $(this).find('img').css({
        	top: 0,
        	WebkitTransition : 'top 1s linear',
		    MozTransition    : 'top 1s linear',
		    MsTransition     : 'top 1s linear',
		    OTransition      : 'top 1s linear',
		    transition       : 'top 1s linear'
        });
    });
	
	/* ==== Scroll link ==== */
	$.localScroll.hash();
	$('.menu').localScroll({
		target: 'body',
		queue: true,
		duration: 1000,
		hash: false,
		offset: -60,
		easing: 'easeInOutExpo'
	});
	
	/* ==== Contact Form ==== */
	var options = {
		target: '.message .alert',
		beforeSubmit: showRequest,
		success: showResponse
	};

	$('#contactForm').ajaxForm(options);
	function showRequest(formData, jqForm, options) {
		var queryString = $.param(formData);
			return true;
		}
	function showResponse(responseText, statusText) {
		}
	
	$('.toggle-btn').on('click',function(){
		if(!$(this).hasClass('open')){
			$(this).addClass('open');
			$(this).parent().find('.menu').addClass('active');
		}
		else{
			$(this).removeClass('open');
			$(this).parent().find('.menu').removeClass('active');
		}
	});
});