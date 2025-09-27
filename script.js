//Get all DOM elements.
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const attendeeList = document.getElementById("attendeeList");

//Track attendance.
let count = 0;
const maxCount = 50;

// Get the winning team
function getWinningTeam() {
  const waterCount = parseInt(
    document.getElementById("waterCount").textContent
  );
  const zeroCount = parseInt(document.getElementById("zeroCount").textContent);
  const powerCount = parseInt(
    document.getElementById("powerCount").textContent
  );

  // Find the maximum count
  const maxTeamCount = Math.max(waterCount, zeroCount, powerCount);

  // Determine which team(s) have the maximum count
  let winningTeams = [];

  if (waterCount === maxTeamCount) {
    winningTeams.push({
      name: "Team Water Wise",
      color: "#0096d6",
      emoji: "🌊",
    });
  }

  if (zeroCount === maxTeamCount) {
    winningTeams.push({ name: "Team Net Zero", color: "#34a853", emoji: "🌿" });
  }

  if (powerCount === maxTeamCount) {
    winningTeams.push({
      name: "Team Renewables",
      color: "#ff9900",
      emoji: "⚡",
    });
  }

  return winningTeams;
}

// Show celebration message
function showCelebrationMessage() {
  // Get winning team
  const winningTeams = getWinningTeam();

  const modalContainer = document.createElement("div");
  modalContainer.className = "celebration-modal";

  const modalContent = document.createElement("div");
  modalContent.className = "celebration-content";

  const celebrationHeader = document.createElement("h2");
  celebrationHeader.className = "celebration-header";
  celebrationHeader.textContent = "Sustainability Summit Goal Reached! 🎉";

  const messageContent = document.createElement("p");
  messageContent.className = "celebration-message";

  // Handle different winning scenarios
  if (winningTeams.length === 1) {
    // Single winner
    const winner = winningTeams[0];
    messageContent.innerHTML = `Congratulations! We've reached our attendance goal of ${maxCount} participants!<br><br>
                              <strong style="color:${winner.color};">${winner.emoji} ${winner.name}</strong> takes the lead with the most attendees!`;
  } else {
    // Multiple winners (tie)
    messageContent.innerHTML = `Congratulations! We've reached our attendance goal of ${maxCount} participants!<br><br>We have a tie between:`;

    const winnersList = document.createElement("ul");
    winnersList.className = "winners-list";

    winningTeams.forEach(function (team) {
      const listItem = document.createElement("li");
      listItem.style.color = team.color;
      listItem.textContent = `${team.emoji} ${team.name}`;
      winnersList.appendChild(listItem);
    });

    messageContent.appendChild(winnersList);
  }

  // Create close button
  const closeButton = document.createElement("button");
  closeButton.className = "celebration-button";
  closeButton.textContent = "Close";

  // Add click event to close modal
  closeButton.addEventListener("click", function () {
    document.body.removeChild(modalContainer);
  });

  // Assemble modal
  modalContent.appendChild(celebrationHeader);
  modalContent.appendChild(messageContent);
  modalContent.appendChild(closeButton);
  modalContainer.appendChild(modalContent);

  // Add to body
  document.body.appendChild(modalContainer);
}

// Add attendee to list
function addAttendeeToList(name, team, teamName) {
  // Create list item
  const listItem = document.createElement("li");

  // Create name span
  const nameSpan = document.createElement("span");
  nameSpan.textContent = name;
  nameSpan.className = "attendee-name";

  // Create team span with color coding
  const teamSpan = document.createElement("span");
  teamSpan.textContent = teamName;
  teamSpan.className = `attendee-team ${team}`;

  // Assemble list item
  listItem.appendChild(nameSpan);
  listItem.appendChild(teamSpan);
  attendeeList.appendChild(listItem);
}

// Save attendee to localStorage
function saveAttendeeToStorage(name, team, teamName) {
  // Get existing attendees or initialize empty array
  const attendees = JSON.parse(localStorage.getItem("attendees") || "[]");

  // Add new attendee
  attendees.push({ name, team, teamName });

  // Save back to localStorage
  localStorage.setItem("attendees", JSON.stringify(attendees));
}

// Load and display all attendees
function loadAttendeesFromStorage() {
  const attendees = JSON.parse(localStorage.getItem("attendees") || "[]");

  attendees.forEach(function (attendee) {
    addAttendeeToList(attendee.name, attendee.team, attendee.teamName);
  });
}

// Load saved counts from localStorage
function loadFromLocalStorage() {
  // Load total count
  const savedCount = localStorage.getItem("attendeeCount");
  if (savedCount !== null) {
    count = parseInt(savedCount);
    attendeeCount.textContent = count;

    // Update progress bar
    const percentage = Math.round((count / maxCount) * 100) + "%";
    progressBar.style.width = percentage;
  }
  // Load team counts
  const options = teamSelect.options;
  for (let i = 0; i < options.length; i++) {
    const teamId = options[i].value;
    if (teamId) {
      const teamCounter = document.getElementById(teamId + "Count");
      if (teamCounter) {
        const savedTeamCount = localStorage.getItem(teamId + "Count");
        if (savedTeamCount !== null) {
          teamCounter.textContent = savedTeamCount;
        }
      }
    }
  }

  // Load attendees list
  loadAttendeesFromStorage();

  // Check if we've reached max count already
  if (count >= maxCount) {
    // Small timeout to ensure UI is updated first
    setTimeout(showCelebrationMessage, 500);
  }
}

// Save counts to localStorage
function saveToLocalStorage() {
  localStorage.setItem("attendeeCount", count);

  // Save team counts
  const options = teamSelect.options;
  for (let i = 0; i < options.length; i++) {
    const teamId = options[i].value;
    if (teamId) {
      const teamCounter = document.getElementById(teamId + "Count");
      if (teamCounter) {
        localStorage.setItem(teamId + "Count", teamCounter.textContent);
      }
    }
  }
}

//Validate form input.
function validateInput() {
  if (nameInput.value.trim() === "") {
    alert("Please enter your name.");
    return false;
  }
  if (teamSelect.value === "") {
    alert("Please select a team.");
    return false;
  }
  if (count >= maxCount) {
    alert("Check-in limit reached.");
    return false;
  }
  return true;
}

///Handle form submission.
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  //Validate input.
  if (validateInput() == false) {
    return;
  }

  count++;
  attendeeCount.textContent = count;

  //Update progress bar.
  const percentage = Math.round((count / maxCount) * 100) + "%";
  console.log(`Progress: ${percentage}`);
  progressBar.style.width = percentage;

  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  //Save to storage.
  addAttendeeToList(name, team, teamName);
  saveAttendeeToStorage(name, team, teamName);
  saveToLocalStorage();

  alert(`Welcome ${name} from ${teamName}!`);

  //Show celebration message if max count reached.
  if (count === maxCount) {
    showCelebrationMessage();
  }

  form.reset();
});

// Load saved data when page loads
document.addEventListener("DOMContentLoaded", loadFromLocalStorage);
