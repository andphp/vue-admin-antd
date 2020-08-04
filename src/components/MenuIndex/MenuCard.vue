<template>
  <a-col :span="6">
    <a-card hoverable @click="gotoRouteHandle(menu)" :loading="!menu">
      <a-card-meta :title="menu.name" :description="menu.description">
        <icon-font slot="avatar" :name="menu.icon || 'icon-zhedie'" :style="{ fontSize: '24px', paddingTop: '10px'}"/>
      </a-card-meta>
    </a-card>
  </a-col>
</template>

<script>
  import { Row, Col, Card } from 'ant-design-vue'
  import IconFont from '@/components/iconSvg/index.vue'
  export default {
    name: 'MenuCard',
    components: {
      ARow: Row,
      ACard: Card,
      ACardMeta: Card.Meta,
      ACol: Col,
      IconFont: IconFont
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
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      latestTopMenuId: {
        get () { return this.$store.state.common.latestTopMenuId },
        set (val) { this.$store.commit('common/updateLatestTopMenuId', val) }
      },
      latestTabMenuId: {
        get () { return this.$store.state.common.latestTabMenuId },
        set (val) { this.$store.commit('common/updateLatestTabMenuId', val) }
      },
      latestOpenKey: {
        get () { return this.$store.state.common.latestOpenKey },
        set (val) { this.$store.commit('common/updateLatestOpenKey', val) }
      }
    },
    methods: {
      // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
      gotoRouteHandle (menu) {
        const isTab = this.mainTabs.find(function(item) {
          return item.menuId === menu.menuId
        })
        const route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === menu.menuId)
        if (route.length >= 1) {
          this.$router.push({ name: route[0].name })
        }
        if (!isTab) {
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
      }
    }
  }
</script>

<style scoped>
.ant-card-bordered {
  border-radius: 5px;
  background: #f5f7fa;
}
</style>
