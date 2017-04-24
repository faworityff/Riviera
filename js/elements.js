(function(){
var lines = document.getElementById('wrap-lines'),
	menu = document.querySelector('.wrap-menu');
	under = document.querySelector('.under-menu');
	w = window.innerWidth
	h = window.innerHeight

function putEl(){
	linesOf = $('#wrap-lines').offset();
	linesOfTop = linesOf.top;
	linesOfLeft = linesOf.left;
	
	menu.style.left = linesOfLeft+ 'px';
	menu.style.top = linesOfTop+ 'px'
}putEl();
	
/* menu open || close */
lines.onclick = function(){
	this.classList.contains('active') ? this.classList.remove('active') : this.classList.add('active');
	this.classList.contains('active') ? menu.classList.add('active') : menu.classList.remove('active');
	this.classList.contains('active') ? openUnder() : closeUnder()
}
var elem = Snap('#navigate')
var el = elem.select('#under-menu');
var el1 = elem.select('#under-menu-rect');
function openUnder(){
	document.getElementById('navigate').style.zIndex = '100000'
	el.animate({transform: 't0 0 s150 r10'},1200);
	el1.animate({opacity:1},600);
}

function closeUnder(){
	el.animate({transform: 't0 0 s1 r10'},800);
	el1.animate({opacity:0},800,function(){
		document.getElementById('navigate').style.zIndex = '-1'
	});
}
/* end menu */
})();


