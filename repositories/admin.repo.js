const sql = require('mssql')

const insertPlant = async (baCode, plantCode, plantName, address) => {
    const request = _sqlserver.request()
    request.input('baCode', sql.NVarChar, baCode)
    request.input('plantCode', sql.NVarChar, plantCode)
    request.input('plantName', sql.NVarChar, plantName)
    request.input('address', sql.NVarChar, address)

    const commandSql = 
        `insert into Plant (PlantCode, BACode, PlantName, Address, IsActived)
        values (@plantCode, @baCode, @plantName, @address, 0);`
    const result = await request.query(commandSql)
    return result
}

const getPlantByPlantCode = async (plantCode) => {
    const request = _sqlserver.request()
    request.input('plantCode', sql.NVarChar, plantCode)

    const querySql = `select * from Plant where PlantCode = @plantCode;`
    const result = await request.query(querySql)
    return result.recordset[0]
}

const updatePlant = async (plantCode, plantName, address, status) => {
    const request = _sqlserver.request()
    request.input('plantCode', sql.NVarChar, plantCode)
    request.input('plantName', sql.NVarChar, plantName)
    request.input('address', sql.NVarChar, address)
    request.input('status', sql.Bit, status)

    const querySql = 
        `update Plant set PlantName = @plantName, Address = @address, IsActived = @status where PlantCode = @plantCode;`
    const result = await request.query(querySql)
    return result
}

const insertStorage = async (baCode, plantCode, storageName) => {
    const request = _sqlserver.request()
    request.input('baCode', sql.NVarChar, baCode)
    request.input('plantCode', sql.NVarChar, plantCode)
    request.input('storageName', sql.NVarChar, storageName)

    const querySql = 
        `insert into Storage (BACode, PlantCode, StorageName, IsActived) 
        values (@baCode, @plantCode, @storageName, 0)`
    const result = await request.query(querySql)
    return result
}

const getStorageByID = async (storageID) => {
    const request = _sqlserver.request()
    request.input('storageID', sql.Int, storageID)

    const querySql = `select * from Storage where StorageID = @storageID`
    const result = await request.query(querySql)
    return result.recordset[0]
}

const updateStorage = async (storageId, storageName, status, effectiveDate) => {
    const request = _sqlserver.request()
    request.input('storageId', sql.Int, storageId)
    request.input('storageName', sql.NVarChar, storageName)
    request.input('status', sql.Bit, status)
    request.input('effectiveDate', sql.DateTime, effectiveDate)

    const commandSql = 
        `update Storage
        set StorageName = @storageName, IsActived = @status, EffectiveDate = @effectiveDate
        where StorageID = @storageId;`
    const result = await request.query(commandSql)
    return result
}

const insertStandardCondition = async (baCode, plantCode, storageId, tempMin, tempMax, humiMin, humiMax) => {
    const request = _sqlserver.request()
    request.input('baCode', sql.NVarChar, baCode)
    request.input('plantCode', sql.NVarChar, plantCode)
    request.input('storageId', sql.Int, storageId)
    request.input('tempMin', sql.Decimal, tempMin)
    request.input('tempMax', sql.Decimal, tempMax)
    request.input('humiMin', sql.Decimal, humiMin)
    request.input('humiMax', sql.Decimal, humiMax)
    const commandSql = 
        `insert into StandardCondition (BACode, PlantCode, StorageID, TempMin, TempMax, HumMin, HumMax)
        values (@baCode, @plantCode, @storageId, @tempMin, @tempMax, @humiMin, @humiMax);`
    const result = await request.query(commandSql)
    return result
}

const updateStandardCondition = async (conditionID, tempMin, tempMax, humiMin, humiMax) => {
    const request = _sqlserver.request()
    request.input('conditionID', sql.Int, conditionID)
    request.input('tempMin', sql.Decimal, tempMin)
    request.input('tempMax', sql.Decimal, tempMax)
    request.input('humiMin', sql.Decimal, humiMin)
    request.input('humiMax', sql.Decimal, humiMax)

    const commandSql = 
        `update StandardCondition
        set TempMin = @tempMin, TempMax = @tempMax, HumMin = @humiMin, HumMax = @humiMax
        where ID = @conditionID;`
    const result = await request.query(commandSql)
    return result
}

module.exports = {
    insertPlant,
    updatePlant,
    getPlantByPlantCode,
    insertStorage,
    getStorageByID,
    updateStorage,
    insertStandardCondition,
    updateStandardCondition
}