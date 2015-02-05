var imgWidth, imgHeight, screenWidth, screenHeight, nav, pos, ratio, $window, largeImage;

var navRatio = 2.5;

$window = $(window);
$(window).on('scroll', updatePos);

$(document).ready(function () {
    nav = $('.nav');
    pos = nav.find('.pos');
    largeImage = $('#large');

    nav.on('mousedown', function () {
        nav.addClass('drag');
        nav.on('mousemove', function (e) {
            var navPos = nav.offset()
            $window.scrollLeft(((e.pageX - navPos.left) / ratio) - (screenWidth / 2));
            $window.scrollTop((e.pageY - navPos.top) / ratio - (screenHeight / 2));
            updatePos();
        })
    });

    $(document).on('mouseup', function () {
        nav.removeClass('drag');
        nav.off('mousemove');
    })

    largeImage.load(function () {
        $('#loading').hide();
        setTimeout(centerImage, 100);
    }).attr('src', largeImage.data('src'));

    setTimeout(centerImage, 100);

    loadNotes();
})

$window.on('resize', function () {
    screenWidth = $(window).width();
    screenHeight = $(window).height();

    var navWidth, navHeight;

    if (screenHeight > screenWidth) {
        navWidth = screenWidth / navRatio;
        navHeight = nav.width() * imgHeight / imgWidth;
    } else {
        navHeight = screenHeight / navRatio;
        navWidth = nav.height() * imgWidth / imgHeight;
    }

    ratio = navWidth / imgWidth;
    nav.width(navWidth).height(navHeight);
    pos.width(screenWidth * ratio).height(screenHeight * ratio);

    // $('.note p').css('width', navWidth).css('height', navHeight);

    updatePos();
});


function updatePos() {
    pos.css('left', ($window.scrollLeft() * ratio) - 2 + 'px')
    pos.css('top', ($window.scrollTop() * ratio) - 2 + 'px')
}

function centerImage() {
    imgWidth = largeImage.width();
    imgHeight = largeImage.height();

    $window.resize();

    if ($window.scrollLeft() > 0 || $window.scrollTop() > 0) {
        return;
    }
    $window.scrollLeft((imgWidth / 2) - (screenWidth / 2));
    $window.scrollTop((imgHeight / 2) - (screenHeight / 2));
}

function loadNotes() {
    $.get('cards.json', function (data) {
        data.forEach(function (obj) {
            var note = $('<div class="note"></div>').appendTo('#container');
            note.css({
                left: obj.x,
                top: obj.y,
                width: obj.w,
                height: obj.h,
            })
            var text = obj.text;
            if (obj.date) {
                text += ' (' + obj.date + ')';
            }
            $('<p></p>').text(text).appendTo(note);
        });
    })
}