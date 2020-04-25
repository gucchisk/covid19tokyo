const ward = ['千代田', '中央', '港', '新宿', '文京', '台東', '墨田', '江東', '品川', '目黒', '大田', '世田谷', '渋谷', '中野', '杉並', '豊島',
	      '北', '荒川', '板橋', '練馬', '足立', '葛飾', '江戸川']
const city = ['八王子', '立川', '武蔵野', '三鷹', '青梅', '府中', '昭島', '調布', '町田', '小金井', '小平', '日野', '東村山', '国分寺', '国立',
	      '福生', '狛江', '東大和', '清瀬', '東久留米', '武蔵村山', '多摩', '稲城', '羽村', 'あきる野', '西東京']
const town = ['瑞穂', '日の出', '奥多摩', '大島', '八丈']
const village = ['檜原', '利島', '新島', '神津島', '三宅', '御蔵島', '青ヶ島', '小笠原']

const baseurl = 'https://raw.githubusercontent.com/gucchisk/parse-tokyo-covid-report-pdf'

function autonomy(name) {
  if (ward.includes(name)) {
    return '区'
  }
  if (city.includes(name)) {
    return '市'
  }
  if (town.includes(name)) {
    return '町'
  }
  if (village.includes(name)) {
    return '村'
  }
  return ''
}

function dateString(date) {
  const y = date.substring(0, 4)
  const m = date.substring(4, 6)
  const d = date.substring(6, 8)
  return [y, m, d].join('/')
}

async function getCSV(filename) {
  // let path
  // if (ENV.env === 'dev') {
  //   path = 'dev'
  // } else {
  //   path = 'csv'
  // }
  const res = await fetch(`${baseurl}/master/csv/${filename}`)
  if (!res.ok) {
    return null
  }
  const text = await res.text()
  const result = []
  const items = text.split("\n")
  const data = new Array()
  items
    .filter(item => item !== '')
    .forEach(item => {
      const arr = item.split(',')
      const ward = arr[0]
      const num = arr[1]
      data.push({ ward, num })
    })
  return data
}

async function getDataList() {
  // let path
  // if (ENV.env === 'dev') {
  //   path = 'dev'
  // } else {
  //   path = '.'
  // }
  const res = await fetch(`${baseurl}/master/list.txt`)
  if (!res.ok) {
    return null
  }
  const text = await res.text()
  return text.split("\n").filter(x => x !== "")
}

async function getData(list) {
  const fetches = list.map(filename => {
    return getCSV(filename)
  })
  return Promise.all(fetches)
}

function error() {
  document.getElementById('grid-main').innerHTML = '<p class="message">ごめんなさい🙇‍データのロードに失敗しました。</p>'
}

window.onload = async () => {
  const list = await getDataList()
  if (list === null) {
    error()
    return
  }
  document.getElementById('date').innerHTML = dateString(list[0])
  const data = await getData(list)
  
  if (data[0] === null || data[1] === null) {
    error()
    return
  }

  let max = 0
  data[0].forEach((obj, i) => {
    if (data[0].length - 1 === i) {
      return
    }
    const current = parseInt(obj.num)
    if (current > max) {
      max = current
    }
  })
  const range = max / 5
  data[0].forEach((obj, i) => {
    const div = document.createElement('div')
    const diff = parseInt(obj.num) - parseInt(data[1][i].num)
    let diffText
    if (diff === 0) {
      diffText = "±0";
    } else {
      if (diff < 0) {
	diffText = `<span class="plus">${diff}</span>`
      } else if (diff < 10) {
	diffText = `<span class="plus">+${diff}</span>`
      } else {
	diffText = `<span class="plus emphasis">+${diff}</span>`
      }
    }
    let level = 1
    if (i < data[0].length - 2) {
      level = Math.floor((parseInt(obj.num) / range) + 1)
      level = level > 5 ? 5 : level
    }
    div.className = `item level${level}`
    const name = obj.ward + autonomy(obj.ward)
    div.innerHTML = `<p class="ward">${name}</p><p class="num">${obj.num} (${diffText})</p>`
    document.getElementById('grid-main').append(div)
  })
}
