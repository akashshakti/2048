let size=4;
let board=[];
let score=0;
let mode="Single";

const gameArea=document.getElementById("gameArea");
const scoreDisplay=document.getElementById("score");
const highTileDisplay=document.getElementById("highTile");

let startX=0;
let startY=0;

/* BOARD UI */

function createBoardUI(){

gameArea.innerHTML="";

let grid=document.createElement("div");
grid.className="board";

for(let i=0;i<size*size;i++){

let tile=document.createElement("div");
tile.className="tile";

grid.appendChild(tile);

}

gameArea.appendChild(grid);

}

/* INIT GAME */

function initGame(){

board=new Array(size*size).fill(0);
score=0;

createBoardUI();

addNumber();
addNumber();

updateBoard();

saveGame();

}

/* RANDOM TILE */

function addNumber(){

let empty=board.map((v,i)=>v===0?i:null).filter(v=>v!==null);

if(empty.length===0)return;

let index=empty[Math.floor(Math.random()*empty.length)];

board[index]=Math.random()>0.5?2:4;

}

/* UPDATE BOARD */

function updateBoard(){

const tiles=document.querySelectorAll(".tile");

board.forEach((value,index)=>{

tiles[index].innerText=value===0?"":value;

tiles[index].style.background=value===0?"#444":getColor(value);

});

updateScore();

saveGame();

}

/* COLORS */

function getColor(v){

const c={
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

return c[v]||"#3c3a32";

}

/* SCORE */

function updateScore(){

scoreDisplay.innerText=score;

let maxTile=Math.max(...board);

highTileDisplay.innerText=maxTile;

}

/* MOVE LOGIC */

function slide(row){

row=row.filter(v=>v);

for(let i=0;i<row.length-1;i++){

if(row[i]===row[i+1]){

row[i]*=2;
score+=row[i];
row[i+1]=0;

playSound("mergeSound");

}

}

row=row.filter(v=>v);

while(row.length<size)row.push(0);

return row;

}

function moveLeft(){

for(let i=0;i<size;i++){

let row=board.slice(i*size,i*size+size);

row=slide(row);

board.splice(i*size,size,...row);

}

}

function rotate(){

let newBoard=[];

for(let i=0;i<size;i++){

for(let j=size-1;j>=0;j--){

newBoard.push(board[j*size+i]);

}

}

board=newBoard;

}

function moveRight(){rotate();rotate();moveLeft();rotate();rotate();}
function moveUp(){rotate();rotate();rotate();moveLeft();rotate();}
function moveDown(){rotate();moveLeft();rotate();rotate();rotate();}

/* GAME OVER */

function checkGameOver(){

if(board.includes(0))return;

for(let i=0;i<15;i++){

if(board[i]===board[i+1])return;

}

playSound("gameOverSound");

alert("Game Over");

}

/* KEYBOARD */

document.addEventListener("keydown",(e)=>{

let old=[...board];

if(e.key==="ArrowLeft")moveLeft();
if(e.key==="ArrowRight")moveRight();
if(e.key==="ArrowUp")moveUp();
if(e.key==="ArrowDown")moveDown();

if(old.toString()!=board.toString()){

playSound("moveSound");

addNumber();
updateBoard();
checkGameOver();

}

});

/* MOBILE SWIPE */

gameArea.addEventListener("touchstart",e=>{
startX=e.touches[0].clientX;
startY=e.touches[0].clientY;
},{passive:true});

gameArea.addEventListener("touchend",e=>{

let dx=e.changedTouches[0].clientX-startX;
let dy=e.changedTouches[0].clientY-startY;

let old=[...board];

if(Math.abs(dx)>Math.abs(dy)){

dx>0?moveRight():moveLeft();

}else{

dy>0?moveDown():moveUp();

}

if(old.toString()!=board.toString()){

playSound("moveSound");

addNumber();
updateBoard();
checkGameOver();

}

},{passive:true});

/* SOUND */

function playSound(id){

let s=document.getElementById(id);

if(!s)return;

s.currentTime=0;

s.play().catch(()=>{});

}

/* SAVE LOAD */

function saveGame(){

localStorage.setItem("board",JSON.stringify(board));
localStorage.setItem("score",score);

}

function loadGame(){

let saved=localStorage.getItem("board");

if(saved){

board=JSON.parse(saved);
score=parseInt(localStorage.getItem("score"))||0;

createBoardUI();
updateBoard();

}else{

initGame();

}

}

/* BUTTONS */

function newGame(){

localStorage.clear();
initGame();

}

function toggleMode(){

document.body.classList.toggle("light-mode");

}

function switchMode(){

mode=mode==="Single"?"Multi":"Single";

document.getElementById("modeText").innerText=mode;

}

/* START */

loadGame();