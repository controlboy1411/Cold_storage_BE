const express = require('express')
const router = express.Router()
const constant = require('../utils/constant')
const reportService = require('../services/report.service')

router.get('/summary-infor', async (req, res) => {
    try {
        const baCode = req.query.baCode || ''
        const plantCode = req.query.plantCode || ''
        const storageID = req.query.storageID || ''
        const locationID = req.query.locationID || ''
        const fromDate = req.query.fromDate || null
        const toDate = req.query.toDate || null
        const result = await reportService.getSummaryData(baCode, plantCode, storageID, locationID, fromDate, toDate)
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
        console.log('Exception at router /report/summary-infor: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.get('/detail-infor', async (req, res) => {
    try {
        const baCode = req.query.baCode || ''
        const plantCode = req.query.plantCode || ''
        const storageID = req.query.storageID || ''
        const locationID = req.query.locationID || ''
        const fromDate = req.query.fromDate || null
        const toDate = req.query.toDate || null
        const page = req.query.page || 0
        const size = req.query.size || 10
        const result = await reportService.getDetailData(baCode, plantCode, storageID, locationID, fromDate, toDate, page, size)
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
        console.log('Exception at router /report/detail-infor: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

module.exports = router