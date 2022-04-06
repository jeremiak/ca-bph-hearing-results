import { promises as fs } from 'fs'

import _ from 'lodash'
import cheerio from 'cheerio'
import dayjs from 'dayjs'
import fetch from 'isomorphic-fetch'

const existingFile = await fs.readFile('./hearing-results.json')
const existing = JSON.parse(existingFile.toString())

async function scrapeResultsUrl() {
    const response = await fetch('https://www.cdcr.ca.gov/bph/parole-suitability-hearing-results/')
    const html = await response.text()
    const $ = cheerio.load(html)
    const lis = $('#hearing-results-by-month + ul li')
    const first = lis[0]
    const href = $(first).find('a').attr('href')
    return href
}

async function scrapeResults(url) {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    const rows = $('article table tbody tr')
    const data = []
    rows.each((i, row) => {
        const cells = $(row).find('td')
        const columns = cells.length === 8 ? [
            'name',
            'cdc',
            'in-person',
            'commitment-county',
            'gov-code',
            'scheduled-date',
            'hearing-type',
            'result',
        ] : [
            'name',
            'cdc',
            'commitment-county',
            'gov-code',
            'scheduled-date',
            'hearing-type',
            'result',
        ]
        const d = {}
        cells.each((ii, cell) => {
            const text = $(cell).text()
            const col = columns[ii]

            if (col === 'scheduled-date') {
                const split = text.split(',')
                const date = split.slice(1).join(',').trim()
                const parsed = dayjs(date, "MMMM DD, YYYY")
                d[col] = parsed.format('YYYY-MM-DD')
            } else {
                d[col] = text.trim().replace('\n', '')
            }
        })
        data.push(d)
    })

    return data
}

function merge(existing, current, keyFn) {
    const merged = [...existing]

    current.forEach(d => {
        const currentKey = keyFn(d)
        const exists = merged.find(dd => {
            const ddKey = keyFn(dd)
            return ddKey === currentKey
        })

        if (exists) return
        merged.push(d)
    })

    return merged
}

// const resultsUrl = 'https://www.cdcr.ca.gov/bph/2021/11/10/hearing-results-october-2021-2/'
const resultsUrl = await scrapeResultsUrl()
console.log(`🌎 Scraping ${resultsUrl}`)
const results = await scrapeResults(resultsUrl)
console.log(`🥸 Found ${results.length.toLocaleString('en-US')} hearing results`)
const merged = merge(existing, results, d => {
    return `${d.cdc}-${d['scheduled-date']}`
})
console.log(`💾 Saving all ${merged.length.toLocaleString('en-US')} hearing results`)
const ordered = _.orderBy(merged, ['scheduled-date', 'name'])
await fs.writeFile('./hearing-results.json', JSON.stringify(ordered, null, 2))