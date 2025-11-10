const sanityBase = 'https://wux05uca.api.sanity.io/v1/data/query/production';

// 🔧 Utility: Fetch and inject content
function fetchSanity(query, onSuccess, label) {
  fetch(`${sanityBase}?query=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(({ result }) => onSuccess(result))
    .catch(err => console.error(`${label} fetch error:`, err));
}

// 🎤 Bio Section
fetchSanity('*[_type == "bio"][0]{content}', result => {
  const bio = document.getElementById('bio-content');
  bio.textContent = result?.content || 'Bio coming soon...';
}, 'Bio');

// 🎶 Tracks Section
fetchSanity('*[_type == "track"]{title, genre, "audioUrl": audio.asset->url}', result => {
  const container = document.getElementById('track-list');
  container.innerHTML = '';
  result.forEach(track => {
    const div = document.createElement('div');
    div.className = 'track';
    div.innerHTML = `
      <p><strong>${track.title}</strong> <span>${track.genre}</span></p>
      <audio controls src="${track.audioUrl}"></audio>
    `;
    container.appendChild(div);
  });
}, 'Track');

fetchSanity('*[_type == "galleryImage"]{caption, "imageUrl": image.asset->url}', result => {
  const container = document.getElementById('gallery-grid');
  container.innerHTML = '';

  container.style.display = 'grid';
  container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 2fr))';
  container.style.gap = '20px';
  container.style.marginTop = '20px';

  result.forEach(img => {
    const a = document.createElement('a');
    a.href = img.imageUrl;
    a.className = 'lightbox';
    a.style.display = 'block';
    a.style.textAlign = 'center';

    // 🧱 Image wrapper to preserve border radius
    const wrapper = document.createElement('div');
    wrapper.style.overflow = 'hidden';
    wrapper.style.borderRadius = '8px';

    const image = document.createElement('img');
    image.src = img.imageUrl;
    image.alt = img.caption;
    image.style.width = '100%';
    image.style.aspectRatio = '1 / 1';
    image.style.objectFit = 'cover';
    image.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    image.style.cursor = 'pointer';

    image.addEventListener('mouseenter', () => {
      image.style.transform = 'scale(1.05)';
      image.style.boxShadow = '0 0 15px rgba(243, 156, 18, 0.6)';
    });

    image.addEventListener('mouseleave', () => {
      image.style.transform = 'scale(1)';
      image.style.boxShadow = 'none';
    });

    const caption = document.createElement('p');
    caption.textContent = img.caption;
    caption.style.marginTop = '8px';
    caption.style.fontSize = '0.9rem';
    caption.style.color = '#aaa';

    wrapper.appendChild(image);
    a.appendChild(wrapper);
    a.appendChild(caption);
    container.appendChild(a);
  });
}, 'Gallery');

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
    img.className = 'lightbox-overlay';
    img.style = `
      max-width:90vw;
      max-height:90vh;
      border-radius:10px;
      box-shadow:0 0 20px rgba(0,0,0,0.6);
    `;
    const overlay = document.createElement('div');
    overlay.style = `
      position:fixed;
      top:0; left:0;
      width:100%; height:100%;
      background:rgba(0,0,0,0.8);
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:9999;
    `;
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
