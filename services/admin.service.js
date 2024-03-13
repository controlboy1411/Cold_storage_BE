const moment = require('moment')
const constant = require('../utils/constant')
const adminRepo = require('../repositories/admin.repo')
const masterRepo = require('../repositories/master.repo')
const dashboardRepo = require('../repositories/dashboard.repo')
const { ResponseService } = require('../model/response')

const searchDataTable = async (searchValue) => {
    const baCode = '5096'
    const results = []
    const plants = await masterRepo.searchPlants(baCode, searchValue)

    for (const plant of plants) {
        let recordPlant = {
            plantCode: plant.PlantCode,
            plantName: plant.PlantName,
            address: plant.Address,
            status: Boolean(plant.IsActived) ? 'Active' : 'Not active',
        }

        const storageInfor = []
        const storages = await masterRepo.getAllStoragesByPlantCode(plant.PlantCode)

        for (const storage of storages) {
            const condition = await dashboardRepo.getStandardConditionV2(baCode, plant.PlantCode, storage.StorageID)
            const tempStd = `${condition?.TempMin || 0}-${condition?.TempMax || 100}`
            const humiStd = `${condition?.HumMin || 0}-${condition?.HumMax || 100}`

            let recordStorage = {
                storageId: storage.StorageID,
                storageName: storage.StorageName,
                effectiveDate: '14-10-2023',
                standard: {
                    temp: tempStd,
                    humi: humiStd
                },
                status: Boolean(storage.IsActived) ? 'Active' : 'Not active',
            }

            const locationInfor = []
            const locations = await masterRepo.getAllLocationsByStorageID(storage.StorageID)
            for (const location of locations) {
                locationInfor.push({
                    locationId: location.LocationID,
                    locationName: location.LocationName,
                    effectiveDate: '14-10-2023',
                    status: Boolean(location.IsActived) ? 'Active' : 'Not active',
                })
            }

            recordStorage.activeDevices = locationInfor.length,
            recordStorage.locations = locationInfor
            storageInfor.push(recordStorage)
        }

        recordPlant.storages = storageInfor
        results.push(recordPlant)
    }

    return results
}

const createPlant = async (data) => {
    const { baCode, plantCode, plantName, address } = data

    const existPlant = await adminRepo.getPlantByPlantCode(plantCode)
    if (existPlant) {
        return new ResponseService(constant.RESPONSE_CODE.FAIL, `Đã tồn tại mã Plant trong hệ thống!`)
    }

    const result = await adminRepo.insertPlant(baCode, plantCode, plantName, address)
    if (result.rowsAffected === 0) {
        return new ResponseService(constant.RESPONSE_CODE.FAIL, 'Đã có lỗi xảy ra. Vui lòng thử lại sau!')
    }

    return new ResponseService(constant.RESPONSE_CODE.SUCCESS)
}

const configPlant = async (data) => {
    const { plantCode, plantName, address, status } = data

    const existPlant = await adminRepo.getPlantByPlantCode(plantCode)
    if (!existPlant) {
        return new ResponseService(constant.RESPONSE_CODE.FAIL, `Không tồn tại mã Plant trong hệ thống. Vui lòng kiểm tra lại!`)
    }

    const result = await adminRepo.updatePlant(plantCode, plantName, address, Boolean(status))
    if (result.rowsAffected === 0) {
        return new ResponseService(constant.RESPONSE_CODE.FAIL, 'Đã có lỗi xảy ra. Vui lòng thử lại sau!')
    }

    return new ResponseService(constant.RESPONSE_CODE.SUCCESS)
}

const createStorage = async (data) => {
    const { baCode, plantCode, storageName } = data

    const existPlant = await adminRepo.getPlantByPlantCode(plantCode)
    if (!existPlant) {
        return new ResponseService(constant.RESPONSE_CODE.FAIL, `Không tồn tại mã Plant trong hệ thống. Vui lòng kiểm tra lại!`)
    }

    const result = await adminRepo.insertStorage(baCode, plantCode, storageName)
    if (result.rowsAffected === 0) {
        return new ResponseService(constant.RESPONSE_CODE.FAIL, 'Đã có lỗi xảy ra. Vui lòng thử lại sau!')
    }

    return new ResponseService(constant.RESPONSE_CODE.SUCCESS)
}

const configStorage = async (data) => {
    const { storageId, storageName, status, tempMin, tempMax, humiMin, humiMax, effectiveDate } = data

    const storage = await adminRepo.getStorageByID(storageId)
    if (!storage) {
        return new ResponseService(constant.RESPONSE_CODE.FAIL, `Kho không tồn tại hoặc đã bị xóa khỏi hệ thống!`)
    }

    const resultUpdate = await adminRepo.updateStorage(storageId, storageName, status, effectiveDate)
    if (resultUpdate.rowsAffected === 0) {
        return new ResponseService(constant.RESPONSE_CODE.FAIL, 'Đã có lỗi xảy ra. Vui lòng thử lại sau!')
    }

    const baCode = storage.BACode || ''
    const plantCode = storage.PlantCode || ''

    const condition = await dashboardRepo.getStandardConditionV2(baCode, plantCode, storageId)
    if (condition) {
        const rs1 = await adminRepo.updateStandardCondition(condition.ID, tempMin, tempMax, humiMin, humiMax)
        if (rs1.rowsAffected === 0) {
            return new ResponseService(constant.RESPONSE_CODE.FAIL, 'Đã có lỗi xảy ra. Vui lòng thử lại sau!')
        }
    } else {
        const rs2 = await adminRepo.insertStandardCondition(baCode, plantCode, storageId, tempMin, tempMax, humiMin, humiMax)
        if (rs2.rowsAffected === 0) {
            return new ResponseService(constant.RESPONSE_CODE.FAIL, 'Đã có lỗi xảy ra. Vui lòng thử lại sau!')
        }
    }

    return new ResponseService(constant.RESPONSE_CODE.SUCCESS)
}

module.exports = {
    searchDataTable,
    createPlant,
    configPlant,
    createStorage,
    configStorage
}