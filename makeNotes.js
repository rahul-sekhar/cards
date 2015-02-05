$(document).ready(function () {
  var canvas = $('<canvas id="canvas"></canvas>').appendTo('#container').show(),
    ctx = canvas[0].getContext('2d'),
    rect = {},
    drag = false,
    $window = $(window),
    data = [];

  $('.note').hide();

  canvas.on('mousedown', function (e) {
    rect.startX = e.pageX - $(window).scrollLeft();
    rect.startY = e.pageY - $(window).scrollTop();
    drag = true;
  });

  $(document).on('mouseup', function (e) {
    if (drag && rect.w > 20 && rect.h > 20) {
      var text = prompt('Text:');
      if (text) {
        var obj = {
          x: rect.startX + $window.scrollLeft(),
          y: rect.startY + $window.scrollTop(),
          w: rect.w,
          h: rect.h,
          text: text
        }
        createBox(obj);
        data.push(obj);
      }
    }
    drag = false;
  });

  $(document).on('mousemove', function (e) {
    ctx.clearRect(0,0,canvas[0].width,canvas[0].height);

    if (e.target != canvas[0]) {
      return;
    }

    posX = e.pageX - $(window).scrollLeft();
    posY = e.pageY - $(window).scrollTop();

    drawCrosshairs(posX, posY);

    if (drag) {
      rect.w = posX - rect.startX;
      rect.h = posY - rect.startY;
      drawRect();
    }
  });

  function drawCrosshairs(x, y) {
    ctx.strokeStyle = '#2134AD';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas[0].width, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas[0].height);
    ctx.stroke();
  }

  function drawRect() {
    ctx.strokeStyle = '#65E6C8';
    ctx.lineWidth = 2;
    ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
  }

  function createBox(obj) {
    var div = $('<div class="box"></div>').appendTo('#container');
    div.css('top', obj.y + 'px');
    div.css('left', obj.x + 'px');
    div.css('width', obj.w + 'px');
    div.css('height', obj.h + 'px');

    $('<p></p>').text(obj.text).appendTo(div);
  }

  $window.on('resize', function () {
    canvas[0].width = $window.width();
    canvas[0].height = $window.height();
  });

  $window.resize();


  $('<button id="clear">Clear</button>').on('click', function () {
    data = [];
    $('.box').remove();
  }).appendTo('#container');

  $('<button id="save">Save</button>').on('click', function () {
    var jsonString = JSON.stringify(data);
    window.open('data:text/json,' + encodeURIComponent(jsonString));
  }).appendTo('#container');

  $('<span id="import"></span>').on('change', 'input[type="file"]', function () {
    if (this.files) {
      importFile(this.files[0]);
    }
    $(this).replaceWith('<input type="file" />');
  }).append('<input type="file" />')
    .appendTo('#container');

  function importFile(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      data = JSON.parse(reader.result);
      data.forEach(function (obj) {
        createBox(obj);
      });
    }
    reader.readAsText(file);
  }
})