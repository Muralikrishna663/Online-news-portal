// admin.js - add, display, delete, tracking chart
(function(){
  const newsForm = document.getElementById('news-form');
  const adminListEl = document.getElementById('admin-news-list');
  const trackingTable = document.getElementById('tracking-table');
  const chartCanvas = document.getElementById('viewsChart');
  const PLACEHOLDER = "https://via.placeholder.com/900x600?text=No+Image";

  // helper - get news array
  function getNews(){ return JSON.parse(localStorage.getItem('news')) || []; }
  function saveNews(arr){ localStorage.setItem('news', JSON.stringify(arr)); }

  // add event
  if (newsForm){
    newsForm.addEventListener('submit', function(e){
      e.preventDefault();
      const title = document.getElementById('title').value.trim();
      const description = document.getElementById('description').value.trim();
      const content = document.getElementById('content').value.trim();
      const category = document.getElementById('category').value.trim() || 'General';
      const image = document.getElementById('image').value.trim() || PLACEHOLDER;
      if(!title || !content){ alert('Title and content required'); return; }

      const arr = getNews();
      const article = {
        id: Date.now(),
        title, description, content, category, image,
        date: new Date().toLocaleDateString(),
        views: 0,
        lastViewed: null
      };
      arr.unshift(article); // newest first
      saveNews(arr);
      this.reset();
      displayAdminNews();
      loadTrackingData();
      alert('Article added');
    });
  }

  // display admin cards with delete & edit (edit opens prompt to change content)
  function displayAdminNews(){
    const arr = getNews();
    if(!adminListEl) return;
    adminListEl.innerHTML = arr.map(a=>`
      <div class="col-md-4">
        <div class="card custom-card h-100">
          <img src="${a.image || PLACEHOLDER}" class="card-img-top" alt="${a.title}">
          <div class="card-body">
            <h6 class="card-title">${a.title}</h6>
            <p class="text-muted mb-1">${a.category}</p>
            <p class="mb-0 text-truncate">${a.description}</p>
          </div>
          <div class="card-footer">
            <small class="text-muted">Views: ${a.views||0}</small>
            <div class="float-end">
              <button class="btn btn-sm btn-outline-secondary me-1" onclick="editArticle(${a.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteArticle(${a.id})">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // delete
  window.deleteArticle = function(id){
    if(!confirm('Delete this article?')) return;
    let arr = getNews();
    arr = arr.filter(a => String(a.id) !== String(id));
    saveNews(arr);
    displayAdminNews();
    loadTrackingData();
  }

  // edit (simple prompts)
  window.editArticle = function(id){
    const arr = getNews();
    const idx = arr.findIndex(a=>String(a.id)===String(id));
    if(idx === -1) return alert('Not found');
    const a = arr[idx];
    const newTitle = prompt('Title', a.title);
    if(newTitle === null) return;
    const newDesc = prompt('Short description', a.description);
    if(newDesc === null) return;
    const newContent = prompt('Full content (HTML allowed)', a.content);
    if(newContent === null) return;
    const newCategory = prompt('Category', a.category) || a.category;
    arr[idx] = {...a, title:newTitle, description:newDesc, content:newContent, category:newCategory};
    saveNews(arr);
    displayAdminNews();
    loadTrackingData();
    alert('Article updated');
  }

  // tracking table + chart
  let chartInstance = null;
  function loadTrackingData(){
    const arr = getNews();
    if(trackingTable){
      trackingTable.innerHTML = arr.map(a=>`
        <tr>
          <td style="max-width:400px">${a.title}</td>
          <td>${a.views||0}</td>
          <td>${a.lastViewed || 'Never'}</td>
          <td><button class="btn btn-sm btn-link" onclick="openArticleFromAdmin(${a.id})">Open</button></td>
        </tr>
      `).join('');
    }

    // chart - views per category
    const categories = {};
    arr.forEach(a => { categories[a.category] = (categories[a.category]||0) + (a.views||0); });

    const labels = Object.keys(categories);
    const data = Object.values(categories);
    if(chartInstance) chartInstance.destroy();
    if(chartCanvas){
      chartInstance = new Chart(chartCanvas, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Views per Category',
            data,
            backgroundColor: labels.map(_=> 'rgba(67,100,247,0.85)'),
            borderColor: labels.map(_=> 'rgba(67,100,247,1)'),
            borderWidth: 1
          }]
        },
        options: {
          scales: { y: { beginAtZero:true, ticks: { precision:0 }}}
        }
      });
    }
  }

  // helper to open article from admin
  window.openArticleFromAdmin = function(id){
    window.open(`article.html?id=${id}`, '_blank');
  }

  // init
  displayAdminNews();
  loadTrackingData();
})();
