<template>
  <a-menu
    mode="inline"
    :open-keys='sidebarOpenKey'
    :default-selected-keys="[latestTabMenuId]"
    :selected-keys="[latestTabMenuId]"
    @openChange="onOpenChange"
  >
    <a-sub-menu
      v-if="menu.list && menu.list.length >= 1 && latestTopMenuId !== menu.menuId + ''"
      :index="menu.menuId + ''"
      :key="menu.menuId + ''"
    >
      <template slot="title">
        <span>{{ menu.name }}</span>
      </template>
      <left-sidebar-sub
        v-for="item in menu.list"
        :key="item.menuId + ''"
        :menu="item"
        :dynamicMenuRoutes="dynamicMenuRoutes">
      ></left-sidebar-sub>
    </a-sub-menu>
    <template
      v-else-if="menu.list && menu.list.length >= 1 && latestTopMenuId === menu.menuId + ''"
      v-for="item in menu.list"
      :index="item.menuId + ''"
    >
      <a-sub-menu
        v-if="item.list && item.list.length >= 1"
        :index="item.menuId + ''"
        :key="item.menuId + ''"
      >
        <template slot="title" class="left-side">
          <icon-font :name="item.icon || 'icon-zhedie'" />
          <span>{{ item.name }}</span>
        </template>
        <left-sidebar-sub
          v-for="itemMenu in item.list"
          :key="itemMenu.menuId + ''"
          :menu="itemMenu"
          :dynamicMenuRoutes="dynamicMenuRoutes">
          ></left-sidebar-sub>
      </a-sub-menu>
      <a-menu-item
        class="left-side"
        v-else
        :key="item.menuId + ''"
        :index="item.menuId + ''"
        @click="gotoRouteHandle(item)">
        <icon-font :name="item.icon || 'icon-zhedie'" />
        <span>{{ item.name }}</span>
      </a-menu-item>
    </template>
    <a-menu-item v-else :key="menu.menuId + ''" :index="menu.menuId + ''" @click="gotoRouteHandle(menu)">
      <icon-font v-if="!sidebarFold" class="sub-span" :name="menu.icon || 'icon-zhedie'" />
      <span>{{ menu.name }}</span>
    </a-menu-item>
  </a-menu>
</template>

<script>
  import { Menu, Icon, Button } from 'ant-design-vue'
  import IconFont from '@/components/iconSvg/index.vue'
  import { isURL } from '../../../utils/validate'
  export default {
    name: 'LeftSidebarSub',
    components: {
      AMenu: Menu,
      AMenuItem: Menu.Item,
      ASubMenu: Menu.SubMenu,
      AIcon: Icon,
      IconFont: IconFont,
      AButton: Button
    },
    data() {
      return {
      }
    },
    props: {
      menu: {
        type: Object,
        required: true
      },
      dynamicMenuRoutes: {
        type: Array,
        required: true
      }
    },
    computed: {
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold }
      },
      latestTopMenuId: {
        get () { return this.$store.state.common.latestTopMenuId },
        set (val) { this.$store.commit('common/updateLatestTopMenuId', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      latestTabMenuId: {
        get () { return this.$store.state.common.latestTabMenuId },
        set (val) { this.$store.commit('common/updateLatestTabMenuId', val) }
      },
      sidebarOpenKey: {
        get () { return this.$store.state.common.sidebarOpenKey },
        set (val) { this.$store.commit('common/updateSidebarOpenKey', val) }
      },
      mainSubmenuKeyList: {
        get () { return this.$store.state.common.mainSubmenuKeyList },
        set (val) { this.$store.commit('common/updateMainSubmenuKeyList', val) }
      },
      latestOpenKey: {
        get () { return this.$store.state.common.latestOpenKey },
        set (val) { this.$store.commit('common/updateLatestOpenKey', val) }
      }
    },
    created () {
      if (this.menu.list && this.menu.list.length > 0) {
        this.menu.list.forEach((item) => {
          if (item.list && item.list.length > 0 && this.mainSubmenuKeyList.indexOf(item.menuId + '') === -1) {
            this.mainSubmenuKeyList.push(item.menuId + '')
          }
        })
      }
    },
    methods: {
      // 打开/折叠 侧边栏 二级菜单
      onOpenChange(openKeys) {
        this.latestOpenKey = openKeys.find(key => this.sidebarOpenKey.indexOf(key) === -1)
        if (this.mainSubmenuKeyList.indexOf(this.latestOpenKey) === -1) {
          this.sidebarOpenKey = openKeys
        } else {
          this.sidebarOpenKey = this.latestOpenKey ? [this.latestOpenKey] : []
        }
        sessionStorage.setItem('sidebarOpenKey', JSON.stringify(this.sidebarOpenKey || '[]'))
      },
      // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
      gotoRouteHandle (menu) {
        const isTab = this.mainTabs.find(function(item) {
          return item.menuId === menu.menuId
        })
        const route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === menu.menuId)
        if (!isTab && menu.type !== 3) {
          menu.topNavMenuId = this.latestTopMenuId
          if (menu.parentId && menu.parentId + '' === this.latestOpenKey) {
            menu.sidebarOpenSubmenuMenuId = this.latestOpenKey
          }
          if (route.length >= 1) {
            menu.path = route[0].name
          }
          this.mainTabs.push(menu)
          sessionStorage.setItem('mainTabs', JSON.stringify(this.mainTabs || '[]'))
        }
        this.latestTabMenuId = menu.menuId + ''
        if (route.length >= 1) {
          this.$router.push({ name: route[0].name })
        }
        if (menu.type === 3 && menu.redirect) {
          if (isURL(menu.redirect)) {
            window.open(menu.redirect, '_blank')
          } else {
            this.$router.push({ name: menu.redirect })
          }
        }
      }
    }
  }
</script>

<style scoped>
  .center{
    display: flex;
    align-items: center;
    height: 100%;
    overflow: hidden;
  }
  .ant-menu-inline-collapsed {
    width: 102%;
  }
  .sub-span {
    padding-left: 24px;
  }
  .ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left{
    border-right: none;
  }
</style>
