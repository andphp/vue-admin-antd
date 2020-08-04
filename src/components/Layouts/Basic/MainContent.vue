<template>
  <div class="card-container">
      <a-tabs
        v-if="mainTabs.length > 0"
        v-model="latestTabMenuId"
        hide-add
        type="editable-card"
        @edit="onEdit"
        @change="changeTabsActive"
        :tabBarExtraContent="tabBarExtraContent"
        :forceRende="false"
       >
        <a-tab-pane class="tab-pane-class" v-for="pane in mainTabs" :key="pane.menuId + ''" :tab="pane.name" :closable="pane.closable">
          <keep-alive>
            <router-view v-if="pane.menuId + '' === latestTabMenuId" />
          </keep-alive>
        </a-tab-pane>
      </a-tabs>
      <router-view v-else />
  </div>
</template>
<script>
  import { Tabs, Dropdown, Menu, Button, Icon } from 'ant-design-vue'
  export default {
    name: 'MainContent',
    components: {
      ATabs: Tabs,
      ATabPane: Tabs.TabPane,
      AMenu: Menu,
      AMenuItem: Menu.Item,
      ADropdown: Dropdown,
      AButton: Button,
      AIcon: Icon
    },
    data () {
      return {
      }
    },
    computed: {
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      latestTopMenuId: {
        get () { return this.$store.state.common.latestTopMenuId },
        set (val) { this.$store.commit('common/updateLatestTopMenuId', val) }
      },
      mainSubmenuKeyList: {
        get () { return this.$store.state.common.mainSubmenuKeyList },
        set (val) { this.$store.commit('common/updateMainSubmenuKeyList', val) }
      },
      latestTabMenuId: {
        get () { return this.$store.state.common.latestTabMenuId },
        set (val) { this.$store.commit('common/updateLatestTabMenuId', val) }
      },
      latestOpenKey: {
        get () { return this.$store.state.common.latestOpenKey },
        set (val) { this.$store.commit('common/updateLatestOpenKey', val) }
      },
      sidebarOpenKey: {
        get () { return this.$store.state.common.sidebarOpenKey },
        set (val) { this.$store.commit('common/updateSidebarOpenKey', val) }
      }
    },
    created () {
    },
    methods: {
      tabBarExtraContent() {
        return <div style="margin-right:16px;">
          <a-dropdown
            placement="bottomRight"
          >
            <a-button style="margin-left: 8px;height: 36px;">
              <a-icon type="eye-invisible" />关闭
              <a-icon type="down" /> </a-button>
            <a-menu slot="overlay">
              <a-menu-item>
                <a target="_blank" rel="noopener noreferrer" onClick={this.closeLeft}
                ><a-icon type="double-left" /> 关闭左侧</a
                >
              </a-menu-item>
              <a-menu-item>
                <a target="_blank" rel="noopener noreferrer" onClick={this.closeRight}
                ><a-icon type="double-right" /> 关闭右侧</a
                >
              </a-menu-item>
              <a-menu-item>
                <a target="_blank" rel="noopener noreferrer" onClick={this.closeOther}
                ><a-icon type="close" /> 关闭其他</a
                >
              </a-menu-item>
              <a-menu-item>
                <a target="_blank" rel="noopener noreferrer" onClick={this.closeAll}
                ><a-icon type="close-circle" /> 关闭所有</a
                >
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      },
      closeLeft() {
        try {
          const activeKey = this.latestTabMenuId
          this.mainTabs.forEach((pane, i) => {
            if (pane.menuId + '' === activeKey) {
              this.mainTabs.splice(0, i)
              throw new Error('EndIterative')
            }
          })
        } catch (e) {
          if (e.message !== 'EndIterative') throw e
        }
        // 下面的代码不影响继续执行
        sessionStorage.setItem('mainTabs', JSON.stringify(this.mainTabs))
      },
      closeRight() {
        try {
          const activeKey = this.latestTabMenuId
          this.mainTabs.forEach((pane, i) => {
            if (pane.menuId + '' === activeKey) {
              this.mainTabs.splice(i + 1, this.mainTabs.length - (i + 1))
              throw new Error('EndIterative')
            }
          })
        } catch (e) {
          if (e.message !== 'EndIterative') throw e
        }
        // 下面的代码不影响继续执行
        sessionStorage.setItem('mainTabs', JSON.stringify(this.mainTabs))
      },
      closeOther() {
        this.mainTabs = this.mainTabs.filter(pane => pane.menuId + '' === this.latestTabMenuId)
        sessionStorage.setItem('mainTabs', JSON.stringify(this.mainTabs))
      },
      closeAll() {
        this.mainTabs = []
        sessionStorage.setItem('mainTabs', JSON.stringify(this.mainTabs))
      },
      onEdit(targetKey, action) {
        this[action](targetKey)
      },
      remove(targetKey) {
        let activeKey = this.latestTabMenuId
        let lastIndex
        this.mainTabs.forEach((pane, i) => {
          if (pane.menuId + '' === targetKey) {
            lastIndex = i - 1
          }
        })
        const panes = this.mainTabs.filter(pane => pane.menuId + '' !== targetKey)
        if (panes.length && activeKey === targetKey) {
          if (lastIndex >= 0) {
            activeKey = panes[lastIndex].menuId + ''
          } else {
            activeKey = panes[0].menuId + ''
          }
        }
        this.mainTabs = panes
        this.latestTabMenuId = activeKey
        this.changeTabsActive(activeKey)
      },
      changeTabsActive(tabsActive) {
        const subActive = this.mainTabs.filter(tab => tab.menuId + '' === tabsActive)[0]
        if (subActive) {
          this.latestTopMenuId = subActive.topNavMenuId
        }
        this.latestTabMenuId = tabsActive
        if (subActive.sidebarOpenSubmenuMenuId) {
          this.onOpenChange([subActive.sidebarOpenSubmenuMenuId])
        } else {
          this.onOpenChange([])
        }
        if (subActive.path && subActive.path !== this.$route.name) {
          this.$nextTick(() => {
            this.$router.push({ name: subActive.path })
          })
        }
      },
      onOpenChange(openKeys) {
        this.latestOpenKey = openKeys.find(key => this.sidebarOpenKey.indexOf(key) === -1)
        if (this.mainSubmenuKeyList.indexOf(this.latestOpenKey) === -1) {
          this.sidebarOpenKey = openKeys
        } else {
          this.sidebarOpenKey = this.latestOpenKey ? [this.latestOpenKey] : []
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .card-container {
    background: #f5f5f5;
    overflow: hidden;
    min-height: 93vh;
    margin: 5px 0 0 1px;
  }
  .card-container > .ant-tabs-card > .ant-tabs-content {
    height: 120px;
    margin-top: -16px;
  }

  .card-container > .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
    background: #fff;
    padding: 16px;
    margin-left: 16px;
    margin-right: 16px;
    width: auto;
    border-radius: 5px;
  }

  .card-container > .ant-tabs-card > .ant-tabs-bar {
    border-color: #fff;
  }

  .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
    border-color: transparent;
    background: transparent;
  }

  .card-container > .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
    background: #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
  }
  .ant-dropdown-menu {
    margin-top: 5px;
  }
  .card-container /deep/ .ant-tabs-bar {
    background: #fff;
  }
  .card-container /deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    background: #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
  }
</style>
