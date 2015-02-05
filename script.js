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
})

$window.on('resize', function () {
    screenWidth = $(window).width();
    screenHeight = $(window).height();

    if (screenHeight > screenWidth) {
        nav.width(screenWidth / navRatio);
        nav.height(nav.width() * imgHeight / imgWidth);
    } else {
        nav.height(screenHeight / navRatio);
        nav.width(nav.height() * imgWidth / imgHeight);
    }

    ratio = nav.width() / imgWidth;
    pos.width(screenWidth * ratio);
    pos.height(screenHeight * ratio);
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