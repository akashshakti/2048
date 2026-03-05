let size = 4;
let mode = "Single";

let boards = {
board1: [],
board2: []
};

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");

highScoreDisplay.innerText = highScore;

/* ================= */
/* SAVE / LOAD */
/* ================= */

function saveGame(){
localStorage.setItem("boards", JSON.stringify(boards));
localStorage.setItem("score", score);
localStorage.setItem("mode", mode);
}

function loadGame(){

const savedBoards = localStorage.getItem("boards");
const savedScore = localStorage.getItem("score");
const savedMode = localStorage.getItem("mode");

if(savedBoards){

boards = JSON.parse(savedBoards);
score = parseInt(savedScore) || 0;
mode = savedMode || "Single";

document.getElementById("modeText").innerText = mode;

createBoardsUI();
updateBoard("board1");

if(mode==="Multi") updateBoard("board2");

updateScore();

}else{

initGame();

}

}

/* ================= */
/* CREATE BOARD */
/* ================= */

function createBoard(id){

const grid=document.createElement("div");
grid.className="board";
grid.id=id;

for(let i=0;i<size*size;i++){

let tile=document.createElement("div");
tile.className="tile";

grid.appendChild(tile);

}

return grid;

}

function createBoardsUI(){

gameArea.innerHTML="";

gameArea.appendChild(createBoard("board1"));

if(mode==="Multi"){
gameArea.appendChild(createBoard("board2"));
}

}

/* ================= */
/* INIT GAME */
/* ================= */

function initGame(){

boards.board1 = new Array(size*size).fill(0);
boards.board2 = new Array(size*size).fill(0);

score = 0;

createBoardsUI();

addNumber("board1");
addNumber("board1");

if(mode==="Multi"){
addNumber("board2");
addNumber("board2");
}

updateBoard("board1");

if(mode==="Multi") updateBoard("board2");

updateScore();

saveGame();

}

/* ================= */
/* ADD TILE */
/* ================= */

function addNumber(boardId){

let board=boards[boardId];

let empty=board.map((v,i)=>v===0?i:null).filter(v=>v!==null);

if(empty.length===0) return;

let randomIndex=empty[Math.floor(Math.random()*empty.length)];

board[randomIndex]=Math.random()>0.5?2:4;

}

/* ================= */
/* UPDATE BOARD */
/* ================= */

function updateBoard(boardId){

let board=boards[boardId];

const tiles=document.querySelectorAll("#"+boardId+" .tile");

board.forEach((value,index)=>{

tiles[index].innerText=value===0?"":value;

tiles[index].style.background=value===0?"#444":getColor(value);

});

saveGame();

}

/* ================= */
/* COLORS */
/* ================= */

function getColor(value){

const colors={
2:"#eee4da",
4:"#ede0c8",
8:"#f2b179",
16:"#f59563",
32:"#f67c5f",
64:"#f65e3b",
128:"#edcf72",
256:"#edcc61",
512:"#edc850",
1024:"#edc53f",
2048:"#edc22e"
};

return colors[value]||"#3c3a32";

}

/* ================= */
/* SCORE SYSTEM */
/* ================= */

function updateScore(){

scoreDisplay.innerText=score;

if(score>highScore){

highScore=score;

localStorage.setItem("highScore",highScore);

highScoreDisplay.innerText=highScore;

}

}

/* ================= */
/* MOVE LOGIC */
/* ================= */

function slide(row){

row=row.filter(v=>v);

for(let i=0;i<row.length-1;i++){

if(row[i]===row[i+1]){

row[i]*=2;

score+=row[i];

row[i+1]=0;

}

}

row=row.filter(v=>v);

while(row.length<size) row.push(0);

return row;

}

function moveLeft(boardId){

let board=boards[boardId];

for(let i=0;i<size;i++){

let row=board.slice(i*size,i*size+size);

row=slide(row);

board.splice(i*size,size,...row);

}

updateScore();

}

function rotate(boardId){

let board=boards[boardId];

let newBoard=[];

for(let i=0;i<size;i++){

for(let j=size-1;j>=0;j--){

newBoard.push(board[j*size+i]);

}

}

boards[boardId]=newBoard;

}

function moveRight(boardId){rotate(boardId);rotate(boardId);moveLeft(boardId);rotate(boardId);rotate(boardId);}
function moveUp(boardId){rotate(boardId);rotate(boardId);rotate(boardId);moveLeft(boardId);rotate(boardId);}
function moveDown(boardId){rotate(boardId);moveLeft(boardId);rotate(boardId);rotate(boardId);rotate(boardId);}

/* ================= */
/* CONTROLS */
/* ================= */

document.addEventListener("keydown",(e)=>{

if(mode==="Single"){

handleMove(e.key,"board1");

}else{

if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key))
handleMove(e.key,"board1");

if(["a","d","w","s"].includes(e.key))
handleMove(e.key,"board2");

}

});

function handleMove(key,boardId){

let oldBoard=[...boards[boardId]];

if(key==="ArrowLeft"||key==="a") moveLeft(boardId);
if(key==="ArrowRight"||key==="d") moveRight(boardId);
if(key==="ArrowUp"||key==="w") moveUp(boardId);
if(key==="ArrowDown"||key==="s") moveDown(boardId);

if(oldBoard.toString()!==boards[boardId].toString()){

addNumber(boardId);

updateBoard(boardId);

}

}

/* ================= */
/* MOBILE SWIPE */
/* ================= */

let startX=0;
let startY=0;

gameArea.addEventListener("touchstart",e=>{
startX=e.touches[0].clientX;
startY=e.touches[0].clientY;
},{passive:true});

gameArea.addEventListener("touchend",e=>{

let dx=e.changedTouches[0].clientX-startX;
let dy=e.changedTouches[0].clientY-startY;

if(mode==="Single") handleSwipe(dx,dy,"board1");
else{

let mid=window.innerWidth/2;

if(startX<mid) handleSwipe(dx,dy,"board1");
else handleSwipe(dx,dy,"board2");

}

},{passive:true});

function handleSwipe(dx,dy,boardId){

let oldBoard=[...boards[boardId]];

if(Math.abs(dx)>Math.abs(dy)){

dx>0?moveRight(boardId):moveLeft(boardId);

}else{

dy>0?moveDown(boardId):moveUp(boardId);

}

if(oldBoard.toString()!==boards[boardId].toString()){

addNumber(boardId);

updateBoard(boardId);

}

}

/* ================= */
/* MODE BUTTONS */
/* ================= */

function switchMode(){

mode=mode==="Single"?"Multi":"Single";

document.getElementById("modeText").innerText=mode;

initGame();

}

function toggleMode(){

document.body.classList.toggle("light-mode");

}

function newGame(){

localStorage.removeItem("boards");

localStorage.removeItem("score");

initGame();

}

/* ================= */
/* START */
/* ================= */

loadGame();
