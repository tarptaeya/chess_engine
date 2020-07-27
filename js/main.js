Array.prototype.shuffle = function() {
  for (var i = 0; i < this.length; i++) {
    var j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }

  return this;
}

function bestMove(depth) {
  var [move, _] = miniMax('b', 'w', depth, -Infinity, Infinity)
  return move;
}

function miniMax(player, opponent, depth, alpha, beta) {
  var best = [null, null];
  var moves = game.moves().shuffle();
  if (depth == 0 || moves.length == 0) {
    var score = evaluateGame('b');
    return [null, score];
  }

  for (var m of moves) {
    game.move(m);
    var [_, score] = miniMax(opponent, player, depth - 1, alpha, beta);
    game.undo();

    if (best[1] == null) {
      best = [m, score];
    }

    if (player == 'b') {
      if (score > best[1]) {
        best = [m, score];
      }

      alpha = Math.max(alpha, score);
    } else {
      if (score < best[1]) {
        best = [m, score];
      }

      beta = Math.min(beta, score);
    }

    if (alpha >= beta) break;
  }

  return best;
}

function evaluateGame(player) {
  var pieceValue = {
    'p': 100,
    'n': 350,
    'b': 350,
    'r': 525,
    'q': 1000,
    'k': 10000,
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
