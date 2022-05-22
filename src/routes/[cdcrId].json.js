export async function get({ params }) {
  const { cdcrId } = params
  const { default: hearings } = await import("../../hearing-results.json")
  const match = hearings.filter(d => d["cdc"] === cdcrId)
  return {
    status: 200,
    body: match,
  }
}
