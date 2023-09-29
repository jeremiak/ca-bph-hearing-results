<script>
  import dayjs from "dayjs";
  import * as Pancake from "@sveltejs/pancake";
  export let data = [];

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
</script>

<div>
  <div class="title">Parole is granted at a relatively consistent rate</div>
  <div class="chart">
    <Pancake.Chart x1={minX} x2={maxX} y1={0} y2={100}>
      <Pancake.Grid horizontal count={4} let:value>
        <div class="grid-line horizontal">
          <span
            >{value}{#if value === 100}% of hearings granted parole{/if}</span
          >
        </div>
      </Pancake.Grid>

      <Pancake.Grid vertical count={5} let:value>
        <span class="x-label">{formatDate(value)}</span>
      </Pancake.Grid>

      <Pancake.Svg>
        <Pancake.SvgLine
          data={granted.map((d) => ({
            x: parseDate(d.month),
            y: d.percent * 100,
          }))}
          let:d
        >
          <path class="data" {d} />
        </Pancake.SvgLine>
      </Pancake.Svg>
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
    width: 4em;
    left: -2em;
    bottom: -22px;
    font-size: 14px;
    color: #999;
    text-align: center;
  }

  path.data {
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
</style>
