import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { blobs } = await list({ prefix: 'profile-pic' });
    
    if (blobs.length > 0) {
      // Return the URL. We append a timestamp to ensure the browser
      // doesn't cache an older version of the profile picture.
      const url = `${blobs[0].url}?t=${Date.now()}`;
      return res.status(200).json({ url });
    } else {
      return res.status(404).json({ error: 'Profile picture not found' });
    }
  } catch (error) {
    console.error('List error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to retrieve profile picture (Unknown error)' 
    });
  }
}
