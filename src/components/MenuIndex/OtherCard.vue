<template>
  <div>
    <a-divider v-if="filterMenuList.length > 0" orientation="left"> <icon-font :name="'icon-zhedie'" /> Other</a-divider>
    <a-row :gutter="16" justify="space-around">
      <menu-card
        v-for="item in filterMenuList"
        :key="item.menuId + ''"
        :menu="item"
        :dynamicMenuRoutes="dynamicMenuRoutes"
      ></menu-card>
    </a-row>
  </div>
</template>

<script>
  import { Divider, Row } from 'ant-design-vue'
  import MenuCard from './MenuCard'
  import IconFont from '@/components/iconSvg/index.vue'
  export default {
    name: 'OtherCard',
    data() {
      return {
        filterMenuList: []
      }
    },
    components: {
      ADivider: Divider,
      MenuCard: MenuCard,
      IconFont: IconFont,
      ARow: Row
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
    created() {
      this.filterMenuList = this.menu.list.filter(item => !item.list && item.orderNum)
    }
  }
</script>

<style scoped>

</style>
