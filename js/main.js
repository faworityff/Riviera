window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){window.setTimeout(a,1E3/60)}}();
var stop = true;
var screen = 0;
var sec  =  document.querySelectorAll('.sec');
var s = Snap('#svgout');
	more = s.select('#circle-open');
	moreLine =  s.select('#circle-open-line');

var coordinates = [ 
					
					[[342, 100], [938.9,120], [260, 90],[778.9,70],[343, 70],[938.9,70],[343, 70],[1058.9,-170],[500.9,70]],
					[[492, 210], [340,120], [492, 210], [1038.9, 210],[492, 210],[1038.9, 210],[492, 210],[1258.9, 190],[1338.9, 100]], 
					[[560, 280], [330,90], [560, 280], [1038.9, 210],[560, 280],[1038.9, 210],[560, 280],[1258.9, 190],[1338.9, 550]],
					// [],
				  ]
var coordMain = [[0, 0], [576.9,20], [-102, -10],[406.9, -30],[-20, -30],[576.9,-30],[-20, -30],[696.9,-250],[696.9,-250]]
var coordSliderRemote = [[0, 0], [606.9,-95], [-102, -10],[406.9, -30],[-20, -30],[576.9,-30],[-20, -30],[696.9,-250],[696.9,-250]]
var timing = [
				[500,500,500,500,500,500,500,500,500],
				[500,500,500, 500, 500,500,500,500,500],
				[500,500,500, 500, 500,500,500,500,500],
				[500,500,500,500,500,500,500,500,500],
			]

var scaling = [ 
				[ 1, 0.65, 1, 1, 1, 1, 1, .4, .9],
				[ 1, 1, 1, 1, 1, 1, 1, .1, 1.2],
				[ 1, 1, 1, 1, 1, 1, 1, .1, 1], 
				[ 1, 0.65, 1, 1, 1, 1, 1, 0, 0],
			  ]

var rotating = [ 
				[ 0, 180, -90, 180, 0, -180, 180, 180, -180], 
				[ 0, 180, 0, 10, 10, 10, 10, 10, 10], 
				[ 0, 180, 0, 10, 10, 10, 10, 10, 50],
				[ 0, 0, 0, 0, 0, 0, 0, 0, 0] 
			   ]

var anim;
var circle = []
var circles = document.querySelectorAll('.circle');
//  positions
	 for (var i = 0; i < circles.length ; i++) {
	 	circle[i] = new MoveCircle(circles[i], coordinates[i], rotating[i], scaling[i], timing[i], circles[i].getAttribute('id'),'#svgout'); /*,existing[i]*/
	}

	
opencloseCoord = [
					[0, 680, -95, 440, 10, 610, 10, 810, 10],
					[0,-40, 0, 0, 0, 0, 0, -420, 0]
				]


color = [	
			[231,254,255,.9],  /* главная   */
			[218,204,188,0.9], /* ресторан  */
			[249,240,200,0.9], /* пляж 	    */
			[17,17,26,0.9],    /* диско 	*/
			[168,178,139,0.9], /* бани      */
			[255,207,182,0.9], /* события   */
			[228,213,255,0.9], /* кейтеринг */
			[225,248,249,0.9], /* события   */
			[65,65,65,0.5],    /* карта     */
		]
coloring = [	
			[221,244,245],
			[218,204,188],
			[249,240,200],
			[17,17,2],
			[168,178,139],
			[255,207,182],
			[228,213,255],
			[225,248,249],
			[65,65,65],
		]



function colorChange(){

	var elem = Snap('#svgout')
	coloredRect  = elem.select('#coloredRect');
	
	// coloredRect.attr({fill: 'rgb('+coloring[screen-1]+')'}).animate({fill:'rgb('+coloring[screen]+')'},500,function(){
	// 	coloredRect.animate({fill: 'rgba('+color[screen]+')'})
	// })
	
	coloredRect.animate({fill:'rgba('+color[screen]+')', opacity:1},500,function(){
		coloredRect.animate({fill: 'rgba('+color[screen]+')',opacity:.9},100)
	})
}


