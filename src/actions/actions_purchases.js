import axios from 'axios'
import { normalize } from 'normalizr'

import { headers, PURCHASES_URL, BUYER_PURCHASES_URL, SELLER_PURCHASES_URL } from '../api_url'

import { setFlashMessage } from './actions_flash_messages'
import { purchase, fetchPurchaseState, fetchPurchaseTimes } from './actions_contract'
import { CREATE_USERS, SELECT_USER } from './actions_users'
import { CREATE_ITEMS, SELECT_ITEM } from './actions_items'

import { purchaseState } from '../containers/shared/PurchaseState'
import { purchasesNormalizr, purchaseNormalizr } from '../models/normalizr'
import EscrowContract from '../services/escrow'

export const CREATE_PURCHASE = 'CREATE_PURCHASE'
export const CREATE_PURCHASES = 'CREATE_PURCHASES'
export const UPDATE_PURCHASE = 'UPDATE_PURCHASE'
export const SELECT_PURCHASE = 'SELECT_PURCHASE'

// Purchase one item
// Create locally first a purchase in mongodb
// Retrieve the purchaseId to send the transaction into the smart contract
export function createPurchase(item, finalPrice, provider) {
  const params = {
    amount: finalPrice,
    item_id: item.id,
    address: '155 W Washington Blvd',
    postal_code: '90030',
    city: 'Los Angeles',
    us_state: 'CA',
    country: 'USA',
    seller_id: item.user.id,
    shipping_deadline: item.shipping_deadline
  }

  return dispatch => {
    return axios.post(PURCHASES_URL, params, headers)
      .then((request) => {
        const normalizeRequest = normalize(request.data, purchaseNormalizr)
        dispatch({
          type: CREATE_PURCHASES,
          payload: normalizeRequest.entities.purchases,
        })
        dispatch({ type: SELECT_PURCHASE, payload: request.data.id })

        return EscrowContract.purchaseItem({
          purchaseId: request.data.id,
          sellerAddress: item.user.wallet,
          itemId: item.id,
          amount: request.data.amount,
          shippingDeadline: item.shipping_deadline,
        })
         .then((transaction) => {
            dispatch({ type: UPDATE_PURCHASE, payload: { id: request.data.id, purchaseState: purchaseState.PURCHASED } })
            return transaction
          })
         .catch((error) => {
            dispatch(setFlashMessage("Error: Transaction failed.. please try again later.", 'error'))
            dispatch({ type: UPDATE_PURCHASE, payload: { id: request.data.id, purchaseState: purchaseState.ERROR } })

            throw error
          })
    })
  }
}

// Get one purchase information
export function selectPurchase(provider, purchaseId) {
  return dispatch => {
    axios.get(`${PURCHASES_URL}/${purchaseId}`, headers)
         .then((request) => {
            const normalizeRequest = normalize(request.data, purchaseNormalizr)
            dispatch({ type: CREATE_ITEMS, payload: normalizeRequest.entities.items })
            dispatch({ type: CREATE_USERS, payload: normalizeRequest.entities.users })
            dispatch({ type: CREATE_PURCHASES, payload: normalizeRequest.entities.purchases })
            dispatch({ type: SELECT_PURCHASE, payload: request.data.id })
            dispatch(fetchPurchaseState(request.data, provider))
            dispatch(fetchPurchaseTimes(request.data, provider))
         })
  }
}

// Fetch All User's Purchases and sort them between 'Pending' or 'Finalized' state
// Get Purchases State from the blockchain
export function fetchAllPurchases(provider, isBuyer) {
  const PURCHASE_API_URL = isBuyer ? BUYER_PURCHASES_URL : SELLER_PURCHASES_URL
  return dispatch => {
    axios.get(PURCHASE_API_URL, headers)
         .then((request) => {
          const normalizeRequest = normalize(request.data, purchasesNormalizr)
          dispatch({ type: CREATE_USERS, payload: normalizeRequest.entities.users })
          dispatch({ type: CREATE_ITEMS, payload: normalizeRequest.entities.items })
          dispatch({ type: CREATE_PURCHASES, payload: normalizeRequest.entities.purchases })
          request.data.forEach((purchase) => {
            dispatch(fetchPurchaseState(purchase, provider))
            dispatch(fetchPurchaseTimes(purchase, provider))
          })
       }).catch((error) => {
        console.log(error)
        if (error.response) {
          dispatch(setFlashMessage(error.response.data.error, 'error'))
        } else {
          dispatch(setFlashMessage("Error: Failed to retrieve purchases.. please try again later.", 'error'))
        }
       })
  }
}

