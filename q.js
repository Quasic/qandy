
run="queville.js";
e=document.getElementById("run").innerHTML=run;

var now=new Date(); function pad(num) { return num.toString().padStart(2, '0'); }

var ALlowMove=1;
var AllowScroll=1;

var PName="";
var NInv=16;
var PInv="ZaZaZaZaZaZaZaZaZaZaZaZaZaZaZaZa";
var PObj=""; 
var PMap="Ce";
var PX=3;
var PY=7;
var PZ=(PY*(mapx+1))+PX;
var walk=-1;
var Que="";

var TMode=0;
var TFill="";

var objs=[];
var ilist=[]; 
var dlist=[]; 

var map="";
var maps=[];

maps["Zz"]="GaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGa..Zm3535";
maps["Z@"]="GaGaGaGaGaGaGaGaGaYbYaYaYaYaYcGaGaYfCaCaCaCaYgGaGaYfCaCaCaCaYgGaGaYfCaCaCaCaYgGaGaYfCaCaCaCaYgGaGaYfCaCaCaCaYgGaGaYfCaCaCaCaYgGaGaYaYaCeCcYaYaGaGaGaGaCeCcGaGaGaGaGaGaCeCcGaGaGaGaGaGaCeCcGaGaGa";
maps["Cd"]="UaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUbAaAaAaAaAaAaUaAcGaGaGaGaGaGaUaAcGaGaGaGaGaGaUaAcGaGaGaGaGaGa";
maps["Ce"]="UaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUbAaAaAaUcUaUaUaAcDcGaDdAdUaUaUaAcGaBaGaAfUcUaUaAcGaBaGaGaAdUaUbAeGaBaGaGaAfAaAcGaGaBaGaGaGaGaAcGaGaBeBgGaRcGaAcGaGaGaBaFkRaGaAcGaGaGaBeBgFlGaAeGbGaGaGaBaGaGa..Zm2783Ze74FfZf36..";
maps["C+"]="UgUgUhUaUaUaUhUhUbAaAaAaAaAaUcUgAcCfCbCbCbCgAfUcAcCeCaCaCaCaCgAdAcCeCaCaCaCaCcAdAcCeCaCaCaCaCcAdAcCeCaCaCaCaCcAdAcCeCaCaCaCaCcAdAeChCdCaCaCdCiAfGaGaFlCeCcFkGaGaYmYaYlCeCcYmYaYlGbGaGaCeCcGaGbGb..Yb27..Zi51..Zh45..Bd46..Cg58..";
maps["Cf"]="UaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaAaAaAaAaAaAaUcUaGaGaGaGaGaGaAfUcGaGaGaGaGaGaGaScGaGaGaGaGaGaGaSgGaGaGaGaGaGaGaScGaGaGaGaBaGaGaSg";
maps["Cg"]="GaGaGaGaGaGaGaSdGaGaGaGaGaGaGaSdGaGaGaGaGaGaGaSdGaGaGaGaGaGaGaSdGaGaGaGaGaGaGaSdGaGaGaGaGaGaGaSdGaGaGaGaGaGaGaSdGaGaGaGaGaGaGaSdGaGaGaGaGaSdSdSdGaGaGaSdSdSdSdSdGaGaSdSdSdSdSdSdSdSdSdSdSdSdSdSd";
maps["Dc"]="UaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaAaAaAaAaAaAaAaAaXcGaGaGaGaGaGaGaXdGaGaGaGaGaGaGaXcGaGaGaGaGaGaGaXdGaGaGaGaGaGaGaXcGaGaGaGaGaGaGaXdGaGaGaGaGaGaGaXcGaGaGaGaGaGaGa";
maps["Dd"]="UaAcGaGaGaGaGaGaUaAcHaHaGaGaGaGaUaAcHaHaGaGaGaGaUaAcHaHaGaGaGaGaUaAcGaGaGaGaGaGaUaAcHaHaGaGaBfBbUaAcHaHaGaBfBdGaUaAcHaHaGaBaGaGaUaAcGaGaGaBaGaGaUaAcHaHaGaBaGaGaUaAcHaHaGaBaRbRbUaAcGaGaGaBaRaRa..Ye30..";
maps["De"]="GbGbGaGaGaBaGaGaGbGbGaGaGaBaGaGaGbGaGaGbGaBaGaGaGbGaGaGaGaBaFiGaGaGaGaGaFkBiBbBbBbBbBbBbBbBdGaGaGaGaFkGaGbGaGaGaGaGaGaGaGaGaRbGaGaGaGaGaGaRbRaRbGaRbGaRbRbRaRbRaRbRaRbRaRaRbRaRbRaRbRaRbRbRaRbRa..Ab26..";
maps["D+"]="IlIcIcIcIcIcIcImIcIlIcIcIcIcImIcIcIcIpInInInIoIcIcIcIoIcIcIcIoIcIcIcIoIcIcIcIoIcIcIcIoIcIcIcIoIcIcIcIoIcIcIcIoIcIcIcIoIcIcIcIoIcIcIcIoIcIcIcIoIcIcIcIoIcIcIcIoIcIcImInInInInIlIcImIcIcIcIcIcIcIl";
maps["Df"]="GaGaGaGaBaGaGaScGaGaGaGaBaGaGaScGaFgGaGaBaGbGaGaGaGaGaGbBaGbGbGaBbBbBbBbBcBbBbBbGaGaGbGbBaGbGaGaGaGaGaGaBaGaGaGaGaFeGaGaBaGaGaSbRbGaFeGaBaScSeGaRaRbGaGaBaGaScSeRbRaGaGaBaSbGaScRaRbGaGaBaGaGaSc..";
maps["Dg"]="UaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaGaGaGaGaUaUaUaUaBbGaGaGaUaUaUaUaGaGaGaGaUaUaUaUaGaGaGaGaUaUaUaUaGaGaGaGaUaUaUaUaGaGaGaGaGaGaGaSdGaGaGaGaGaGaGaSdGaGaGaGaGaGaGaSdSdSdSdSdSdSdSdSd";
maps["Ed"]="UaAcGaGaGaBaGaRaUaAcGaGaGaBaGaRbUaAcGaGaGaBaRbRaUaAcGaGaGaBaRaRbUaAcGaGaGaBaGaRaUaAcGaGaGaBaGaRbUaAcGaGaGaBaRbRaUaAcGaGaGaBaRaRbUaAcGaGaGaBaRbRaUaAcGaGaGaBaRaRbUaAcGaGaGaBaGaRaUaAcGaGaGaBaGaRb";
maps["Ee"]="RaRbRaRbRbRaRbRaRbRaRbRaRaRbRaGaRaRbRaGaGaRaGaRbRbRaGaGaGaGaRbRaRaGaGaGaGaGaRaRbRbRbGaGaGaGaGaRaRaRaGaGaGaGaGaRbRbGaGaGaGaGaGaRaRaRbGaGaGaGaGaRbRbRaGaGaGaGaRbRaRaGaRbGaGaRbRaRbRbRbRaRbRbRaRbRa";
maps["Ef"]="RaRbGaGaBaGaGaScGaRaRbGaBaGaGaScRbGaRaGaBaGaSbGaRaRbGaGaBaGaGaGaRbRaGaGaBiBbBbBbRaRbGaGaBaGaGaGaRbRaRbGaBaGaGaGaRaRbRaGaBaGaGaGaRbRaGaGaBaGaGaGaRaGaGaGaBaGaSbFkRbGaGaGaBaGaGaScRaRbGaGaBaGaGaSc";
maps["Eg"]="ScSdSdSdSdSdSdSdScSdSdSdSdSdSdSdGaSfSbSfSiSdSdSdGaGaFkScSeSbSiSdBbBgGaGaGaGaScSdGaBeBgDcGaDdScSdGaFkBeBbBbBlScSdGaGaSbGaGbGbScSdGaScSdShSbSbSgSdFkSgSdSdSdSdSdSdScSdSdSdSdSdSdSdScSdSdSdSdSdSdSd..Zm4449";
maps["E-"]="GaGaGaGaGaGaGaScGaCfCbCbCbCbCgScGaCeCaCaCaCaCiScGaCeCaCaCaCcGaScGaCeCaCaCaCcScSdCbCaCaCaCaCcScSdCdCaCaCaCaCcScSdGaCeCaCaCaCcScSdGaCeCaCaCdCiScSdGaChCdCiGgSbSgSdGaSbSbSbSgSdSdSdScSdSdSdSdSdSdSd..La20..Lb19..Lc18..Ad60..";
maps["Fd"]="UaAcGaGaGaBaGaRbUaAcGaGaGaBaGaRaUaAcGaGaGaBaGaGaUaAcGaGaGaBaGaGaUaAcGaGaGaBaGaGaUaAcGaGaGaBeBbBbUaAcGaGaGaGaGaGaUaAcDcGaDdGaGaGaUaAcGaGaGaGaGaGaUaUdAbAbAbAbAbAbUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUa..Zm5914";
maps["Fe"]="RbRbRaRbRbRaRbRaRaRaRbRaRaRbRaRbGaGaRaGaGaRaGaRaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaBbBbBbBbBbBbBbBbGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaGaAbAbAbAbAbAbAbAbUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUa";
maps["Ff"]="RaRbGaGaBaGaGaSgRbRaGaFaBaGaScSdRaGaFaFaBaGaScSdGaFaFaBfBdGaSgSdFaFaBfBdGbSgSdSdBbBbBdGbGaScSdSdFaGaGbGbGaSgSdSdGaGaGaGbScSdSdSdGaGaGaGaSgSdSdSdGaGaGaSbSiSdSdSdSbSbSgSdSdSdSdSdSdSdSdSdSdSdSdSd..Ze66Ce";
maps["F*"]="UaAcGaGaGaGaGaGaUaAcYaYaYaGaGaGaUaAcGaGaGaGaGaGaUaAcGaGaGaGaGaGaUaAcGaGaGaGaGaYdUaAcGaGaGaGaGaYdUaAcGaGaGaGaGaYdUaAcGaGaGaGaGaYdUaAcGaGaGaGaGaYdUaAcGaGaGaGaGaGaUaUdAbAbAbAbAbAbUaUaUaUaUaUaUaUa";
maps["Fg"]="SdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSdSd";
maps["Ga"]="UaUaGaGaGaBaGaGaUaUaGaGaGaBaGaGaUaUaGaGaGaBaGaGaUaUaGaGaGaBaGaGaUaUaGaGaGaBeBgGaUaUaGaGaGaGaBeBbUaUaGaGaGaGaGaGaUaUaGaGaGaGaGaGaUaUaGaGaGaGaGaGaUaUaGaGaGaGaGaGaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUaUa";

