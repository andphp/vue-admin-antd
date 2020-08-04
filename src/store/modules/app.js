import { TOGGLE_MOBILE_TYPE } from '../constants'
const app = {
  state: {
    isMobile: false
  },
  mutations: {
    [TOGGLE_MOBILE_TYPE]: (state, isMobile) => {
      state.isMobile = isMobile
    }
  },
  actions: {
  }
}

export default app
