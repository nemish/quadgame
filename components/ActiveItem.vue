<template>
    <div class='btn bg-white params-container' @click='focusItem(el)'>
        <div class='svg-icon' v-html='el.getNormalizedSvgStr()'></div>
        <p>x: {{el.x}} - y: {{el.y}}. lvl: {{el.level}}. MP: {{el.movePoints}}</p>
    </div>
</template>

<script>
export default {
  name: 'ActiveItem',
  props: {
      el: {
          type: Object,
          required: true
      }
  },
  data () {
    return {
    }
  },
  methods: {
    focusItem(item) {
        item.scrollIntoView();
    }
  }
}
</script>

<style lang="stylus">

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

</style>