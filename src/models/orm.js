import { ORM } from 'redux-orm'
import Activity from './ActivityModel'
import Item from './ItemModel'
import User from './UserModel'
import Purchase from './PurchaseModel'
import Review from './ReviewModel'
import Notification from './NotificationModel'

export const orm = new ORM()

orm.register(Activity, Item, User, Purchase, Review, Notification)

export default orm

