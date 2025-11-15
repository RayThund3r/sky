const sanityBase = 'https://wux05uca.api.sanity.io/v1/data/query/production';

// 🔧 Utility: Fetch and inject content
function fetchSanity(query, onSuccess, label) {
  fetch(`${sanityBase}?query=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(({ result }) => onSuccess(result))
    .catch(err => console.error(`${label} fetch error:`, err));
}

// 🌀 Hide loading spinner after all content loads
const hideSpinner = () => {
  const spinner = document.getElementById('loading-spinner');
  if (spinner) spinner.style.display = 'none';
};

// 🎤 Bio Section
const bioPromise = new Promise(resolve => {
  fetchSanity('*[_type == "bio"][0]{content}', result => {
    const bio = document.getElementById('bio-content');
    bio.textContent = result?.content || 'Bio coming soon...';
    resolve();
  }, 'Bio');
});

const trackPromise = new Promise(resolve => {
  fetchSanity(`*[_type == "track"]{
    title,
    genre,
    "audioUrl": audio.asset->url
  }`, result => {
    const container = document.getElementById('track-list');
    container.innerHTML = '';

    result.forEach((track, index) => {
      const div = document.createElement('div');
      div.className = 'track';

      const waveformId = `waveform-${index}`;

      div.innerHTML = `
        <h3>${track.title}</h3>
        <span class="track-meta">${track.genre ? ` ${track.genre}` : ''}</span>
        <div id="${waveformId}" class="waveform"></div>
        <button class="play-button">▶ Play</button>
      `;

      container.appendChild(div);

      const wavesurfer = WaveSurfer.create({
        container: `#${waveformId}`,
        waveColor: '#f39c12',
        progressColor: '#e67e22',
        height: 80,
        responsive: true
      });

      wavesurfer.load(track.audioUrl);

      const playBtn = div.querySelector('.play-button');
      playBtn.addEventListener('click', () => {
        wavesurfer.playPause();
      });
    });

    resolve();
  }, 'Track');
});

// 📸 Gallery Section with hover captions
const galleryPromise = new Promise(resolve => {
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

      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
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
      caption.style.position = 'absolute';
      caption.style.bottom = '0';
      caption.style.left = '0';
      caption.style.right = '0';
      caption.style.padding = '8px';
      caption.style.background = 'rgba(0, 0, 0, 0.6)';
      caption.style.color = '#fff';
      caption.style.fontSize = '0.9rem';
      caption.style.opacity = '0';
      caption.style.transition = 'opacity 0.3s ease';

      wrapper.addEventListener('mouseenter', () => {
        caption.style.opacity = '1';
      });
      wrapper.addEventListener('mouseleave', () => {
        caption.style.opacity = '0';
      });

      wrapper.appendChild(image);
      wrapper.appendChild(caption);
      a.appendChild(wrapper);
      container.appendChild(a);
    });
    resolve();
  }, 'Gallery');
});

// 🌀 Wait for all content to load before hiding spinner
Promise.all([bioPromise, trackPromise, galleryPromise]).then(hideSpinner);

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

// 🌙 Dark Mode Toggle
document.getElementById('darkToggle')?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});


window.addEventListener('scroll', () => {
  const navBar = document.getElementById('nav-bar');
  const branding = document.querySelector('.branding');
  const heroTitle = document.querySelector('.hero-title');

  if (window.scrollY > 100) {
    navBar.classList.add('sticky');
    branding.style.opacity = '1';
    heroTitle.style.opacity = '0';
  } else {
    navBar.classList.remove('sticky');
    branding.style.opacity = '0';
    heroTitle.style.opacity = '1';
  }
});

window.addEventListener('scroll', () => {
  const navBar = document.getElementById('nav-bar');
  const hero = document.querySelector('.hero');
  const branding = document.querySelector('.branding');
  const heroTitle = document.querySelector('.hero-title');

  const heroBottom = hero.offsetTop + hero.offsetHeight;

  if (window.scrollY > heroBottom) {
    navBar.classList.add('sticky');
    branding.style.opacity = '1';
    heroTitle.style.opacity = '0';
  } else {
    navBar.classList.remove('sticky');
    branding.style.opacity = '0';
    heroTitle.style.opacity = '1';
  }
});

document.querySelector('form')?.addEventListener('submit', e => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      alert('✅ Message sent successfully!');
      form.reset();
    } else {
      alert('⚠️ Something went wrong. Please try again.');
    }
  })
  .catch(() => {
    alert('⚠️ Network error. Please check your connection.');
  });
});

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 60) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});


document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-menu').classList.remove('active');
  });
});

const reveals = document.querySelectorAll('.reveal');
window.addEventListener('scroll', () => {
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.classList.add('visible');
    }
  });
});

