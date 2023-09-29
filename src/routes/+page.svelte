<script>
  import { writable } from "svelte/store"
  import GrantChart from "$lib/GrantChart.svelte";
	import InmateSearch from "$lib/InmateSearch.svelte";

  export let data = {}

  $: stats = data.stats

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

  <div class="chart-graf-container">
    <div class="grafs">
      <p>Is <a href="https://www.cdcr.ca.gov/bph/">the Board</a> granting parole at a higher rate than normal? How did COVID-19 impact the parole hearing process?</p>
      <p>In order to answer these questions we need a time series, machine-readable dataset. The state doesn't publish that, <a href="https://www.jeremiak.com/blog/ca-bph-parole-hearing-results-data/">but I do</a>.</p>
      <div class="chart-container">
        <GrantChart data={stats} />
      </div>
      <p>As we can see from the chart, the rate at which the Board grants parole is pretty consistent over the past few years.</p>
      <p>And if you wanted to see all of the parole hearings for a particular person, the state doesn't publish that either. But I do! Use the form below to look for a specific perons's hearings.</p>
    </div>

  </div>

	<InmateSearch on:selected={handleSelected} />

  {#if $name}
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
  {/if}

  <div class="source">
    <p>
      Source: Scraped regularly from <a
        href="https://www.cdcr.ca.gov/bph/parole-suitability-hearing-results/"
        >https://www.cdcr.ca.gov/bph/parole-suitability-hearing-results/</a
      > and stored at <a href="https://github.com/jeremiak/ca-bph-hearing-results"
	>https://github.com/jeremiak/ca-bph-hearing-results</a>
    </p>
  </div>
</section>

<style>
  section {
    margin: 0 auto;
    max-width: 800px;
    width: 90%;
  }

  p {
    line-height: 1.4rem;
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
