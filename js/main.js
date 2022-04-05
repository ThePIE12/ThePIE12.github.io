function partialLoadAndReplaceLanguage(link, duration) {
	duration = duration || 500;

	window.history.pushState({}, '', link);

	// '#main-wrapper' clone for animation purposes (clone > current[partially changed])
	mwclone = $('#main-wrapper').clone().attr('id', 'clone').appendTo('body').css('pointer-events', 'none')
				                .css('opacity', '1');
	mw = $('#main-wrapper');

	mw.css('opacity', '0')
	  .css('position', 'absolute')
	  .css('z-index', '-1')
	  .css('pointer-events', 'none');

	$('#main-wrapper *[langrpl]').each(function(i, e) {
		let loadHolder = $('<div></div>');
		let qs = `*[langrpl=${$(this).attr('langrpl')}]`

		loadHolder.load(`${link} ${qs}`, function() {
			console.log(mw.find(qs).html());
			console.log(loadHolder.find(qs).html());
			mw.find(qs).html(loadHolder.find(qs).html());
		});
	});

	mw.css('transition', `opacity ${duration}ms ease-in 0s`).children().css('transition', `opacity ${duration}ms ease-in 0s`);
 	mwclone.css('transition', `opacity ${duration}ms ease-out 0s`).children().css('transition', `opacity ${duration}ms ease-out 0s`);

	setTimeout( function() {
		mw.css('opacity', '1');
		mwclone.css('opacity', '0');
	}, 50);

	setTimeout(() => {
		mw.css('pointer-events', 'initial').css('position', 'initial').css('z-index', 'initial');
		$('#clone').remove();
	}, duration);
}

function onDocLoaded() {
	$('.langbtn').click(function(e) {
		e.preventDefault();
		$('.langbtn').each(function() {
			$(this).parent().attr('activelang', null);
		});
		$(this).parent().attr('activelang', '');
		partialLoadAndReplaceLanguage(this.href);
	});
}

$( document ).ready(onDocLoaded);
