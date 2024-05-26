<script>
  import { writable } from "svelte/store";
  import InmateSearch from "./InmateSearch.svelte";

  const hearings = writable([]);
  const name = writable(null);

  async function handleSelected(e) {
    const result = e.detail;
    const response = await fetch(`/${result.cdc}.json`);
    const json = await response.json();

    hearings.set(json);
    name.set(`${result.name}`);
  }
</script>

<div class="container">
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
</div>

<style>
  .container {
    background-color: #212121;
    border-radius: 5px;
    border: 1px dashed white;
    padding: 0.5em;
  }

  table {
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
    background-color: #4d4c4c;
  }
</style>
