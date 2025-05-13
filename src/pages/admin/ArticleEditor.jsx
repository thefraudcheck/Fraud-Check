import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast, Toaster } from 'react-hot-toast';
import {
  ArrowLeftIcon,
  PhotoIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  TrashIcon,
  PencilIcon,
  PlusIcon,
} from '@heroicons/react/24/solid';
import { supabase } from '../../utils/supabase';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Cropper from 'react-easy-crop';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    ['link', 'image'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['clean'],
  ],
  history: { delay: 1000, maxStack: 100, userOnly: true },
};

const quillFormats = ['header', 'bold', 'italic', 'underline', 'link', 'image', 'list', 'bullet', 'align'];

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ArticleEditor ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 flex items-center justify-center">
          <div className="text-center text-red-600">
            <h1 className="text-3xl font-bold font-inter">Editor Error</h1>
            <p className="mt-2 font-inter">{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-inter"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ArticleEditor = () => {
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState(() => {
    const savedDraft = localStorage.getItem('articleDraft');
    const defaultArticle = {
      slug: '',
      title: '',
      summary: '',
      articleContent: '',
      author: 'Fraud Check Team',
      date: new Date().toISOString().split('T')[0],
      heroType: 'none',
      heroText: '',
      heroImage: null,
      cardImage: null,
      layout: [],
    };
    return savedDraft ? { ...defaultArticle, ...JSON.parse(savedDraft) } : defaultArticle;
  });
  const [editingArticle, setEditingArticle] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });
  const [editorValue, setEditorValue] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropImage, setCropImage] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('articleDraft', JSON.stringify(newArticle));
  }, [newArticle]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw new Error(`Authentication error: ${error.message}`);
        if (session) {
          setIsAuthenticated(true);
          await fetchArticles();
        } else {
          setError('Please log in to access the article editor.');
          setLoading(false);
          navigate('/login');
        }
      } catch (err) {
        setError(`Failed to verify authentication: ${err.message}`);
        setLoading(false);
        navigate('/login');
      }
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) fetchArticles();
      else {
        setError('Please log in to access the article editor.');
        navigate('/login');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated || !newArticle.slug) return;
    const autoSave = setTimeout(() => handleSaveArticle(true), 5000);
    return () => clearTimeout(autoSave);
  }, [newArticle, isAuthenticated]);

  useEffect(() => {
    const container = containerRef.current;
    const handleScroll = () => {
      if (container) setScrollPosition(container.scrollTop);
    };
    if (container) container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!modalState.isOpen && containerRef.current) {
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [modalState.isOpen, scrollPosition]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data: articlesData, error: articlesError } = await supabase
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
          )
        `)
        .order('date', { ascending: false });

      if (articlesError) throw new Error(`Failed to fetch articles: ${articlesError.message}`);

      const normalizedArticles = articlesData.map((article) => {
        const heroImage = article.article_images?.find((img) => img.image_type === 'hero') || null;
        const cardImage = article.article_images?.find((img) => img.image_type === 'card') || null;
        const contentImages = article.article_images
          ?.filter((img) => img.image_type === 'content')
          .map((img) => ({
            id: img.id || uuidv4(),
            src: img.src,
            width: img.width || 300,
            height: img.height || 200,
            fitmode: img.fitmode || 'contain',
            image_type: 'content',
            type: 'image',
            position: { x: 50, y: 720 },
            zIndex: 5,
          })) || [];

        const uniqueContentImages = Array.from(
          new Map(contentImages.map((img) => [img.src, img])).values()
        );

        return {
          ...article,
          title: article.title || 'Untitled',
          summary: article.summary || '',
          articleContent: article.content || '',
          heroType: heroImage ? 'image' : 'none',
          heroText: article.hero_text || '',
          heroImage: heroImage ? { ...heroImage, src: `${heroImage.src}?t=${Date.now()}` } : null,
          cardImage: cardImage ? { ...cardImage, src: `${cardImage.src}?t=${Date.now()}` } : null,
          layout: [
            {
              id: uuidv4(),
              type: 'hero',
              src: heroImage?.src || null,
              width: heroImage?.width || 1200,
              height: heroImage?.height || 300,
              fitmode: heroImage?.fitmode || 'cover',
              text: article.hero_text || '',
              position: { x: 0, y: 0 },
              zIndex: 0,
            },
            { id: uuidv4(), type: 'title', content: article.title || 'Untitled', position: { x: 50, y: 350 }, width: 1100, height: 60, zIndex: 1 },
            { id: uuidv4(), type: 'meta', content: `${article.date || 'No Date'} • ${article.author || 'Fraud Check Team'}`, position: { x: 50, y: 420 }, width: 1100, height: 30, zIndex: 2 },
            { id: uuidv4(), type: 'summary', content: article.summary || '', position: { x: 50, y: 460 }, width: 1100, height: 50, zIndex: 3 },
            { id: uuidv4(), type: 'content', content: article.content || '', position: { x: 50, y: 520 }, width: 1100, height: 200, zIndex: 4 },
            ...uniqueContentImages,
          ],
        };
      });

      console.log('Fetched articles:', normalizedArticles); // Debugging log
      setArticles(normalizedArticles);
    } catch (err) {
      console.error('Fetch articles error:', err.message);
      setError(`Failed to load articles: ${err.message}`);
      setArticles([]);
      toast.error(`Failed to load articles: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    try {
      const image = new Image();
      image.src = imageSrc;
      image.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) throw new Error('Failed to create cropped image blob');
          const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
          resolve({ file, width: pixelCrop.width, height: pixelCrop.height });
        }, 'image/jpeg', 0.9);
      });
    } catch (err) {
      throw new Error(`Error cropping image: ${err.message}`);
    }
  };

  const handleFileUpload = async (file, type, blockId = null) => {
    if (!isAuthenticated) {
      toast.error('Please log in to upload images.');
      return;
    }
    if (!newArticle.slug) {
      toast.error('Please set a slug before uploading images.');
      return;
    }
    try {
      setIsUploading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) throw new Error('User not authenticated.');
      if (!file || !file.type.startsWith('image/')) throw new Error('Only PNG or JPG allowed.');
      if (file.size > 2 * 1024 * 1024) throw new Error('File too large. Max 2MB.');

      const imageUrl = URL.createObjectURL(file);
      setCropImage(imageUrl);
      setModalState({ isOpen: true, type: 'cropper', data: { file, type, blockId } });
      setCroppedAreaPixels(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } catch (err) {
      console.error('File upload error:', err.message);
      setError(err.message);
      toast.error(err.message);
      setIsUploading(false);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    console.log('Crop complete:', croppedArea, croppedAreaPixels);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    if (!croppedAreaPixels || !cropImage) {
      toast.error('Please adjust the crop area before saving.');
      setIsUploading(false);
      return;
    }

    try {
      setIsUploading(true);
      const { file: croppedFile, width, height } = await getCroppedImg(cropImage, croppedAreaPixels);
      const { type, blockId } = modalState.data;

      const fileName = `${Date.now()}_${uuidv4()}.jpg`;
      const cleanSlug = stripHTML(newArticle.slug);
      const filePath = `${cleanSlug}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(filePath, croppedFile, { upsert: true });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      const { data } = supabase.storage.from('article-images').getPublicUrl(filePath);
      if (!data.publicUrl) throw new Error('Failed to get public URL.');

      const imageData = {
        id: uuidv4(),
        src: `${data.publicUrl}?t=${Date.now()}`,
        width: width || (type === 'hero' ? 1200 : type === 'card' ? 320 : 300),
        height: height || (type === 'hero' ? 300 : type === 'card' ? 320 : 200),
        fitmode: type === 'hero' ? 'cover' : 'contain',
        image_type: type,
        position: { x: 50, y: type === 'hero' ? 0 : 720 },
        zIndex: type === 'hero' ? 0 : 5,
      };

      setNewArticle((prev) => {
        let updatedLayout = [...prev.layout];
        if (type === 'hero') {
          updatedLayout = prev.layout.map((block) =>
            block.type === 'hero'
              ? { ...block, src: imageData.src, width: imageData.width, height: imageData.height, fitmode: imageData.fitmode }
              : block
          );
          return { ...prev, heroType: 'image', heroImage: imageData, layout: updatedLayout };
        } else if (type === 'card') {
          return { ...prev, cardImage: imageData };
        } else if (type === 'content' && blockId) {
          updatedLayout = prev.layout.map((block) =>
            block.id === blockId
              ? { ...block, src: imageData.src, width: imageData.width, height: imageData.height, fitmode: imageData.fitmode }
              : block
          );
          return { ...prev, layout: updatedLayout };
        } else {
          updatedLayout.push({
            id: imageData.id,
            type: 'image',
            src: imageData.src,
            width: imageData.width,
            height: imageData.height,
            fitmode: imageData.fitmode,
            position: { x: 50, y: 720 },
            zIndex: 5,
          });
          return { ...prev, layout: updatedLayout };
        }
      });

      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded successfully.`);
    } catch (err) {
      console.error('Crop save error:', err.message);
      toast.error(`Failed to upload image: ${err.message}`);
    } finally {
      setModalState({ isOpen: false, type: null, data: null });
      setCropImage(null);
      setIsUploading(false);
    }
  };

  const handleCropCancel = () => {
    setModalState({ isOpen: false, type: null, data: null });
    setCropImage(null);
    setIsUploading(false);
  };

  const handleSaveArticle = async (silent = false) => {
    if (!isAuthenticated) {
      toast.error('Please log in to save articles.');
      return;
    }
    try {
      setError('');
      setSuccess('');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) throw new Error('User not authenticated.');

      if (!newArticle.slug || !newArticle.title) throw new Error('Slug and title are required.');

      const normalizedSlug = stripHTML(newArticle.slug).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const updatedArticle = {
        slug: normalizedSlug,
        title: newArticle.title,
        summary: newArticle.summary,
        content: newArticle.articleContent,
        author: newArticle.author,
        date: newArticle.date,
        hero_text: newArticle.heroText,
      };

      let articleOperation;
      if (editingArticle) {
        await supabase.from('article_images').delete().eq('article_slug', editingArticle.slug);
        articleOperation = await supabase.from('articles').update(updatedArticle).eq('slug', editingArticle.slug);
      } else {
        articleOperation = await supabase.from('articles').upsert([updatedArticle], { onConflict: 'slug' });
      }

      if (articleOperation.error) throw new Error(`Failed to save article: ${articleOperation.error.message}`);

      const imagesToInsert = [];
      if (newArticle.heroImage) {
        imagesToInsert.push({
          article_slug: normalizedSlug,
          src: newArticle.heroImage.src.split('?')[0],
          width: newArticle.heroImage.width,
          height: newArticle.heroImage.height,
          fitmode: newArticle.heroImage.fitmode,
          image_type: 'hero',
        });
      }
      if (newArticle.cardImage) {
        imagesToInsert.push({
          article_slug: normalizedSlug,
          src: newArticle.cardImage.src.split('?')[0],
          width: 320,
          height: 320,
          fitmode: newArticle.cardImage.fitmode,
          image_type: 'card',
        });
      }
      const uniqueImages = Array.from(
        new Map(
          newArticle.layout
            .filter((block) => block.type === 'image' && block.src)
            .map((block) => [block.src, block])
        ).values()
      );
      uniqueImages.forEach((block) => {
        imagesToInsert.push({
          article_slug: normalizedSlug,
          src: block.src.split('?')[0],
          width: block.width,
          height: block.height,
          fitmode: block.fitmode,
          image_type: 'content',
        });
      });

      if (imagesToInsert.length > 0) {
        const { error: imageError } = await supabase.from('article_images').insert(imagesToInsert);
        if (imageError) throw new Error(`Failed to save images: ${imageError.message}`);
      }

      await fetchArticles();
      if (!silent) {
        setNewArticle({
          slug: '',
          title: '',
          summary: '',
          articleContent: '',
          author: 'Fraud Check Team',
          date: new Date().toISOString().split('T')[0],
          heroType: 'none',
          heroText: '',
          heroImage: null,
          cardImage: null,
          layout: [],
        });
        setEditingArticle(null);
        setSuccess('Article saved successfully.');
        toast.success('Article saved successfully!');
        localStorage.removeItem('articleDraft');
      }
    } catch (err) {
      setError(`Failed to save article: ${err.message}`);
      toast.error(`Failed to save article: ${err.message}`);
    }
  };

  const handleEditArticle = (article) => {
    if (!isAuthenticated) {
      toast.error('Please log in to edit articles.');
      return;
    }
    try {
      setError('');
      setSuccess('');
      setEditingArticle(article);
      setNewArticle({
        slug: article.slug || '',
        title: article.title || '',
        summary: article.summary || '',
        articleContent: article.articleContent || '',
        author: article.author || 'Fraud Check Team',
        date: article.date ? new Date(article.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        heroType: article.heroType || 'none',
        heroText: article.heroText || '',
        heroImage: article.heroImage,
        cardImage: article.cardImage,
        layout: article.layout.map((block) => ({
          ...block,
          position: block.position || { x: 50, y: block.type === 'hero' ? 0 : 720 },
          width: block.width || (block.type === 'hero' ? 1200 : block.type === 'image' ? 300 : 1100),
          height: block.height || (block.type === 'hero' ? 300 : block.type === 'image' ? 200 : 50),
          zIndex: block.zIndex || (block.type === 'hero' ? 0 : block.type === 'image' ? 5 : 1),
        })),
      });
      toast.success('Article loaded for editing.');
      if (containerRef.current) containerRef.current.scrollTop = 0;
    } catch (err) {
      setError(`Failed to load article: ${err.message}`);
      toast.error(`Failed to load article: ${err.message}`);
    }
  };

  const handleDeleteArticle = async (slug) => {
    if (!isAuthenticated) {
      toast.error('Please log in to delete articles.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      setError('');
      setSuccess('');
      await supabase.from('article_images').delete().eq('article_slug', slug);
      const { error } = await supabase.from('articles').delete().eq('slug', slug);
      if (error) throw new Error(`Failed to delete article: ${error.message}`);
      await fetchArticles();
      setSuccess('Article deleted successfully.');
      toast.success('Article deleted successfully.');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const openEditor = (field, value, e, blockId = null) => {
    e.preventDefault();
    e.stopPropagation();
    if (containerRef.current) setScrollPosition(containerRef.current.scrollTop);
    setModalState({ isOpen: true, type: 'editor', data: { field, value, blockId } });
    setEditorValue(value || '');
    document.body.style.overflow = 'hidden';
  };

  const saveEditor = () => {
    const { field, blockId } = modalState.data || {};
    if (!field) return;

    if (blockId) {
      setNewArticle((prev) => ({
        ...prev,
        layout: prev.layout.map((block) =>
          block.id === blockId ? { ...block, content: editorValue } : block
        ),
      }));
    } else {
      setNewArticle((prev) => {
        const updated = { ...prev, [field]: editorValue };
        updated.layout = updated.layout.map((block) => {
          if (block.type === 'title' && field === 'title') return { ...block, content: editorValue };
          if (block.type === 'summary' && field === 'summary') return { ...block, content: editorValue };
          if (block.type === 'content' && field === 'articleContent') return { ...block, content: editorValue };
          if (block.type === 'hero' && field === 'heroText') return { ...block, text: editorValue };
          if (block.type === 'meta') return { ...block, content: `${updated.date} • ${updated.author}` };
          return block;
        });
        return updated;
      });
    }

    setModalState({ isOpen: false, type: null, data: null });
    setEditorValue('');
    toast.success(`${field.replace(/([A-Z])/g, ' $1').trim().replace(/^./, (str) => str.toUpperCase())} updated.`);
    document.body.style.overflow = 'auto';
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, data: null });
    setEditorValue('');
    setCropImage(null);
    setIsUploading(false);
    document.body.style.overflow = 'auto';
  };

  const stripHTML = (html) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const renderFieldPreview = (field, value, label, isRichText = false) => {
    if (isRichText) {
      return (
        <div
          className="p-5 bg-gray-50 dark:bg-slate-700 rounded-xl shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors mb-6"
          onClick={(e) => openEditor(field, value, e)}
        >
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">{label}</label>
          {value ? (
            <p className="text-gray-900 dark:text-gray-100 font-inter">{stripHTML(value)}</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic font-inter">Click to edit {label.toLowerCase()}</p>
          )}
        </div>
      );
    }
    return (
      <div
        className="p-5 bg-gray-50 dark:bg-slate-700 rounded-xl shadow-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors mb-6"
        onClick={(e) => openEditor(field, value, e)}
      >
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">{label}</label>
        <p className="text-gray-900 dark:text-gray-100 font-inter">
          {field === 'date' && value
            ? new Date(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            : value || `Click to edit ${label.toLowerCase()}`}
        </p>
      </div>
    );
  };

  const addBlock = (type) => {
    if (type === 'image') {
      setModalState({ isOpen: true, type: 'image-upload', data: { blockType: 'content' } });
      document.body.style.overflow = 'hidden';
    }
  };

  const deleteBlock = (blockId) => {
    setNewArticle((prev) => {
      const block = prev.layout.find((b) => b.id === blockId);
      if (block?.type === 'hero') {
        return {
          ...prev,
          heroType: 'none',
          heroImage: null,
          layout: prev.layout.map((b) =>
            b.id === blockId ? { ...b, src: null, position: { x: 0, y: 0 }, zIndex: 0 } : b
          ),
        };
      }
      return {
        ...prev,
        layout: prev.layout.filter((b) => b.id !== blockId),
      };
    });
    toast.success('Block deleted.');
  };

  const initializeLayout = useCallback(() => {
    const layout = [
      {
        id: uuidv4(),
        type: 'hero',
        src: newArticle.heroImage?.src || null,
        width: newArticle.heroImage?.width || 1200,
        height: newArticle.heroImage?.height || 300,
        fitmode: newArticle.heroImage?.fitmode || 'cover',
        text: newArticle.heroText || '',
        position: { x: 0, y: 0 },
        zIndex: 0,
      },
      {
        id: uuidv4(),
        type: 'title',
        content: newArticle.title || 'Untitled',
        position: { x: 50, y: 350 },
        width: 1100,
        height: 60,
        zIndex: 1,
      },
      {
        id: uuidv4(),
        type: 'meta',
        content: `${newArticle.date || 'No Date'} • ${newArticle.author || 'Fraud Check Team'}`,
        position: { x: 50, y: 420 },
        width: 1100,
        height: 30,
        zIndex: 2,
      },
      {
        id: uuidv4(),
        type: 'summary',
        content: newArticle.summary || '',
        position: { x: 50, y: 460 },
        width: 1100,
        height: 50,
        zIndex: 3,
      },
      {
        id: uuidv4(),
        type: 'content',
        content: newArticle.articleContent || '',
        position: { x: 50, y: 520 },
        width: 1100,
        height: 200,
        zIndex: 4,
      },
    ];
    setNewArticle((prev) => ({ ...prev, layout }));
  }, [newArticle]);

  useEffect(() => {
    if (!newArticle.layout.length && newArticle.title) initializeLayout();
  }, [newArticle.title, initializeLayout]);

  const memoizedLayout = useMemo(() =>
    newArticle.layout.map((block) => ({
      ...block,
      position: block.position || { x: 50, y: block.type === 'hero' ? 0 : 720 },
      width: block.width || (block.type === 'hero' ? 1200 : block.type === 'image' ? 300 : 1100),
      height: block.height || (block.type === 'hero' ? 300 : block.type === 'image' ? 200 : 50),
      zIndex: block.zIndex || (block.type === 'hero' ? 0 : block.type === 'image' ? 5 : 1),
    })),
    [newArticle.layout]
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h2 className="text-3xl font-bold mb-4 font-inter">Authentication Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 font-inter">Please log in to access the article editor.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-700 rounded-lg font-inter"
          >
            Go to Login
          </button>
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center justify-center">
              <ExclamationCircleIcon className="w-5 h-5 mr-2" /> {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-[#f0fcff] to-[#e0f5fa] dark:bg-slate-900 text-gray-900 dark:text-gray-100 overflow-auto">
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
          .prose img {
            border-radius: 0.5rem;
            margin: 2rem auto;
            max-width: 100%;
            height: auto;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .drop-zone {
            border: 2px dashed #0ea5e9;
            border-radius: 12px;
            padding: 24px;
            text-align: center;
            background: #f8fafc;
            transition: background 0.3s ease;
          }
          .drop-zone.uploading {
            background: #e0f2fe;
            cursor: not-allowed;
          }
          .drop-zone.drag-over {
            background: #e0f2fe;
          }
          .drop-zone .icon {
            width: 40px;
            height: 40px;
            margin: 0 auto 16px;
            color: #0ea5e9;
          }
          .drop-zone p {
            margin: 8px 0;
            color: #64748b;
            font-family: 'Inter', sans-serif;
          }
          .drop-zone label {
            color: #0ea5e9;
            cursor: pointer;
          }
          .drop-zone label:hover {
            text-decoration: underline;
          }
          .article-card {
            transform: translateY(0);
            transition: all 0.3s ease-in-out;
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
          }
          .article-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
          }
          .card-glow {
            position: relative;
            background: linear-gradient(145deg, #ffffff, #e6f9fd);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(14, 165, 233, 0.2);
            border-radius: 1.5rem;
          }
          .card-glow::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at center, rgba(14,165,233,0.1) 0%, rgba(14,165,233,0) 70%);
            z-index: -1;
            border-radius: 1.5rem;
          }
          .card-glow-dark {
            background: linear-gradient(145deg, #1e293b, #334155);
          }
          @media (max-width: 640px) {
            .article-card {
              max-width: 100%;
              margin: 0;
            }
            .article-grid {
              display: flex;
              flex-direction: column;
              gap: 1.5rem;
              align-items: center;
            }
          }
        `}</style>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-16 py-8" ref={containerRef} style={{ overflowY: 'auto', maxHeight: '100vh' }}>
          <section className="mt-6">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500 font-inter font-medium text-lg mb-6"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
          </section>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl flex items-center animate-fadeIn">
              <ExclamationCircleIcon className="w-5 h-5 mr-2" /> {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl flex items-center animate-fadeIn">
              <CheckCircleIcon className="w-5 h-5 mr-2" /> {success}
            </div>
          )}

          {loading ? (
            <div className="card-glow dark:card-glow-dark rounded-2xl p-6 text-center">
              <svg className="animate-spin h-8 w-8 text-cyan-600 mx-auto" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          ) : (
            <>
              <section className="mb-12 card-glow dark:card-glow-dark rounded-2xl p-8">
                <h1 className="text-4xl font-bold mb-8 text-[#002E5D] dark:text-white font-inter">{editingArticle ? 'Edit Article' : 'Create New Article'}</h1>
                <div className="space-y-6">
                  {renderFieldPreview('slug', newArticle.slug, 'Slug')}
                  {renderFieldPreview('title', newArticle.title, 'Title', true)}
                  {renderFieldPreview('summary', newArticle.summary, 'Summary', true)}
                  {renderFieldPreview('articleContent', newArticle.articleContent, 'Article Content', true)}
                  {renderFieldPreview('author', newArticle.author, 'Author')}
                  {renderFieldPreview('date', newArticle.date, 'Date')}
                  {renderFieldPreview('heroText', newArticle.heroText, 'Hero Text', true)}

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">Hero Type</label>
                    <select
                      value={newArticle.heroType}
                      onChange={(e) => {
                        const heroType = e.target.value;
                        setNewArticle((prev) => ({
                          ...prev,
                          heroType,
                          heroImage: heroType === 'image' ? prev.heroImage : null,
                          layout: prev.layout.map((block) =>
                            block.type === 'hero'
                              ? { ...block, src: heroType === 'image' ? block.src : null }
                              : block
                          ),
                        }));
                      }}
                      className="w-full p-3 border border-gray-300 rounded-xl dark:border-gray-600 dark:bg-slate-700 dark:text-gray-100 font-inter focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      disabled={!isAuthenticated}
                    >
                      <option value="none">None</option>
                      <option value="image">Image</option>
                    </select>
                  </div>

                  {newArticle.heroType === 'image' && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">Hero Image</label>
                      {newArticle.heroImage?.src ? (
                        <div className="relative">
                          <img
                            src={newArticle.heroImage.src}
                            alt="Hero Image"
                            className="w-full h-[32rem] object-cover rounded-2xl shadow-md"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-2xl" />
                          <div className="absolute bottom-10 left-10 right-10">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-inter mb-4 leading-tight">{stripHTML(newArticle.title)}</h1>
                            <p className="text-lg sm:text-xl text-gray-100 font-inter opacity-90">{stripHTML(newArticle.summary)}</p>
                          </div>
                          <button
                            onClick={() => deleteBlock(memoizedLayout.find((b) => b.type === 'hero')?.id)}
                            className="absolute top-4 right-4 p-2 bg-red-600 text-white hover:bg-red-700 rounded-lg shadow-md transition-colors"
                            title="Delete Hero Image"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      ) : (
                        <div
                          className={`drop-zone ${isUploading ? 'uploading' : ''}`}
                          onPaste={async (e) => {
                            const file = e.clipboardData.files[0];
                            if (file && file.type.startsWith('image/')) await handleFileUpload(file, 'hero');
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add('drag-over');
                          }}
                          onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
                          onDrop={async (e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('drag-over');
                            const file = e.dataTransfer.files[0];
                            if (file && file.type.startsWith('image/')) await handleFileUpload(file, 'hero');
                          }}
                        >
                          <PhotoIcon className="icon" />
                          <p>
                            Drag and drop, paste, or{' '}
                            <label className="cursor-pointer">
                              click to upload
                              <input
                                type="file"
                                accept="image/png,image/jpeg"
                                onChange={(e) => handleFileUpload(e.target.files[0], 'hero')}
                                className="hidden"
                                disabled={isUploading}
                              />
                            </label>
                          </p>
                          <p className="text-sm mt-1">PNG or JPG, max 2MB, 1200x300 recommended</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">Card Image</label>
                    {newArticle.cardImage?.src ? (
                      <div className="relative">
                        <img
                          src={newArticle.cardImage.src}
                          alt="Card Image"
                          className="w-48 h-48 object-cover rounded-xl shadow-md"
                        />
                        <button
                          onClick={() => setNewArticle((prev) => ({ ...prev, cardImage: null }))}
                          className="absolute top-2 right-2 p-2 bg-red-600 text-white hover:bg-red-700 rounded-lg shadow-md transition-colors"
                          title="Delete Card Image"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`drop-zone ${isUploading ? 'uploading' : ''}`}
                        onPaste={async (e) => {
                          const file = e.clipboardData.files[0];
                          if (file && file.type.startsWith('image/')) await handleFileUpload(file, 'card');
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.add('drag-over');
                        }}
                        onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
                        onDrop={async (e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('drag-over');
                          const file = e.dataTransfer.files[0];
                          if (file && file.type.startsWith('image/')) await handleFileUpload(file, 'card');
                        }}
                      >
                        <PhotoIcon className="icon" />
                        <p>
                          Drag and drop, paste, or{' '}
                          <label className="cursor-pointer">
                            click to upload
                            <input
                              type="file"
                              accept="image/png,image/jpeg"
                              onChange={(e) => handleFileUpload(e.target.files[0], 'card')}
                              className="hidden"
                              disabled={isUploading}
                            />
                          </label>
                        </p>
                        <p className="text-sm mt-1">PNG or JPG, max 2MB, 320x320 recommended</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-2xl font-semibold mb-6 text-[#002E5D] dark:text-white font-inter">Article Preview</h4>
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl shadow-sm p-8">
                    <div className="max-w-3xl mx-auto">
                      {memoizedLayout.map((block) => (
                        <div
                          key={block.id}
                          className={`layout-block ${block.type}`}
                          style={{
                            position: 'relative',
                            width: '100%',
                            margin: block.type === 'hero' ? '0 auto 3rem' : '0.5rem auto',
                          }}
                        >
                          {block.type === 'hero' && block.src && (
                            <div className="relative w-full h-[32rem] rounded-2xl overflow-hidden shadow-xl">
                              <img
                                src={block.src}
                                alt="Hero"
                                className="w-full h-full object-cover"
                                style={{ objectFit: block.fitmode }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                              <div className="absolute bottom-10 left-10 right-10">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-inter mb-4 leading-tight">{stripHTML(newArticle.title)}</h1>
                                <p className="text-lg sm:text-xl text-gray-100 font-inter opacity-90">{stripHTML(newArticle.summary)}</p>
                              </div>
                            </div>
                          )}
                          {block.type === 'title' && (
                            <h1
                              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#002E5D] dark:text-white font-inter mb-4 leading-tight"
                              dangerouslySetInnerHTML={{ __html: block.content || 'Untitled' }}
                            />
                          )}
                          {block.type === 'meta' && (
                            <div className="flex items-center justify-between mb-10 border-b border-gray-200 dark:border-gray-700 pb-4">
                              <div className="flex items-center space-x-6 text-gray-600 dark:text-gray-400">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-inter font-medium">{new Date(newArticle.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-inter font-medium">{newArticle.author}</span>
                                </div>
                              </div>
                            </div>
                          )}
                          {block.type === 'summary' && block.content && (
                            <p
                              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 font-inter mb-8"
                              dangerouslySetInnerHTML={{ __html: block.content }}
                            />
                          )}
                          {block.type === 'content' && (
                            <div
                              className="prose prose-lg dark:prose-invert font-inter max-w-none"
                              dangerouslySetInnerHTML={{ __html: block.content || 'No content provided' }}
                            />
                          )}
                          {block.type === 'image' && block.src && (
                            <div className="relative my-8 mx-auto" style={{ textAlign: 'center' }}>
                              <img
                                src={block.src}
                                alt="Content Image"
                                className="rounded-xl shadow-md"
                                style={{
                                  width: `${block.width || 300}px`,
                                  height: `${block.height || 200}px`,
                                  objectFit: block.fitmode,
                                }}
                              />
                              <button
                                onClick={() => deleteBlock(block.id)}
                                className="absolute top-2 right-2 p-2 bg-red-600 text-white hover:bg-red-700 rounded-lg shadow-md transition-colors"
                                title="Delete Image"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      onClick={() => addBlock('image')}
                      className="px-4 py-2 bg-cyan-600 text-white hover:bg-cyan-700 rounded-xl flex items-center font-inter font-medium transition-colors"
                      title="Add Image"
                    >
                      <PlusIcon className="w-5 h-5 mr-2" /> Add Image
                    </button>
                    <button
                      onClick={() => handleSaveArticle()}
                      className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-xl flex items-center font-inter font-medium transition-colors"
                      disabled={!isAuthenticated || isUploading}
                    >
                      <CheckCircleIcon className="w-5 h-5 mr-2" />
                      Save Article
                    </button>
                  </div>
                </div>
              </section>

              <section className="mb-12 card-glow dark:card-glow-dark rounded-2xl p-8">
                <h2 className="text-3xl font-bold mb-8 text-[#002E5D] dark:text-white font-inter">Existing Articles</h2>
                {articles.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 font-inter text-center">No articles available.</p>
                ) : (
                  <div className="article-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                      <div key={article.slug} className="article-card rounded-xl p-5 bg-gray-50 dark:bg-slate-700 shadow-sm transition-all">
                        <div className="relative mb-4">
                          {article.cardImage?.src ? (
                            <img
                              src={article.cardImage.src}
                              alt={article.title}
                              className="w-full h-48 object-cover rounded-xl shadow-md"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-200 dark:bg-slate-600 rounded-xl flex items-center justify-center">
                              <PhotoIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-semibold text-[#002E5D] dark:text-white font-inter mb-2 line-clamp-2">{stripHTML(article.title)}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-inter mb-2">
                          {article.date ? new Date(article.date).toLocaleDateString('en-US', { month: "long", day: "numeric", year: "numeric" }) : 'No Date'} • {article.author}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 font-inter mb-4 line-clamp-3">{stripHTML(article.summary)}</p>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-xl flex items-center font-inter font-medium transition-colors"
                          >
                            <PencilIcon className="w-4 h-4 mr-2" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.slug)}
                            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-xl flex items-center font-inter font-medium transition-colors"
                          >
                            <TrashIcon className="w-4 h-4 mr-2" /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        {modalState.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ overflowY: 'auto' }}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-2xl w-full mx-4 my-8 relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              {modalState.type === 'editor' && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-[#002E5D] dark:text-white font-inter">
                    Edit {modalState.data.field.replace(/([A-Z])/g, ' $1').trim().replace(/^./, (str) => str.toUpperCase())}
                  </h2>
                  <ReactQuill
                    theme="snow"
                    value={editorValue}
                    onChange={setEditorValue}
                    modules={quillModules}
                    formats={quillFormats}
                    className="mb-4 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    style={{ minHeight: '200px' }}
                  />
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-xl font-inter font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEditor}
                      className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-xl font-inter font-medium transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </>
              )}
              {modalState.type === 'cropper' && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-[#002E5D] dark:text-white font-inter">Crop Image</h2>
                  <div className="relative w-full" style={{ height: '400px' }}>
                    <Cropper
                      image={cropImage}
                      crop={crop}
                      zoom={zoom}
                      aspect={modalState.data.type === 'hero' ? 4 / 1 : modalState.data.type === 'card' ? 1 / 1 : 3 / 2}
                      onCropChange={setCrop}
                      onZoomChange={setZoom}
                      onCropComplete={onCropComplete}
                      restrictPosition={false}
                      style={{
                        containerStyle: { background: '#333' },
                        mediaStyle: { maxWidth: '100%', maxHeight: '100%' },
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-inter">Zoom</label>
                    <input
                      type="range"
                      min="1"
                      max="3"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      onClick={handleCropCancel}
                      className="px-6 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-xl font-inter font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCrop}
                      className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-xl font-inter font-medium transition-colors"
                      disabled={isUploading || !croppedAreaPixels}
                    >
                      Crop & Save
                    </button>
                  </div>
                </>
              )}
              {modalState.type === 'image-upload' && (
                <>
                  <h2 className="text-2xl font-bold mb-4 text-[#002E5D] dark:text-white font-inter">Upload Image</h2>
                  <div
                    className={`drop-zone ${isUploading ? 'uploading' : ''}`}
                    onPaste={async (e) => {
                      const file = e.clipboardData.files[0];
                      if (file && file.type.startsWith('image/')) await handleFileUpload(file, modalState.data.blockType);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.add('drag-over');
                    }}
                    onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
                    onDrop={async (e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('drag-over');
                      const file = e.dataTransfer.files[0];
                      if (file && file.type.startsWith('image/')) await handleFileUpload(file, modalState.data.blockType);
                    }}
                  >
                    <PhotoIcon className="icon" />
                    <p>
                      Drag and drop, paste, or{' '}
                      <label className="cursor-pointer">
                        click to upload
                        <input
                          type="file"
                          accept="image/png,image/jpeg"
                          onChange={(e) => handleFileUpload(e.target.files[0], modalState.data.blockType)}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                    </p>
                    <p className="text-sm mt-1">PNG or JPG, max 2MB</p>
                  </div>
                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      onClick={closeModal}
                      className="px-6 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-xl font-inter font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ArticleEditor;