function loadNewContent(link) {
    $('#main-wrapper *[langrpl]').each(function(i, e) {
        const loadHolder = $('<div></div>');
        const qs = `*[langrpl=${$(this).attr('langrpl')}]`;

        loadHolder.load(`${link} ${qs}`, function() {
            $('#main-wrapper').find(qs).html(loadHolder.find(qs).html());
        });
    });
}

const createPartialLoadAndReplaceLanguage = () => {
	let running = false;

	const animateContentChange = (duration, offset, callback) => {
	    setTimeout(function() {
	        $('#clone').css('opacity', '0');
	        $('#clone').find('*[langrpl]').css('opacity', '0');
	    }, offset);

	    setTimeout(function() {
	        $('#main-wrapper').find('*[langrpl]').css('opacity', '1');
	    }, duration/2 + offset);

	    setTimeout(() => {
	        $('#main-wrapper').css('position', 'initial').css('z-index', 'initial');
	        $('#main-wrapper').find('*[langrpl]').removeClass('in-able').css('opacity', 'initial');
	        $('#clone').remove();
	        callback();
	    }, duration + offset);
	}

	return (link, duration = 700, offset = 50) => {
		if (running) return;
		running = true;

		window.history.pushState({}, '', link);

		// '#main-wrapper' clone for animation purposes (clone > current[partially changed])
		const mwclone = $('#main-wrapper').clone().attr('id', 'clone').appendTo('body')
			.css('opacity', '1')
			.addClass('out-able');
		mwclone.find('*[langrpl]').css('opacity', '1').addClass('out-able');
		onDocLoaded(mwclone);

		$('#main-wrapper').css('position', 'absolute').css('z-index', '-1');
		$('#main-wrapper').find('*[langrpl]').css('opacity', '0');
		setTimeout(function() {
			$('#main-wrapper').find('*[langrpl]').addClass('in-able');
		}, offset);

		loadNewContent(link);
		animateContentChange(duration, offset, function () { running = false });
	}
}

const partialLoadAndReplaceLanguage = createPartialLoadAndReplaceLanguage();

function onDocLoaded(context = document) {
    $('.langbtn', context).click(function(e) {
        e.preventDefault();
        $('.langbtn', context).parent().removeAttr('activelang');
        $(this).parent().attr('activelang', '');
        partialLoadAndReplaceLanguage(this.href);
    });
}

$( document ).ready(onDocLoaded);
