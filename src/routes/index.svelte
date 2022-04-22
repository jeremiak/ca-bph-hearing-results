<script context="module">
  export async function load({ fetch }) {
    const response = await fetch(`/stats.json`)
    const json = await response.json()
    const withPercents = json.map((d) => {
      const { month, results } = d
			const {	grant, deny, total } = results
      return [{
        month,
        type: 'grant',
				value: grant,
				percent: grant / total,
			},
			{
        month,
        type: 'deny',
				value: deny,
				percent: deny / total,
			}
			]
    }).flat()
    return {
      props: {
        stats: withPercents,
      },
    }
  }
</script>

<script>
  import { writable } from "svelte/store"
	import InmateSearch from "$lib/InmateSearch.svelte";

  export let stats = null

  const hearings = writable([])
  const name = writable(null)

  async function handleSelected(e) {
		const result = e.detail
		const response = await fetch(`/${result.cdc}.json`)
    const json = await response.json()

    hearings.set(json)
		name.set(`${result.name}`)
	}
</script>

<svelte:head>
  <title>CA Board of Parole Hearing results</title>
</svelte:head>

<section>
  <h1>CA Board of Parole Hearing results</h1>

	<InmateSearch on:selected={handleSelected} />

  <table>
    <caption>Hearings for {$name || "--"}</caption>
    <thead>
      <tr>
        <th>Date</th>
        <th>County</th>
        <th>Code</th>
        <th>Result</th>
      </tr>
    </thead>
    <tbody>
      {#if $hearings.length === 0}
        <tr>
          <td>--</td>
          <td>--</td>
          <td>--</td>
          <td>--</td>
        </tr>
      {/if}
      {#each $hearings as hearing}
        <tr>
          <td>{hearing["scheduled-date"]}</td>
          <td>{hearing["commitment-county"]}</td>
          <td>{hearing["gov-code"]}</td>
          <td>{hearing.result}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <div class="source">
    <p>
      Source: Scraped regularly from <a
        href="https://www.cdcr.ca.gov/bph/parole-suitability-hearing-results/"
        >https://www.cdcr.ca.gov/bph/parole-suitability-hearing-results/</a
      >
    </p>
  </div>
</section>

<style lang="scss">
  section {
    margin: 0 auto;
    max-width: 800px;
    width: 90%;
  }

  form {
    background-color: #eee;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    margin-top: 1rem;
    padding: 1rem;
  }

  input[type="text"] {
    font-family: inherit;
    font-size: inherit;
    margin: 0.5rem auto;
    min-width: 50vw;
    padding: 0.25rem;
  }

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: block;
    font-family: inherit;
  }

  button.search-btn {
    background-color: gold;
    font-size: 1.1rem;
    margin: 0.5rem auto;
    padding: 1rem 2rem;
    width: 165px;
  }

  button.example {
    text-align: right;
  }

  button[disabled] {
    background-color: #ccc;
  }

  table {
    border: 1px solid black;
    border-collapse: collapse;
    width: 100%;
  }

  caption {
    margin-bottom: 0.5rem;
  }

  th {
    text-align: left;
  }

  th,
  td {
    padding: 0.25rem;
  }

  tbody tr:nth-child(odd) {
    background-color: #ccc;
  }

  .source {
    font-size: 0.75em;
    font-style: italic;
    margin-top: 1rem;
    text-align: right;
  }
</style>
