import request from './base.config'

const http = {
  get(url, params) {
    return request.get(url, { params })
  },
  post(url, data) {
    return request.post(url, data)
  },
}

export default http