var sign=[];
sign['Ce']="Welcome To Queville";
sign['Df']="The Crossroads";

var drop=[]; // drop[map]=iizzmmss

login();

function login() {
 keyon=1; print("<p>Welcome to Queville<p>Enter your name:<br>");
}

function input(l) {
 k=1; if (PName) {
  if (l.substr(0, 4)=="/tp ") { 
   EraseAll();
   PMap=l.substring(4,6); 
   LMap(PMap); char(PName,PObj,PZ); 
  }
  if (l=="") { hpop(); }
 } else {
  if (l.length<3) {
   print("Name must be at least three characters.<br>Enter your name:<br>");
  } else {
   if (l.substring(0,2)=="NPC") {
    print("Name cannot start with NPC.<br>Enter your name:<br>");
   } else {
    PName=l;
    mode="gfx";
    PForce="visible";
    NewChar("");
    LMap(PMap);
   }
  }
 }	
}

function loop() {
 // draw all charcaters
 // draw all items that move?
}

function NewChar(a) {
 PopForce="visible";
 if (a=="M") {
  PUP="Select Character:<p>";
  PUP=PUP+"<a href=\"javascript:NewChar(\'B0\');\"><img src=\""+chrs['B0']+"\" height=64 width=32></a> &nbsp; ";
  PUP=PUP+"<a href=\"javascript:NewChar(\'B1\');\"><img src=\""+chrs['B1']+"\" height=64 width=32></a> &nbsp; ";
  PUP=PUP+"<a href=\"javascript:NewChar(\'B2\');\"><img src=\""+chrs['B2']+"\" height=64 width=32></a><br>";
  PUP=PUP+"<a href=\"javascript:NewChar(\'B3\');\"><img src=\""+chrs['B3']+"\" height=64 width=32></a> &nbsp; ";
  PUP=PUP+"<a href=\"javascript:NewChar(\'B4\');\"><img src=\""+chrs['B4']+"\" height=64 width=32></a> &nbsp; ";
  PUP=PUP+"<a href=\"javascript:NewChar(\'B5\');\"><img src=\""+chrs['B5']+"\" height=64 width=32></a> &nbsp; ";
  PUP=PUP+"<a href=\"javascript:NewChar(\'B6\');\"><img src=\""+chrs['B6']+"\" height=64 width=32></a><p>";
  PUP=PUP+"<a href=\"javascript:NewChar(\'\');\">Go Back</a><p>";
  pop(PUP);
 } else {
  if (a=="F") {
   PUP="Select Character:<p>";
   PUP=PUP+"<a href=\"javascript:NewChar(\'F0\');\"><img src=\""+chrs['F0']+"\" height=64 width=32></a> &nbsp; ";
   PUP=PUP+"<a href=\"javascript:NewChar(\'F1\');\"><img src=\""+chrs['F1']+"\" height=64 width=32></a> &nbsp; ";
   PUP=PUP+"<a href=\"javascript:NewChar(\'F2\');\"><img src=\""+chrs['F2']+"\" height=64 width=32></a><br>";
   PUP=PUP+"<a href=\"javascript:NewChar(\'F3\');\"><img src=\""+chrs['F3']+"\" height=64 width=32></a> &nbsp; ";
   PUP=PUP+"<a href=\"javascript:NewChar(\'F4\');\"><img src=\""+chrs['F4']+"\" height=64 width=32></a> &nbsp; ";
   PUP=PUP+"<a href=\"javascript:NewChar(\'F5\');\"><img src=\""+chrs['F5']+"\" height=64 width=32></a> &nbsp; ";
   PUP=PUP+"<a href=\"javascript:NewChar(\'F6\');\"><img src=\""+chrs['F6']+"\" height=64 width=32></a><p>";
   PUP=PUP+"<a href=\"javascript:NewChar(\'\');\">Go Back</a><p>";
   pop(PUP);
  } else {
  	if (a.length==2) {
  	 if (a.charAt(0)=="F") { PObj=a+"H0"; } else { PObj=a+"D0"; }
    char(PName,PObj,PZ); PForce="hidden"; hpop(); mainloop();
  	} else {  	
    PX=2; PY=9; PZ=(PY*(mapx+1))+PX;
    pop("<p>Male or Female?<br><a href=\"javascript:NewChar(\'M\');\"><img src=\""+chrs['B1']+"\" height=128 width=64></a> &nbsp; <a href=\"javascript:NewChar(\'F\');\"><img src=\""+chrs['F5']+"\"height=128 width=64></a>");
   }
  }
 }
}

