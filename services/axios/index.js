import axios from 'axios'
import queryString from 'query-string'

const axiosClinet = axios.create({
    baseURL: 'https://test-payment.momo.vn',

    headers: {
        'content-type' : 'application/json'
    },
    // dung querystring handle params thay vi dung mac dinh cua axios
    paramsSerializer: params => queryString.stringify(params)
})

axiosClinet.interceptors.request.use(async (config)=> {
    return config
})

axiosClinet.interceptors.response.use((response) => {
    if(response && response.data) return response.data 
    return response
}, (error) => {
    throw error
})

export default axiosClinet;