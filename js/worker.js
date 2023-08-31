importScripts('chess.js');
importScripts('main.js');

var game = null;
var DEPTH = 3;

self.addEventListener('message', function(e) {
    game = new Chess(e.data);
    var move = bestMove(DEPTH);
    self.postMessage(move);
});
