const sql = require('mssql')

const getNewestTransactionData = async (baCode, plantCode, storageID, locationID) => {
    const request = _sqlserver.request()
    request.input('baCode', sql.NVarChar, baCode)
    request.input('plantCode', sql.NVarChar, plantCode)
    request.input('storageID', sql.Int, storageID)
    request.input('locationID', sql.NVarChar, locationID)

    const querySql = 
        `select top 1 isnull(tr.Temperature, 0) Temperature, isnull(tr.Humidity, 0) Humidity
        from [dbo].[Transaction] tr with (nolock)
        where 
            tr.BACode = @baCode and tr.PlantCode = @plantCode
            and tr.StorageID = @storageID and tr.LocationID = @locationID
        order by tr.[Time] desc;`
    const result = await request.query(querySql)
    return result.recordset[0]
}

const getAverageTempAndHumi = async (baCode, plantCode, storageID, locationID, startTime, endTime) => {
    const request = _sqlserver.request()
    request.input('baCode', sql.NVarChar, baCode)
    request.input('plantCode', sql.NVarChar, plantCode)
    request.input('storageID', sql.Int, storageID)
    request.input('locationID', sql.NVarChar, locationID)
    request.input('startTime', sql.VarChar, startTime)
    request.input('endTime', sql.VarChar, endTime)

    const querySql = 
        `select
            isnull(avg(cast(Temperature as float)), 0) as avg_temp,
            isnull(avg(cast(Humidity as float)), 0) as avg_humi
        from [dbo].[Transaction] with (nolock)
        where
            BACode = @baCode and PlantCode = @plantCode and StorageID = @storageID and LocationID = @locationID
            and Time >= cast(@startTime as datetime) and Time < cast(@endTime as datetime);`
    
    const result = await request.query(querySql)
    return result.recordset[0]
}

const getStandardCondition = async (baCode, plantCode, storageID, locationID) => {
    const request = _sqlserver.request()
    request.input('baCode', sql.NVarChar, baCode)
    request.input('plantCode', sql.NVarChar, plantCode)
    request.input('storageID', sql.Int, storageID)
    request.input('locationID', sql.NVarChar, locationID)

    const querySql = 
        `select 
            isnull(TempMin, 0) TempMin, isnull(TempMax, 100) TempMax, 
            isnull(HumMin, 0) HumMin, isnull(HumMax, 100) HumMax
        from StandardCondition 
        where BACode = @baCode and PlantCode = @plantCode and StorageID = @storageID and LocationID = @locationID;`

    const result = await request.query(querySql)
    return result.recordset[0]
}

const getStandardConditionV2 = async (baCode, plantCode, storageID) => {
    const request = _sqlserver.request()
    request.input('baCode', sql.NVarChar, baCode)
    request.input('plantCode', sql.NVarChar, plantCode)
    request.input('storageID', sql.Int, storageID)

    const querySql = 
        `select ID,
            isnull(TempMin, 0) TempMin, isnull(TempMax, 100) TempMax, 
            isnull(HumMin, 0) HumMin, isnull(HumMax, 100) HumMax
        from StandardCondition 
        where BACode = @baCode and PlantCode = @plantCode and StorageID = @storageID;`

    const result = await request.query(querySql)
    return result.recordset[0]
}

const getTransactionReportPaging = async (baCode, plantCode, storageID, locationID, startDate, endDate, limit, offset) => {
    const request = _sqlserver.request()
    request.input('baCode', sql.NVarChar, baCode)
    request.input('plantCode', sql.NVarChar, plantCode)
    request.input('storageID', sql.Int, storageID)
    request.input('locationID', sql.NVarChar, locationID)
    request.input('startDate', sql.VarChar, startDate)
    request.input('endDate', sql.VarChar, endDate)
    request.input('offset', sql.Int, offset)
    request.input('limit', sql.Int, limit)

    const totalSql = 
        `select count(1) total
        from [dbo].[Transaction] with(nolock)
        where 
            BACode = @baCode and PlantCode = @plantCode and StorageID = @storageID and LocationID = @locationID
            and Time >= cast(@startDate as datetime) and Time < cast(@endDate as datetime);`

    const querySql = 
        `select Temperature, Humidity, substring(convert(varchar, [Time], 120), 1, 16) as [Time]
        from [dbo].[Transaction] with(nolock)
        where 
            BACode = @baCode and PlantCode = @plantCode and StorageID = @storageID and LocationID = @locationID
            and Time >= cast(@startDate as datetime) and Time < cast(@endDate as datetime)
        order by [Time] desc
        offset @offset rows
        fetch next @limit rows only;`

    const result = await Promise.all([
        await request.query(totalSql),
        await request.query(querySql)
    ])
    return {
        total: result[0].recordset[0].total,
        data: result[1].recordset
    }
}

module.exports = {
    getNewestTransactionData,
    getAverageTempAndHumi,
    getStandardCondition,
    getStandardConditionV2,
    getTransactionReportPaging
}