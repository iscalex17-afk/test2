/* Animated background lines + stars */
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const c = document.getElementById('bg-canvas');
  const ctx = c.getContext('2d');
  let w, h, dpr, time = 0;
  const LINES = 12;
  const POINTS = 180;   // samples per line
  const SPEED = 0.0012; // global speed
  const AMPL = 34;      // amplitude
  const GAP = 24;       // vertical gap between lines
  const STAR_COUNT = 160;
  const stars = [];

  function resize(){
    dpr = Math.min(2, window.devicePixelRatio || 1);
    w = c.width = Math.floor(innerWidth * dpr);
    h = c.height = Math.floor(innerHeight * dpr);
    c.style.width = innerWidth + 'px';
    c.style.height = innerHeight + 'px';
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(dpr,dpr);
    // regen stars on resize
    stars.length = 0;
    for(let i=0;i<STAR_COUNT;i++){
      stars.push({
        x: Math.random()*innerWidth,
        y: Math.random()*innerHeight,
        r: Math.random()*1.4 + 0.2,
        a: Math.random()*0.6 + 0.2,
        s: Math.random()*0.3 + 0.05
      });
    }
  }
  window.addEventListener('resize', resize, {passive:true});
  resize();

  // Smooth noise via sum of sines
  function fbm(x, t){
    let v=0, a=1, f=1;
    for(let i=0;i<4;i++){
      v += a*Math.sin(x*f + t* (0.6 + i*0.07));
      a *= 0.5; f *= 1.9;
    }
    return v;
  }

  function drawStars(dt){
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for(const s of stars){
      s.x += s.s*dt*0.06; // drift
      if(s.x>innerWidth+2) s.x=-2;
      ctx.globalAlpha = s.a;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(120,200,255,0.6)';
      ctx.fill();
    }
    ctx.restore();
  }

  function drawLines(t){
    ctx.save();
    ctx.lineWidth = 1.2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = 'rgba(60,230,255,0.65)';
    ctx.globalCompositeOperation = 'lighter';

    const centerY = innerHeight*0.55;
    for(let l=0; l<LINES; l++){
      const y0 = centerY + (l - LINES/2) * GAP;
      ctx.beginPath();
      for(let i=0;i<=POINTS;i++){
        const p = i/POINTS;
        const x = p * innerWidth;
        const y = y0 + fbm((i*0.06) + l*0.35, t) * AMPL * (0.35 + l/LINES);
        if(i===0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      const alpha = 0.2 + (l/(LINES-1))*0.25;
      ctx.strokeStyle = 'rgba(60,230,255,'+alpha.toFixed(3)+')';
      ctx.stroke();
    }
    ctx.restore();
  }

  let last = performance.now();
  function loop(now){
    const dt = now - last;
    last = now;
    time += dt * (prefersReduced ? 0.2*SPEED : SPEED);
    ctx.clearRect(0,0,innerWidth,innerHeight);

    // subtle vignette
    const g = ctx.createRadialGradient(innerWidth*0.8, innerHeight*0.2, 0, innerWidth*0.8, innerHeight*0.2, Math.max(innerWidth, innerHeight));
    g.addColorStop(0, 'rgba(50,180,255,0.05)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,innerWidth,innerHeight);

    drawStars(dt);
    drawLines(time);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // Footer year
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
})();