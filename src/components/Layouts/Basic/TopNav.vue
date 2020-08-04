<template>
  <a-menu mode="horizontal"  :default-selected-keys="[latestTopMenuId]" :selected-keys="[latestTopMenuId]">
    <a-menu-item :key="'-1'" @click="updateMenuActive({menuId: -1})">
      <a-icon type="compass" :style="{ fontSize: '16px' }" /> <span>仪表盘</span>
    </a-menu-item>
    <a-menu-item v-for="item in menuList" :key="item.menuId + ''" @click="updateMenuActive(item)">
      <template class="left-side">
        <div class="center">
          <icon-font :name="item.icon || 'icon-zhedie'" :style="{ fontSize: '16px' }" /> <span>{{item.name}}</span>
        </div>
      </template>
    </a-menu-item>
  </a-menu>
</template>

<script>
  import { Menu, Icon } from 'ant-design-vue'
  import IconFont from '@/components/iconSvg/index.vue'
  export default {
    name: 'TopNav',
    components: {
      AMenu: Menu,
      AMenuItem: Menu.Item,
      ASubMenu: Menu.SubMenu,
      IconFont: IconFont,
      AIcon: Icon
    },
    props: {
      menuList: {
        type: Array,
        required: true
      }
    },
    computed: {
      latestTopMenuId: {
        get () { return this.$store.state.common.latestTopMenuId },
        set (val) { this.$store.commit('common/updateLatestTopMenuId', val) }
      },
      latestTabMenuId: {
        get () { return this.$store.state.common.latestTabMenuId },
        set (val) { this.$store.commit('common/updateLatestTabMenuId', val) }
      }
    },
    created () {
    },
    methods: {
      updateMenuActive(item) {
        this.latestTopMenuId = item.menuId + ''
        if (item.list && item.list.length > 0) {
          this.latestTabMenuId = item.list[0].menuId + ''
        }
        if (item.menuId === -1) {
          this.latestTabMenuId = item.menuId + ''
        }
      }
    }
  }
</script>

<style scoped>
  .icon-left {
    margin-left: 6px;
    display: inline-block;
  }
  .ant-menu-horizontal{
    border: none;
    line-height: 64px;
  }
  .center{
    line-height:64px;
    display: flex;
    align-items: center;
  }
</style>
