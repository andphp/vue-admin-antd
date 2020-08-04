<template>
  <div>
    <welcome-menu
      v-for="menu in menuList"
      v-if="menu.menuId + '' === latestTopMenuId"
      :key="menu.menuId + ''"
      :menu="menu"
      :dynamicMenuRoutes="dynamicMenuRoutes">
    </welcome-menu>
    <other-card
      v-for="menu in menuList"
      v-if="menu.menuId + '' === latestTopMenuId"
      :key="menu.menuId + 'o'"
      :menu="menu"
      :dynamicMenuRoutes="dynamicMenuRoutes"
    ></other-card>
  </div>
</template>

<script>
  import WelcomeMenu from '@/components/MenuIndex/Index'
  import OtherCard from '@/components/MenuIndex/OtherCard'
  export default {
    name: 'index',
    data() {
      return {
        dynamicMenuRoutes: []
      }
    },
    components: {
      WelcomeMenu,
      OtherCard
    },
    created() {
      this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
      this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
    },
    computed: {
      menuList: {
        get () {
          return this.$store.state.common.menuList
        },
        set (val) {
          this.$store.commit('common/updateMenuList', val)
        }
      },
      latestTopMenuId: {
        get () { return this.$store.state.common.latestTopMenuId },
        set (val) { this.$store.commit('common/updateLatestTopMenuId', val) }
      }
    }
  }
</script>

<style scoped>

</style>
