<script>
  import dayjs from "dayjs";
  import * as Pancake from "@sveltejs/pancake";
  export let data = [];

  let closest
  let title = "Parole is granted in fewer than 1 in 5 hearings";

  function formatDate(date) {
    return dayjs(date).format("YYYY-MM");
  }

  function parseDate(date) {
    return dayjs(date, "YYYY-MM");
  }

  $: granted = data.filter((d) => d.type === "grant");

  $: minX = data.length > 0 ? parseDate(data[0].month) : parseDate("2000-01");
  $: maxX =
    data.length > 0
      ? parseDate(data[data.length - 1].month)
      : parseDate("2050-12");
  $: maxY = 30;

  $: lastGranted = granted[granted.length - 1];
  $: lastGrantedPercent = lastGranted?.percent;
  $: chartData = granted.map((d) => ({
            x: parseDate(d.month),
            y: d.percent * 100,
          }))

  $: {
    if (lastGrantedPercent > 0.2) {
      title = `Last month, parole was granted at a rate higher than 1 in 5`;
    }
  }
</script>

<div>
  <div class="title">{title}</div>
  <div class="chart">
    <Pancake.Chart x1={minX} x2={maxX} y1={0} y2={maxY}>
      <Pancake.Grid horizontal count={3} let:value>
        <div class="grid-line horizontal">
          <span
            >{value}{#if value === maxY}% of hearings granted parole{/if}</span
          >
        </div>
      </Pancake.Grid>

      <Pancake.Grid vertical count={3} let:value>
        <span class="x-label">{formatDate(value)}</span>
      </Pancake.Grid>

      <Pancake.Svg>
        <Pancake.SvgLine
          data={chartData}
          let:d
        >
          <path class="data" {d} />
        </Pancake.SvgLine>
      </Pancake.Svg>

      {#if closest}
        {@const value = closest.y}
        {@const month = (new Date(closest.x)).getMonth() + 1}
        {@const year = (new Date(closest.x).getFullYear())}
        <div class="tooltip">
          <div>
            Month: {`${month}`.padStart(2, '0')}-{year}
          </div>
          <div>
            Grant rate: {Math.round(value)}%
          </div>
        </div>
      {/if}

      <Pancake.Quadtree data={chartData} bind:closest/>
    </Pancake.Chart>
  </div>
</div>

<style lang="scss">
  .chart {
    font-family: monospace;
    height: 250px;
    padding: 2em;
    width: 100%;
    // max-width: 600px;
  }

  .grid-line {
    position: relative;
    display: block;
  }

  .grid-line.horizontal {
    width: calc(100% + 2em);
    left: -2em;
    border-bottom: 1px dashed #ccc;
  }

  .grid-line span {
    position: absolute;
    left: 0;
    bottom: 2px;
    font-size: 14px;
    color: #999;
  }

  .x-label {
    position: absolute;
    width: 6em;
    left: -2em;
    bottom: -22px;
    font-size: 14px;
    color: #999;
    text-align: center;
  }

  path.data {
    cursor: pointer;
    stroke: gold;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 4px;
    fill: none;
  }

  .title {
    text-align: center;
    font-weight: 700;
  }

  .tooltip {
    font-size: .8em;
    padding-top: .5rem;
    text-align: center;
  }
</style>
