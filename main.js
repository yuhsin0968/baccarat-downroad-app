const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const CELL_WIDTH = 30;
const CELL_HEIGHT = 30;
const COLS = 20;
const ROWS = 6;

canvas.width = COLS * CELL_WIDTH;
canvas.height = ROWS * CELL_HEIGHT;

let beadData = []; // 儲存每局結果，P=Player, B=Banker, T=Tie

// 大路格子資料：儲存每格顏色和格子位置
let bigRoad = []; // 每個元素格式為 { row: 0~5, col: 0~19, color: "red" / "blue", ties: 0 }

// 清空畫面與格線
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#ccc";
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * CELL_WIDTH, 0);
    ctx.lineTo(c * CELL_WIDTH, canvas.height);
    ctx.stroke();
  }
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * CELL_HEIGHT);
    ctx.lineTo(canvas.width, r * CELL_HEIGHT);
    ctx.stroke();
  }
}

// 畫圓點
function drawDot(row, col, color) {
  const cx = col * CELL_WIDTH + CELL_WIDTH / 2;
  const cy = row * CELL_HEIGHT + CELL_HEIGHT / 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 10, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

// 更新大路邏輯
function updateBigRoad() {
  bigRoad = [];
  let col = 0;
  let row = 0;
  let fixedRow = -1; // -1 表示還沒啟動擠位
  for (let i = 0; i < beadData.length; i++) {
    const result = beadData[i];
    if (result === "T") {
      // 和局不佔格，若上一筆存在則 ties+1
      if (bigRoad.length > 0) bigRoad[bigRoad.length - 1].ties++;
      continue;
    }

    const color = result === "B" ? "red" : "blue";

    if (bigRoad.length === 0) {
      // 第一顆：第一欄第一行
      row = 0;
      col = 0;
      fixedRow = -1;
    } else {
      const last = bigRoad[bigRoad.length - 1];
      if (last.color === color) {
        // 同色 → 嘗試直落
        if (fixedRow === -1 && last.row < ROWS - 1) {
          row = last.row + 1;
          col = last.col;
        } else {
          // 擠位：往右畫，固定行
          fixedRow = fixedRow === -1 ? last.row : fixedRow;
          row = fixedRow;
          col = last.col + 1;
        }
      } else {
        // 換色：從最左欄開始往下找空位
        col = bigRoad.reduce((max, b) => Math.max(max, b.col), -1) + 1;
        row = 0;
        fixedRow = -1;
      }
    }

    bigRoad.push({ row, col, color, ties: 0 });
  }
}

// 重繪所有內容
function render() {
  drawGrid();
  updateBigRoad();
  for (const cell of bigRoad) {
    drawDot(cell.row, cell.col, cell.color);
  }
}

// 處理按鈕輸入
function addResult(result) {
  beadData.push(result);
  render();
}

// 清除最後一筆
function undo() {
  beadData.pop();
  render();
}

// 全部清除
function reset() {
  beadData = [];
  render();
}

// 初始化畫面
drawGrid();
