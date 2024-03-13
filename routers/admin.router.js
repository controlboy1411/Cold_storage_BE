const express = require('express')
const router = express.Router()
const constant = require('../utils/constant')
const adminService = require('../services/admin.service')

router.get('/search-table', async (req, res) => {
    try {
        const searchValue = req.query.searchValue || ''
        const result = await adminService.searchDataTable(searchValue)

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
        console.log('Exception at router /admin/search-table: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/create-plant', async (req, res) => {
    try {
        const result = await adminService.createPlant(req.body)
        if (result.resultCode === 0) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.SUCCESS,
                message: constant.RESPONSE_MESSAGE.SUCCESS,
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: result.message || constant.RESPONSE_MESSAGE.FAIL,
        })
    } catch (e) {
        console.log('Exception at router /admin/create-plant: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/config-plant', async (req, res) => {
    try {
        const result = await adminService.configPlant(req.body)
        if (result.resultCode === 0) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.SUCCESS,
                message: constant.RESPONSE_MESSAGE.SUCCESS,
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: result.message || constant.RESPONSE_MESSAGE.FAIL,
        })
    } catch (e) {
        console.log('Exception at router /admin/config-plant: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/create-storage', async (req, res) => {
    try {
        const result = await adminService.createStorage(req.body)
        if (result.resultCode === 0) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.SUCCESS,
                message: constant.RESPONSE_MESSAGE.SUCCESS,
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: result.message || constant.RESPONSE_MESSAGE.FAIL,
        })
    } catch (e) {
        console.log('Exception at router /admin/create-storage: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

router.post('/config-storage', async (req, res) => {
    try {
        const result = await adminService.configStorage(req.body)
        if (result.resultCode === 0) {
            return res.status(constant.HTTP_STATUS_CODE.OK).json({
                code: constant.RESPONSE_CODE.SUCCESS,
                message: constant.RESPONSE_MESSAGE.SUCCESS,
            })
        }

        return res.status(constant.HTTP_STATUS_CODE.OK).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: result.message || constant.RESPONSE_MESSAGE.FAIL,
        })
    } catch (e) {
        console.log('Exception at router /admin/config-storage: ', e?.message)
        return res.status(e.status || constant.HTTP_STATUS_CODE.INTERNAL_SERVER).json({
            code: constant.RESPONSE_CODE.FAIL,
            message: e?.message || constant.RESPONSE_MESSAGE.SYSTEM_ERROR
        })
    }
})

module.exports = router