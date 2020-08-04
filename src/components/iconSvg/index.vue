<template>
  <a-icon
    :component="IconSvgComponent"
    :type="type"
    :theme="theme"
    :spin="spin"
    :rotate="rotate"
    :twoToneColor="twoToneColor" />
</template>

<script>
  import _import from './index.js'
  import { Icon } from 'ant-design-vue'

  export default {
    name: 'IconSvg',
    components: {
      AIcon: Icon
    },
    props: {
      name: {
        type: String
      },
      type: {
        type: Object
      },
      theme: {
        type: String
      },
      spin: {
        type: Boolean
      },
      rotate: {
        type: Number
      },
      twoToneColor: {
        type: String
      }
    },
    computed: {
      IconSvgComponent() {
        return _import(this.name)
      }
    }
  }
</script>

<style>
  .icon-svg {
    width: 1em;
    height: 1em;
    fill: currentColor;
    overflow: hidden;
  }
</style>
