export const API_URL = 'https://braitokit.kaiyouit.com'

export const getMaterial = {
  method: 'GET',
  url: `${API_URL}/api/materials`
}

export const addMaterial = {
  method: 'POST',
  url: `${API_URL}/api/materials`
}
export const editMaterial = {
  method: 'PUT',
  url: `${API_URL}/api/materials`
}

export const delMaterial = {
  method: 'DELETE',
  url: `${API_URL}/api/materials`
}

export const materialUnits = [
  '勺',
  '合',
  '升',
  '斗',
  'cc',
  'mℓ',
  'ℓ',
  'cup',
  'g',
  'kg',
  'つまみ',
  '振り',
  'つかみ',
  '杯',
  '個',
  '本',
  '枚',
  'パック',
  '粒',
  '束',
  '缶',
  '切れ',
  '丁',
  'かけ',
  '片',
  '房',
  '節',
  '尾',
  'mm',
  'cm',
  'm',
  '適量',
  '少々'
]

export const categories = ['0-漬け地', '1-かけ地', '2-焚き地', '3-合わせ地', '4-餡', '5-衣', '6-スープ/汁', '7-ゼリー', '8-ソース/タレ', '9-その他']
