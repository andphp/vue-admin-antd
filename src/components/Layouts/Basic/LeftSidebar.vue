<template>
  <a-menu
    mode="inline"
    :collapse="sidebarFold"
    :default-selected-keys="[latestTabMenuId]"
    v-if="latestTopMenuId > 0"
  >
    <left-sidebar-sub
      v-for="menu in menuList"
      v-if="menu.menuId + '' === latestTopMenuId"
      :key="menu.menuId + ''"
      :menu="menu"
      :dynamicMenuRoutes="dynamicMenuRoutes">
    </left-sidebar-sub>
  </a-menu>
  <a-menu
    mode="inline"
    :collapse="sidebarFold"
    :default-selected-keys="[latestTabMenuId]"
    v-else
  >
    <a-menu-item
      class="left-side"
      :key="'-1'"
      @click="gotoRouteHandle({menuId: -1})"
      >
      <a-icon type="compass" />
      <span>仪表盘</span>
    </a-menu-item>
  </a-menu>
</template>

<script>
  import { Menu, Icon } from 'ant-design-vue'
  import LeftSidebarSub from './LeftSidebarSub'

  export default {
    name: 'LeftSidebar',
    data() {
      return {
      }
    },
    props: {
      menuList: {
        type: Array,
        required: true
      },
      dynamicMenuRoutes: {
        type: Array,
        required: true
      }
    },
    components: {
      LeftSidebarSub,
      AMenu: Menu,
      AIcon: Icon,
      AMenuItem: Menu.Item,
      ASubMenu: Menu.SubMenu
    },
    computed: {
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
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
      console.log('mainTabs', this.mainTabs)
    },
    methods: {
      // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
      gotoRouteHandle (menu) {
        let tab = this.mainTabs.find(function(item) {
          return item.menuId === menu.menuId
        })
        if (!tab) {
          tab = {
            menuId: -1,
            name: '仪表盘',
            path: 'home',
            type: 'module',
            iframeUrl: '',
            params: '',
            query: '',
            topNavMenuId: this.latestTopMenuId,
            sidebarOpenSubmenuMenuId: this.latestOpenKey
          }
          this.mainTabs = this.mainTabs.concat(tab)
          sessionStorage.setItem('mainTabs', JSON.stringify(this.mainTabs || '[]'))
        }
        this.latestTabMenuId = menu.menuId + ''
      }
    }
  }
</script>

<style scoped>
  .ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left {
    border-right: none;
  }
</style>
