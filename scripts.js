// 🎤 Fetch Bio
fetch(`https://wux05uca.api.sanity.io/v1/data/query/production?query=${encodeURIComponent('*[_type == "bio"][0]{content}')}`)
  .then(res => res.json())
  .then(({ result }) => {
    document.getElementById('bio-content').textContent = result.content;
  });

// 🎶 Fetch Tracks
fetch(`https://wux05uca.api.sanity.io/v1/data/query/production?query=${encodeURIComponent('*[_type == "track"]{title, genre, "audioUrl": audio.asset->url}')}`)
  .then(res => res.json())
  .then(({ result }) => {
    const container = document.getElementById('track-list');
    result.forEach(track => {
      const div = document.createElement('div');
      div.className = 'track';
      div.innerHTML = `
        <p><strong>${track.title}</strong> <span>${track.genre}</span></p>
        <audio controls src="${track.audioUrl}"></audio>
      `;
      container.appendChild(div);
    });
  });

// 📸 Fetch Gallery Images
fetch(`https://wux05uca.api.sanity.io/v1/data/query/production?query=${encodeURIComponent('*[_type == "galleryImage"]{caption, "imageUrl": image.asset->url}')}`)
  .then(res => res.json())
  .then(({ result }) => {
    const container = document.getElementById('gallery-grid');
    result.forEach(img => {
      const a = document.createElement('a');
      a.href = img.imageUrl;
      a.className = 'lightbox';
      a.innerHTML = `<img src="${img.imageUrl}" alt="${img.caption}" loading="lazy" />`;
      container.appendChild(a);
    });
  });

// 🍔 Mobile Nav Toggle
document.querySelector('.nav-toggle')?.addEventListener('click', () => {
  document.querySelector('.nav-menu')?.classList.toggle('active');
});

// 🔍 Lightbox Viewer
document.addEventListener('click', e => {
  const link = e.target.closest('.lightbox');
  if (link) {
    e.preventDefault();
    const img = document.createElement('img');
    img.src = link.href;
    img.style = 'max-width:90vw; max-height:90vh; border-radius:10px;';
    const overlay = document.createElement('div');
    overlay.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:9999;';
    overlay.appendChild(img);
    overlay.onclick = () => document.body.removeChild(overlay);
    document.body.appendChild(overlay);
  }
});

// 🔝 Scroll-to-Top Button
const scrollBtn = document.getElementById('scrollTop');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
