var board = null;
var game = new Chess();

var DEPTH = 3;

function makeComputerMove() {
  var move = bestMove(DEPTH);
  game.move(move);
  board.position(game.fen());
}

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;

  if (piece.search(/^b/) !== -1) return false;
}

function onDrop(source, target) {
  var move = game.move({
    from: source,
    to: target
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
