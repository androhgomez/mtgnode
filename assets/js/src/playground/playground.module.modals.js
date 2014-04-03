(function(undefined) {
  'use strict';

  /**
   * Playground Modals Modules
   * ==========================
   *
   * The modals to display to help the player in his choices.
   */

  function DeckChoiceModal() {
    domino.module.call(this);
    var _this = this;

    // Selectors
    var $modal = $('#deck_choice_modal'),
        $select = $('#deck_select'),
        $choice = $('#deck_validate');

    // Emettor
    //---------
    $choice.click(function() {

      var deck_id = $select.val();

      _this.dispatchEvent('my-deck.selected', deck_id);
      _this.dispatchEvent('realtime.send', {
        head: 'op-deck.selected',
        body: deck_id
      });

      $modal.modal('hide');
    });

    // Receptor
    //----------
    this.triggers.events['deck.choice'] = function(d) {

      // Showing modal
      $modal.modal('show');
    }
  }

  /**
   * Exporting
   * ----------
   */
  utilities.pkg('playground.modules.modals', {
    deckChoice: DeckChoiceModal
  });
}).call(this);
