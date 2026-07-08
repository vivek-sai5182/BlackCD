// 'ad39dd9e05mshef7ec8539d5cbe2p1abb87jsnb8293eb39ed3'
const apikey = "ad39dd9e05mshef7ec8539d5cbe2p1abb87jsnb8293eb39ed3"


export async function getUrl(videoId) {
  console.log('🔍 getUrl called for:', videoId);

  const url = `https://youtube-mp3-2025.p.rapidapi.com/v1/social/youtube/audio?id=${videoId}&quality=128kbps&ext=mp3`;

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': apikey,
      'x-rapidapi-host': 'youtube-mp3-2025.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const text = await response.text();
    const result = JSON.parse(text);
    console.log('API result:', result);

    if (result?.linkStream && !result.error) {
      console.log('✅ API success');
      return { url: result.linkStream, needsPolling: false };
    }

    console.log('❌ API failed for:', videoId);
    return null;
  } catch (e) {
    console.log('getUrl error:', e.message);
    return null;
  }
}