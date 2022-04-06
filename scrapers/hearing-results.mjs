import { promises as fs } from 'fs'

import _ from 'lodash'
import cheerio from 'cheerio'
import dayjs from 'dayjs'
import fetch from 'isomorphic-fetch'

const existingFile = await fs.readFile('./data/hearing-results.json')
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
    const columns = [
        'name',
        'cdc',
        'commitment-county',
        'gov-code',
        'scheduled-date',
        'hearing-type',
        'result',
    ]

    rows.each((i, el) => {
        const row = $(el).find('td')
        const d = {}
        row.each((ii, cell) => {
            const text = $(cell).text()
            const col = columns[ii]

            if (col === 'scheduled-date') {
                const split = text.split(',')
                const date = split.slice(1).join(',').trim()
                const parsed = dayjs(date, "MMMM DD, YYYY")
                d[col] = parsed.format('YYYY-MM-DD')
            } else {
                d[col] = text.trim()
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



// const resultsUrl = 'https://web.archive.org/web/20201223093748/https://www.cdcr.ca.gov/bph/2019/11/07/hearing-results-october-2019/'
const resultsUrl = await scrapeResultsUrl()
console.log(`🌎 Scraping ${resultsUrl}`)
const results = await scrapeResults(resultsUrl)
console.log(`Found ${results.length.toLocaleString('en-US')} hearing results`)
const merged = merge(existing, results, d => {
    return `${d.cdc}-${d['scheduled-date']}`
})
console.log(`Saving all ${merged.length.toLocaleString('en-US')} hearing results`)
const ordered = _.orderBy(merged, ['scheduled-date'])
await fs.writeFile('./data/hearing-results.json', JSON.stringify(ordered, null, 2))