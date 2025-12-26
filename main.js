// 監聽 DOM 載入
document.addEventListener("DOMContentLoaded", function () {
  const drawButton = document.getElementById("drawBtn");
  drawButton.addEventListener("click", drawBeadRoad);
});

// 初始化格子資料
let grid = [...Array(6)].map(() => Array(100).fill(""));

function drawBeadRoad() {
  const input = document.getElementById("resultInput").value.trim().toLowerCase();
  const results = input.split("").filter(char => ["b", "p", "t"].includes(char));
  clearGrid();
  renderBeadRoad(results);
}

function clearGrid() {
  const road = document.getElementById("beadRoad");
  road.innerHTML = "";
  grid = [...Array(6)].map(() => Array(100).fill(""));
}

function renderBeadRoad(results) {
  let col = 0;
  let row = 0;
  let prev = "";
  let fixedRow = null;

  for (let i = 0; i < results.length; i++) {
    const result = results[i];

    if (result === "t") {
      // 和局畫在同一格右下角，略過格子占用
      addCell(col, row, result);
      continue;
    }

    if (result === prev) {
      // 同色連開 → 試圖往下畫
      if (row < 5 && grid[row + 1][col] === "") {
        row++;
      } else {
        // 到底或被占用 → 擠位模式：固定在目前 row 向右畫
        col++;
      }
    } else {
      // 換色：新欄第1列
      col++;
      row = 0;

      // 若預定格已被佔 → 啟動擠位 → 試下一欄同一 row
      while (grid[row][col] !== "" && col < 100) {
        col++;
      }
    }

    grid[row][col] = result;
    addCell(col, row, result);
    prev = result;
  }
}

function addCell(x, y, result) {
  const road = document.getElementById("beadRoad");
  const cell = document.createElement("div");
  cell.className = "cell";

  if (result === "b") {
    cell.classList.add("banker");
    cell.innerText = "莊";
  } else if (result === "p") {
    cell.classList.add("player");
    cell.innerText = "閒";
  } else if (result === "t") {
    cell.classList.add("tie");
    cell.innerText = "和";
  }

  cell.style.gridColumn = x + 1;
  cell.style.gridRow = y + 1;
  road.appendChild(cell);
}
