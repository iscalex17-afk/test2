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

  const count = REVIEWS.length;
  const avg = count ? (REVIEWS.reduce((s,r)=>s+r.stars,0)/count) : 0;

  const avgEl = document.getElementById("avgRating");
  const countEl = document.getElementById("reviewCount");
  if(avgEl) avgEl.textContent = avg.toFixed(1);
  if(countEl) countEl.textContent = String(count);

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

function scrollToOffer(){
  const card = document.getElementById("offerCard");
  if(!card) return;
  card.scrollIntoView({behavior:"smooth", block:"center"});
  card.style.transition = "box-shadow .2s ease";
  const prev = card.style.boxShadow;
  card.style.boxShadow = "0 0 0 6px rgba(14,165,233,.25), 0 16px 50px rgba(11,18,32,.12)";
  setTimeout(()=> card.style.boxShadow = prev, 1200);
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderReviews();

  document.getElementById("angebotSichernBtn")?.addEventListener("click", scrollToOffer);

  document.querySelectorAll("[data-scroll='offerCard']").forEach(btn=>{
    btn.addEventListener("click", scrollToOffer);
  });
});
