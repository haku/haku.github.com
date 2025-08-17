(function(){

  document.addEventListener("DOMContentLoaded", function(event) {
    document.getElementById('bg0').onclick = drawFL
    drawFL()
  })

  var W = 1000
  var H = 1000

  var drawFL = function() {
    var seed = rndInt(100000000, 999999999)
    console.log('seed', seed)
    var bbs = blumBlumShubFact(seed, 7247, 7823)
    var eRnd = evenDistFact(bbs)
    var sRnd = sineDistFact(bbs)

    removeElementById('bg0_svg')
    var draw = SVG('bg0')
      .attr('id', 'bg0_svg')
      .size('100%', '100%')
      .viewbox(0, 0, W, H)
      .attr('preserveAspectRatio', 'xMidYMax slice')

    draw.rect(W, H)
      .fill({ opacity: 0 })

    var x = sRnd(50, 100)
    while (x < 950) {
      var h = sRnd(50, 100)
      shroom(draw, sRnd)
        .size(100, h)
        .cx(x).y(H - h)
      x += sRnd(50, 130)
    }

    var leafCount = sRnd(10, 50)
    for (i = 0; i < leafCount; i++) {
      var h = sRnd(10, 20)
      leaf(draw, sRnd)
        .size(h, h)
        .cx(eRnd(0, 1000)).cy(eRnd(0, 1000))
    }
  }

  var shroom = function(draw, rnd) {
    var stalkW = rnd(10, 25)
    var stalkBM = rnd(0, 10) // base margin
    var stalkTopN = Math.min(rnd(5, 15), stalkW / 2) // narrowing
    var stalkS = rnd(-10, 10) // shift / lean
    var leftM = rnd(5, 30)
    var rightM = rnd(5, 30)
    var btmIndent = rnd(-14, 5)
    var btmCornerTweak = (btmIndent < -5 ? 2 : 0)
    var btmH = rnd(0, 45)
    var edgeUp = rnd(0, -5) - (btmH / (100 - leftM - rightM)) * 10
    var rotate = rnd(-20, 20)

    var m = draw.nested().viewbox(0, 0, 100, 100)

    var sPath = ('m 0,0 ' +
        'c ' + stalkTopN + ',0 ' + (-stalkS + stalkTopN) + ',17 ' + (-stalkS + stalkTopN) + ',50 ' +
        '0,17 ' + stalkS + ',20 ' + (stalkS + stalkBM) + ',20 ' +
        'l ' + -(stalkW + stalkBM * 2) + ',0 ' +
        'c 0,0 ' + (-stalkS + stalkBM)  + ',-2 ' + (-stalkS + stalkBM) + ',-20 ' +
        '0,-17 ' + stalkS + ',-50 ' + (stalkS + stalkTopN) + ',-50 z')
    console.log('sPath', sPath)
    var stalkH = 85 - btmH
    m.path(sPath)
      .cx(50).y(100 - stalkH)
      .height(stalkH)
      .fill('#fff')

    var cPath = ('m ' + leftM + ',' + (50 + btmH) + ' ' +
           'c 20,' + btmIndent + ' ' + (80 - (leftM + rightM)) + ',' + btmIndent + ' ' + (100 - (leftM + rightM)) + ',0 ' +
           '5,' + btmCornerTweak + ' 5,-1 -1,' + (-7 + edgeUp) + ' ' +
           'C 50,0 50,0 ' + (leftM + 1) + ',' + (43 + btmH + edgeUp) + ' ' +
           (leftM - 5) + ',' + (49 + btmH) + ' ' + (leftM - 5) + ',' + (50 + btmCornerTweak + btmH) + ' ' + leftM + ',' + (50 + btmH) + ' z')
    console.log('cPath', cPath)
    m.path(cPath)
      .cx(50).y(0)
      .attr('transform', 'rotate(' + rotate + ', 50, 50)')
      .fill('#fff')

    return m
  }

  // m 5,50 c 20,-10 70,-10 90,0 5,2 5,-1 -1,-7 C 50,0 50,0 6,43 0,49 0,52 5,50 z
  // m 65,30 c 0,0 0,17 0,35 0,17 0,35 0,35 l -30,0 c 0,0 0,-17 0,-35 0,-17 0,-35 0,-35 z

  var leaf = function(draw, rnd) {
    var stemW = rnd(0, 2)
    var rotate = rnd(100, 260)
    var skewX = rnd(-15, 15)
    var skewY = rnd(-15, 15)

    var l = draw.nested().viewbox(0, 0, 100, 100)

    var lPath = ('m ' + (49 - stemW) + ',80 ' +
      'c 0,15 0,15 ' + (1 + stemW) + ',15 ' +
      (1 + stemW) + ',0 ' + (1 + stemW) + ',0 ' + (1 + stemW) + ',-15 ' +
      'C ' + (85 + stemW) + ',60 85,45 50,5 ' +
      '15,45 ' + (15 - stemW) + ',60 ' + (49 - stemW) + ',80 z')
    l.path(lPath)
      .cx(50).cy(50)
      .attr('transform', 'rotate(' + rotate + ', 50, 50) skewX(' + skewX + ') skewY(' + skewY + ')')
      .fill('#fff')

    return l
  }

  // m 49,80  c 0,15 0,15 1,15  1,0 1,0 1,-15  C 85,60 85,45 50,5  15,45 15,60 49,80 z
  // m 48,80  c 0,15 0,15 2,15  2,0 2,0 2,-15  C 86,60 85,45 50,5  15,45 14,60 48,80 z

  var removeElementById = function(id) {
    var el = document.getElementById(id)
    if (el) el.parentElement.removeChild(el)
  }

  var rndInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  var blumBlumShubFact = function(seed, mod1, mod2) {
    return function() {
      seed = (seed * seed) % (mod1 * mod2)
      return seed / (mod1 * mod2)
    }
  }

  var evenDistFact = function(rnd) {
    return function(min, max) {
      return Math.floor(rnd() * (max - min)) + min
    }
  }

  var sineDistFact = function(rnd) {
    return function(min, max) {
      var i = rnd()
      var range = max - min
      var x = Math.floor(Math.sin(i * Math.PI) * (range / 2))
      x = i > 0.5 ? range - x : x
      return x + min
    }
  }

})()
