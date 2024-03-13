const masterRepo = require('../repositories/master.repo')

const getMasterDataPlants = async (baCode) => {
    const result = await masterRepo.getPlantsByBACode(baCode)
    return result
}

const getMasterDataStorages = async (plantCode) => {
    const result = await masterRepo.getStoragesByPlantCode(plantCode)
    return result
}

const getMasterDataLocations = async (storageID) => {
    const result = await masterRepo.getLocationsByStorageID(storageID)
    return result
}

module.exports = {
    getMasterDataPlants,
    getMasterDataStorages,
    getMasterDataLocations
}