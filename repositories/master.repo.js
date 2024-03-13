const sql = require('mssql')

const getPlantsByBACode = async (baCode) => {
    const request = _sqlserver.request()
    request.input('baCode', sql.NVarChar, baCode)

    const querySql = 
        `select PlantCode, PlantName 
        from Plant where BACode = @baCode and IsActived = 1 order by PlantName;`

    const result = await request.query(querySql)
    return result.recordset
}

const getStoragesByPlantCode = async (plantCode) => {
    const request = _sqlserver.request()
    request.input('plantCode', sql.NVarChar, plantCode)

    const querySql = 
        `select StorageID, StorageName 
        from Storage where PlantCode = @plantCode and IsActived = 1 order by StorageName;`
    const result = await request.query(querySql)
    return result.recordset
}

const getAllStoragesByPlantCode = async (plantCode) => {
    const request = _sqlserver.request()
    request.input('plantCode', sql.NVarChar, plantCode)

    const querySql = 
        `select StorageID, StorageName, IsActived 
        from Storage where PlantCode = @plantCode order by StorageName;`
    const result = await request.query(querySql)
    return result.recordset
}

const getLocationsByStorageID = async (storageID) => {
    const request = _sqlserver.request()
    request.input('storageID', sql.Int, storageID)

    const querySql = 
        `select LocationID, LocationName 
        from [dbo].[Location] where StorageID = @storageID and IsActived = 1 order by LocationName;`
    const result = await request.query(querySql)
    return result.recordset
}

const getAllLocationsByStorageID = async (storageID) => {
    const request = _sqlserver.request()
    request.input('storageID', sql.Int, storageID)

    const querySql = 
        `select LocationID, LocationName, IsActived
        from [dbo].[Location] where StorageID = @storageID order by LocationName;`
    const result = await request.query(querySql)
    return result.recordset
}

const searchPlants = async (baCode, searchValue) => {
    const request = _sqlserver.request()
    request.input('baCode', sql.NVarChar, baCode)
    request.input('searchValue', sql.NVarChar, searchValue)

    const querySql = 
        `select * from Plant 
        where
            BACode = @baCode
            and (
                PlantCode like concat('%', @searchValue, '%') 
                or PlantName like concat('%', @searchValue, '%')
            );`
    const result = await request.query(querySql)
    return result.recordset
}

module.exports = {
    getPlantsByBACode,
    getStoragesByPlantCode,
    getAllStoragesByPlantCode,
    getLocationsByStorageID,
    getAllLocationsByStorageID,
    searchPlants
}