(function(undefined) {
  'use strict';

  /**
   * Realtime Utilities
   * ===================
   *
   * Realtime abstraction to plug socket.io into domino.
   */

  // Connecting
  var socket = io.connect();

  // Functions namespace
  // TODO: generalize?
  var _realtime = {
    connect: function(url, cb) {
      socket.get(url, cb);
    },
    domino: function(game_id) {
      return {
        module: function() {
          domino.module.call(this);
          var _this = this;

          socket.on('game', function(e) {
            if (e.verb === 'updated')
              _this.dispatchEvent('realtime.receive', e.data);
          });
        },
        hacks: [
          {
            triggers: 'realtime.receive',
            method: function(e) {
              this.dispatchEvent(e.data.head, e.data.body);
            }
          },
          {
            triggers: 'realtime.send',
            method: function(e) {

              // Sending through socket
              socket.post('/playground/' + game_id + '/message', {
                id: this.get('gameId'),
                debug: this.get('debug'),
                head: e.data.head,
                body: (e.data.body !== undefined) ? e.data.body : null
              });
            }
          }
        ]
      };
    }
  };

  // Firehose Debug
  if (mtgnode.config.realtime.debug)
    socket.get('/firehose', function() {

      console.log('Firehose online...');

      // Attach a listener which fires every time Sails publishes
      // message to the firehose.
      socket.on('firehose', function(m) {
        console.log('FIREHOSE (debug): Sails published a message ::\n', m);
      });
    });

  /**
   * Exporting
   * ----------
   */
  this.realtime = _realtime;
  this.socket = socket;
}).call(this);
