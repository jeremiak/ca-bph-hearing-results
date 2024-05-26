export async function load({ fetch }) {
  const response = await fetch(`/stats.json`);
  const json = await response.json();
  let overallTotal = 0
  let overallGrant = 0
  let overallDeny = 0
  const withPercents = json
    .map((d) => {
      const { month, results } = d;
      const { grant, deny, total } = results;
      overallTotal += total
      overallGrant += grant
      overallDeny += deny
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
    total: overallTotal,
    grant: overallGrant,
    deny: overallDeny
  };
}
