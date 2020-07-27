var board = null;
var game = new Chess();

Array.prototype.shuffle = function() {
  for (var i = 0; i < this.length; i++) {
    var j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }

  return this;
}

function bestMove(depth) {
  var [move, _] = miniMax('b', 'w', depth)
  return move;
}

function miniMax(player, opponent, depth) {
  var best = [null, null];
  var moves = game.moves().shuffle();
  if (depth == 0 || moves.length == 0) {
    var score = evaluateGame(player);
    return [null, score];
  }

  for (var m of moves) {
    game.move(m);
    var [_, score] = miniMax(opponent, player, depth - 1);
    game.undo();

    if (best[1] == null) {
      best = [m, score];
    }

    if (-score > best[1]) {
      best = [m, -score];
    }
  }

  return best;
}

function evaluateGame(player) {
  var pieceValue = {
    'p': 1,
    'n': 10,
    'b': 10,
    'r': 100,
    'q': 10000,
    'k': 100000,
  }
  var value = 0;
  game.board().forEach(function(row) {
    row.forEach(function(piece) {
      if (!piece) return;

      value += pieceValue[piece['type']] * (piece['color'] == player ? 1 : -1)
    });
  });

  return value;
}

function makeComputerMove() {
  var move = bestMove(2);
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
