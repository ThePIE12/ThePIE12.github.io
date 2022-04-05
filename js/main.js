let running = false;


function partialLoadAndReplaceLanguage(link, duration) {
	if(running) return;
	else running = true;
	duration = duration || 700;
	offset = 50;

	window.history.pushState({}, '', link);

	// '#main-wrapper' clone for animation purposes (clone > current[partially changed])
	mwclone = $('#main-wrapper').clone().attr('id', 'clone').appendTo('body')
								.css('opacity', '1')
		   						.addClass('out-able');
	mwclone.find('*[langrpl]').css('opacity', '1')
		   .addClass('out-able');
	onDocLoaded(mwclone);

	mw = $('#main-wrapper');

	mw.css('position', 'absolute')
	  .css('z-index', '-1');
	mw.find('*[langrpl]').css('opacity', '0');
	setTimeout(function() {
		mw.find('*[langrpl]').addClass('in-able');
	}, offset);

	$('#main-wrapper *[langrpl]').each(function(i, e) {
		let loadHolder = $('<div></div>');
		let qs = `*[langrpl=${$(this).attr('langrpl')}]`

		loadHolder.load(`${link} ${qs}`, function() {
			mw.find(qs).html(loadHolder.find(qs).html());
		});
	});

	setTimeout(function() {
		mwclone.css('opacity', '0');
		mwclone.find('*[langrpl]').css('opacity', '0');
	}, offset);

	setTimeout(function() {
		mw.find('*[langrpl]').css('opacity', '1');
	}, duration/2 + offset);

	setTimeout(() => {
		mw.css('position', 'initial').css('z-index', 'initial');
		mw.find('*[langrpl]').removeClass('in-able').css('opacity', 'initial');
		$('#clone').remove();
		running = false;
	}, duration + offset);
}

function onDocLoaded(context) {
	context = context || document;
	$('.langbtn', context).click(function(e) {
		e.preventDefault();
		$('.langbtn', context).each(function() {
			$(this).parent().attr('activelang', null);
		});
		$(this, context).parent().attr('activelang', '');
		partialLoadAndReplaceLanguage(this.href);
	});
}

$( document ).ready(onDocLoaded);
