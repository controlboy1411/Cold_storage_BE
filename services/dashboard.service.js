const dashboardRepo = require('../repositories/dashboard.repo')
const masterRepo = require('../repositories/master.repo')
const moment = require('moment')
const constant = require('../utils/constant')

const getDashboardMainData = async (baCode, plantCode) => {
    const result = []
    const storages = await masterRepo.getStoragesByPlantCode(plantCode)
    for (const storage of storages) {
        const resultItem = {
            storageID: Number(storage.StorageID),
            storageName: storage.StorageName,
            dataLocation: []
        }
        const locations = await masterRepo.getLocationsByStorageID(Number(storage.StorageID))
        for (const location of locations) {
            const transactionData = await dashboardRepo.getNewestTransactionData(baCode, plantCode, Number(storage.StorageID), location.LocationName)
            const condition = await dashboardRepo.getStandardCondition(baCode, plantCode, Number(storage.StorageID), location.LocationName)
            const tempStd = `${condition?.TempMin || 0}-${condition?.TempMax || 100}`
            const humiStd = `${condition?.HumMin || 0}-${condition?.HumMax || 100}`

            let isOverStd = {
                temp: false,
                humi: false
            }
            if ((Number(transactionData.Temperature) > Number(condition?.TempMax || 100)) || (Number(transactionData.Temperature) < Number(condition?.TempMin || 0))) {
                isOverStd.temp = true
            }

            if ((Number(transactionData.Humidity) > Number(condition?.HumMax || 100)) || (Number(transactionData.Humidity) < Number(condition?.HumMin || 0))) {
                isOverStd.humi = true
            }
            
            resultItem.dataLocation.push({
                locationID: location.LocationID,
                locationName: location.LocationName,
                temp: Number(transactionData.Temperature).toFixed(2),
                humi: Number(transactionData.Humidity).toFixed(2),
                std: {
                    temp: tempStd,
                    humi: humiStd
                },
                isOverStd
            })
        }
        result.push(resultItem)
    }
    return result
}

const getLineChartData = async (baCode, plantCode, storageID, locationID, selectedDate) => {
    let thisDateTime = new Date()
    let vnDateTimestamp = thisDateTime.setHours(thisDateTime.getUTCHours() + 7)
    let currentDate = moment(vnDateTimestamp).format(constant.DATE_FORMAT.YYYY_MM_DD)
    let date = currentDate
    if (selectedDate) {
        date = selectedDate
    }

    const timeLines = []
    if (new Date(date) < new Date(currentDate)) {
        for (let i = -1; i <= 23; i++) {
            const timeLine = moment(new Date(date).setHours(i)).format(constant.DATE_FORMAT.YYYY_MM_DD_HH_mm_ss)
            timeLines.push(timeLine)
        }
    } else {
        for (let i = -1; i <= moment(vnDateTimestamp).hours(); i++) {
            const timeLine = moment(new Date(date).setHours(i)).format(constant.DATE_FORMAT.YYYY_MM_DD_HH_mm_ss)
            timeLines.push(timeLine)
        }
    }

    let result = { temp: [], humi: [] }
    for (let i = 0; i < timeLines.length - 1; i++) {
        const avg = await dashboardRepo.getAverageTempAndHumi(baCode, plantCode, storageID, locationID, timeLines[i], timeLines[i + 1])
        const hour = moment(timeLines[i + 1]).hours()

        result.temp.push({
            x: hour,
            y: Number(avg.avg_temp).toFixed(2)
        })
        result.humi.push({
            x: hour,
            y: Number(avg.avg_humi).toFixed(2)
        })
    }

    return result
}

const getReportDataTable = async (baCode, plantCode, storageID, locationID, selectedDate, page, size) => {
    let currentDate = moment().format(constant.DATE_FORMAT.YYYY_MM_DD)
    let date = currentDate
    if (selectedDate) {
        date = selectedDate
    }

    const limit = size
    const offset = page * size

    const year = Number(date.substring(0, 4))
    const month = Number(date.substring(5, 7))
    const day = Number(date.substring(8, 10))
    let startDate = moment(new Date(year, month - 1, day)).format(constant.DATE_FORMAT.YYYY_MM_DD)
    let endDate = moment(new Date(year, month - 1, day + 1)).format(constant.DATE_FORMAT.YYYY_MM_DD)

    let condition = await dashboardRepo.getStandardCondition(baCode, plantCode, storageID, locationID)
    let tempStd = `${condition?.TempMin || 0}-${condition?.TempMax || 100}`
    let humiStd = `${condition?.HumMin || 0}-${condition?.HumMax || 100}`

    let data = []
    let reportData = await dashboardRepo.getTransactionReportPaging(baCode, plantCode, storageID, locationID, startDate, endDate, limit, offset)
    reportData.data.map((record, index) => {
        let overTemp = 0
        if (Number(record.Temperature) - Number(condition.TempMax) > 0) {
            overTemp = Number(record.Temperature) - Number(condition.TempMax)
        } else if (Number(record.Temperature) - Number(condition.TempMin) < 0) {
            overTemp = Number(condition.TempMin) - Number(record.Temperature)
        }

        let overHumi = 0
        if (Number(record.Humidity) - Number(condition.HumMax) > 0) {
            overHumi = Number(record.Humidity) - Number(condition.HumMax)
        } else if (Number(record.Humidity) - Number(condition.HumMin) < 0) {
            overHumi = Number(condition.HumMin) - Number(record.Humidity)
        }

        let item = {
            stt: index + 1,
            temp: Number(record.Temperature).toFixed(2),
            humi: Number(record.Humidity).toFixed(2),
            std: {
                temp: tempStd,
                humi: humiStd
            },
            overStd: {
                temp: Number(overTemp).toFixed(2),
                humi: Number(overHumi).toFixed(2)
            },
            time: record.Time
        }
        data.push(item)
    })

    return {
        total: reportData.total,
        data: data
    }
}

module.exports = {
    getDashboardMainData,
    getLineChartData,
    getReportDataTable
}