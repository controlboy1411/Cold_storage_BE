const moment = require('moment')
const constant = require('../utils/constant')
const reportRepo = require('../repositories/report.repo')
const dashboardRepo = require('../repositories/dashboard.repo')

const getSummaryData = async (baCode, plantCode, storageID, locationID, fromDate, toDate) => {
    const result = []

    const year = Number(toDate.substring(0, 4))
    const month = Number(toDate.substring(5, 7))
    const day = Number(toDate.substring(8, 10))

    let _fromDate = fromDate
    let _toDate = moment(new Date(year, month - 1, day + 1)).format(constant.DATE_FORMAT.YYYY_MM_DD)

    const tempData = await reportRepo.getSummaryDataOfEachColumn('Temperature', baCode, plantCode, Number(storageID), locationID, _fromDate, _toDate)
    const humiData = await reportRepo.getSummaryDataOfEachColumn('Humidity', baCode, plantCode, Number(storageID), locationID, _fromDate, _toDate)
    result.push({desc: 'report_detail_summary_max_value', temp: Number(tempData.max_value || 0).toFixed(2), humi: Number(humiData.max_value || 0).toFixed(2)})
    result.push({desc: 'report_detail_summary_max_value_time', temp: tempData.max_value_time, humi: humiData.max_value_time})
    result.push({desc: 'report_detail_summary_min_value', temp: Number(tempData.min_value || 0).toFixed(2), humi: Number(humiData.min_value || 0).toFixed(2)})
    result.push({desc: 'report_detail_summary_min_value_time', temp: tempData.min_value_time, humi: humiData.min_value_time})
    result.push({desc: 'report_detail_summary_avg_value', temp: Number(tempData.avg_value || 0).toFixed(2), humi: Number(humiData.avg_value).toFixed(2)})

    const condition = await dashboardRepo.getStandardCondition(baCode, plantCode, Number(storageID), locationID)
    const numOverRange = await Promise.all([
        reportRepo.getNumberOfOverRange('Temperature', baCode, plantCode, Number(storageID), locationID, _fromDate, _toDate, Number(condition?.TempMax || 0), Number(condition?.TempMin || 0)),
        reportRepo.getNumberOfOverRange('Humidity', baCode, plantCode, Number(storageID), locationID, _fromDate, _toDate, Number(condition?.HumMax || 0), Number(condition?.HumMin || 0))
    ])
    result.push({desc: 'report_detail_summary_num_over_range', temp: numOverRange[0].count, humi: numOverRange[1].count})
    
    return result
}

const getDetailData = async (baCode, plantCode, storageID, locationID, fromDate, toDate, page, size) => {
    const limit = size
    const offset = page * size

    const year = Number(toDate.substring(0, 4))
    const month = Number(toDate.substring(5, 7))
    const day = Number(toDate.substring(8, 10))

    let _fromDate = fromDate
    let _toDate = moment(new Date(year, month - 1, day + 1)).format(constant.DATE_FORMAT.YYYY_MM_DD)

    const result = await dashboardRepo.getTransactionReportPaging(baCode, plantCode, storageID, locationID, _fromDate, _toDate, limit, offset)
    return result
}

module.exports = {
    getSummaryData,
    getDetailData
}