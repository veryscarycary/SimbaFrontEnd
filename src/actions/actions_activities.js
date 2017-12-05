import { normalize } from 'normalizr'
import Eth from 'ethjs'

import Api, { ACTIVITIES_URL } from '../services/api'
import { activitiesNormalizr } from '../models/normalizr'

import { activityCategories } from '../containers/shared/ActivityCategory'
import { CREATE_USERS } from './actions_users'
import { CREATE_ITEMS } from './actions_items'
import { CREATE_PURCHASES } from './actions_purchases'

export const CREATE_ACTIVITIES = 'CREATE_ACTIVITIES'

export function fetchAllActivities() {
  return dispatch => {
    Api.get(ACTIVITIES_URL)
         .then((request) => {
            const normalizeRequest = normalize(request.data, activitiesNormalizr)
            dispatch({ type: CREATE_USERS, payload: normalizeRequest.entities.users })
            dispatch({ type: CREATE_ITEMS, payload: normalizeRequest.entities.items })
            dispatch({ type: CREATE_PURCHASES, payload: normalizeRequest.entities.purchases })
            dispatch({ type: CREATE_ACTIVITIES, payload: normalizeRequest.entities.activities })
         })
  }
}

export function createPurchaseActivity(log) {
  return dispatch => {
    const newLog = `[${log.buyer}] purchased ${Eth.toUtf8(log.purchaseId)} for ${Eth.fromWei(log.amount, 'ether')} ETH`
    console.log('[Event - ItemPurchased] : ', newLog)
    dispatch(createLogActivity(activityCategories.PURCHASE,
                               Eth.toUtf8(log.purchaseId),
                               Eth.toUtf8(log.itemId),
                               Eth.fromWei(log.amount, 'ether'),
                               log.buyer,
                               log.seller))
  }
}

export function createCancelActivity(log) {
  return dispatch => {
    const newLog = `[${log.sender}] cancels order ${Eth.toUtf8(log.itemId)}.`
    console.log('[Event - CancelPurchase] : ', newLog)
    var activityCategory
    if (log.sender === log.seller) {
      activityCategory = activityCategories.CANCEL_SALES
    } else {
      activityCategory = activityCategories.CANCEL_PURCHASE
    }
    dispatch(createLogActivity(activityCategory,
                               Eth.toUtf8(log.purchaseId),
                               Eth.toUtf8(log.itemId),
                               Eth.fromWei(log.amount, 'ether'),
                               log.buyer,
                               log.seller))
  }
}

export function createShippingActivity(log) {
  return dispatch => {
    const newLog = `[${log.seller}] shipped ${Eth.toUtf8(log.itemId)} - Tracking Number : ${Eth.toUtf8(log.code)}`
    console.log('[Event - ItemShipped] : ', newLog)
    dispatch(createLogActivity(activityCategories.SHIP_ITEM,
                               Eth.toUtf8(log.purchaseId),
                               Eth.toUtf8(log.itemId),
                               Eth.toAscii(log.code),
                               log.buyer,
                               log.seller))
  }
}

export function createPurchaseConfirmationActivity(log) {
  return dispatch => {
    const newLog = `[${log.buyer}] confirms receiving ${Eth.toUtf8(log.itemId)}. The transaction is complete.`
    console.log('[Event - PurchaseComplete] : ', newLog)
    dispatch(createLogActivity(activityCategories.CONFIRM_PURCHASE,
                               Eth.toUtf8(log.purchaseId),
                               Eth.toUtf8(log.itemId),
                               Eth.fromWei(log.amount, 'ether'),
                               log.buyer,
                               log.seller))
  }
}

/**
 * create a withdrawal log activity
 * @param  {Object} log [contains sender wallet & amount withdrawn]
 * @return {Promise}
 */
export function createWithdrawalActivity(log) {
  return dispatch => {
    const newLog = `[${log.sender} withdraws ${Eth.fromWei(log.amount, 'ether')} ETH]`
    console.log('[Event Log - Withdraw Funds] : ', newLog)
    dispatch(createLogActivity(activityCategories.USER_WITHDRAWAL,
                               '',
                               '',
                               Eth.fromWei(log.amount, 'ether'),
                               log.sender,
                               log.sender))
  }
}

/**
 * Create a log activity in database
 * @param  {enum} category   [Log Category]
 * @param  {string} purchaseId [id of urchase]
 * @param  {string} itemId     [id of item]
 * @param  {int} amount     [amount in ETH]
 * @param  {string} buyer      [buyer wallet address]
 * @param  {string} seller     [seller wallet address]
 * @return {Promise}
 */
export function createLogActivity(category, purchaseId, itemId, amount, buyer, seller) {
  const activity_params = {
    category: category,
    purchase_id: purchaseId,
    item_id: itemId,
    amount: amount,
    buyer_address: buyer,
    seller_address: seller
  }
  return dispatch => {
    Api.post(ACTIVITIES_URL, activity_params)
  }
}
