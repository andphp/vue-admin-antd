<template>
  <div v-if="menu.list && menu.list.length >= 1">
    <template
      v-if="latestTopMenuId === menu.menuId + ''"
    >
      <welcome-menu
        v-for="itemMenu in menu.list"
        :key="itemMenu.menuId + ''"
        :menu="itemMenu"
        :dynamicMenuRoutes="dynamicMenuRoutes">
      </welcome-menu>
    </template>
    <template v-else>
      <a-divider  orientation="left">  <icon-font :name="menu.icon || 'icon-zhedie'" /> {{menu.name}}</a-divider>
      <a-row :gutter="16" justify="space-around">
        <menu-card
          v-for="itemMenu in menu.list"
          :key="itemMenu.menuId + ''"
          :menu="itemMenu"
          :dynamicMenuRoutes="dynamicMenuRoutes"
        ></menu-card>
      </a-row>
    </template>
  </div>
</template>

<script>
  import { Divider, Row, Col, Card } from 'ant-design-vue'
  import IconFont from '@/components/iconSvg/index.vue'
  import MenuCard from './MenuCard'
    export default {
      name: 'WelcomeMenu',
      components: {
        ADivider: Divider,
        ARow: Row,
        ACol: Col,
        ACard: Card,
        MenuCard: MenuCard,
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
        latestTopMenuId: {
          get () { return this.$store.state.common.latestTopMenuId },
          set (val) { this.$store.commit('common/updateLatestTopMenuId', val) }
        }
      }
    }
</script>

<style scoped>

</style>
