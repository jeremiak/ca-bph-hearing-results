import { json } from '@sveltejs/kit';
import data from "../../../hearing-results.json"

function formatName(name) {
    const replaced = name.replace(/\s+/g, ' ')
    const [lastName, ...restOfName] = replaced.split(', ')
    return `${lastName}, ${restOfName.join(' ')}`
}

export async function GET({ url }) {
    const nameParam = url.searchParams.get("name").toUpperCase()

    const matched = []

    data.forEach(d => {
        const { name, cdc } = d

        const nameMatch = name.includes(nameParam)
        const alreadyExists = matched.find(dd => dd.cdc === cdc)
        if (nameMatch && !alreadyExists) {
            matched.push({
                name: formatName(name),
                cdc
            })
        }
    })

    const sorted = matched.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
    })

    return json(sorted)
}