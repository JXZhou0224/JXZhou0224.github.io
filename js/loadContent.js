let content;

async function getContent() {
  const response = await fetch('data/content.yaml');
  const text = await response.text();
  return jsyaml.load(text);
}

async function loadContent() {
  try {
    content = await getContent();
    
    // Hide loading message
    document.getElementById('loading').style.display = 'none';
    
    // Populate header
    document.getElementById('name').textContent = content.personal.name;
    document.getElementById('title').textContent = content.personal.title;
    document.getElementById('institution').textContent = content.personal.institution;
    document.getElementById('header').style.display = 'block';
    
    // Populate bio
    document.getElementById('bio').textContent = content.personal.bio;
    document.getElementById('about-section').style.display = 'block';
    
    // Populate publications
    const pubList = document.getElementById('publications-list');
    content.publications.forEach(pub => {
      const div = document.createElement('div');
      div.className = 'publication';
      div.innerHTML = `
        <div class="publication-title">${pub.title}</div>
        <div class="publication-meta">
          ${pub.authors} | ${pub.venue} (${pub.year})
          ${pub.link ? `<a href="${pub.link}" target="_blank">→ View paper</a>` : ''}
        </div>
      `;
      pubList.appendChild(div);
    });
    document.getElementById('publications-section').style.display = 'block';
    
    // Rest of population code...
    
  } catch (e) {
    console.error('Error loading content:', e);
    document.getElementById('loading').textContent = 'Error loading content.';
  }
}

// Call when page loads
loadContent();