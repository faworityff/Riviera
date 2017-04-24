$(document).ready(function(){
	var ofTop = $(document).scrollTop();

window.addEventListener('mousewheel',function(e){
	e.preventDefault(e)
	ofTop = +ofTop + e.deltaY;
	// console.log(ofTop);
	$('html, body').animate({
		scrollTop:  ofTop + 'px'
	},10);
	// console.log(ofTop);
})


function putMask(){
	if(document.getElementById('mask-svg')) {
		var elem = Snap('#masking')
		elems  = elem.select('#mask-svg');
		elems.animate({ transform: 't-170.9 -233 s .35 r180' },0);
	}
}putMask();

/****** tabs *******/
if($('.tabs')){
	var actTab = 0;
	$('.single-tab').eq(actTab).addClass('active');
	$('.tab-navigation li').eq(actTab).addClass('active');
	
	$('.single-tab').each(function(){
		$(this).find('.tab-alone:last-of-type').prependTo($(this));
	})

	function initTabs() {
		$('.single-tab').removeClass('active');
		$('.tab-navigation li').removeClass('active');
		$('.single-tab').eq(actTab).addClass('active');
		$('.tab-navigation li').eq(actTab).addClass('active');
	}

	$('.tab-navigation li').click(function(){
		actTab = +$(this).find('span').html() - 1 ;
		initTabs();
	})



	$('.nav-next').click(function(){tabSide(0)});
	$('.nav-prev').click(function(){tabSide(1)})
	function tabSide(f) {
		side = 0;
		console.log(1);
		f == 1 ? side = 20 : side = -20;

		$('.single-tab.active').animate({
			top: side + '%'
		},800, afterSlide)	

		function afterSlide(){
			if(side) {
				$('.single-tab.active').find('.tab-alone').eq(0).prependTo($('.single-tab.active'));
				$('.single-tab.active').attr('style', '')
			}else{
				$('.single-tab.active').find('.tab-alone').eq($('.single-tab.active .tab-alone').length -1 ).appendTo($('.single-tab.active'));
				$('.single-tab.active').attr('style', '')
			}
		}
	}		
}
/****** end Tabs ****/
/****** Slider Restoran ****/

	restCurr = 0;
	posScroll = 0;
	sliSize = 0;
	readySl = true;
	slideStop = 0;
	slidesToShow = 5; 
	var restSlides = $('.slider-restoran-big img');
		restSlides.eq(restCurr).addClass('active');
	function resizingSlider(){
		if( window.matchMedia("(max-width: 900px)").matches && window.matchMedia("(orientation: portrait)").matches){
			sliSize  = 26.34;
			slidesToShow = 3
		}else if(window.matchMedia("(max-width: 600px)").matches && window.matchMedia("(orientation: landscape)").matches){
			sliSize = 26.3545;
			slidesToShow = 3
		}else {
			sliSize = 8.6081;
			slidesToShow = 5
		}
		vw = $(window).width() / 100;
		sliderWidth = restSlides.length * sliSize;
		slidesShownWidth = slidesToShow * ( sliSize* vw )
		$(".wrap-pagination").css({width: slidesShownWidth + 'px' });
		$('.slides-small').css({'width':  sliderWidth + 'vw'});
		slideStop = restSlides.length  - Math.floor(slidesShownWidth /( sliSize* vw ));
		console.log(Math.floor(slidesShownWidth / sliSize) + '  ' + Math.floor(slidesShownWidth) +' / ' +sliSize );
		console.log(slideStop);
	}resizingSlider()
	


	for (var i = 0; i < restSlides.length; i++) {
		restSlides.eq(i).attr('data-num', i);
		restSlides.eq(i).clone().appendTo($('.slides-small'))
	}

	$('.slides-small img').click(function(){
		restCurr = $(this).attr('data-num');
		restSlides.removeClass('active');
		restSlides.eq(restCurr).addClass('active');
	})

	$(".wrap-pagination").mCustomScrollbar({
		axis:"x",
		theme:"dark",
		mouseWheel:{ enable: 0 },
		autoDraggerLength: false,
		callbacks:{
		      whileScrolling: function(){
		      	vw = $(window).width() / 100;
				restCurr = -Math.floor(this.mcs.left / Math.floor(sliSize * vw));
				posScroll = -this.mcs.left;
				restSlides.removeClass('active');
				restSlides.eq(restCurr).addClass('active');

				console.log(restCurr+' ' +this.mcs.left+' '+ Math.floor(sliSize * vw) );
		      }
		}
		
	});
	$('.slider-next-arr').click(function(){
		if(!readySl) { return}
		restCurr++;
		if(restCurr > slideStop) { 
			if(restCurr > $('.slides-small img').length - 1 ){restCurr = $('.slides-small img').length - 1; return}
			justChangeF();
			return;
		}
		readySl = false;
		vw = $(window).width() / 100;
		posScroll = posScroll + Math.floor(sliSize * vw);

		sliderScroll();
	})
	$('.slider-prev-arr').click(function(){
		if(!readySl) { return}
		restCurr--;
	
		if(restCurr >= slideStop) { 
			console.log('dddd '  + restCurr);
			justChangeF();
			return; 
		}
		readySl = false;
		vw = $(window).width() / 100;
		posScroll = posScroll - Math.floor(sliSize * vw);
		

		sliderScroll();
	})
	function justChangeF(){
		console.log($('.slides-small img').length + ' ' +restCurr);
		restSlides.removeClass('active');
		restSlides.eq(restCurr).addClass('active');

	}
	function sliderScroll(){
		$(".wrap-pagination").mCustomScrollbar("scrollTo", posScroll );
		setTimeout(function(){readySl = true;},1000)
	}

	$(window).resize(function () {
	  resizingSlider()
	});
})