function mainloop() {
 if (walk>-1) { 
  walkY=Math.floor(walk/(mapx+1));
  walkX=walk-(walkY*(mapx+1));

  newZ=PZ; newX=PX; newY=PY; newD="";

  if (PX>walkX) { disX=PX-walkX; } else { disX=walkX-PX;}
  if (PY>walkY) { disY=PY-walkY; } else { disY=walkY-PY; }
  if (disX>disY) {
  	if (PX>walkX) { newX=PX-1; newZ=PZ-1; newD="L"; }
   if (PX<walkX) { newX=PX+1; newZ=PZ+1; newD="R"; }
  } else {
   if (PY>walkY) { newY=PY-1; newZ=PZ-(mapx+1); }
   if (PY<walkY) { newY=PY+1; newZ=PZ+(mapx+1); }
  }
  AllowMove=1;
  if (newY<0) { AllowMove=0; }
  if (newY>mapy) { AllowMove=0; }
  if (newX<0) { AllowMove=0; }
  if (newX>mapx) { AllowMove=0; }
  
  // get tile for newz
  // is tile restricted?
  // does player have correct boots?
  
  newT=maps[PMap].slice(newZ*2,(newZ*2)+2);
  if (newT.charAt(0)>="V") { AllowMove=0; }  
  if (newT.charAt(0)=="R") { if (PInv.indexOf("Ab")<0) { AllowMove=0; }}
  if (newT.charAt(0)=="S") { if (PInv.indexOf("Ad")<0) { AllowMove=0; }}
  
  if (TMode) { AllowMove=1; }
  if (AllowMove) {
   PY=newY; PX=newX; PZ=newZ;
   if (newD=="R") { PObj=FaceR(PObj); } else { if (newD=="L") { PObj=FaceL(PObj); }}
   char(PName,PObj,PZ);
   if (TMode) {
    pop(PZ+" "+maps[PMap].slice(PZ*2,(PZ*2)+2));
    if (TFill) { maps[PMap]=maps[PMap].slice(0,PZ*2)+TFill+maps[PMap].slice((PZ*2)+2,maps[PMap].length); gfx(maps[PMap]); }
   }
   if (walk==PZ) {
    walk=-1; if (Que) { eval(Que); Que=""; }
   }

   if (AllowScroll==0) {
    AllowScroll=1;
    if (PX==0)    { AllowScroll=0; }
    if (PX==mapx) { AllowScroll=0; }
    if (PY==0)    { AllowScroll=0; }
    if (PY==mapy) { AllowScroll=0; }
   }
   if (TMode) { AllowScroll=0; }

   if (AllowScroll) {
    if(PX==0)    { AllowScroll=0; walk=-1; stimer=setTimeout('West();',400); }
    if(PX==mapx) { AllowScroll=0; walk=-1; stimer=setTimeout('East();',400); }
    if(PY==0)    { AllowScroll=0; walk=-1; stimer=setTimeout('North();',400); }
    if(PY==mapy) { AllowScroll=0; walk=-1; stimer=setTimeout('South();',400); }
   } 
  }
 }
 if (drop[PMap]) { RefDItems(); }
 maintimer=setTimeout('mainloop();',200);
}