var elementsC = [
					['img/pticy.png',1000,100,309,254],
					['img/stul.png',849,424,730,412],
					['img/sky.png',508,0,736,674],
					['img/shar.png',945,0,977,345],
					['img/venik.png',593,623,551,362],
					['img/flowers.png',927,84,558,431],
					['img/man.png',501,67,305,265],
					['',0,0,0,0],
					['',0,0,0,0]
				]

var elementsB = [
					['',0,0,0,0],
					['',0,0,0,0],
					['img/way.png',510,829,278,110],
					['img/tuman.png',857,623,1062,364],
					['',0,0,0,0],
					['',0,0,0,0],
					['img/buter.png',581,668,318,292],
					['',0,0,0,0],
					['',0,0,0,0]
				]
var elC,elB;


function screenElements(op){
	stop = false;
	var elem = Snap('#svgout');
	if(elC){elC.remove()}
	if(elB){elB.remove()}
		if(op){return}
	ugol =  elem.select('.ugol-stula').animate({opacity:0, transform: 't'+1505+' ' + 350},0)
	elemGroup = elem.select('#images')
		elC = elemGroup.image(elementsC[screen][0], elementsC[screen][1], elementsC[screen][2], elementsC[screen][3], elementsC[screen][4]).animate({opacity:0},0);
		elB = elemGroup.image(elementsB[screen][0], elementsB[screen][1], elementsB[screen][2], elementsB[screen][3], elementsB[screen][4]).animate({opacity:0},0);
		
		setTimeout(function(){
			elC.animate({opacity:1},500,function(){
				stop = true;
			});
			elB.animate({opacity:1},500);
			
			if (screen == 1) {
				ugol.animate({opacity:1},100);
			}else{
				ugol.animate({opacity:0},100);
			}
		},500)
};screenElements();	  

                     
function MoveCircle(el, coord, deg, scale, time,ids,parent) {//exst
	this.el = el
	
	el.coord = coord
	el.deg = deg
	el.scale = scale
	el.time = time
	el.parent = parent
	/*el.exst = exst*/
	var elem = Snap(el.parent)
	el.Path  = elem.select('#' + ids);
	//окружность управления
	elMain = elem.select('#circle-positive');
 	el.Path.animate({ transform: 't'+el.coord[screen][0]+' ' + el.coord[screen][1] +'s'+ el.scale[screen] +' r'+ el.deg[screen] },0);
	//слайдер управления
	elSliderRemote = elem.select('#slider-remote');
	elSliderCount = elem.select('#slider-count');
	el.posX = el.beforeX = el.coord[screen][0] 
	el.posY = el.beforeY = el.coord[screen][1]
	//degrees
	el.scaleEl = el.scale[screen]
	el.rotEl = el.deg[screen]

	el.x = el.coord[screen][0]
	el.y = el.coord[screen][1]
	

	MoveCircle.prototype.Move = function(el){
		elMain.animate({'opacity':0},10, function(){
			elMain.animate({ transform: 't'+coordMain[screen][0]+' ' + coordMain[screen][1] +'s'+scaling[3][screen] +' r'+ rotating[3][screen] },10);
			el.Path.animate({ transform: 't'+el.coord[screen][0]+' ' + el.coord[screen][1] +'s'+ el.scale[screen] +' r'+ el.deg[screen] },el.time[screen], function(){
				elMain.animate({'opacity':1},10)
				elSliderRemote.animate({ transform: 't'+coordSliderRemote[screen][0]+' ' + coordSliderRemote[screen][1] +'s'+1+' r'+ 1 },10);
				screen == 1 ? elSliderCount.animate({ transform: 't-95 0  s1  r1' },10) : elSliderCount.animate({ transform: 't0 0  s1  r1' },10) 
			});
		})
	}
	MoveCircle.prototype.Open = function(el){
		el.Path.animate({ transform: 't'+el.coord[screen][0]+' ' + el.coord[screen][1] +'s'+ 5.4 +' r'+ el.deg[screen]},1000 );

	}
	MoveCircle.prototype.Close = function(el){
		el.Path.animate({ transform: 't'+el.coord[screen][0]+' ' + el.coord[screen][1] +'s'+ el.scale[screen]  +' r'+ el.deg[screen]},800 );

	}
}

