import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image, password } = req.body;

  // Verify Admin Password
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized: Invalid Admin Password' });
  }

  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    // The image arrives as a base64 Data URL, e.g. "data:image/jpeg;base64,iVBORw0K..."
    const parts = image.split(',');
    const mimeType = parts[0].split(';')[0].split(':')[1];
    const base64Data = parts[1];
    
    // Convert base64 to a Buffer
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Upload to Vercel Blob, replacing the existing file
    const blob = await put('profile-pic', buffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType: mimeType,
    });

    return res.status(200).json({ success: true, url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to upload image (Unknown error)' 
    });
  }
}
