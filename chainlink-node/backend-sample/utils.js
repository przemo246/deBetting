// return matchIds and winners arrays
function getData(result) {
  matchId = [];
  winner = [];
  for (let item of result.response) {
    matchId.push(String(item.fixture.id).valueOf());
    winner.push(
      String(
        determineWinner(item.teams.home.winner, item.teams.away.winner)
      ).valueOf()
    );
  }
  return { matchId: matchId, winner: winner };
}

// determine winner based on dict keys
function determineWinner(isWinnerA, isWinnerB) {
  if (isWinnerA) {
    return 1;
  } else if (isWinnerB) {
    return 2;
  } else {
    return 3;
  }
}

module.exports = { getData };
