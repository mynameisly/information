import axios from 'axios'
import { Message } from 'element-ui'
import store from "../store/index.js"
import { getToken } from './token.js'

const service = axios.create({
  baseURL: '',
  // baseURL: process.env.VUE_APP_BASE_URL,
  withCredentials: false,
  timeout: 5000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
    'Content-Type': 'application/json'
  }
})

service.interceptors.request.use(
  config => {
    var token = store.getters.token;
    var userid = store.getters.userid;
    token = (token === undefined || token === '' || token === null) ? token : getToken();
    if (token !== undefined && token !== null && token !== '') {
      config.headers['X-TOKEN'] = token
      config.headers['userId'] = userid
    }
    config.params = {
      _t: Date.parse(new Date()) / 1000,
      ...config.params
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  res => {
    // res.data.status = Number(res.data.status)
    if (res.data.code === 200) {
      return res.data;
    } else if (res.data.code === 404) {
      this.$router.push("/404")
    } else if (res.data.code === 401) {
      this.$router.push("/401")
    } else {
      Message.error({ message: res.data.msg||res.data.entity.msg });
      return Promise.reject(res);
    }
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
