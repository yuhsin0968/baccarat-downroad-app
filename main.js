let results = [];

function addResult(val) {
  results.push(val);
  drawBeadRoad();
}

function clearResults() {
  results = [];
  drawBeadRoad();
}

function drawBeadRoad() {
  const road = document.getElementById("bead-road");
  road.innerHTML = "";
  results.forEach(result => {
    const cell = document.createElement("div");
    cell.classList.add("cell", result);
    cell.textContent = result;
    road.appendChild(cell);
  });
}