open = false
t = true
time = 800
var elem = Snap('#svgout')
var el1 = elem.select('#open-circle-elements')
		el2 = elem.select('.str'),
		el3 = elem.select('.str1'),
		el4 = elem.select('.str2'),
		el5 = elem.select('.str3');

		el6 = elem.select('#circle-open');
		el7 = elem.select('#circle-open-line');
		
	var clipG = s.group(el1);

function openCloseMove() {
	if(screen >= 7 ){
		el1.animate({opacity:0},10)
		// el1.animate({ transform: 't'+opencloseCoord[0][screen]+' ' + opencloseCoord[1][screen] +'s'+ 1  +' r'+ 0, 'opacity':0},500 );
		return;
	}
	el1.animate({opacity:0},10, function(){
		el1.animate({ transform: 't'+opencloseCoord[0][screen]+' ' + opencloseCoord[1][screen] +'s'+ 1  +' r'+ 0,},500,function(){
			el1.animate({opacity:1},10)
		});
	})
	
} openCloseMove()

function OpenClose(c){

	coloredRect  = elem.select('#coloredRect');
	ramka = elem.select('#ramka');
	
	if(open){
		open = false
		$('.remote').css({'opacity':'0'});
		$('.sec.active').removeClass('open');
		slider[screen].opens()

		circle[0].Close(circles[0]);
		clipG.animate({transform:'t0 0s1r0'},time);
/*arrows*/
		el2.animate({transform:'t0 0s1r0'},time);
		el2.animate({transform:'t0 0s1r0'},time);
		el3.animate({transform:'t0 0s1r0'},time);
		el4.animate({transform:'t0 0s1r0'},time);
		el5.animate({transform:'t0 0s1r0'},time);

		setTimeout(function(){
			coloredRect.animate({'opacity': .9},500);

		},700)	
		setTimeout(function(){
			ramka.attr({opacity:0});
			
			if(c){return}
				setTimeout(function(){
				  coloredRect
					.attr({fill:'rgb('+coloring[screen]+')'})
				},400)
		},800)
		setTimeout(function(){screenElements();},400)
	}else{
		open = true
		$('.remote').css({'opacity':'1'});
		$('.sec.active').addClass('open');
		screenElements(1)
		slider[screen].counts()
		clipG.animate({transform:'t0 0s1r180'},time);		
/*arrows*/
		el2.animate({transform:'t-4 -4s1r-180'},time);
		el3.animate({transform:'t4 -4s1r-180'},time);
		el4.animate({transform:'t4  4s1r-180'},time);
		el5.animate({transform:'t-4 4s1r-180'},time);

		coloredRect.animate({fill:'rgb('+coloring[screen]+')',opacity:1},200) 

		setTimeout(function(){
			ramka.attr({opacity:1, fill:'rgba('+color[screen]+')', transform: 't0 -2' });
			circle[0].Open(circles[0]);
		},100)
	}
}
time2 = 200;
function hoverEl(){

	if(open){
		el6.animate({r:22},time2);
		

		el2.animate({transform:'t0 0s1r-180'},time2);
		el3.animate({transform:'t0 0s1r-180'},time2);
		el4.animate({transform:'t0 0s1r-180'},time2);
		el5.animate({transform:'t0 0s1r-180'},time2);

	}else{
		

		el6.animate({r:30},time2);	

		el2.animate({transform:'t-4 -4s1r0'},time2);
		el3.animate({transform:'t4 -4s1r0'},time2);
		el4.animate({transform:'t4 4s1r0'},time2);
		el5.animate({transform:'t-4 4s1r0'},time2);
	}
}
	
