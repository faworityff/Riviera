
$(document).ready(function(){

	function putMask(){

		var elem = Snap('#masking')
		elems  = elem.select('#mask-svg');

		elems.animate({ transform: 't1058.9 -170 s 0.4 r180' },0);
	}putMask()
var defaultData = null;

function calendarStart(defaultDate){
	$('#datetimepicker').datetimepicker({
		timepicker:false,
		formatDate:'Y/m/d',
		inline:true,
		timepicker:false,
		todayButton:false,
            i18n:{
                en:{
                    months: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
                    daysShort: ['Вос.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Суб.'],
                    dayOfWeekShort: [
					                    'Вос.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Суб.'
					                ],

                }

            },
       
        defaultDate :	defaultDate == null ? '' : defaultDate, 
        format: 'd,m,Y',
        dayOfWeekStart: 1,
        onGenerate: function(current_time,$input){
        	date = $(this).find('.xdsoft_date.xdsoft_current');
        	if(date.hasClass('xdsoft_disabled')){return}
        	d = date.attr('data-date');
        	m = +date.attr('data-month') + 1;
        	y = date.attr('data-year');
        	if(m < 10) {
        		m = '0' + m; 
        	}
        	fullDate = d + '.'+ m + '.' + y;
        	dateDiff(fullDate);
        },
        allowDates: ['12 04 2017', '15 04 2017','20 04 2017','24 04 2017','30 04 2017','05 05 2017','10 05 2017','14 05 2017','27 05 2017','29 05 2017'], formatDate:'d m Y'
	})
} calendarStart();
 function onStartCalendar(){
 	var date = new Date()

 	current = date.getMonth()
 	months = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']

 	current == 0 ? current == 11 : current = current - 1
	for (var i = 0; i < 12; i++) {
		if(current > 11) {current = 0}
		$('<span class="month-focus" data-numer='+current+'>'+months[current]+'</span>').appendTo('.wrap-mouth');
		current++
	}

$('.wrap-mouth .month-focus').eq($('.wrap-mouth .month-focus').length-1).prependTo('.wrap-mouth');
 }onStartCalendar()


$('article').each(function(i){
	$(this).attr('data-n', i)
})
/* начало события*/
var articleCount = $('.articles article').length;
calActivesBack();
$('.articles article').eq(articleCount-1).prependTo('.articles').addClass('before');

 var angle = 0;
 var can = true;


/*переключение событий	*/
 $('.next-sobitie').click(function(){
 	nextButt();
 });
  function nextButt (x){
  	if(!can){return}
 	calActivesForw();
console.log(x);
 	angle = angle- 36;
 	can = false;
 	$('.articles').animate({
 		transform:'rotate('+angle+'deg)'
 	},100,function(){
 		$('.articles article').eq(0).appendTo('.articles').addClass('before');
 		can = true;
 		if(!x){changeDate();}
 	})
  }


 $('.prev-sobitie').click(function(auto){
 	prevButt()
 });
function prevButt(x){
	calActivesBack();
 	if(!can){return}
 	angle = angle + 36;
 	can = false;
 	$('.articles').animate({
 		transform:'rotate('+angle+'deg)'
 	},100,function(){
 		$('.articles article').eq(articleCount-1).prependTo('.articles').addClass('before');
 		
 		can = true;
 		if(!x){changeDate();}
 	})
}



function dateDiff(date){
	date = date
	$('article').each(function(){

		dateArticle = $(this).find('time').html();

		if(date == dateArticle) {
			n = $(this).attr('data-n');
			changeTill(n);
			
		}
	})
}
function changeTill(n){
	rotateTill = setInterval(function(){
		c = $('article.active').attr('data-n');
console.log(c == n);
		if(c == n ){ clearInterval(rotateTill); return}
			c - n > 0 ? deg = prevButt(1) : nextButt(1)
	
	},100)

}


function changeDate() {
	var cur = $('.articles article.active div h5 time').html();
		cur = cur.split('.')
		cd = cur[0]
		cm = cur[1]
		cy = cur[2]
	$('#datetimepicker').datetimepicker('destroy');
	calendarStart( cd + ' ' + cm + ' ' + cy);

}



/*Actives*/
	function calActivesBack(){
		$('.articles article')
			.removeClass('active')
			.removeClass('almost-before')
			.removeClass('almost-after')
			.removeClass('almostActive-after')
			.removeClass('almostActive-before')
			.removeClass('before')
			.removeClass('after');
		$('.articles article').eq(2).addClass('active');
		$('.articles article').eq(1).addClass('almostActive-before');
		$('.articles article').eq(3).addClass('almostActive-after');
		$('.articles article').eq(0).addClass('almost-before');
		$('.articles article').eq(4).addClass('almost-after');
		$('.articles article').eq(5).addClass('after');
		var afisha = $('.articles article.active').attr('data-afisha');
			$('#afisha').attr('xlink:href' ,afisha);
		
	}
	function calActivesForw(){
		$('.articles article')
			.removeClass('active')
			.removeClass('almost-before')
			.removeClass('almost-after')
			.removeClass('almostActive-after')
			.removeClass('almostActive-before')
			.removeClass('before')
			.removeClass('after');
		$('.articles article').eq(4).addClass('active');
		$('.articles article').eq(3).addClass('almostActive-before');
		$('.articles article').eq(5).addClass('almostActive-after');
		$('.articles article').eq(2).addClass('almost-before');
		$('.articles article').eq(6).addClass('almost-after');
		$('.articles article').eq(1).addClass('before');
		$('.articles article').eq(7).addClass('after');
		var afisha = $('.articles article.active').attr('data-afisha');
			$('#afisha').attr('xlink:href' ,afisha);
		
	}

	//endDocready
})