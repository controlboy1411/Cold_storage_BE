const constant = require("./constant")

const formatObjectData = (object) => {
    if (object instanceof Object) {
        const keys = Object.keys(object)
        for (const key of keys) {
            if (typeof(object[key]) == 'string') {
                object[key] = object[key].trim()
            }
        }
    }

    return object
}

const monthInVietnamese = {
    '01': 'Tháng 1',
    '02': 'Tháng 2',
    '03': 'Tháng 3',
    '04': 'Tháng 4',
    '05': 'Tháng 5',
    '06': 'Tháng 6',
    '07': 'Tháng 7',
    '08': 'Tháng 8',
    '09': 'Tháng 9',
    '10': 'Tháng 10',
    '11': 'Tháng 11',
    '12': 'Tháng 12'
}

const monthInEnglish = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
}

const getMonthNameByLanguage = (lang = constant.LANGUAGE_TYPE.VIETNAMESE, month = '01') => {
    let monthName = ''
    if (lang === constant.LANGUAGE_TYPE.VIETNAMESE) {
        monthName = monthInVietnamese[month]
    } else {
        monthName = monthInEnglish[month]
    }

    return monthName
}

module.exports = {
    formatObjectData,
    getMonthNameByLanguage
}