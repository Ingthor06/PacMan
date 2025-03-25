// canvas er breyta sem geymir vísun á <canvas> í html skrá.
let canvas = document.getElementById('tutorial');
let ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(200, 0, 0)';  // rauður fylltur litur
ctx.fillRect(10, 10, 50, 50);      // rétthyrningur með rauðum fylltum lit