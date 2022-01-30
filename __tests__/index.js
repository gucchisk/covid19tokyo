import { focusStartDateStr } from '../js/index.js'

test('forcusStartDate', () => {
  let date = new Date('2022/01/01')
  expect(focusStartDateStr(date)).toBe('2021/10/03')
  date = new Date('2021/4/30')
  expect(focusStartDateStr(date)).toBe('2021/01/30')
})