function WalkHere(i) {
  HPOP(); PopForce="hidden"; MoveTo=1; DynItem="";
  MoveToY=Math.floor(i/(MapSizeX+1));
  MoveToX=i-(MoveToY*(MapSizeX+1));
  document.getElementById("MH").style.left=MoveToX*32+15;
  document.getElementById("MH").style.top=MoveToY*32+15;
  document.getElementById("MH").style.visibility="visible";
  HideObjs=setTimeout('document.getElementById("MH").style.visibility="hidden";',250);
}

function FaceR(a) {
 a=a.replaceAll("A", "B");
 a=a.replaceAll("C", "D");
 a=a.replaceAll("E", "F"); 
 a=a.replaceAll("G", "H");
 a=a.replaceAll("I", "J");
 return a;
}

function FaceL(a) {
 a=a.replaceAll("B", "A");
 a=a.replaceAll("D", "C");
 a=a.replaceAll("F", "E"); 
 a=a.replaceAll("H", "G");
 a=a.replaceAll("J", "I");
 return a;
}

function StepHere(a) {
  if (Retreat==0) { if (TradeOn==0) {
    Que="";
    Skill=""; IStamp=CStamp;
    HPOP(); MoveTo=1;
    MoveToY=Math.floor(a/(MapSizeX+1));
    MoveToX=a-(MoveToY*(MapSizeX+1));
  }}
}

