const wallet = localStorage.getItem('simba_wallet')
const token = localStorage.getItem('simba_token')
export const headers = { headers: { 'X-User-Wallet': wallet, 'X-User-Token': token } }

export const ROOT_URL = process.env.REACT_APP_API_HOST || 'http://localhost:3001'

// DEVISE URLS
export const SIGN_UP_URL = `${ROOT_URL}/users`
export const SIGN_IN_URL = `${ROOT_URL}/users/sign_in`

// USERS URL
export const USERS_URL = `${ROOT_URL}/users`

// ITEMS URLS
export const ITEMS_URL = `${ROOT_URL}/items`

// PURCHASES URLS
export const PURCHASES_URL = `${ROOT_URL}/purchases`
export const BUYER_PURCHASES_URL = `${ROOT_URL}/purchases/buyer_purchases`
export const SELLER_PURCHASES_URL = `${ROOT_URL}/purchases/seller_sales`

// ACTIVITIES URLS
export const ACTIVITIES_URL = `${ROOT_URL}/activities`

// REVIEWS URL
export const REVIEWS_URL = `${ROOT_URL}/reviews`
