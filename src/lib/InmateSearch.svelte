<script>
  	import { createEventDispatcher } from 'svelte'
  import { writable } from "svelte/store"

  const dispatch = createEventDispatcher()
  const searchResults = writable(null)
  let name = null
  let isSearching = false

  async function search() {
    isSearching = true
    const response = await fetch(`/search.json?name=${name}`)
    const json = await response.json()

    searchResults.set(json)

    isSearching = false
  }

  function handleResultSelect(result) {
    return () => {
      name = `${result.name} (${result.cdc})`
      searchResults.set(null)
      dispatch('selected', result)
    }
  }
</script>

<form>
  <label for="cdcrIdSearch"
    >Search for a CDCR inmate to see all of their hearings</label
  >
  <input
    id="cdcrIdSearch"
    type="text"
    placeholder={"Type a name here..."}
    bind:value={name}
  />
  {#if $searchResults}
    <ul>
      {#each $searchResults as result}
        <li class="result">
          <button on:click|preventDefault={handleResultSelect(result)}>
            <span class="result-name">{result.name}</span>
            <span class="result-id">{result.cdc}</span>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
  <button
    class="search-btn"
    on:click|preventDefault={search}
    disabled={isSearching}
  >
    🔎 {#if isSearching}Searching...{:else}Search{/if}
  </button>
</form>

<style lang="scss">

  :root {
    --search-width: 300px;

    @media screen and (min-width: 650px) {
      --search-width: 500px;
    }
  }

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

  label {
    text-align: center;
  }

  input[type="text"] {
    font-family: inherit;
    font-size: inherit;
    margin: 0.5rem auto;
    margin-bottom: 0;
    max-width: 90vw;
    padding: 0.25rem;
    width: var(--search-width);
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

  button[disabled] {
    background-color: #ccc;
  }

  ul {
    border: 1px solid black;
    max-height: 240px;
    margin: 0 auto;
    padding-left: 0;
    overflow-y: scroll;
    list-style-type: none;
    width: var(--search-width);
  }

  li {
    padding: 0.25rem;
  }

  li:nth-child(odd) {
    background-color: #ccc;
  }

  .result button {
    display: flex;
    font-size: inherit;
    justify-content: space-between;
    width: 100%;
  }

  .result-name {
    padding-left: .2rem;
  }

  .result-id {
    font-style: italic;
    padding-right: .2rem;
  }
</style>
