export async function get() {
  const { default: hearings } = await import("../../hearing-results.json")
  const transformed = hearings.map(d => {
    const date = d['scheduled-date']
    const result = d.result
    const [year,month,day] = date.split('-')

    return {
      year,
      month,
      day,
      result,
    }
  })

  const groupedByMonth = []

  transformed.forEach(d => {
    const { result } = d
    const key = `${d.year}-${d.month}`
    if (key.includes('undefined')) return
    const match = groupedByMonth.find(dd => dd.key === key)

    if (match) {
      match.results.push(result.toLowerCase())
    } else {
      groupedByMonth.push({ key, results: [result.toLowerCase()]})
    }
  })

  const stats = groupedByMonth.map(d => {
    const { key: month } = d
    const results = {
      grant: 0,
      deny: 0,
      continue: 0,
      cancelled: 0,
      split: 0,
      postpone: 0,
      waive: 0,
      stip: 0,
      total: 0,
    }

    d.results.forEach(result => {
      if (result.includes('grant')) {
        results.grant += 1
      } else if (result.includes('deny')) {
        results.deny += 1
      } else if (result.includes('continue')) {
        results.continue += 1
      } else if (result.includes('split')) {
        results.split += 1
      } else if (result.includes('postpone')) {
        results.postpone += 1
      } else if (result.includes('waive')) {
        results.waive += 1
      } else if (result.includes('stip')) {
        results.stip += 1
      }
      results.total += 1
    })

    return {
      month,
      results
    }
  })


  return {
    status: 200,
    body: stats,
  }
}
