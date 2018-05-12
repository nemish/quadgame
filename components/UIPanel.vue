<template>
  <div id='ui-panel'>
    <div v-if='item' class='params-container'>Coords: {{item.x}} - {{item.y}}. Level: {{item.level}}</div>
  </div>
</template>

<script>

export default {
  name: 'UIPanel',
  props: {
    item: {
        type: Object
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="stylus">
#ui-panel
    position fixed
    bottom 0
    left 0
    width 100%
    display flex

.params-container
    margin 10px
    padding 10px
    color rgba(0,0,0,0.5)

</style>