function LMap(a) {
 if (maps[a]) {} else { maps[a]="CaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCaCa"; }
 gfx(maps[a]); 
 items=[]; if (maps[a].length>194) { ilist=maps[a].substring(194).match(/.{1,6}/g); }
 for (b=0;b<ilist.length;b++) {
  i=ilist[b].substring(0,2);
  z=ilist[b].substring(2,4);
  d=ilist[b].substring(4,6);
  y=Math.floor(z/(mapx+1));
  x=z-(y*(mapx+1));
  c=document.createElement("img");
  c.id="i"+b;
  c.src=item[ilist[b].substring(0,2)];
  c.style.position="absolute";
  c.style.top=32+20+(y*32)+"px";
  c.style.left=(32+22+(x*32))+"px";
  c.onload=function() { this.style.top=parseInt(this.style.top)-(this.height-32)+"px"; this.style.left=parseInt(this.style.left)-(this.width-32)+"px"; }
  c.onmousedown=new Function("MenuItem("+(z)+",this.parentNode)");
  document.body.appendChild(c);
 }
 RefDItems();
 return maps[a];
}
 
function RefDItems() {
 if (drop[PMap]) {
  newdrop=0; dlist=drop[PMap].match(/.{1,8}/g);
  now=new Date(); tstamp=pad(now.getMinutes())+pad(now.getSeconds());

  for (b=0;b<dlist.length;b++) {
   i=dlist[b].substring(0,2); z=dlist[b].substring(2,4); d=dlist[b].substring(4,8);
   if (tstamp>d) {
    newitem=ExpItem(i);
    if (newitem!="--------") {
     if (newitem=="Za") {
      dlist[b]="--------"; if (document.getElementById("d"+b)) { document.getElementById("d"+b).remove(); }
     } else {    	
      if (document.getElementById("d"+b)) { document.getElementById("d"+b).remove(); }
      c=new Date(); e=new Date(c.getTime()+60*1000); f=pad(e.getMinutes())+pad(e.getSeconds());
      dlist[b]=newitem+z+f;
     } 
    }
    newdrop=1;
   } else {
    y=Math.floor(z/(mapx+1)); x=z-(y*(mapx+1));
    if (!document.getElementById("d"+b)) { 
     c=document.createElement("img");
     c.id="d"+b;
     c.src=item[i];
     c.style.position="absolute";
     c.style.top=32+20+(y*32)+"px";
     c.style.left=(32+22+(x*32))+"px";
     c.onload=function() { this.style.top=parseInt(this.style.top)-(this.height-32)+"px"; this.style.left=parseInt(this.style.left)-(this.width-32)+"px"; }
     c.onmousedown=new Function("MenuItem("+(z)+")");
     document.body.appendChild(c);
    }
   }
  }
  if (newdrop) {
   newdrop=""; for (b=0;b<dlist.length;b++) { newdrop=newdrop+dlist[b]; }
   while (newdrop.endsWith("--------")) { newdrop=newdrop.slice(0, -8); }
   drop[PMap]=newdrop; console.log(drop[PMap]); 
  }   
 }
}  

function ExpItem(a) {
 switch (a) {
  case "Fe": return "Ka"; break;
  case "Fa": if (Math.random()>.8) { return "Ka"; } else { return "Za"; } break;
  case "Fb": if (Math.random()>.6) { return "Ka"; } else { return "Za"; } break;
  case "Fc": if (Math.random()>.4) { return "Ka"; } else { return "Za"; } break;
  case "Fd": if (Math.random()>.2) { return "Ka"; } else { return "Za"; } break;
  case "Ka": 
  if (Math.random()>.8) {
  	return "Fd";
  } else {
   if (Math.random()>.8) {
    return "Fc";
   } else {
    if (Math.random()>.8) {
     return "Fd";
    } else {
     return "Za";
    }
   }  
  }
  break;
 }
 return "--------"; 
}

function EraseAll() {
 for (b=0;b<ilist.length;b++) { if (document.getElementById("i"+b)) { document.getElementById("i"+b).remove(); }} ilist=[];
 if (drop[PMap]) {
  dlist=drop[PMap].match(/.{1,8}/g);  
  for (b=0;b<dlist.length;b++) {
 	i=dlist[b].substring(0,2);
 	if (document.getElementById("d"+b)) { document.getElementById("d"+b).remove(); }
  }
 }
 dlist=[];
 if (document.getElementById("cf"+PName)) { document.getElementById("cf"+PName).remove(); }
 if (document.getElementById("cb"+PName)) { document.getElementById("cb"+PName).remove(); }
 if (document.getElementById("ch"+PName)) { document.getElementById("ch"+PName).remove(); }
 if (document.getElementById("cw"+PName)) { document.getElementById("cw"+PName).remove(); }
 if (document.getElementById("ca"+PName)) { document.getElementById("ca"+PName).remove(); }
}

