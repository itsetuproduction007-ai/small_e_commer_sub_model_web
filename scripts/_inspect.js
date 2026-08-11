const fs = require('fs');
const html = fs.readFileSync('scripts/ig_profile.html', 'utf8');
console.log('File bytes:', html.length);

const markers = [
  '_sharedData', 'additionalDataLoaded', 'edge_owner_to_timeline_media',
  'xdt_api__v1', 'profile_pic_url', '__typename', 'X-IG-App-ID',
  'xdt_web_profile_info', 'web_profile_info', 'graphql',
];
for (const m of markers) {
  let idx = -1, count = 0;
  while ((idx = html.indexOf(m, idx + 1)) !== -1) { count++; if (count > 5) break; }
  console.log(m, '=> count(first6):', count);
}

// Try to find all script tags that contain 'timeline_media'
const re = /<script[^>]*>([\s\S]*?)<\/script>/g;
let m, scriptCount = 0;
while ((m = re.exec(html))) {
  const s = m[1];
  if (s.includes('window._sharedData') || s.includes('additionalDataLoaded') || s.includes('timeline_media')) {
    scriptCount++;
    console.log('--- SCRIPT', scriptCount, 'len', s.length, '---');
    console.log(s.slice(0, 500));
  }
}
console.log('scripts containing post data:', scriptCount);
