export default {
  namespaced: true,
  state: {
    // 侧边栏, 折叠状态
    sidebarFold: false,
    // 所有菜单
    menuList: [],
    // 当前选中 一级菜单
    latestTopMenuId: '',
    // 所有打开窗口标签页
    mainTabs: [],
    // 当前打开窗口标签页
    latestTabMenuId: '',
    // 当前选中(一级菜单) 下 所有二级菜单 组 menuId
    mainSubmenuKeyList: [],
    // 当前 打开三级菜单 的二级菜单 menuId
    latestOpenKey: '',
    // 所有 打开二级菜单 的 menuId
    sidebarOpenKey: []
  },
  mutations: {
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
    },
    // all menu
    updateMenuList (state, list) {
      state.menuList = list
    },
    updateLatestTopMenuId (state, MenuId) {
      sessionStorage.setItem('LatestTopMenuId', MenuId + '')
      state.latestTopMenuId = MenuId + ''
    },
    // all tabs list
    updateMainTabs (state, tabs) {
      state.mainTabs = tabs
    },
    updateLatestTabMenuId (state, MenuId) {
      sessionStorage.setItem('LatestTabMenuId', MenuId + '')
      state.latestTabMenuId = MenuId + ''
    },
    updateMainSubmenuKeyList (state, SubmenuKeyList) {
      state.mainSubmenuKeyList = SubmenuKeyList
    },
    updateLatestOpenKey (state, menuId) {
      sessionStorage.setItem('LatestOpenKey', menuId + '')
      state.latestOpenKey = menuId
    },
    updateSidebarOpenKey (state, SubmenuKey) {
      state.sidebarOpenKey = SubmenuKey
    }
  }
}
