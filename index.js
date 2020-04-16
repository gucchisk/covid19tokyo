async function getCSV(date) {
  const res = await fetch(`${date}.csv`)
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
  const res = await fetch('latest.txt')
  console.log(res)
  if (!res.ok) {
    return null
  }
  const text = await res.text()
  return text.split("\n").filter(x => x !== "")
}

async function getData(list) {
  const fetches = list.map(name => {
    return getCSV(name)
  })
  return Promise.all(fetches)
}

window.onload = async () => {
  const list = await getDataList()
  // const data = await getCSV('20200414')
  document.getElementById('date').innerHTML = list[0]
  const data = await getData(list)
  
  if (data[0] === null || data[1] === null) {
    document.getElementById('grid-main').innerHTML = '<p class="message">ごめんなさい🙇‍データのロードに失敗しました。</p>'
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
      diffText = diff >= 10 ? `<span class="plus up">+${diff}</span>` : `<span class="plus">+${diff}</span>`
    }
    let level = 1
    if (i < data[0].length - 2) {
      level = Math.floor((parseInt(obj.num) / range) + 1)
      level = level > 5 ? 5 : level
    }
    div.className = `item level${level}`
    div.innerHTML = `<p class="ward">${obj.ward}</p><p class="num">${obj.num}(${diffText})</p>`
    document.getElementById('grid-main').append(div)
  })
}
