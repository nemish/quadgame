<template>
  <div id='game'>
    <ui-panel :item='item'></ui-panel>
  </div>
</template>

<script>
import './app.styl';
import UIPanel from '@/components/UIPanel.vue';
import { createGameInstance } from '@/game';


export default {
  data () {
    return {
        item: null
    }
  },
  components: {
    'ui-panel': UIPanel
  },
  mounted() {
    this.game = createGameInstance({root: 'game'});
    this.game.init();
    this.game.on('ITEM_FOCUSED', (item) => {
        this.item = item;
    });

    this.game.on('ITEM_UNFOCUSED', () => {
        this.item = null;
    });
  }
}
</script>

<style lang="stylus">
#game
  height 100vh
  width 100vw
  background #eee
  user-select none
</style>