function North() {
 EraseAll();
 a=PMap.charCodeAt(0);
 b=PMap.charCodeAt(1);
 if (b<97) {+new Date();
  XCity(a,b);
 } else {
  a=a-1; if (a<65) { a=90; }
  PMap=String.fromCharCode(a)+String.fromCharCode(b);
  LMap(PMap);
  PY=11; PZ=88+PX; char(PName,PObj,PZ);
 }
}

function South() {
 EraseAll();
 a=PMap.charCodeAt(0);
 b=PMap.charCodeAt(1);
 if (b<97) {
  XCity(a,b);
 } else {
  a=a+1; if (a>90) { a=65; }
  PMap=String.fromCharCode(a)+String.fromCharCode(b);
  LMap(PMap);
  PY=0; PZ=PX; char(PName,PObj,PZ);
 }
}

function East() {
 EraseAll();
 a=PMap.charCodeAt(0);
 b=PMap.charCodeAt(1);
 if (b<97) {
  XCity(a,b);
 } else { 
  b=b+1; if (b>122) { b=97; }
  PMap=String.fromCharCode(a)+String.fromCharCode(b);
  LMap(PMap);
  PX=PX-mapx; PZ=PZ-mapx; char(PName,PObj,PZ);
 }
} 	
 	
function West() {
 EraseAll();
 a=PMap.charCodeAt(0);
 b=PMap.charCodeAt(1);
 if (b<97) {
  XCity(a,b);
 } else {
  b=b-1; if (b<97) { b=122; }
  PMap=String.fromCharCode(a)+String.fromCharCode(b);
  PX=PX+(mapx); PZ=PZ+(mapx); char(PName,PObj,PZ);
  LMap(PMap);
 }
}

function XCity(a,b) {
 b=b+58; PMap=String.fromCharCode(a)+String.fromCharCode(b);
 EraseAll();
 LMap(PMap);
 for (b=0;b<ilist.length;b++) {
  if (ilist[b].substring(0,2)=="Zm") { PZ=parseInt(ilist[b].substring(2,4)); PY=Math.floor(PZ/(mapx+1)); PX=PZ-(PY*(mapx+1)); }
 }
 char(PName,PObj,PZ);
}

function TileMode() {
 TMode=1-TMode;
 if (TMode==1) {
  keyon=0; 
  pop("Tile Editor Enabled");
 } else {
  keyon=1;
  pop("Tile Editor Off");
 }
}

function TileFill() {
 if (TFill=="") {
  TFill=maps[PMap].slice(PZ*2,(PZ*2)+2);
  pop("Tile Fill On<p>"+TFill);
 } else {
  TFill="";  
  pop("Tile Fill Off");
 }	
}

function EdgeTiles() {
 pop("Not Working<br>Perl code not<br>translating well.");
 
 // a=PMap.charCodeAt(0); b=PMap.charCodeAt(1);
 // b=b+1; if (b>122) { b=97; }
 // c=String.fromCharCode(a)+String.fromCharCode(b);
 // NMap=maps[PMap];
 // for (i=0;i<mapy+1;i++) {
 // NMap = NMap.substring(0,(i*14)*2)+ 
 //        maps[c].substring(((i*9)*2)+16,((i*9)*2)+18) + 
 //        NMap.substring(((i*14)*2)+2);
 // }
 // gfx(NMap); 
  
 // 
 //  NMap=maps[PMap].slice(0,mapx*2)+
 //       maps[c].slice(mapx*2,(mapx*2)+2)+
 //       maps[PMap].slice((8*i)+2,maps[PMap].length);
 //
 // } 
 // gfx(NMap);
 // $FirstMap=$CharMap;
 // $Map=$FORM{'I'};
 // $EdgeMap=$Map;
 // if ($y==-1) { $y="9"; } $CharMap="$x$y"; &LoadMap; for ($i=0;$i<9;$i++) { substr($EdgeMap,($i*14)*2,2)=substr($Map,(($i*14)*2)+26,2); }
 // $x=substr($FirstMap,0,1); $y=substr($FirstMap,1,1)+1; if ($y==10) { $y="0"; } $CharMap="$x$y"; &LoadMap; for ($i=0;$i<9;$i++) { substr($EdgeMap,(($i*14)*2)+26,2)=substr($Map,($i*14)*2,2); }
 // $x=chr(ord(substr($FirstMap,0,1))-1); $y=substr($FirstMap,1,1); if ($x eq "@") { $x="Z"; } $CharMap="$x$y"; &LoadMap; $EdgeMap=substr($Map,252,280).substr($EdgeMap,28,280);
 // $x=chr(ord(substr($FirstMap,0,1))+1); $y=substr($FirstMap,1,1); if ($x eq "[") { $x="A"; } $CharMap="$x$y"; &LoadMap; $EdgeMap=substr($EdgeMap,0,252).substr($Map,0,28);
 // $CharMap=$FirstMap; print "parent.Map=\"$EdgeMap\"; parent.RefMap=1; \n";

 // $x=substr($FirstMap,0,1);
 // $y=substr($FirstMap,1,1)-1;
 // if ($y==-1) { $y="9"; }
 // $CharMap="$x$y";
 // &LoadMap; 
 // for ($i=0;$i<9;$i++) {
 //  substr($EdgeMap,($i*14)*2,2)=substr($Map,(($i*14)*2)+26,2);
 // }
}

