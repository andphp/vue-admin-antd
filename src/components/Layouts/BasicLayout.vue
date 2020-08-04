<template>
  <a-layout id="basic-layout">
    <a-layout-sider theme="light"  v-model="sidebarFold" :trigger="null" collapsible :style="sidebarLeft">
       <div class="logo" >
        <img src="@/assets/logo.jpg" alt="" class="logo-img">
         <span v-if="!sidebarFold" style="font-size: 28px;font-weight: bold;letter-spacing: 4px;color: rgba(0, 0, 0, 0.6)">管理系统</span>
      </div>
<!--  左边主导航栏  -->
      <left-sidebar :menu-list="menuList" :dynamicMenuRoutes="dynamicMenuRoutes"></left-sidebar>
    </a-layout-sider>
    <a-layout class="layout" style="padding-left: 0;min-height: 100vh;">
      <a-layout-header style="background: #fff; padding: 0 0;">
        <a-icon
          class="trigger"
          :type="sidebarFold ? 'menu-unfold' : 'menu-fold'"
          @click="() => (sidebarFold = !sidebarFold)"
        />
        <div style="line-height:64px;flex:1;">
<!--     右边导航栏     -->
          <top-nav :menu-list="menuList"></top-nav>
        </div>
        <div class="avatar">
          <avatar-dropdown :menu="showDropdownMenu" :current-user="currentUser" />
        </div>
      </a-layout-header>
      <a-layout-content>
        <main-content></main-content>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>

import { Layout, Menu, Icon, Tabs } from 'ant-design-vue'
import AvatarDropdown from './Basic/AvatarDropdown'
import TopNav from './Basic/TopNav'
import LeftSidebar from './Basic/LeftSidebar'
import MainContent from './Basic/MainContent'
import { isURL } from '@/utils/validate'

export default {
  name: 'BasicLayout',
  components: {
    ALayout: Layout,
    AMenu: Menu,
    AIcon: Icon,
    AMenuItem: Menu.Item,
    ALayoutHeader: Layout.Header,
    ALayoutContent: Layout.Content,
    ALayoutSider: Layout.Sider,
    ATab: Tabs,
    ATabPane: Tabs.TabPane,
    AvatarDropdown,
    TopNav,
    LeftSidebar,
    MainContent
  },
  data () {
    return {
      collapsed: false,
      showDropdownMenu: true,
      currentUser: {
        userName: 'daxiong',
        avatar: ''
      },
      dynamicMenuRoutes: []
    }
  },
  created () {
    if (!this.latestTopMenuId) {
      this.latestTopMenuId = (sessionStorage.getItem('LatestTopMenuId') || '-1')
    }
    if (!this.latestTabMenuId) {
      this.latestTabMenuId = (sessionStorage.getItem('LatestTabMenuId') || '23')
    }
    if (!this.sidebarOpenKey || this.sidebarOpenKey.length === 0) {
      this.sidebarOpenKey = JSON.parse(sessionStorage.getItem('sidebarOpenKey') || '[]')
    }
    if (!this.latestOpenKey) {
      this.latestOpenKey = (sessionStorage.getItem('LatestOpenKey') || '')
    }
    if (!this.mainTabs || this.mainTabs.length === 0) {
      this.mainTabs = JSON.parse(sessionStorage.getItem('mainTabs') || '[]')
    }
    this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
    this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
    this.routeHandle(this.$route)
  },
  computed: {
    sidebarFold: {
      get () {
        return this.$store.state.common.sidebarFold
      },
      set (val) {
        this.$store.commit('common/updateSidebarFold', val)
      }
    },
    menuList: {
      get () {
        return this.$store.state.common.menuList
      },
      set (val) {
        this.$store.commit('common/updateMenuList', val)
      }
    },
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    },
    latestTabMenuId: {
      get () { return this.$store.state.common.latestTabMenuId },
      set (val) { this.$store.commit('common/updateLatestTabMenuId', val) }
    },
    latestTopMenuId: {
      get () { return this.$store.state.common.latestTopMenuId },
      set (val) { this.$store.commit('common/updateLatestTopMenuId', val) }
    },
    latestOpenKey: {
      get () { return this.$store.state.common.latestOpenKey },
      set (val) { this.$store.commit('common/updateLatestOpenKey', val) }
    },
    sidebarOpenKey: {
      get () { return this.$store.state.common.sidebarOpenKey },
      set (val) { this.$store.commit('common/updateSidebarOpenKey', val) }
    },
    sidebarLeft () {
      if (this.sidebarFold) {
        return {
          flex: '0 0 80px',
          maxWidth: '80px',
          minWidth: '80px',
          width: '80px'
        }
      } else {
        return {
          flex: '0 0 256px',
          maxWidth: '256px',
          minWidth: '256px',
          width: '256px'
        }
      }
    }
  },
  watch: {
    $route: 'routeHandle'
  },
  methods: {
    // 获取当前管理员信息
    getUserInfo () {
      this.$store
        .dispatch('GetInfo')
        .then((data) => {
          if (data && data.code === 0) {
            this.loading = false
            this.currentUser.userId = data.result.user.userId
            this.currentUser.userName = data.result.user.username
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 路由操作
    routeHandle (route) {
      if (route.meta.isTab) {
        // tab选中, 不存在先添加
        let tab = this.mainTabs.filter(item => item.menuId + '' === route.meta.menuId + '')[0]
        if (!tab) {
          if (route.meta.isDynamic) {
            route = this.dynamicMenuRoutes.filter(item => item.meta.menuId + '' === route.meta.menuId + '')[0]
            if (!route) {
              return console.error('未能找到可用标签页!')
            }
          }
          tab = {
            menuId: route.meta.menuId || '',
            name: route.meta.name,
            path: route.name,
            type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
            iframeUrl: route.meta.iframeUrl || '',
            params: route.params,
            query: route.query,
            topNavMenuId: this.latestTopMenuId,
            sidebarOpenSubmenuMenuId: this.latestOpenKey
          }
          this.mainTabs = this.mainTabs.concat(tab)
        }
        this.latestTabMenuId = tab.menuId + ''
      }
    }
  }
}
</script>
<style scoped>
  .ant-layout{
    background: transparent;
  }
  #basic-layout .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  #basic-layout .trigger:hover {
    color: #1890ff;
  }

  #basic-layout .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 0;
  }
  .layout .ant-layout-header {
    display: flex;
    justify-content: space-between;
  }
  .ant-menu-horizontal {
    border-bottom: 0;
  }
  .avatar {
    margin-right: 16px;
  }
  .logo{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .logo-img{
    width: 50px;
    height: 50px;
  }
</style>
