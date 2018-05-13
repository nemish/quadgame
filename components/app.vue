<template>
  <div id='game'>
    <ui-panel :focusedItem='focusedItem' :items='items' :currentTurn='currentTurn'></ui-panel>
  </div>
</template>

<script>
import './app.styl';
import 'animate.css';
import UIPanel from '@/components/UIPanel.vue';
import { createGameInstance } from '@/game';


export default {
  data () {
    return {
        focusedItem: null,
        items: {},
        turn: 1
    }
  },
  components: {
    'ui-panel': UIPanel
  },
  computed: {
    currentTurn() {
        return this.turn;
    }
  },
  mounted() {
    this.game = createGameInstance({root: 'game'});
    this.game.init();
    this.items = this.game.playableObjects;

    this.game.on('ITEM_FOCUSED', (focusedItem) => {
        this.focusedItem = focusedItem;
    });

    this.game.on('ITEM_UNFOCUSED', () => {
        this.focusedItem = null;
    });

    this.game.on('NEXT_TURN', () => {
        this.turn = this.game.currentTurn;
    })
  }
}
</script>

<style lang="stylus">
#game
  font-family 'Cairo', sans-serif
  height 100%
  width 100%
  background #eee
  user-select none
</style>