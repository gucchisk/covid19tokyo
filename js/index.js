const wardData = {
  '千代田': { autonomy: '区', id: 'chiyoda' },
  '中央': { autonomy: '区', id: 'chuo' },
  '港': { autonomy: '区', id: 'minato' },
  '新宿': { autonomy: '区', id: 'shinjuku' },
  '文京': { autonomy: '区', id: 'bunkyo' },
  '台東': { autonomy: '区', id: 'taito' },
  '墨田': { autonomy: '区', id: 'sumida' },
  '江東': { autonomy: '区', id: 'koto' },
  '品川': { autonomy: '区', id: 'shinagawa' },
  '目黒': { autonomy: '区', id: 'meguro' },
  '大田': { autonomy: '区', id: 'ota' },
  '世田谷': { autonomy: '区', id: 'setagaya' },
  '渋谷': { autonomy: '区', id: 'shibuya' },
  '中野': { autonomy: '区', id: 'nakano' },
  '杉並': { autonomy: '区', id: 'suginami' },
  '豊島': { autonomy: '区', id: 'toshima' },
  '北': { autonomy: '区', id: 'kita' },
  '荒川': { autonomy: '区', id: 'arakawa' },
  '板橋': { autonomy: '区', id: 'itabashi' },
  '練馬': { autonomy: '区', id: 'nerima' },
  '足立': { autonomy: '区', id: 'adachi' },
  '葛飾': { autonomy: '区', id: 'katsushika' },
  '江戸川': { autonomy: '区', id: 'edogawa' },
  '八王子': { autonomy: '市', id: 'hachioji' },
  '立川': { autonomy: '市', id: 'tachikawa' },
  '武蔵野': { autonomy: '市', id: 'musashino' },
  '三鷹': { autonomy: '市', id: 'mitaka' },
  '青梅': { autonomy: '市', id: 'ome' },
  '府中': { autonomy: '市', id: 'fuchu' },
  '青梅': { autonomy: '市', id: 'ome' },
  '昭島': { autonomy: '市', id: 'akishima' },
  '調布': { autonomy: '市', id: 'chofu' },
  '町田': { autonomy: '市', id: 'machida' },
  '小金井': { autonomy: '市', id: 'koganei' },
  '小平': { autonomy: '市', id: 'kodaira' },
  '日野': { autonomy: '市', id: 'hino' },
  '東村山': { autonomy: '市', id: 'higashimurayama' },
  '国分寺': { autonomy: '市', id: 'kokubunji' },
  '国立': { autonomy: '市', id: 'kunitachi' },
  '福生': { autonomy: '市', id: 'fussa' },
  '狛江': { autonomy: '市', id: 'komae' },
  '東大和': { autonomy: '市', id: 'higashiyamato' },
  '清瀬': { autonomy: '市', id: 'kiyose' },
  '東久留米': { autonomy: '市', id: 'higashikurume' },
  '武蔵村山': { autonomy: '市', id: 'musashimurayama' },
  '多摩': { autonomy: '市', id: 'tama' },
  '稲城': { autonomy: '市', id: 'inagi' },
  '羽村': { autonomy: '市', id: 'hamura' },
  'あきる野': { autonomy: '市', id: 'akiruno' },
  '西東京': { autonomy: '市', id: 'nishitokyo' },
  '瑞穂': { autonomy: '町', id: 'mizuho' },
  '日の出': { autonomy: '町', id: 'hinode' },
  '奥多摩': { autonomy: '町', id: 'okutama' },
  '大島': { autonomy: '町', id: 'oshima' },
  '八丈': { autonomy: '町', id: 'hachijo' },
  '檜原': { autonomy: '村', id: 'hinohara' },
  '利島': { autonomy: '村', id: 'toshimamura' },
  '新島': { autonomy: '村', id: 'niijima' },
  '神津島': { autonomy: '村', id: 'kouzushima' },
  '三宅': { autonomy: '村', id: 'miyake' },  
  '御蔵島': { autonomy: '村', id: 'mikurasima' },
  '青ヶ島': { autonomy: '村', id: 'aogashima' },
  '小笠原': { autonomy: '村', id: 'ogasawara' }
}

const totalLabel = '累計'
const dayLabel = '日別'

const baseurl = 'https://raw.githubusercontent.com/gucchisk/parse-tokyo-covid-report-pdf'
const dataurl = 'https://raw.githubusercontent.com/tokyo-metropolitan-gov/covid19/gh-pages/data/130001_tokyo_covid19_patients.csv'

