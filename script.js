var imgWidth, imgHeight, screenWidth, screenHeight, nav, pos, ratio, $window;

$window = $(window);

nav = $('.nav');
pos = nav.find('.pos');

$window.on('resize', function () {
    screenWidth = $(window).width();
    screenHeight = $(window).height();

    if (screenHeight > screenWidth) {
        nav.width(screenWidth / 2);
        nav.height(nav.width() * imgHeight / imgWidth);
    } else {
        nav.height(screenHeight / 2);
        nav.width(nav.height() * imgWidth / imgHeight);
    }

    ratio = nav.width() / imgWidth;
    pos.width(screenWidth * ratio);
    pos.height(screenHeight * ratio);
});


function updatePos() {
    pos.css('left', ($window.scrollLeft() * ratio) + 'px')
    pos.css('top', ($window.scrollTop() * ratio) + 'px')
}

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

$(window).on('scroll', updatePos);


$('#large').load(function () {
    $('#loading').hide();

    setTimeout(center, 100);

}).attr('src', $('#large').data('src'));

var center = function () {
    imgWidth = $('#large').width();
    imgHeight = $('#large').height();

    $window.resize();

    if ($window.scrollLeft() > 0 || $window.scrollTop() > 0) {
        return;
    }
    $window.scrollLeft((imgWidth / 2) - (screenWidth / 2));
    $window.scrollTop((imgHeight / 2) - (screenHeight / 2));
}

center();
setTimeout(center, 100);