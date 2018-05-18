<template>
    <div class='btn ui-item bg-white params-container' @click='focusItem'>
        <div class='svg-icon' v-html='itemAvatar'></div>
        <p>x: {{item.x}} - y: {{item.y}}. lvl: {{item.level}}. MP: {{item.movePoints}}</p>
    </div>
</template>

<script>
export default {
  name: 'UIActiveItem',
  props: {
      item: {
          type: Object,
          required: true
      }
  },
  data () {
    return {
    }
  },
  computed: {
    itemAvatar() {
        return this.item.getNormalizedSvgStr();
    }
  },
  methods: {
    focusItem() {
        this.item.focusInView();
    }
  }
}
</script>

<style lang="stylus">

.params-container
    margin 8px
    color rgba(0,0,0,0.5)
    border-radius 5px
    background #fff
    box-shadow 0 1px 3px 0 rgba(0,0,0,0.3)
    display flex
    align-items center
    justify-content center

    & p
        margin 0

.svg-icon
    height 32px
    display flex
    margin-right 5px

    & *
        margin auto

</style>