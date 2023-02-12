import { syncFixtures } from "../api/fixture/fixtureService"

(async () => {
  const fixtures = await syncFixtures();
  return fixtures;
})().then((fixtures) => {
  console.log(`Sync complete, downloaded ${fixtures.response.length} fixtures`)
  process.exit(0);
})