function autonomy(name) {
  const data = wardData[name]
  if (data === undefined) {
    return ''
  }
  return data.autonomy
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

async function getCountTokyo(datestr) {
  const dateText = `${datestr.substring(0, 4)}-${datestr.substring(4, 6)}-${datestr.substring(6, 8)}`
  const res = await fetch(dataurl)
  if (!res.ok) {
    return null
  }
  const text = await res.text()
  return text.split('\n').filter(line => {
    return line.split(',')[4] == dateText
  }).length
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
  const start = new Date().getMilliseconds()
  const all = await getDataList()
  const list = [all[0], all[1]]
  if (list === null) {
    error()
    return
  }
  getCountTokyo(list[0]).then(count => {
    document.getElementById('date').innerHTML = `${dateString(list[0])} - ${count}<span>人</span>`
  })
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

  const range = Math.floor(max / 31)
  const level1 = range
  const level2 = range * 3
  const level3 = range * 7
  const level4 = range * 15

  data[0].forEach((obj, i) => {
    const div = document.createElement('div')
    const diff = parseInt(obj.num) - parseInt(data[1][i].num)
    let diffText = ""
    if (Object.keys(wardData).includes(obj.ward)) {
      if (diff === 0) {
	diffText = "(±0)";
      } else {
	if (diff < 0) {
	  diffText = `(<span class="plus">${diff}</span>)`
	} else if (diff < 10) {
	  diffText = `(<span class="plus">+${diff}</span>)`
	} else {
	  diffText = `(<span class="plus emphasis">+${diff}</span>)`
	}
      }
    }
    let level = 1
    if (i < data[0].length - 2) {
      const num = parseInt(obj.num)
      if (num > level4) {
	level = 5
      } else if (num > level3) {
	level = 4
      } else if (num > level2) {
	level = 3
      } else if (num > level1) {
	level = 2
      }
    }
    div.className = `item level${level}`
    const name = obj.ward + autonomy(obj.ward)
    const wdata = wardData[obj.ward]
    let divtag = '<div>'
    if (wdata !== undefined) {
      divtag = `<div id="${wdata.id}" class="clickpop" href="#popup" data-effect="mfp-zoom-in">`
    }
    div.innerHTML = `${divtag}<p class="ward">${name}</p><p class="num">${obj.num} ${diffText}</p></div>`
    document.getElementById('grid-main').append(div)
  })

  const end = new Date().getMilliseconds()
  const timeout = (end - start) < 1000 ? 1000 - (end - start) : 0
  setTimeout(() => {
    $('.loader').removeClass('is-active')
  }, timeout)

  $('.clickpop').magnificPopup({
    removalDelay: 300,
    callbacks: {
      beforeOpen: function() {
	const el = this.st.el
	const name = el.children('.ward').text()
	$('#charttitle').html(name)
	this.st.mainClass = el.attr('data-effect')
      },
      open: async function() {
	setTimeout(async () => {
	  const el = this.st.el
	  const id = el.attr('id')
	  const name = el.children('.ward').text()
	  let x = ['x']
	  let total = [totalLabel]
	  let day = [dayLabel]
	  list.forEach((l) => {
	    x.push(`${l.substring(0, 4)}/${l.substring(4, 6)}/${l.substring(6, 8)}`)
	    total.push(0)
	    day.push(0)
	  })
	  const filename = `${id}.csv`

	  const res = await fetch(`${baseurl}/master/data/${filename}`)
	  const text = await res.text()
	  const lines = text.split('\n')
	  x = ['x']
	  total = [totalLabel]
	  day = [dayLabel, 0]
	  lines.forEach((line, index) => {
	    const datevalue = line.split(',')
	    if (datevalue[1] !== undefined) {
	      const date = datevalue[0]
	      x.push(`${date.substring(0, 4)}/${date.substring(4, 6)}/${date.substring(6, 8)}`)
	      if (index !== 0) {
		day.push(datevalue[1] - total[total.length - 1])
	      }
	      total.push(datevalue[1])
	    }
	  })
	  // this.chart.load({
	  //   columns: [
	  //     x,
	  //     day,
	  //     total
	  //   ],
	  // })
	  this.chart = c3.generate({
	    bindto: '#chart',
	    data: {
	      x: 'x',
	      hide: [totalLabel],
	      xFormat: '%Y/%m/%d',
	      columns: [
		x,
		day,
		total
	      ],
	      groups: [
		['value']
	      ],
	      type: 'bar'
	    },
	    bar: {
	      width: {
		ratio: 0.5
	      }
	    },
	    axis: {
	      x: {
		type: 'timeseries',
		tick: {
		  culling: true,
		  format: '%m/%d'
		}
	      }
	    },
	    subchart: {
	      show: true,
	    },
	    zoom: {
	      enabled: true,
	      rescale: true
	    }
	  })
	  // this.chart.zoom(['2020/10/01', x[x.length-1]])
	  const d = new Date()
	  const today = `${d.getFullYear()}/${(d.getMonth()+1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`
	  this.chart.zoom(['2020/10/01', today])
	}, 200)
      },
      close: function() {
	this.chart.unload({
	  ids: [this.st.el.children('.ward').text()]
	})
      }
    },
    midClick: true
  })
}
