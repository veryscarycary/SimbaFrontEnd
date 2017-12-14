import { schema } from 'normalizr'

export const userNormalizr = new schema.Entity('users', {}, { idAttribute: 'wallet' })

export const itemNormalizr = new schema.Entity('items', {
  user: userNormalizr
})

export const purchaseNormalizr = new schema.Entity('purchases', {
  item: itemNormalizr,
  buyer: userNormalizr,
  seller: userNormalizr
})

export const activityNormalizr = new schema.Entity('activities', {
  buyer: userNormalizr,
  seller: userNormalizr,
  item: itemNormalizr,
  purchase: purchaseNormalizr
})

export const reviewNormalizr = new schema.Entity('reviews', {
  buyer: userNormalizr,
  seller: userNormalizr,
  item: itemNormalizr
})

export const notificationNormalizr = new schema.Entity('notifications', {})

export const itemsNormalizr = new schema.Array(itemNormalizr)

export const usersNormalizr = new schema.Array(userNormalizr)

export const purchasesNormalizr = new schema.Array(purchaseNormalizr)

export const activitiesNormalizr = new schema.Array(activityNormalizr)

export const reviewsNormalizr = new schema.Array(reviewNormalizr)

export const notificationsNormalizr = new schema.Array(notificationNormalizr)
