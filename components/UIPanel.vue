<template>
  <div id='ui-panel'>
    <div class='bottom-row'>
        <button class='btn' @click='nextTurn'>{{nextTurnText}}</button>
        <button :class='["btn", showItems ? "bg-yellow" : "bg-green"]' @click='toggleItems'>{{toggleItemsText}}</button>
        <transition
            name="custom-classes-transition"
            enter-active-class="animated flipInX"
            leave-active-class="animated flipOutX"
        >
            <div v-if='showItems' class='items-container'>
                <div class='active-item' v-for='(el, index) in itemsList' :key='el.id'>
                    <active-item :el=el />
                </div>
            </div>
        </transition>
        <transition
            name="custom-classes-transition"
            enter-active-class="animated flipInX"
            leave-active-class="animated flipOutX"
        >
            <active-item v-if='item && !showItems' :el=item />
        </transition>
    </div>
    <div class='turn-container'>TURN: {{currentTurn}}</div>
  </div>
</template>

<script>
import Vue from 'vue';
import ActiveItem from '@/components/ActiveItem.vue';
import { gameInstance as game } from '@/game';

export default {
  name: 'UIPanel',
  props: {
    item: {
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
    'active-item': ActiveItem
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
    },
    focusItem(item) {
        item.scrollIntoView();
    }
  },
  computed: {
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

.params-container
    margin 8px
    padding 8px
    color rgba(0,0,0,0.5)
    border-radius 5px
    background #fff
    box-shadow 0 1px 3px 0 rgba(0,0,0,0.3)
    display flex
    align-items center
    justify-content center

    & p
        margin 0

.bottom-row
    display flex
    height 64px

.svg-icon
    height 32px


.turn-container
    position absolute
    top -8px
    left 8px

</style>