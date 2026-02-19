function starString(n){
  const full = "★★★★★";
  const empty = "☆☆☆☆☆";
  return full.slice(0, n) + empty.slice(0, 5 - n);
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[s]));
}

function formatDate(iso){
  try{
    const d = new Date(iso);
    return d.toLocaleDateString("de-DE", { day:"2-digit", month:"2-digit", year:"numeric" });
  }catch{ return ""; }
}

async function loadReviews(){
  const res = await fetch("reviews.json", { cache: "no-store" });
  const data = await res.json();

  const count = data.length;
  const avg = count ? (data.reduce((s,r)=>s+r.stars,0) / count) : 0;
  const avgTxt = count ? avg.toFixed(1) : "—";

  const avgEls = [document.getElementById("avgRating"), document.getElementById("avgRating2")];
  const countEls = [document.getElementById("reviewCount"), document.getElementById("reviewCount2")];
  avgEls.forEach(el => el && (el.textContent = avgTxt));
  countEls.forEach(el => el && (el.textContent = String(count)));

  const wrap = document.getElementById("reviews");
  if(!wrap) return;

  wrap.innerHTML = data
    .sort((a,b)=> new Date(b.date) - new Date(a.date))
    .slice(0, 9)
    .map(r => `
      <article class="review">
        <div class="review__top">
          <div>
            <div class="review__name">${escapeHtml(r.name)}</div>
            <div class="review__meta">${escapeHtml(r.city || "Helmstedt")} • ${formatDate(r.date)}</div>
          </div>
          <div class="stars" aria-label="${r.stars} von 5 Sternen">${starString(r.stars)}</div>
        </div>
        <p class="muted">${escapeHtml(r.text)}</p>
      </article>
    `).join("");
}

document.addEventListener("DOMContentLoaded", ()=>{
  loadReviews().catch(()=>{});
});
