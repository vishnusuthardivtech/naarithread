import { orderService } from './orderService'

function toDayStart(value) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

function toDayEnd(value) {
  const date = new Date(value)
  date.setHours(23, 59, 59, 999)
  return date
}

function isOrderInRange(order, startDate, endDate) {
  const orderDate = new Date(order.createdAt)
  if (Number.isNaN(orderDate.getTime())) {
    return false
  }

  return orderDate >= toDayStart(startDate) && orderDate <= toDayEnd(endDate)
}

export const reportService = {
  async getSummary({ startDate, endDate }) {
    const orders = (await orderService.getAll()).filter((order) => isOrderInRange(order, startDate, endDate))
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
    const totalOrders = orders.length

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
      conversionRate: null,
      orders,
    }
  },
}
