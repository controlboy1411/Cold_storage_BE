const sql = require('mssql')

const getSummaryDataOfEachColumn = async (columnName, baCode, plantCode, storageID, locationID, fromDate, toDate) => {
    const request = _sqlserver.request()
    request.input('baCode', sql.NVarChar, baCode)
    request.input('plantCode', sql.NVarChar, plantCode)
    request.input('storageID', sql.Int, storageID)
    request.input('locationID', sql.NVarChar, locationID)
    request.input('fromDate', sql.VarChar, fromDate)
    request.input('toDate', sql.VarChar, toDate)

    const querySql = 
        `select 
            tmp.*,
            (
                select substring(convert(varchar, min(Time), 120), 1, 16)
                from [dbo].[Transaction]
                where 
                    BACode = @baCode and PlantCode = @plantCode and StorageID = @storageID and LocationID = @locationID
                    and ${columnName} = tmp.max_value and Time >= cast(@fromDate as datetime) and Time < cast(@toDate as datetime)
            ) as max_value_time,
            (
                select substring(convert(varchar, min(Time), 120), 1, 16)
                from [dbo].[Transaction]
                where 
                    BACode = @baCode and PlantCode = @plantCode and StorageID = @storageID and LocationID = @locationID
                    and ${columnName} = tmp.min_value and Time >= cast(@fromDate as datetime) and Time < cast(@toDate as datetime)
            ) as min_value_time
        from (
            select 
                max(${columnName}) max_value, min(${columnName}) min_value, avg(${columnName}) avg_value
            from [dbo].[Transaction]
            where 
                BACode = @baCode and PlantCode = @plantCode and StorageID = @storageID and LocationID = @locationID
                and Time >= cast(@fromDate as datetime) and Time < cast(@toDate as datetime)
        ) as tmp;`

    const result = await request.query(querySql)
    return result.recordset[0]
}

const getNumberOfOverRange = async (columnName, baCode, plantCode, storageID, locationID, fromDate, toDate, maxValue, minValue) => {
    const request = _sqlserver.request()
    request.input('baCode', sql.NVarChar, baCode)
    request.input('plantCode', sql.NVarChar, plantCode)
    request.input('storageID', sql.Int, storageID)
    request.input('locationID', sql.NVarChar, locationID)
    request.input('fromDate', sql.VarChar, fromDate)
    request.input('toDate', sql.VarChar, toDate)
    request.input('maxValue', sql.Float, maxValue)
    request.input('minValue', sql.Float, minValue)

    const querySql = 
        `select COUNT(ID) count
        from [dbo].[Transaction]
        where 
            BACode = @baCode and PlantCode = @plantCode and StorageID = @storageID and LocationID = @locationID
            and Time >= cast(@fromDate as datetime) and Time < cast(@toDate as datetime)
            and (${columnName} < @minValue or ${columnName} > @maxValue);`

    const result = await request.query(querySql)
    return result.recordset[0]
}

module.exports = {
    getSummaryDataOfEachColumn,
    getNumberOfOverRange
}