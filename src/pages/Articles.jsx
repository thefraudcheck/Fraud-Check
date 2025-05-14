// ... (keep imports, ErrorBoundary, and other code as is)

function Articles() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const fetchArticles = async (retryCount = 0) => {
      try {
        setLoading(true);
        console.log('Fetching articles from Supabase at:', new Date().toISOString());
        console.log('Supabase URL:', 'https://ualzgryrkwktiqndotzo.supabase.co');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const { data: articlesData, error: articlesError } = await supabase
          .from('articles')
          .select(`
            slug, title, summary, content, author, date, category, tags,
            article_images (
              id, src, x, y, zoom, rotation, width, height, fitmode, image_type
            )
          `) // Removed article_backgrounds for simplicity
          .order('date', { ascending: false })
          .abortSignal(controller.signal);

        clearTimeout(timeoutId);

        if (articlesError) {
          console.error('Supabase error:', articlesError);
          if (retryCount < 2) {
            console.log('Retrying fetch, attempt:', retryCount + 1);
            return setTimeout(() => fetchArticles(retryCount + 1), 1000);
          }
          throw new Error(`Supabase error: ${articlesError.message}`);
        }

        console.log('Raw Supabase data:', articlesData);

        const normalizedArticles = articlesData.map((article) => {
          const cardImages = (article.article_images || [])
            .filter((img) => img.image_type === 'card')
            .map((img) => ({
              ...img,
              src: `${img.src}?t=${Date.now()}`,
              x: img.x ?? 0,
              y: img.y ?? 0,
              zoom: img.zoom ?? 1.0,
              rotation: img.rotation ?? 0,
              width: img.width || 320,
              height: img.height || 320,
              fitMode: img.fitmode ?? 'cover',
            }));

          console.log('Card images for', article.slug, ':', cardImages);

          return {
            ...article,
            title: article.title || 'Untitled',
            summary: article.summary || '',
            content: article.content || '',
            category: article.category || null,
            tags: Array.isArray(article.tags) ? article.tags : [],
            cardImages,
            image: cardImages[0]?.src || 'https://via.placeholder.com/150',
            heroImages: (article.article_images || [])
              .filter((img) => img.image_type === 'hero')
              .map((img) => ({
                ...img,
                src: `${img.src}?t=${Date.now()}`,
                x: img.x ?? 0,
                y: img.y ?? 0,
                zoom: img.zoom ?? 1.0,
                rotation: img.rotation ?? 0,
                width: img.width || 1200,
                height: img.height || 300,
                fitMode: img.fitmode ?? 'cover',
              })),
            background: null,
          };
        });

        console.log('Normalized articles:', normalizedArticles);
        setArticles(normalizedArticles);
        setDebugInfo({
          articlesLength: normalizedArticles.length,
          articlesSlugs: normalizedArticles.map((a) => a.slug),
          fetchTime: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Fetch articles error:', err.message);
        setError(`Failed to load articles: ${err.message}`);
        setArticles([]);
        setDebugInfo({ error: err.message, fetchTime: new Date().toISOString() });
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // ... (keep rest of JSX unchanged)
}

export default Articles;