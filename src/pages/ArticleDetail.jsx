// src/components/ArticleDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { supabase } from '../utils/supabase';
import '../components/admin/ArticleEditor.css';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('articles')
          .select(`
            *,
            article_images (
              id,
              src,
              width,
              height,
              fitmode,
              image_type
            ),
            article_backgrounds (
              background_type,
              background_data
            )
          `)
          .eq('slug', slug)
          .single();

        if (fetchError) throw new Error(`Failed to fetch article: ${fetchError.message}`);
        if (!data) throw new Error('Article not found');

        const heroImage = data.article_images?.find((img) => img.image_type === 'hero') || null;
        const contentImages = data.article_images?.filter((img) => img.image_type === 'content') || [];

        setArticle({
          ...data,
          heroImage,
          contentImages,
          heroType: heroImage ? 'image' : (data.article_backgrounds?.[0]?.background_type || 'none'),
          gradientColor1: data.article_backgrounds?.[0]?.background_data?.color_one || '#4fd1c5',
          gradientColor2: data.article_backgrounds?.[0]?.background_data?.color_two || '#38a169',
          gradientAngle: data.article_backgrounds?.[0]?.background_data?.angle || 90,
          layout: [
            {
              id: data.id || uuidv4(),
              type: 'hero',
              src: heroImage?.src || null,
              width: heroImage?.width || 1200,
              height: heroImage?.height || 300,
              fitmode: heroImage?.fitmode || 'cover',
              text: data.hero_text || '',
              position: { x: 50, y: 50 },
              zIndex: 0,
            },
            {
              id: uuidv4(),
              type: 'title',
              content: data.title || 'Untitled',
              position: { x: 50, y: 350 },
              width: 1100,
              height: 60,
              zIndex: 1,
            },
            {
              id: uuidv4(),
              type: 'meta',
              content: `${
                data.date ? new Date(data.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'No Date'
              } • ${data.author || 'Fraud Check Team'}`,
              position: { x: 50, y: 420 },
              width: 1100,
              height: 30,
              zIndex: 2,
            },
            {
              id: uuidv4(),
              type: 'summary',
              content: data.summary || '',
              position: { x: 50, y: 460 },
              width: 1100,
              height: 50,
              zIndex: 3,
            },
            {
              id: uuidv4(),
              type: 'content',
              content: data.content || '',
              position: { x: 50, y: 520 },
              width: 1100,
              height: 200,
              zIndex: 4,
            },
            ...contentImages.map((img) => ({
              id: img.id || uuidv4(),
              type: 'image',
              src: img.src,
              width: img.width || 300,
              height: img.height || 200,
              fitmode: img.fitmode || 'contain',
              position: { x: 50, y: 720 },
              zIndex: 5,
            })),
          ],
        });
      } catch (err) {
        console.error('Fetch article error:', err.message);
        setError(`Failed to load article: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <svg className="animate-spin h-8 w-8 text-cyan-600 mx-auto" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Article not found.'}</p>
          <Link to="/" className="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-700 rounded-lg">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 sm:p-8">
          <Link
            to="/"
            className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500 mb-8"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Articles
          </Link>
          <article className="prose dark:prose-invert max-w-none">
            {article.layout.map((block) => (
              <React.Fragment key={block.id}>
                {block.type === 'hero' && article.heroType === 'linear' && (
                  <div
                    className="relative w-full h-96 mb-8 rounded-lg overflow-hidden"
                    style={{
                      background: `linear-gradient(${article.gradientAngle}deg, ${article.gradientColor1}, ${article.gradientColor2})`,
                    }}
                  >
                    {block.text && (
                      <div
                        className="absolute text-white text-4xl font-bold text-center w-full"
                        style={{
                          left: `${block.position?.x || 50}%`,
                          top: `${block.position?.y || 50}%`,
                          transform: 'translate(-50%, -50%)',
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                        }}
                        dangerouslySetInnerHTML={{ __html: block.text }}
                      />
                    )}
                  </div>
                )}
                {block.type === 'hero' && article.heroType === 'image' && block.src && (
                  <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                    <img
                      src={block.src}
                      alt="Hero Image"
                      className="w-full h-full object-cover"
                      style={{ objectFit: block.fitmode || 'cover' }}
                    />
                    {block.text && (
                      <div
                        className="absolute text-white text-4xl font-bold text-center w-full"
                        style={{
                          left: `${block.position?.x || 50}%`,
                          top: `${block.position?.y || 50}%`,
                          transform: 'translate(-50%, -50%)',
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                        }}
                        dangerouslySetInnerHTML={{ __html: block.text }}
                      />
                    )}
                  </div>
                )}
                {block.type === 'title' && (
                  <h1
                    className="text-4xl font-bold mb-4 text-center"
                    dangerouslySetInnerHTML={{ __html: block.content || 'Untitled' }}
                  />
                )}
                {block.type === 'meta' && (
                  <p
                    className="text-gray-600 dark:text-gray-400 text-sm mb-6 text-center"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                )}
                {block.type === 'summary' && block.content && (
                  <p
                    className="text-lg italic mb-8 text-center"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                )}
                {block.type === 'content' && (
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: block.content || 'No content provided' }}
                  />
                )}
                {block.type === 'image' && block.src && (
                  <div className="mb-6 mx-auto" style={{ textAlign: 'center' }}>
                    <img
                      src={block.src}
                      alt="Content Image"
                      className="rounded-lg"
                      style={{
                        width: `${block.width || 300}px`,
                        height: `${block.height || 200}px`,
                        objectFit: block.fitmode || 'contain',
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </article>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;