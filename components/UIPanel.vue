<template>
  <div id='ui-panel'>
    <button class='btn' @click='nextTurn'>{{nextTurnText}}</button>
    <button class='btn bg-green' @click='toggleItems'>Show items</button>
    <div v-if='showItems' class='items-container'>
        <div class='active-item' v-for='(item, index) in itemsList' :key='item.id'>
            <div v-html='item.getNormalizedSvgStr()'></div>
        </div>
    </div>
    <div class='turn-container'>TURN: {{currentTurn}}</div>
    <transition
        name="custom-classes-transition"
        enter-active-class="animated flipInX"
        leave-active-class="animated flipOutX"
    >
        <div v-if='item' class='params-container'>Coords: {{item.x}} - {{item.y}}. Level: {{item.level}}</div>
    </transition>
  </div>
</template>

<script>
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
    itemsList() {
        return Object.keys(this.items).map(key => this.items[key]);
    },
    nextTurnText() {
        return 'Next turn';
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
    margin 10px
    padding 10px
    color rgba(0,0,0,0.5)
    border-radius 5px
    background #fff
    box-shadow 0 1px 3px 0 rgba(0,0,0,0.3)

.turn-container
    position absolute
    top -10px
    left 10px

btnFactory(bgColor)
    outline 0
    margin 10px
    padding 10px
    font-size 1.2rem
    border 0
    color rgba(255,255,255,0.5)
    border-radius 5px
    background-color bgColor
    box-shadow 0 1px 3px 0 rgba(0,0,0,0.3)
    cursor pointer
    transition color .5s, background-color .5s
    &:hover
        color rgba(255,255,255,0.8)
        background-color darken(@background-color, 10%)

.btn
    btnFactory(#5A73EE)

.bg-green
    background-color #36BF4C
    &:hover
        color rgba(255,255,255,0.8)
        background-color darken(#36BF4C, 10%)

</style>