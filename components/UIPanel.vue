<template>
  <div id='ui-panel'>
    <div class='bottom-row'>
        <button class='btn ui-item' @click='nextTurn'>{{nextTurnText}}</button>
        <button :class='["btn", "ui-item", showItems ? "bg-yellow" : "bg-green"]' @click='toggleItems'>{{toggleItemsText}}</button>
        <div class='active-items-container'>
            <transition
                name="custom-classes-transition"
                enter-active-class="animated fadeInDown"
                leave-active-class="animated fadeOutUp"
            >
                <div v-if='showItems' class='items-container'>
                    <active-item v-for='(el, index) in itemsList' :key='el.id' :item=el />
                </div>
            </transition>
            <transition
                name="custom-classes-transition"
                enter-active-class="animated flipInX"
                leave-active-class="animated flipOutX"
            >
                <active-item v-if='focusedItem && !showItems' :item='focusedItem' />
            </transition>
        </div>
    </div>
    <div class='turn-container'>
        <p>TURN: {{currentTurn}}</p>
        <p>ITEMS WITH MP: {{itemsWithMP}}</p>
        <p>TOTAL FREE MP: {{totalMP}}</p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import UIActiveItem from '@/components/UIActiveItem.vue';
import { gameInstance as game } from '@/game';

export default {
  name: 'UIPanel',
  props: {
    focusedItem: {
        type: Object
    },
    items: {
        type: Object
    },
    currentTurn: {
        type: Number
    }
  },
  components: {
    'active-item': UIActiveItem
  },
  data () {
    return {
        showItems: false
    }
  },
  methods: {
    toggleItems() {
        this.showItems = !this.showItems;
    },
    nextTurn() {
        game.watchers('NEXT_TURN');
    }
  },
  computed: {
    itemsWithMP() {
        return this.itemsList.filter(item => item.getRemainingMovePoints() > 0).length;
    },
    totalMP() {
        return this.itemsList.reduce((agg, item) => {
            return agg + item.getRemainingMovePoints();
        }, 0);
    },
    itemsList() {
        return Object.keys(this.items).map(key => this.items[key]);
    },
    nextTurnText() {
        return 'Next turn';
    },
    toggleItemsText() {
        return this.showItems ? 'Hide items' : 'Show items';
    }
  }
}
</script>

<style lang="stylus">
#ui-panel
    line-height 1.2rem
    font-size 1.2rem
    position fixed
    bottom 0
    left 0
    width 100%
    display flex
    backface-visibility hidden
    pointer-events none

.active-items-container
    flex 1
    display flex

.items-container
    display flex
    flex 1

.bottom-row
    display flex
    height 48px

.turn-container
    position absolute
    top -32px
    left 8px

    & p
        margin 0

</style>