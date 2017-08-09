import { createSelector } from 'reselect'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from './orm'
import { purchaseState } from '../containers/shared/PurchaseState'

export const ormSelector = state => state.orm

// --------------------------------------------
// Activities Selectors
export const activities = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    return session.Activity.all().toModelArray()
  })
)

//--------------------------------------------
//Items Selector
export const items = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    return session.Item.all().toModelArray()
  })
)

export const item = createSelector(
  ormSelector,
  state => state.selectedItemId,
  ormCreateSelector(orm, (session, selectedItemId) => {
    // .ref returns a reference to the plain
    // JavaScript object in the store.
    // It includes the id and name that we need.
    if (selectedItemId !== 0) {
      return session.Item.withId(selectedItemId);
    }
    return {}
  })
)

// --------------------------------------------
// Users selectors
export const users = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
      console.log('Running users selector')
      return session.User.all().toRefArray()
  })
)

export const user = createSelector(
  ormSelector,
  state => state.selectedUserId,
  ormCreateSelector(orm, (session, selectedUserId) => {
    if (selectedUserId !== 0) {
      return session.User.withId(selectedUserId).ref;
    }
    return {}
  })
)

export const current_user = createSelector(
  ormSelector,
  state => state.currentUserWallet,
  ormCreateSelector(orm, (session, currentUserWallet) => {
      if (currentUserWallet !== '') {
        return session.User.withId(currentUserWallet).ref
      }
      return {}
  })
)

// --------------------------------------------
// Purchases Selectors
export const pendingPurchases = createSelector(
  ormSelector,
  state => state.currentUserWallet,
  ormCreateSelector(orm, (session, currentUserWallet) => {
    if (currentUserWallet !== '') {
      return session.User.withId(currentUserWallet).buyer_purchases.filter((purchase) => {
        if ((purchase.purchaseState === purchaseState.SHIPPED)
          || (purchase.purchaseState === purchaseState.PURCHASED)
          || (purchase.purchaseState === purchaseState.PENDING_SHIPPED)
          || (purchase.purchaseState === purchaseState.PENDING_COMPLETED)
          || (purchase.purchaseState === purchaseState.PENDING_CANCELLED)) {
          return true
        }
        return false
      }).toModelArray()
    }
    return []
  })
)

export const completedPurchases = createSelector(
  ormSelector,
  state => state.currentUserWallet,
  ormCreateSelector(orm, (session, currentUserWallet) => {
    if (currentUserWallet !== '') {
      return session.User.withId(currentUserWallet).buyer_purchases.filter((purchase) => {
        if ((purchase.purchaseState === purchaseState.COMPLETED)
          || (purchase.purchaseState === purchaseState.BUYER_CANCELLED)
          || (purchase.purchaseState === purchaseState.SELLER_CANCELLED)
          || (purchase.purchaseState === purchaseState.SELLER_SHIPPING_TIMEOUT)
          || (purchase.purchaseState === purchaseState.BUYER_CONFIRMATION_TIMEOUT)
          || (purchase.purchaseState === purchaseState.ERROR)) {
          return true
        }
        return false
      }).toModelArray()
    }
    return []
  })
)

export const pendingSales = createSelector(
  ormSelector,
  state => state.currentUserWallet,
  ormCreateSelector(orm, (session, currentUserWallet) => {
    if (currentUserWallet !== '') {
      return session.User.withId(currentUserWallet).seller_sales.filter((purchase) => {
        if ((purchase.purchaseState === purchaseState.SHIPPED)
          || (purchase.purchaseState === purchaseState.PURCHASED)
          || (purchase.purchaseState === purchaseState.PENDING_SHIPPED)
          || (purchase.purchaseState === purchaseState.PENDING_COMPLETED)
          || (purchase.purchaseState === purchaseState.PENDING_CANCELLED)) {
          return true
        }
        return false
      }).toModelArray()
    }
    return []
  })
)

export const completedSales = createSelector(
  ormSelector,
  state => state.currentUserWallet,
  ormCreateSelector(orm, (session, currentUserWallet) => {
    if (currentUserWallet !== '') {
      return session.User.withId(currentUserWallet).seller_sales.filter((purchase) => {
        if ((purchase.purchaseState === purchaseState.COMPLETED)
          || (purchase.purchaseState === purchaseState.BUYER_CANCELLED)
          || (purchase.purchaseState === purchaseState.SELLER_CANCELLED)
          || (purchase.purchaseState === purchaseState.SELLER_SHIPPING_TIMEOUT)
          || (purchase.purchaseState === purchaseState.BUYER_CONFIRMATION_TIMEOUT)
          || (purchase.purchaseState === purchaseState.ERROR)) {
          return true
        }
        return false
      }).toModelArray()
    }
    return []
  })
)

export const purchase = createSelector(
  ormSelector,
  state => state.selectedPurchaseId,
  ormCreateSelector(orm, (session, selectedPurchaseId) => {
    if (selectedPurchaseId !== 0) {
      return session.Purchase.withId(selectedPurchaseId).ref
    }
    return {}
  })
)


// --------------------------------------------
// Reviews Selectors
export const itemReviews = createSelector(
  ormSelector,
  state => state.selectedItemId,
  ormCreateSelector(orm, (session, selectedItemId) => {
    if (selectedItemId !== 0) {
      return session.Item.withId(selectedItemId).reviews.filter({isItem: true}).toModelArray()
    }
    return []
  })
)

export const userReviews = createSelector(
  ormSelector,
  state => state.selectedUserId,
  ormCreateSelector(orm, (session, selectedUserId) => {
    if (selectedUserId !== 0) {
      return session.User.withId(selectedUserId).seller_reviews.filter({isItem: false}).toModelArray()
    }
    return []
  })
)
