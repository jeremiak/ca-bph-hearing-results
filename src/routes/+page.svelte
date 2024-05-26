<script>
  import GrantChart from "$lib/GrantChart.svelte";
  import InmateSearchAndResults from "$lib/InmateSearchAndResults.svelte";

  export let data = {};

  $: stats = data.stats;
</script>

<svelte:head>
  <title>California Board of Parole Hearing results</title>
</svelte:head>

<section>
  <h1>California Board of Parole Hearing results</h1>

  <div class="chart-graf-container">
    <div class="grafs">
      <p>
        Is <a href="https://www.cdcr.ca.gov/bph/">the Board</a> granting parole at
        a higher rate than normal? How did COVID-19 impact the parole hearing process?
      </p>
      <p>
        In order to answer these questions we need a time series,
        machine-readable dataset. The state doesn't publish that, <a
          href="https://www.jeremiak.com/blog/ca-bph-parole-hearing-results-data/"
          >but I do</a
        >.
      </p>
      <div class="chart-container">
        <GrantChart data={stats} />
      </div>
      <p>
        As we can see from the chart above, the rate at which the Board grants
        parole is consistently between 10% and 20% over the past few years.
      </p>
      <p>
        And if you wanted to see all of the parole hearings for a particular
        person, the state doesn't publish that either. But I do! Use the form
        below to look for a specific persons's hearings.
      </p>
    </div>
  </div>

  <InmateSearchAndResults />

  <div class="source">
    <p>
      Source: Scraped regularly from <a
        href="https://www.cdcr.ca.gov/bph/parole-suitability-hearing-results/"
        >https://www.cdcr.ca.gov/bph/parole-suitability-hearing-results/</a
      >
      and stored at
      <a href="https://github.com/jeremiak/ca-bph-hearing-results"
        >https://github.com/jeremiak/ca-bph-hearing-results</a
      >
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

  .source {
    font-size: 0.75em;
    font-style: italic;
    margin-top: 1rem;
    text-align: right;
  }
</style>
