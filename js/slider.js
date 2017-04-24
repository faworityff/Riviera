var slider = []
$('.sec .img').each(function(i){
	slider[i] = new Slider($(this),0);
	
});

$('#slider-next').click(function(){
	slider[screen].next()
})

$('#slider-prev').click(function(){
	slider[screen].prev()
})

function Slider(el,n){
	this.el = this,
	this.obj = el
	this.n = n
	this.next = next
	this.prev = prev
	this.opens = opens
	this.counts = counts

	el.find('img').eq(n).addClass('active');

	function next(){
		n++
		n > el.find('img').length - 1 ? n = 0 : n = n;
		counts()
		el.find('img').removeClass('active');
		el.find('img').eq(n).addClass('active');
	}

	function prev(){
		n--
		n < 0 ? n = el.find('img').length - 1 : n = n;
		counts()
		el.find('img').removeClass('active');
		el.find('img').eq(n).addClass('active');
	}
	function opens(){
		n = 0;
		el.find('img').removeClass('active');
		el.find('img').eq(n).addClass('active');
	}
	function counts(){
		$('#current-slide').html(n + 1)
		$('#all-slide').html(el.find('img').length)
	}
}
