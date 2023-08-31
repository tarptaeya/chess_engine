var board = null;
var game = new Chess();

var curtain = document.getElementById('curtain');

function makeComputerMove() {
  curtain.style.display = 'block';
  var worker = new Worker('js/worker.js');
  worker.addEventListener('message', function(e) {
    var move = e.data;
    game.move(move);
    board.position(game.fen());
    worker.terminate();
    curtain.style.display = 'none';
  });
  worker.postMessage(game.fen());
}

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;

  if (piece.search(/^b/) !== -1) return false;
}

function onDrop(source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q',
  });

  if (move == null) return 'snapback';

  window.setTimeout(makeComputerMove, 250);
}

function onSnapEnd() {
  board.position(game.fen());
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
};

board = Chessboard('my_board', config);
