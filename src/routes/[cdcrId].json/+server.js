import { json } from '@sveltejs/kit';
import hearings from "../../../hearing-results.json"

export async function GET({ params }) {
  const { cdcrId } = params
  const match = hearings.filter(d => d["cdc"] === cdcrId)

  return json(match)
}
