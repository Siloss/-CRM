const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

module.exports.overview = async function (req, res) {
    try {
        const allOrders = await Order.find({ user: req.user.id }).sort({ date: 1 })
        const ordersMap = getOrdersMap(allOrders)
        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || []

        //cont of orders of yesterday
        const yesterdayOrdersNumber = yesterdayOrders.length
        //Count of orders
        const totalOrdersNumber = allOrders.length
        //count if days total
        const daysNumber = Object.keys(ordersMap).length
        //Orders per day
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0)
        //Percent of count of orders of of
        //((orders yesterday \ orders per day) - 1) * 100
        //Percent of number of orders
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2)
        //totalGain
        const totalGain = calculateprice(allOrders)
        //GainPerDay
        const gainPerDay = totalGain / daysNumber
        //YesterdayGain
        const yesterdayGain = calculateprice(yesterdayOrders)
        //GainPercent
        const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2)
        //compareGain
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2)
        //compareNumber of orders
        const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2)

        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        })
    } catch (e) {
        errorHandler(res, e)
        console.log(e)
    }
}

module.exports.analytics = async function (req, res) {
    try {
        const allOrders = await Order.find({ user: req.user.id }).sort({ date: 1 })
        const ordersMap = getOrdersMap(allOrders)

        const average = +(calculateprice(allOrders) / Object.keys(ordersMap).length).toFixed(2)

        const chart = Object.keys(ordersMap).map(label => {
            //label == 05.05.2018
            const gain = calculateprice(ordersMap[label])
            const order = ordersMap[label].length
            return {label, order, gain}
        })

        res.status(200).json({ average, chart })
    }
    catch (e) {
        errorHandler(res, e)
    }
}

function getOrdersMap(orders = []) {
    const daysOrders = {}
    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY')

        if (date === moment().format('DD.MM.YYYY')) return

        if (!daysOrders[date]) {
            daysOrders[date] = []
        }

        daysOrders[date].push(order)
    })
    return daysOrders
}

function calculateprice(orders = []) {
    return orders.reduce((total, order) => {
        const orderPrice = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity
        }, 0)
        return total += orderPrice
    }, 0)
}