function SaveMap() {
 MCode=document.createElement('input');
 MCode.value=maps[PMap];
 document.body.appendChild(MCode);
 MCode.select();
 MCode.setSelectionRange(0, 99999);
 try {
  document.execCommand('copy');
  pop("Map "+PMap+" copied to clipboard");
 } catch (err) {
  pop("Clipboard Error,<br>Browser Issue");
 }
 document.body.removeChild(MCode);
}

function keydown(k) {
 if (TMode) {
  if (k.length==1) {
   a=k.charCodeAt(0)
   if (a>64&&a<91) {
    maps[PMap]=maps[PMap].slice(0,PZ*2)+k+maps[PMap].slice((PZ*2)+1,maps[PMap].length);
    LMap(PMap);  
   } else {
    if (a>96&&a<123) {
     maps[PMap]=maps[PMap].slice(0,(PZ*2)+1)+k+maps[PMap].slice((PZ*2)+2,maps[PMap].length);
     LMap(PMap);	
    }
   }
  }
  if (k=="enter") { TileMode(); }
 }
 
 if (k=="left") { walk=PZ-1; }
 if (k=="right") { walk=PZ+1; }
 if (k=="up") { walk=PZ-(mapx+1); }
 if (k=="down") { walk=PZ+(mapx+1); }
}

function MenuTile(z) {
 if (PObj) { hpop(); walk=z; }
}

function MenuItem(IZ) {
 PUP="";
 
 if (drop[PMap]) {
  dlist=drop[PMap].match(/.{1,8}/g);
  for (b=0;b<dlist.length;b++) {
   i=dlist[b].substring(0,2); z=dlist[b].substring(2,4); d=dlist[b].substring(4,8);
   if (IZ==z) { PUP=PUP+"<a href='javascript:GetDItem(\""+b+"\");'>"+ItemID(i)+"<br>"; }
  }
 } 
 
 for (b=0;b<ilist.length;b++) {
  i=ilist[b].substring(0,2);
  z=ilist[b].substring(2,4);
  d=ilist[b].substring(4,6);
  if (IZ==z) { PUP=PUP+"<a href='javascript:ClickItem(\""+ilist[b]+"\");'>"+ItemID(i)+"<br>"; }
 }
 pop(PUP);
}

function GetDItem(b) {
 dlist=drop[PMap].match(/.{1,8}/g);
 i=dlist[b].substring(0,2); z=dlist[b].substring(2,4); d=dlist[b].substring(4,8);
 if (i!="--") {
  if (z!=PZ) {
   walk=z; Que="GetDItem("+b+");";
  } else {
   a=PInv.indexOf("Za");
   if (a>-1) {
    newdrop=""; dlist[b]="--------"; 
    for (c=0;c<dlist.length;c++) { newdrop=newdrop+dlist[c]; }
    while (newdrop.endsWith("--------")) { newdrop=newdrop.slice(0, -8); }
    drop[PMap]=newdrop; 
  	 if (document.getElementById("d"+b)) { document.getElementById("d"+b).remove(); }
    PInv=PInv.replace("Za", i);
    Inven();
   }
   //i=dlist[b].substring(0,2); z=dlist[b].substring(2,4); d=dlist[b].substring(4,8);
  }
 } 
} 

