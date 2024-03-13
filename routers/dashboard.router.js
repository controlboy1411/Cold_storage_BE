const express = require('express')
const router = express.Router()
const constant = require('../utils/constant')
const dashboardService = require('../services/dashboard.service')

router.get('/dashboard-main', async (req, res) => {
    try {
        const baCode = req.query.baCode || ''
        const plantCode = req.query.plantCode || ''
        const result = await dashboardService.getDashboardMainData(baCode, plantCode)

        if (result) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.SUCCESS,
                message: constant.RESPONSE_MESSAGE.SUCCESS,
                data: result
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.NOT_FOUND,
            message: constant.RESPONSE_MESSAGE.NOT_FOUND,
        })

    } catch (e) {
        console.log('Exception while get /dashboard/dashboard-main: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/chart-data', async (req, res) => {
    try {
        const baCode = req.query.baCode || ''
        const plantCode = req.query.plantCode || ''
        const storageID = req.query.storageID || ''
        const locationID = req.query.locationID || ''
        const selectedDate = req.query.selectedDate || null
        const result = await dashboardService.getLineChartData(baCode, plantCode, storageID, locationID, selectedDate)

        if (result) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.SUCCESS,
                message: constant.RESPONSE_MESSAGE.SUCCESS,
                data: result
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.NOT_FOUND,
            message: constant.RESPONSE_MESSAGE.NOT_FOUND,
        })

    } catch (e) {
        console.log('Exception at router /dashboard/chart-data: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/report-table', async (req, res) => {
    try {
        const baCode = req.query.baCode || ''
        const plantCode = req.query.plantCode || ''
        const storageID = req.query.storageID || ''
        const locationID = req.query.locationID || ''
        const selectedDate = req.query.selectedDate || null
        const page = req.query.page || 0
        const size = req.query.size || 20
        const result = await dashboardService.getReportDataTable(baCode, plantCode, storageID, locationID, selectedDate, page, size)

        if (result) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.SUCCESS,
                message: constant.RESPONSE_MESSAGE.SUCCESS,
                data: result
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.NOT_FOUND,
            message: constant.RESPONSE_MESSAGE.NOT_FOUND,
        })
    } catch (e) {
        console.log('Exception at router /dashboard/report-table: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})


module.exports = router