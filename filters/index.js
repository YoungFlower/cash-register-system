

// 生日过滤
export const filterBirthday = function (string) {
  return string.substr(0,7)
}
// 分->元
export const priceFormat = function (price) {
  return parseFloat(price / 100).toFixed(2)
}


// 计算时间填0
export const zero = function (count) {
  if (count < 10) count = '0' + count
  return count
}


// 百千万加逗号
export const countFilter = function (msg) {
  msg = msg.toString()
  let temp = ''
  let unit = ''
  if(parseInt(msg)>=10000){

  msg = parseInt(msg/10000).toString()
  unit='万'
  }
  for (let i = msg.length - 1, j = 1; i >= 0; i--, j++) {
    if ((j - 1) % 3 == 0 && j != 1) {
      temp = ',' + temp
    }
    temp = msg[i] + temp
  }
  return temp +unit
}


// 时间戳转标准时间
export const parseTime = function (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
