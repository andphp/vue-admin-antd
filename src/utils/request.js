import axios from 'axios'
import { Message, Notification } from 'ant-design-vue'
import { GetToken } from '@/utils/cookie'
import { TOKEN_INVALID } from '@/store/constants'

// 创建axios实例
const service = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  // 请求超时时间
  timeout: 1000 * 30,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// request拦截器
service.interceptors.request.use(config => {
  // 让每个请求携带自定义token 请根据实际情况自行修改
  if (GetToken()) {
      config.headers.Authorization = `Bearer ${GetToken()}`
      // config.headers.Authorization = GetToken()
  }
  return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
  return Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {
        /**
        * code为非0是抛错 可结合自己业务进行修改
        */
        const res = response.data
        if (res.code > 0) {
            // Message.error(res.message)

            // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
            if (res.code === TOKEN_INVALID) {
              Notification.error({
                message: '登录失效',
                description: '你的登录信息已失效，请重新登录'
              })
            } else {
              Notification.error({
                message: res.message,
                description: res.result.error
              })
            }
            return Promise.reject(res)
        } else {
            return res
        }
    },
    error => {
        console.log('err:', error)// for debug
        Message.error(error.message)
        return Promise.reject(error)
    }
)

export default service
