function typeWriter(element, text, speed = 100, callback = null) {
  let i = 0;
  element.innerHTML = "";
  function typing() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    } else if (callback) callback();
  }
  typing();
}

/* Elements */
const countdown = document.getElementById("countdown");
const countText = document.getElementById("countText");
const fireworksCanvas = document.getElementById("fireworksCanvas");
const intro = document.getElementById("intro");
const celebrateBtn = document.getElementById("celebrateBtn");
const cakeSection = document.getElementById("cakeSection");
const bujhaBtn = document.getElementById("bujhaBtn");
const candles = document.getElementById("candles");
const cakeLayers = document.querySelectorAll('.cake .layer');

/* Countdown from 10 */
let count = 10;
const countdownInterval = setInterval(() => {
  count--;
  if (count > 0) {
    countText.textContent = count;
  } else {
    clearInterval(countdownInterval);
    countdown.classList.add("hidden");
    startFireworks();
    setTimeout(() => {
      fireworksCanvas.classList.add("hidden");
      intro.classList.remove("hidden");
      startIntro();
    }, 4500);
  }
}, 1000);

/* Fireworks + confetti */
function startFireworks() {
  fireworksCanvas.classList.remove("hidden");
  const canvas = fireworksCanvas;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let particles = [];
  function createBurst(x, y, hueBase) {
    const hue = hueBase || Math.random()*360;
    for(let i=0;i<120;i++){
      const angle=Math.random()*Math.PI*2;
      const speed=Math.random()*6+2;
      const radius=Math.random()*3+2;
      particles.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:80+Math.random()*40,radius,hue,type:'spark'});
    }
  }
  function createConfetti(x){
    for(let i=0;i<18;i++){
      particles.push({x:x||Math.random()*canvas.width,y:-10-Math.random()*80,vx:(Math.random()-0.5)*1.8,vy:Math.random()*1+1.5,life:200+Math.random()*80,w:6+Math.random()*8,h:8+Math.random()*6,hue:Math.random()*360,type:'conf'});
    }
  }
  createBurst(canvas.width/2, canvas.height/3, Math.random()*360);
  const burstInt=setInterval(()=>{ createBurst(Math.random()*canvas.width, Math.random()*canvas.height/2, Math.random()*360); },350);
  const confInt=setInterval(()=>{ createConfetti(); },120);

  function draw(){
    ctx.fillStyle='rgba(0,0,0,0.18)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i];
      if(p.type==='spark'){
        p.vy+=0.03;p.x+=p.vx;p.y+=p.vy;p.life--;
        ctx.beginPath();
        const alpha=Math.max(0,p.life/140);
        ctx.fillStyle=`hsla(${p.hue},100%,60%,${alpha})`;
        ctx.shadowBlur=18; ctx.shadowColor=`hsla(${p.hue},100%,70%,${alpha})`;
        ctx.arc(p.x,p.y,p.radius,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0;
        if(p.life<=0)particles.splice(i,1);
      } else if(p.type==='conf'){
        p.vy+=0.02;p.x+=p.vx;p.y+=p.vy;p.life--;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate((p.x+p.y)*0.01);
        ctx.fillStyle=`hsla(${p.hue},100%,60%,${Math.max(0,p.life/220)})`;
        ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore();
        if(p.y>canvas.height+30||p.life<=0)particles.splice(i,1);
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
  setTimeout(()=>{ clearInterval(burstInt); },3500);
  setTimeout(()=>{ clearInterval(confInt); },4200);
}

/* Intro */
function startIntro(){
  const title = document.getElementById("title");
  const line1 = document.getElementById("line1");
  const line2 = document.getElementById("line2");
  const line3 = document.getElementById("line3");
    // Play music
  const music = document.getElementById('happyMusic');
  music.play();
  typeWriter(title,"🎂 Happy Birthday Preeti 🎂",100,()=>{
    typeWriter(line1,"🎉 Hello Nehnu, many many congratulations for the birthday! 🎉",100,()=>{
      typeWriter(line2,"💖 Thank you for turning 18 in this lovely world and being such a nice person.",100,()=>{
        typeWriter(line3,"✨ Let’s celebrate this birthday of you ✨",100,()=>{
          celebrateBtn.classList.remove("hidden");
          celebrateBtn.addEventListener('click',showCake,{once:true});
        });
      });
    });
  });
}

/* Show cake section */
let blown=false;
function showCake(){
  intro.classList.add('hidden');
  cakeSection.classList.remove('hidden');

  // Auto-blow in 10s
  setTimeout(()=>{ if(!blown) blowCandles(); },10000);
}

/* Blow candles */
bujhaBtn.addEventListener('click',()=>{ blowCandles(); });

function blowCandles(){
  if(blown) return;
  blown=true;

  const smoke=document.createElement('div');
  smoke.className='smoke'; smoke.innerText='💨';
  document.querySelector('.cake-wrap').appendChild(smoke);

  document.querySelectorAll('#candles .flame').forEach(s=>{ s.style.opacity='0'; s.style.transform='translateY(-8px) scale(.9)'; });

  cakeLayers.forEach(layer=>{
    layer.style.transition='opacity .9s ease, transform .9s ease';
    layer.style.opacity='0';
    layer.style.transform='scale(.92) translateY(-8px)';
  });

  bujhaBtn.style.display='none';

  setTimeout(()=>{ window.location.href='stats.html'; },1100);
}
/* --------- Balloons ---------- */
function spawnBalloons(count=6){
  const container = document.getElementById('balloonContainer');
  for(let i=0;i<count;i++){
    const b=document.createElement('div');
    b.className='balloon';
    b.style.left=Math.random()*90+'%';
    const emoji=['🎈','🎉','🎊'];
    b.textContent=emoji[Math.floor(Math.random()*emoji.length)];
    b.style.animationDuration=(4+Math.random()*3)+'s';
    container.appendChild(b);
    setTimeout(()=>b.remove(),7000); // remove after animation
  }
}

/* --------- Hearts ---------- */
function spawnHearts(count=8){
  const container = document.getElementById('heartsContainer');
  for(let i=0;i<count;i++){
    const h=document.createElement('div');
    h.className='heart';
    h.style.left=Math.random()*90+'%';
    const emoji=['💖','💝','💗'];
    h.textContent=emoji[Math.floor(Math.random()*emoji.length)];
    h.style.animationDuration=(3+Math.random()*2)+'s';
    container.appendChild(h);
    setTimeout(()=>h.remove(),5000);
  }
}

/* --------- Floating Photo ---------- */
function showFloatingPhoto(){
  const photo=document.getElementById('floatingPhoto');
  photo.classList.remove('hidden');
  setTimeout(()=>{ photo.style.opacity=1; },50);
}

/* --------- Custom cake text ---------- */
function addCakeText(){
  const cake = document.querySelector('.cake');
  const textDiv = document.createElement('div');
  textDiv.style.position='absolute';
  textDiv.style.top='50px';
  textDiv.style.left='50%';
  textDiv.style.transform='translateX(-50%)';
  textDiv.style.color='#fff';
  textDiv.style.fontWeight='700';
  textDiv.style.fontSize='1.3rem';
  textDiv.textContent='Preeti\'s Cake';
  cake.appendChild(textDiv);
}

/* ---------- Integration ---------- */
// When cake shows, spawn balloons and add cake text
celebrateBtn.addEventListener('click', () => {
  setTimeout(()=>{ spawnBalloons(8); spawnHearts(6); addCakeText(); }, 500);
});

// When candles are blown, show floating photo
bujhaBtn.addEventListener('click', () => {
  setTimeout(showFloatingPhoto, 600);
});
