
let content;

async function getContent() {
  const response = await fetch('data/content.yaml');
  const text = await response.text();
  return jsyaml.load(text);
}

function boldFaceAuthor(text) {
  const regex = new RegExp(`(${BIB_AUTHOR_HIGHLIGHT})`, 'g');
  return text.replace(regex, '<b>$1</b>');
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
    
    // contact info
    document.getElementById('google-scholar').href = content.personal.links.google_scholar;
    document.getElementById('github').href = content.personal.links.github;
    document.getElementById('email').href = content.personal.links.email;
    // Populate publications
    bib = await parseBibFile(BIB_FILE_PATH);
    const pubList = document.getElementById('publications-list');
    bib.forEach(pub => {
      const div = document.createElement('div');
      div.className = 'publication';
      author_formatted = boldFaceAuthor(pub.authors, content.personal.name);
      div.innerHTML = `
        <div class="publication-title">${pub.title}</div>
        <div class="publication-meta">
          ${author_formatted} | ${pub.venue}
          ${pub.link ? `<a href="${pub.link}" target="_blank">→ View paper</a>` : ''}
        </div>
      `;
      pubList.appendChild(div);
    });
    document.getElementById('publications-section').style.display = 'block';

    const achievementsList = document.getElementById('achievements-list');
    content.achievements.forEach(achievement => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${achievement.title}</strong> (${achievement.date})`;
      achievementsList.appendChild(li);
    });
    document.getElementById('achievements-section').style.display = 'block';

    const projectsList = document.getElementById('projects-list');
    content.projects.forEach(project => {
      const div = document.createElement('div');
      div.className = 'publication';
      div.innerHTML = `
        <div class="publication-title">
          ${project.title}
        </div>
        <div class="publication-meta">
          ${project.description}
          ${project.link ? `<a href="${project.link}" target="_blank">→ View project</a>` : ''}
        </div>
      `;
      projectsList.appendChild(div);
    });
    document.getElementById('projects-section').style.display = 'block';
    // Rest of population code...
    
  } catch (e) {
    console.error('Error loading content:', e);
    document.getElementById('loading').textContent = 'Error loading content.';
  }
}

// Call when page loads
loadContent();