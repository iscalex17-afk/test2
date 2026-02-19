const slides = Array.from(document.querySelectorAll(".hero__slide"));
const dots = Array.from(document.querySelectorAll("#dots .dot"));
const prev = document.getElementById("prev");
const next = document.getElementById("next");

let idx = 0;
let timer = null;

function setActive(i){
  idx = (i + slides.length) % slides.length;
  slides.forEach((s,k)=> s.classList.toggle("is-active", k === idx));
  dots.forEach((d,k)=> d.classList.toggle("is-active", k === idx));
}

function goNext(){ setActive(idx + 1); }
function goPrev(){ setActive(idx - 1); }

function start(){
  stop();
  timer = setInterval(goNext, 4500);
}
function stop(){
  if(timer) clearInterval(timer);
  timer = null;
}

dots.forEach((d, i)=>{
  d.addEventListener("click", ()=>{ setActive(i); start(); });
});
next?.addEventListener("click", ()=>{ goNext(); start(); });
prev?.addEventListener("click", ()=>{ goPrev(); start(); });

document.querySelector(".hero")?.addEventListener("mouseenter", stop);
document.querySelector(".hero")?.addEventListener("mouseleave", start);

setActive(0);
start();

// CTA scroll
function scrollToOffer(){
  const target = document.getElementById("offerForm");
  if(!target) return;
  target.scrollIntoView({behavior:"smooth", block:"center"});
  target.style.transition = "box-shadow .2s ease";
  const prevShadow = target.style.boxShadow;
  target.style.boxShadow = "0 0 0 6px rgba(14,165,233,.25), 0 18px 60px rgba(11,18,32,.18)";
  setTimeout(()=> target.style.boxShadow = prevShadow, 1200);
}

document.getElementById("ctaOffer")?.addEventListener("click", scrollToOffer);
document.getElementById("ctaOffer2")?.addEventListener("click", scrollToOffer);

// Reviews
const REVIEWS = [
  { name:"M. Krüger", stars:5, city:"Helmstedt", date:"2026-02-10", text:"Schnell reagiert, pünktlich da, Ergebnis top." },
  { name:"S. Neumann", stars:5, city:"Wolfsburg", date:"2026-01-28", text:"Umzugsreinigung mit Abnahme – ohne Stress. Sehr gründlich." },
  { name:"Hausverwaltung B.", stars:5, city:"Braunschweig", date:"2026-01-17", text:"Zuverlässig, sauber, termintreu. Kommunikation professionell." },
  { name:"T. Brandt", stars:4, city:"Königslutter", date:"2026-01-05", text:"Gute Arbeit, fairer Preis. Würde wieder buchen." },
  { name:"A. Weber", stars:5, city:"Schöningen", date:"2025-12-18", text:"Entrümpelung im Keller – schnell erledigt und sauber hinterlassen." },
  { name:"N. Richter", stars:5, city:"Gifhorn", date:"2025-12-04", text:"Büro war richtig sauber. Sehr angenehm und diskret." }
];

function starString(n){
  const full="★★★★★", empty="☆☆☆☆☆";
  return full.slice(0,n) + empty.slice(0,5-n);
}
function formatDate(iso){
  const d=new Date(iso);
  return d.toLocaleDateString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric"});
}

function renderReviews(){
  const wrap = document.getElementById("reviews");
  if(!wrap) return;

  wrap.innerHTML = REVIEWS
    .slice().sort((a,b)=> new Date(b.date) - new Date(a.date))
    .slice(0, 6)
    .map(r => `
      <article class="review">
        <div class="review__top">
          <div>
            <div class="review__name">${r.name}</div>
            <div class="review__meta">${r.city} • ${formatDate(r.date)}</div>
          </div>
          <div class="stars">${starString(r.stars)}</div>
        </div>
        <p>${r.text}</p>
      </article>
    `).join("");
}

document.addEventListener("DOMContentLoaded", renderReviews);
