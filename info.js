const VALID = /^[a-zA-Z0-9_-]{11}$/;
const ALLOWED = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim().replace(/\/$/, '')).filter(Boolean);
function cors(req, res) {
  const origin = req.headers.origin;
  if (origin && ALLOWED.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  return !origin || ALLOWED.includes(origin);
}
module.exports = async function handler(req, res) {
  const allowed = cors(req, res);
  if (req.method === 'OPTIONS') return res.status(allowed ? 204 : 403).end();
  if (!allowed) return res.status(403).json({error:'Origin not allowed'});
  if (req.method !== 'GET') return res.status(405).json({error:'Method not allowed'});
  const id = typeof req.query.id === 'string' ? req.query.id : '';
  if (!VALID.test(id)) return res.status(400).json({error:'Invalid YouTube video ID'});
  const url = 'https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id);
  try {
    const r = await fetch(url, {signal: AbortSignal.timeout(7000), headers:{'User-Agent':'Mozilla/5.0'}});
    if (!r.ok) return res.status(502).json({error:'Video information unavailable', upstreamStatus:r.status});
    const d = await r.json();
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');
    return res.status(200).json({title:d.title || 'YouTube video', author:d.author_name || 'YouTube', thumbnail:'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg'});
  } catch(e) {return res.status(502).json({error:'Could not fetch video information'});}
};
