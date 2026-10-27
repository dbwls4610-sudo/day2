// Vercel Serverless Function: Pixabay API 키를 서버에서만 사용해 이미지를 검색한다.
// 환경변수 PIXABAY_API_KEY 를 Vercel 프로젝트에 등록해야 한다.
module.exports = async (req, res) => {
  const key = process.env.PIXABAY_API_KEY;
  if (!key) {
    return res.status(500).json({ error: 'PIXABAY_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  const q = String(req.query.q || '').trim();
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  if (!q) {
    return res.status(400).json({ error: '검색어를 입력하세요.' });
  }

  const url = 'https://pixabay.com/api/?key=' + encodeURIComponent(key) +
    '&q=' + encodeURIComponent(q) +
    '&image_type=photo&per_page=10&page=' + page;

  try {
    const r = await fetch(url);
    if (!r.ok) {
      return res.status(r.status).json({ error: 'Pixabay 요청 실패 (' + r.status + ')' });
    }
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    return res.status(200).json({ totalHits: data.totalHits, hits: data.hits });
  } catch (e) {
    return res.status(502).json({ error: 'Pixabay 서버에 연결하지 못했습니다.' });
  }
};
