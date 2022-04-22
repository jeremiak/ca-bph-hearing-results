import data from "../../hearing-results.json"

export async function get({ url }) {
  const nameParam = url.searchParams.get("name").toUpperCase()

  const matched = []

  data.forEach(d => {
    const { name, cdc } = d

    const nameMatch = name.includes(nameParam)
    const alreadyExists = matched.find(dd => dd.cdc === cdc)
    if (nameMatch && !alreadyExists) {
      matched.push({
        name: name.replace(/\s+/g, ' '),
        cdc
      })
    }
  })

  const sorted = matched.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name > b.name) return 1
    return 0
  })

  return {
    status: 200,
    body: sorted,
  }
}
