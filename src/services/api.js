import axios from 'axios'
import runtimeEnv from '@mars/heroku-js-runtime-env'

import Auth from './auth'

const env = runtimeEnv()

export const ROOT_URL = env.REACT_APP_API_HOST || 'http://localhost:3001'

// DEVISE URLS
export const SIGN_UP_URL = `${ROOT_URL}/users`
export const SIGN_IN_URL = `${ROOT_URL}/users/sign_in`

// USERS URL
export const USERS_URL = `${ROOT_URL}/users`
export const MY_PROFILE_URL = `${ROOT_URL}/users/me`

// ITEMS URLS
export const ITEMS_URL = `${ROOT_URL}/items`
// PURCHASES URLS
export const PURCHASES_URL = `${ROOT_URL}/purchases`
export const BUYER_PURCHASES_URL = `${ROOT_URL}/purchases/buyer_purchases`
export const SELLER_PURCHASES_URL = `${ROOT_URL}/purchases/seller_sales`
export const PURCHASES_METRICS_URL = `${ROOT_URL}/purchases/metrics`

// ACTIVITIES URLS
export const ACTIVITIES_URL = `${ROOT_URL}/activities`

// REVIEWS URL
export const REVIEWS_URL = `${ROOT_URL}/reviews`

export const get = (url, config = {}) => axios.get(url, {
  ...config,
  headers: {
    'X-User-Wallet': Auth.wallet, 'X-User-Token': Auth.token
  }
})

export const post = (url, data, config = {}) => axios.post(url, data, {
  ...config,
  headers: {
    'X-User-Wallet': Auth.wallet, 'X-User-Token': Auth.token
  }
})

export const put = (url, data, config = {}) => axios.put(url, data, {
  ...config,
  headers: {
    'X-User-Wallet': Auth.wallet, 'X-User-Token': Auth.token
  },
})

export default { get, post, put }
