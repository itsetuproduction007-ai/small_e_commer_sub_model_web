const fs = require('fs');

const unsplashUrls = [
  'https://images.unsplash.com/photo-1610030469983-98e550d615ef?auto=format&fit=crop&w=800&q=80', // woman in sari
  'https://images.unsplash.com/photo-1583391733958-d15f00e9a532?auto=format&fit=crop&w=800&q=80', // indian clothes
  'https://images.unsplash.com/photo-1583391733975-6b45070f7e6e?auto=format&fit=crop&w=800&q=80', // more indian fashion
  'https://images.unsplash.com/photo-1614031679268-6a5d40c6c117?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1550411294-f4460f997637?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1617351656209-1a052ff6e9bf?auto=format&fit=crop&w=800&q=80'
];

const mockProducts = [
  { code: 'RER-SAR-101', name: 'Handloom Cotton Saree', price: 1499, fabric: 'Cotton', emojis: '🌸✨' },
  { code: 'RER-SAR-102', name: 'Kerala Kasavu Saree', price: 2199, fabric: 'Cotton', emojis: '🪷🤍' },
  { code: 'RER-KUR-050', name: 'Ajrakh Block Print Kurti', price: 999, fabric: 'Cotton', emojis: '🌺' },
  { code: 'RER-SAR-104', name: 'Kalamkari Silk Saree', price: 3499, fabric: 'Silk', emojis: '🎨✨' },
  { code: 'RER-DUP-010', name: 'Banarasi Silk Dupatta', price: 1299, fabric: 'Silk', emojis: '💖' },
  { code: 'RER-SAR-105', name: 'Indigo Dabu Print Saree', price: 1599, fabric: 'Cotton', emojis: '🦋💙' },
  { code: 'RER-SAR-106', name: 'Mangalgiri Cotton Saree', price: 1899, fabric: 'Cotton', emojis: '🌿' },
  { code: 'RER-SAR-107', name: 'Kanjeevaram Silk Saree', price: 5999, fabric: 'Silk', emojis: '👑✨' },
  { code: 'RER-KUR-051', name: 'Chikankari Embroidered Kurti', price: 1499, fabric: 'Cotton', emojis: '🕊️🤍' },
  { code: 'RER-SAR-108', name: 'Chettinad Cotton Saree', price: 1199, fabric: 'Cotton', emojis: '🏮' },
  { code: 'RER-SAR-109', name: 'Bandhani Silk Saree', price: 2899, fabric: 'Silk', emojis: '🌹' },
  { code: 'RER-DUP-011', name: 'Phulkari Dupatta', price: 899, fabric: 'Cotton', emojis: '🏵️' },
  { code: 'RER-SAR-110', name: 'Ikat Patola Saree', price: 4299, fabric: 'Silk', emojis: '🌈✨' },
  { code: 'RER-SAR-111', name: 'Chanderi Silk Saree', price: 2499, fabric: 'Silk', emojis: '🌟' },
  { code: 'RER-KUR-052', name: 'Bagru Print Anarkali', price: 1899, fabric: 'Cotton', emojis: '🍂' },
  { code: 'RER-SAR-112', name: 'Sungudi Zari Saree', price: 1399, fabric: 'Cotton', emojis: '✨' },
  { code: 'RER-SAR-113', name: 'Organza Floral Saree', price: 3199, fabric: 'Organza', emojis: '🌸🍃' },
  { code: 'RER-DUP-012', name: 'Kashmiri Embroidery Dupatta', price: 1599, fabric: 'Georgette', emojis: '❄️' },
  { code: 'RER-SAR-114', name: 'Maheshwari Silk Saree', price: 2799, fabric: 'Silk', emojis: '💫' },
  { code: 'RER-SAR-115', name: 'Linen Jamdani Saree', price: 3599, fabric: 'Linen', emojis: '🌾' },
  { code: 'RER-KUR-053', name: 'Sanganeri Print Kurti', price: 899, fabric: 'Cotton', emojis: '🌻' }
];

function createInstagramMojibake(text) {
  // Instagram exports UTF-8 bytes as a Latin-1 string
  return Buffer.from(text, 'utf8').toString('binary');
}

const posts = mockProducts.map((p, i) => {
  const caption = `Product Code: ${p.code}\n\nPresenting our beautiful ${p.name}. Made from pure ${p.fabric.toLowerCase()}, it is perfect for the festive season! ${p.emojis}\n\nPrice: ₹${p.price}\n\nDM to order or tap the link in bio.\n\n#rang_e_renju #handloom #saree #ethnicwear`;
  
  const encodedCaption = createInstagramMojibake(caption);
  const ts = Math.floor(Date.now() / 1000) - (i * 86400 * 2); // Spread over past 12 days

  return {
    media: [
      {
        uri: unsplashUrls[i % unsplashUrls.length],
        creation_timestamp: ts,
        title: encodedCaption,
        media_metadata: { photo_metadata: { exif_data: [{ device_id: "android-mock" }] } }
      }
    ]
  };
});

// Create the JSON structure matching the export
const exportData = posts; // Instagram provides an array of these post objects

fs.writeFileSync('scripts/demo_posts_1.json', JSON.stringify(exportData, null, 2), 'utf8');
console.log('✅ Created scripts/demo_posts_1.json with Instagram Mojibake encoding!');
