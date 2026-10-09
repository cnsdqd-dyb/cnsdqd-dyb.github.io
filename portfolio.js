const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const intro=document.querySelector('.intro');
const statements=['Reasoning with<br><em>structure.</em>','Research grounded<br>in <em>evidence.</em>','Agents working<br><em>together.</em>'];
const staticIntro=document.querySelector('#hero-intro-accessible');
let statement=0;
setInterval(()=>{if(reduced.matches||paused||document.hidden)return;intro.classList.add('is-changing');setTimeout(()=>{statement=(statement+1)%statements.length;intro.innerHTML=statements[statement];intro.classList.remove('is-changing');},350);},5000);
const canvas=document.querySelector('#reasoningCanvas'),ctx=canvas.getContext('2d'),motion=document.querySelector('.motion-toggle');
let paused=reduced.matches,angle=0,last=0;
const points=Array.from({length:32},(_,i)=>{const y=1-i*2/31,r=Math.sqrt(1-y*y),a=i*2.39996;return {x:Math.cos(a)*r,y,z:Math.sin(a)*r};});
function draw(){
 const size=canvas.clientWidth||400,dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.round(size*dpr)){canvas.width=Math.round(size*dpr);canvas.height=Math.round(size*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,size,size);
 const color=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
 const p=points.map(v=>{const x=v.x*Math.cos(angle)+v.z*Math.sin(angle),z=-v.x*Math.sin(angle)+v.z*Math.cos(angle);return {x:size/2+x*size*.32,y:size/2+v.y*size*.32,z};});
 ctx.strokeStyle=color;ctx.lineWidth=.6;for(let i=0;i<p.length;i++)for(let j=i+1;j<p.length;j++){const a=points[i],b=points[j];if(Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<.75){ctx.globalAlpha=.09+(p[i].z+p[j].z+2)*.045;ctx.beginPath();ctx.moveTo(p[i].x,p[i].y);ctx.lineTo(p[j].x,p[j].y);ctx.stroke();}}
 p.sort((a,b)=>a.z-b.z);for(const v of p){ctx.globalAlpha=.25+(v.z+1)*.3;ctx.fillStyle=color;ctx.beginPath();ctx.arc(v.x,v.y,1.8+(v.z+1),0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;
 ctx.strokeStyle=color;ctx.globalAlpha=.13;ctx.beginPath();ctx.arc(size/2,size/2,size*.4,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
}
function updateMotion(){motion.textContent=paused?'Resume motion':'Pause motion';motion.setAttribute('aria-pressed',String(paused));}
motion.addEventListener('click',()=>{paused=!paused;updateMotion();});
reduced.addEventListener('change',()=>{paused=reduced.matches;updateMotion();});
function animate(t){if(!paused&&!document.hidden){angle+=(t-last>100?.016:(t-last)*.00015);draw();}last=t;requestAnimationFrame(animate);}window.addEventListener('resize',draw);updateMotion();draw();requestAnimationFrame(animate);
