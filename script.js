// script.js - homepage rendering (featured, most viewed, grid)
(function(){
  const featuredContainer = document.getElementById("featured-container");
  const newsContainer = document.getElementById("news-container");
  const mostViewedSection = document.getElementById("most-viewed-section");
  let newsList = JSON.parse(localStorage.getItem("news")) || [];

  // placeholder image
  const PLACEHOLDER = "https://via.placeholder.com/900x600?text=No+Image";

  // sort by id (which is Date.now when created) descending
  newsList.sort((a,b)=> Number(b.id) - Number(a.id));
  // featured
  if (newsList.length > 0) {
    const featured = newsList[0];
    featuredContainer.innerHTML = `
      <div class="featured-article row align-items-center g-3">
        <div class="col-md-6">
          <img src="${featured.image || PLACEHOLDER}" alt="${featured.title}">
        </div>
        <div class="col-md-6">
          <h1>${featured.title}</h1>
          <p><span class="category-badge">${featured.category}</span></p>
          <p class="mt-3 text-muted">${featured.description}</p>
          <a href="article.html?id=${featured.id}" class="btn btn-primary read-more-btn">Read Full News</a>
        </div>
      </div>
    `;
  } else {
    featuredContainer.innerHTML = `<div class="alert alert-info">No articles yet. Add from Admin panel.</div>`;
  }

  // most viewed
  const top = [...newsList].sort((a,b)=> (b.views||0) - (a.views||0)).slice(0,3);
  if (top.length > 0 && mostViewedSection){
    mostViewedSection.innerHTML = top.map(a=>`
      <div class="col-md-4">
        <div class="card custom-card h-100">
          <img src="${a.image || PLACEHOLDER}" class="card-img-top" alt="${a.title}">
          <div class="card-body">
            <h6 class="card-title">${a.title}</h6>
            <p class="text-muted mb-1">Views: ${a.views || 0}</p>
            <p class="mb-0 text-truncate">${a.description}</p>
          </div>
          <div class="card-footer">
            <a href="article.html?id=${a.id}" class="btn btn-outline-primary btn-sm">Read Full News</a>
          </div>
        </div>
      </div>
    `).join('');
  } else if (mostViewedSection){
    mostViewedSection.innerHTML = `<div class="col-12"><small class="text-muted">No views tracked yet.</small></div>`;
  }

  // news grid (skip the featured)
  const remaining = newsList.slice(1);
  if (newsContainer){
    newsContainer.innerHTML = remaining.map(article=>`
      <div class="col-md-4">
        <div class="card custom-card h-100">
          <img src="${article.image || PLACEHOLDER}" class="card-img-top" alt="${article.title}">
          <div class="card-body">
            <span class="category-badge">${article.category}</span>
            <h5 class="card-title mt-2">${article.title}</h5>
            <p class="card-text text-muted">${article.description}</p>
          </div>
          <div class="card-footer">
            <small class="text-muted">${article.date}</small>
            <a href="article.html?id=${article.id}" class="btn btn-sm btn-outline-primary float-end">Read Full News</a>
          </div>
        </div>
      </div>
    `).join("");
  }
})();