function mouseOutEl() {
	if(open){

		el6.animate({r:30},time2);

		el2.animate({transform:'t-4 -4s1r-180'},time2);
		el3.animate({transform:'t4 -4s1r-180'},time2);
		el4.animate({transform:'t4 4s1r-180'},time2);
		el5.animate({transform:'t-4 4s1r-180'},time2);
	}else{


		el6.animate({r:22},time2);

		el2.animate({transform:'t0 0s1r0'},time2);
		el3.animate({transform:'t0 0s1r0'},time2);
		el4.animate({transform:'t0 0s1r0'},time2);
		el5.animate({transform:'t0 0s1r0'},time2);
	}
}
	document.getElementById('open-circle-elements').addEventListener('click', function(event) {
		OpenClose();
	})

	var openEl = document.querySelectorAll('.open-element');

	for (var i = 0; i < openEl.length; i++) {
		openEl[i].onmouseover = openEl[i].onmouseout = openAnim;
	}

	function openAnim(event) {
	 	if (event.type == 'mouseover') {
			hoverEl()
		}

		if (event.type == 'mouseout') {
			mouseOutEl()

		}

	}
	/*скролл календаря */
	$('.calendar-left-side').bind('mouseenter', function(){
		window.removeEventListener('scrollDown', scrollToDown);
		window.removeEventListener('scrollUp', scrollToTop);
	}).bind('mouseleave',  function(){
		window.addEventListener('scrollDown', scrollToDown);
		window.addEventListener('scrollUp', scrollToTop);
	})
	/* скролл документ */
	window.addEventListener('scrollUp', scrollToTop);
	window.addEventListener('scrollDown', scrollToDown);

	 function scrollToDown(event) {
		event.preventDefault(event);
		
		if(!stop && open == false || screen + 1  > sec.length - 1 ){return}
		if(open == true){OpenClose(true); stop=false;screen++;setTimeout(goUpOrDown,1500); return}
		screen++
		
		goUpOrDown();
	}

		function scrollToTop(event) {
		event.preventDefault(event);
		if(!stop && open == false || screen == 0){return}
		if(open == true){OpenClose(true); stop=false;screen--; setTimeout(goUpOrDown,1500); return}
		screen--

		goUpOrDown();
	}


	function goUpOrDown(){
		for (var i = 0; i < circle.length; i++) {
			circle[i].Move(circles[i]);
		}
		openCloseMove()
		screenElements();
		colorChange();
		changeScreen()
	} 

function changeScreen() {
	
	for (var i = 0; i < sec.length; i++) {
		sec[i].classList.remove('active');
	}
	// console.log(sec)
sec[screen].classList.add('active');
} changeScreen()


function onStartPage (){

	var page_h = $(window).height() /*window.innerHeight || document.documentElement.clientHeight,*/
	   	page_w = $(window).width() /*window.innerWidth || document.documentElement.clientWidth*/
	   	

	var svg = document.getElementById('svgout'),
		sec1 = document.getElementById('sec1'),
		colorBg = document.getElementById('color-bg')
	   	svg.style.width = page_w + 'px';
	   	sec1.style.width = page_w + 'px';

	var elem = Snap('#svgout')
		coloredRect  = elem.select('#coloredRect');
		ramka = elem.select('#ramka');
		ramka.attr({opacity:0});
		str  = elem.select('.str');
		str1  = elem.select('.str1');
		str2  = elem.select('.str2');
		str3  = elem.select('.str3');

}
	var img= new Array();
	img[0]=new Image();   
	img[1]=new Image();   
	img[2]=new Image();
	img[3]=new Image();
	img[4]=new Image(); 

	img[0].src="img/bg-1.jpg";
	img[1].src="img/bg-2.jpg";
	img[2].src="img/bg-3.jpg";
	img[3].src="img/bg-4.jpg";
	img[4].src="img/bg-5.jpg";
	
	window.onresize = function() {
		onStartPage ()
	}

onStartPage ()



 /* paralax*/ 


