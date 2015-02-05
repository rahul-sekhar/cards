$(document).ready(function () {
  var canvas = $('<canvas id="canvas"></canvas>').appendTo('#container').show(),
    ctx = canvas[0].getContext('2d'),
    rect = {},
    drag = false,
    $window = $(window),
    data = [];

  $('body').addClass('edit');

  canvas.on('mousedown', function (e) {
    rect.startX = e.pageX - $(window).scrollLeft();
    rect.startY = e.pageY - $(window).scrollTop();
    drag = true;
  });

  $(document).on('mouseup', function (e) {
    if (drag && rect.w > 20 && rect.h > 20) {
      var obj = {
        x: rect.startX + $window.scrollLeft(),
        y: rect.startY + $window.scrollTop(),
        w: rect.w,
        h: rect.h,
      }

      var text = prompt('Text:');
      if (text) {
        var date = prompt('Date:');
        obj.text = text;
        obj.date = date;
        createNote(obj, data.length);
        data.push(obj);
      }
    }
    drag = false;
  });

  $('#container').on('click', '.note', function (e) {
    var index = $(this).data('index');
    var obj = data[index];

    var text = prompt('Text:', obj.text);
    if (text) {
      var date = prompt('Date:', obj.date);
      data[index].text = text;
      data[index].date = date;
      $(this).remove();
      createNote(obj, index);
    } else {
      data.splice(index, 1);
      $(this).remove();
    }
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

  $window.on('resize', function () {
    canvas[0].width = $window.width();
    canvas[0].height = $window.height();
  });

  $window.resize();

  $('<button id="clear">Clear</button>').on('click', function () {
    setData([]);
  }).appendTo('#container');

  $('<button id="save">Save</button>').on('click', function () {
    var jsonString = JSON.stringify(data);
    window.open('data:text/json,' + encodeURIComponent(jsonString));
  }).appendTo('#container');

  function setData(importedData) {
    data = importedData;
    $('.note').remove();
    data.forEach(function (obj, index) {
      createNote(obj, index);
    });
  }

  $.get('cards.json', function (importData) {
      setData( importData );
  });
})