function ClickItem(a) {
 hpop();
 i=a.substring(0,2); z=a.substring(2,4); d=a.substring(4,6);
 if (PZ!=z) {
  Que="ClickItem(\""+a+"\");"; walk=z;
 } else {
  if (i<="Sz") { GetItem(a); }
  if (i=="Zh") { PInv=PInv.replace("Bd", "El"); Inven(); }
  if (i=="Zi") { PInv=PInv.replace("Cg", "Zj"); Inven(); }   
  if (i=="Zm") { EraseAll(); a=PMap.charCodeAt(0); b=PMap.charCodeAt(1); if (b>96&&b<123) { PMap=String.fromCharCode(a)+String.fromCharCode(b-58); } if (d>-1&&d<96) { PZ=parseInt(d); PY=Math.floor(PZ/(mapx+1)); PX=PZ-(PY*(mapx+1)); } LMap(PMap); char(PName,PObj,PZ); }
  if (i=="Ze") { EraseAll(); PMap=d; LMap(PMap); for (b=0;b<ilist.length;b++) { if (ilist[b].substring(0,2)=="Ze") { PZ=parseInt(ilist[b].substring(2,4)); PY=Math.floor(PZ/(mapx+1)); PX=PZ-(PY*(mapx+1)); } } char(PName,PObj,PZ); }
  if (i=="Zf") { pop(sign[PMap]); }
  if (i=="Yb") {
   PUP="Free Clothes<br>"; a="C"; if (PObj.indexOf("D")>-1) { a="D"; } else { if (PObj.indexOf("G")>-1) { a="G"; } else { if (PObj.indexOf("H")>-1) { a="H"; }}}
   PUP=PUP+"<a href=\"javascript:clothes(\'0\');\"><img src=\""+chrs[a+'0']+"\"></a>";
   PUP=PUP+"<a href=\"javascript:clothes(\'1\');\"><img src=\""+chrs[a+'1']+"\"></a><br>";
   PUP=PUP+"<a href=\"javascript:clothes(\'2\');\"><img src=\""+chrs[a+'2']+"\"></a>";
   PUP=PUP+"<a href=\"javascript:clothes(\'3\');\"><img src=\""+chrs[a+'3']+"\"></a>";
   PUP=PUP+"<a href=\"javascript:clothes(\'4\');\"><img src=\""+chrs[a+'4']+"\"></a>";
   pop(PUP);
  }
  if (i=="Ye") { 
   if (PInv.indexOf("Fe")<0) { 
    PUP="Put this on the<br>ground, and it will<br>grow into a<br>tomato plant<br><img src=\""+item['Fe']+"\">";
    pop(PUP); PInv=PInv.replace("Za", "Fe");  
   } else {
   	pop("Empty");
   }
  }
 }
}

function clothes(b) {
 a="C"; if (PObj.indexOf("D")>-1) { a="D"; } else { if (PObj.indexOf("G")>-1) { a="G"; } else { if (PObj.indexOf("H")>-1) { a="H"; }}}
 PObj=PObj.substring(0,PObj.indexOf(a))+a+b+PObj.substring(PObj.indexOf(a)+2);
 hpop(); char(PName,PObj,PZ);
}

function MenuChar(z) {
 PUP="";
 PUP=PUP+"<a href=\"javascript:Inven();\">Inventory</a><br>";
 PUP=PUP+"<a href=\"javascript:TileMode();\">Tile Mode</a><br>";
 if (TMode) {
  PUP=PUP+"<a href=\"javascript:TileFill();\">Tile Fill</a><br>";
  PUP=PUP+"<a href=\"javascript:EdgeTiles();\">Edge Tiles</a><br>";
  PUP=PUP+"<a href=\"javascript:SaveMap();\">Export Tiles</a><br>";
 }
 pop(PUP); 
}

function GetItem(a) {
 i=a.substring(0,2); z=a.substring(2,4); d=a.substring(4,6);
 for (a=0;a<ilist.length;a++) {
  b=ilist[a].substring(0,2); c=ilist[a].substring(2,4);
  if (c==PZ) { if (b==i) { document.getElementById("i"+a).remove(); } }
 }
 PInv=PInv.replace("Za", i); Inven();
}

function Inven(Ci) {
 PUP="Player Inventory:<p>";
 for (a=0; a<NInv; a++) {
  PUP=PUP+"<a href=\"javascript:ClickInv("+a+");\"><img src=\""+item[PInv.substring(a*2,(a*2)+2)]+"\"></a>";
  if ((a+1)%4===0) { PUP=PUP+"<br>"; }
 }
 pop(PUP);
}

function ClickInv(a) {
 i=PInv.substring(a*2,(a*2)+2);
 PUP=ItemID(i)+"<p><img src=\""+item[i]+"\"><br>";
 if (i>="La"&&i<="Pz") { PUP=PUP+"<a href=\"javascript:Wear("+a+");\">Wear</a> &nbsp; "; }
 PUP=PUP+"<a href=\"javascript:Drop("+a+");\">Drop</a>";
 pop(PUP);
}

function Drop(a) {
 i=PInv.substring(a*2,(a*2)+2); PInv=PInv.replace(i, "Za"); Inven();
 b=new Date(); c=new Date(b.getTime()+60*1000); tstamp=pad(c.getMinutes())+pad(c.getSeconds());
 if (drop[PMap]) {  
  if (drop[PMap].indexOf("--------")>-1) {  
   drop[PMap]=drop[PMap].replace("--------", i+PZ+tstamp);
  } else { 
   drop[PMap]=drop[PMap]+i+PZ+tstamp;
  }
 } else {   
  drop[PMap]=i+PZ+tstamp;
 }
 RefDItems();
}

function Wear(a) {
 i=PInv.substring(a*2,(a*2)+2);
 b=String.fromCharCode(i.charCodeAt(1)-49);
 PObj=FaceL(PObj); 
 if (i.indexOf("L")>-1) {
  if (PObj.indexOf("I")>-1) {
   PObj=PObj.substring(0,PObj.indexOf("I"))+"I"+b+PObj.substring(PObj.indexOf("I"+2));
  } else {
   PObj=PObj+"I"+b;
  }
 }
 hpop(); char(PName,PObj,PZ);
}
