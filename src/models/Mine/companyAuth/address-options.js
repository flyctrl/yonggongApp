import provinces from 'china-division/dist/provinces.json'
import cities from 'china-division/dist/cities.json'

cities.forEach((city) => {
  const matchProvince = provinces.find(province => province.code === city.provinceCode)
  if (matchProvince) {
    matchProvince.children = matchProvince.children || []
    matchProvince.children.push({
      label: city.name,
      value: city.code
    })
  }
})

const options = provinces.map(province => ({
  label: province.name,
  value: province.code,
  children: province.children,
}))
export default options
