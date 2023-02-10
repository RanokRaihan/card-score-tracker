// get html element
const teamAScoreInput = document.querySelector("#inputA");
const teamBScoreInput = document.querySelector("#inputB");
const addButton = document.querySelector(".submit-Button");
const teamAName = document.querySelector(".team-a-name");
const teamBName = document.querySelector(".team-b-name");
const clearButton = document.querySelector(".clear");
const addScoreForm = document.querySelector(".add-score-form");
const trackContainer = document.querySelector(".score-tracks");
const teamATotalScore = document.querySelector(".team-a-score");
const teamBTotalScore = document.querySelector(".team-b-score");

//team name
const setTeamName = () => {
  const teamNames = localStorage.getItem("teamNames");
  if (!teamNames) {
    localStorage.setItem(
      "teamNames",
      JSON.stringify({
        teamA: "Team A",
        teamB: "Team B",
      })
    );
  } else {
    const teamNameParsed = JSON.parse(teamNames);
    teamAName.value = teamNameParsed.teamA;
    teamBName.value = teamNameParsed.teamB;
    teamAScoreInput.placeholder = `${teamNameParsed.teamA} score`;
    teamBScoreInput.placeholder = `${teamNameParsed.teamB} score`;
  }
};

// edit team name
const editTeamName = (teamName, value) => {
  const teamNames = JSON.parse(localStorage.getItem("teamNames"));
  teamNames[teamName] = value;
  localStorage.setItem("teamNames", JSON.stringify(teamNames));
};

//render function
const render = () => {
  const data = JSON.parse(localStorage.getItem("trackDB"));
  let markup = "";
  let teamATotal = 0;
  let teamBTotal = 0;
  if (data) {
    data.forEach((singleData) => {
      markup += `<div class="single-track">
     
      <div class="team-track team-a-track">
        <div class="prev-score">${teamATotal}</div>
        <div class="round-result ${singleData?.teamAStatus > 0 ? "green" : "red"}">${
        singleData?.teamAStatus > 0 ? `+${singleData?.teamAStatus}` : singleData?.teamAStatus
      }</div>
        <div class="sub-total">${teamATotal + singleData?.teamAStatus}</div>
      </div>
     
      <div class="team-track team-b-track">
        <div class="prev-score">${teamBTotal}</div>
        <div class="round-result ${singleData?.teamBStatus > 0 ? "green" : "red"}">${
        singleData?.teamBStatus > 0 ? `+${singleData?.teamBStatus}` : singleData?.teamBStatus
      }</div>
        <div class="sub-total">${teamBTotal + singleData?.teamBStatus}</div>
      </div>
    </div>`;
      teamATotal += singleData.teamAStatus;
      teamBTotal += singleData.teamBStatus;
    });
  }
  trackContainer.innerHTML = markup;
  teamATotalScore.innerText = teamATotal;
  teamBTotalScore.innerText = teamBTotal;
};

//clear scores function
const clearScores = () => {
  if (confirm("Are you sure to clear the scores?")) {
    localStorage.removeItem("trackDB");
    render();
  }
};

//clear input
const clearInput = () => {
  teamAScoreInput.value = "";
  teamBScoreInput.value = "";
};
// add score function
const addScore = (e) => {
  e.preventDefault();

  const teamAScore = teamAScoreInput.value;
  const teamBScore = teamBScoreInput.value;
  //   console.log(teamAScore, teamBScore);
  if (teamAScore.trim() === "" || teamBScore.trim() === "") {
    console.log("entered");
    return;
  }
  console.log(teamAScore, teamBScore);
  const db = localStorage.getItem("trackDB");
  console.log(db);
  if (db) {
    const dbParsed = JSON.parse(db);

    const newTrackData = {
      roundNo: dbParsed.length + 1,
      teamAStatus: Number(teamAScore),
      teamBStatus: Number(teamBScore),
    };
    dbParsed.push(newTrackData);
    localStorage.setItem("trackDB", JSON.stringify(dbParsed));
  } else {
    const newTrackData = {
      roundNo: 1,
      teamAStatus: Number(teamAScore),
      teamBStatus: Number(teamBScore),
    };
    localStorage.setItem("trackDB", JSON.stringify([newTrackData]));
  }
  clearInput();
  render();
};

setTeamName();
render();
addScoreForm.addEventListener("submit", (e) => addScore(e));
clearButton.addEventListener("click", clearScores);

teamAName.addEventListener("blur", (e) => {
  editTeamName("teamA", e.target.value);
  teamAScoreInput.placeholder = `${e.target.value} score`;
});
teamBName.addEventListener("blur", (e) => {
  editTeamName("teamB", e.target.value);
  teamBScoreInput.placeholder = `${e.target.value} score`;
});
