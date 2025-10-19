async function parseBibFile(bibFilePath) {
  const response = await fetch(bibFilePath);
  const bibText = await response.text();
  
  const publications = [];
  
  // Split by @ to get each entry
  const entries = bibText.split('@').filter(e => e.trim());
  
  entries.forEach(entry => {
    const pub = {};
    
    // Extract title
    const titleMatch = entry.match(/title\s*=\s*[{"](.*?)[}"]/i);
    if (titleMatch) pub.title = titleMatch[1].replace(/[{}]/g, '');
    
    // Extract authors
    const authorMatch = entry.match(/author\s*=\s*[{"](.*?)[}"]/i);
    if (authorMatch) pub.authors = authorMatch[1].replace(/ and /g, ', ');
    
    // Extract year
    const yearMatch = entry.match(/year\s*=\s*[{"]*(\d{4})[}"]*,/i);
    if (yearMatch) pub.year = parseInt(yearMatch[1]);
    
    // Extract venue (journal/booktitle)
    const venueMatch = entry.match(/(?:journal|booktitle)\s*=\s*[{"](.*?)[}"]/i);
    if (venueMatch) pub.venue = venueMatch[1];
    
    // Extract URL/link
    const urlMatch = entry.match(/url\s*=\s*[{"](.*?)[}"]/i);
    if (urlMatch) pub.link = urlMatch[1];
    
    if (pub.title) publications.push(pub);
  });
  
  return publications;
}