export async function load({ fetch }) {
  const response = await fetch(`/stats.json`);
  const json = await response.json();
  const withPercents = json
    .map((d) => {
      const { month, results } = d;
      const { grant, deny, total } = results;
      return [
        {
          month,
          type: "grant",
          value: grant,
          percent: grant / total,
        },
        {
          month,
          type: "deny",
          value: deny,
          percent: deny / total,
        },
      ];
    })
    .flat();
  return {
    stats: withPercents,
  };
}
