import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lightbulb, AlertTriangle } from 'lucide-react';
import { ArrowLeftIcon, CheckCircleIcon, ExclamationCircleIcon, XMarkIcon, TrashIcon, PhotoIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { supabase } from '../../utils/supabase';
import { toast, Toaster } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import Draggable from 'react-draggable';
import 'react-quill/dist/quill.snow.css';
import fraudCheckImage from '../../assets/fraud-check-image.png';
import '../../components/admin/ArticleEditor.css';

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ['clean'],
  ],
  history: {
    delay: 1000,
    maxStack: 100,
    userOnly: true,
  },
};

const quillFormats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'link',
  'image',
  'align',
  'color',
  'background',
];

const stripHtmlTags = (str) => {
  if (!str) return str;
  return str.replace(/<[^>]*>/g, '');
};

function AdminHomeEditor() {
  const navigate = useNavigate();

  const defaultData = useMemo(
    () => ({
      hero: {
        title: 'Stay Scam Safe',
        subtitle: 'Use our tools to identify, report, and stay informed about fraud.',
        image: fraudCheckImage,
        textColor: '#FFFFFF',
        height: 600,
        position: { x: 0, y: 20 },
        width: 640,
        heightPx: 360,
        zoom: 1.0,
        rotation: 0,
        textAlignment: 'bottom-left',
        overlay: 'bg-black/60',
      },
      tipOfTheWeek: {
        title: '🛡️ Tip of the Week',
        text: 'Always verify before you trust. Scammers often pretend to be your bank, HMRC, or other trusted providers to create a false sense of urgency. Never act on unexpected messages alone — always use the company’s official website or app to verify what’s real.',
        link: '/advice',
      },
      keyFeatures: [
        { icon: 'shield-check', title: 'Expert Guidance', description: 'Built with insider fraud experience, our platform helps you spot scams before it’s too late.' },
        { icon: 'light-bulb', title: 'Real Scam Data', description: 'Learn from real reports submitted by people like you — updated weekly.' },
        { icon: 'exclamation-triangle', title: 'Instant Scam Checker', description: 'Answer a few questions and get an instant risk assessment, tailored to your situation.' },
      ],
    }),
    []
  );

  const [data, setData] = useState(defaultData);
  const [savedData, setSavedData] = useState(defaultData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [imageError, setImageError] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [editorValue, setEditorValue] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const editorRef = useRef(null);
  const dropZoneRef = useRef(null);
  const imageBoxRef = useRef(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError || !session?.user) {
          setError('User not authenticated. Please log in to access this page.');
          navigate('/login', { replace: true });
          return;
        }

        const { data: records, error: fetchError } = await supabase
          .from('home_content')
          .select('*');
        if (fetchError) {
          throw new Error(`Failed to fetch content: ${fetchError.message}`);
        }

        let fetchedData = { ...defaultData };
        if (records && records.length > 0) {
          const heroRecord = records.find((r) => r.section === 'hero');
          const tipRecord = records.find((r) => r.section === 'tip_of_the_week');
          const features = records.filter((r) => r.section === 'key_feature');

          fetchedData = {
            hero: {
              ...defaultData.hero,
              ...heroRecord?.content,
              title: stripHtmlTags(heroRecord?.content?.title || defaultData.hero.title),
              subtitle: stripHtmlTags(heroRecord?.content?.subtitle || defaultData.hero.subtitle),
            },
            tipOfTheWeek: {
              ...defaultData.tipOfTheWeek,
              ...tipRecord?.content,
              title: stripHtmlTags(tipRecord?.content?.title || defaultData.tipOfTheWeek.title),
              text: stripHtmlTags(tipRecord?.content?.text || defaultData.tipOfTheWeek.text),
            },
            keyFeatures: features.length > 0
              ? features.map((f) => ({
                  ...f.content,
                  title: stripHtmlTags(f.content.title),
                  description: stripHtmlTags(f.content.description),
                }))
              : defaultData.keyFeatures.map((f) => ({
                  ...f,
                  title: stripHtmlTags(f.title),
                  description: stripHtmlTags(f.description),
                })),
          };
        } else {
          await initializeDefaultData();
          fetchedData = { ...defaultData };
        }

        setData(fetchedData);
        setSavedData(fetchedData);
        toast.success('Content loaded successfully!');
      } catch (err) {
        setError(`Failed to load content: ${err.message}. Using defaults.`);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    const initializeDefaultData = async () => {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError || !session?.user) {
          return;
        }

        await supabase.from('home_content').insert({
          section: 'hero',
          content: defaultData.hero,
        });

        await supabase.from('home_content').insert({
          section: 'tip_of_the_week',
          content: defaultData.tipOfTheWeek,
        });

        for (const feature of defaultData.keyFeatures) {
          await supabase.from('home_content').insert({
            section: 'key_feature',
            content: feature,
          });
        }
      } catch (err) {
        console.error('Error initializing default data:', err);
      }
    };

    fetchContent();

    const handleKeyDown = (e) => {
      if (e.key === 'Shift') setIsShiftPressed(true);
    };
    const handleKeyUp = (e) => {
      if (e.key === 'Shift') setIsShiftPressed(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [navigate, defaultData]);

  const handleFileUpload = async (file, retryCount = 0) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError('User not authenticated. Please log in.');
      toast.error('User not authenticated.');
      return;
    }
    if (!file) {
      setError('No file selected. Please choose an image.');
      toast.error('No file selected.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Invalid file type. Please upload a PNG or JPG image.');
      toast.error('Invalid file type. Use PNG or JPG.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('File too large. Maximum size is 2MB.');
      toast.error('File too large. Max 2MB.');
      return;
    }

    try {
      setIsUploading(true);
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('home-images')
        .upload(fileName, file);
      if (uploadError) {
        if (uploadError.message.includes('Bucket not found') && retryCount < 2) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return handleFileUpload(file, retryCount + 1);
        }
        throw uploadError;
      }

      const { data } = supabase.storage.from('home-images').getPublicUrl(fileName);
      const editorWidth = editorRef.current ? editorRef.current.offsetWidth : 800;
      setData((prev) => ({
        ...prev,
        hero: {
          ...prev.hero,
          image: data.publicUrl,
          x: 0,
          y: 20,
          width: Math.round(Math.min(editorWidth * 0.8, 640)),
          heightPx: Math.round(Math.min(editorWidth * 0.8 * 0.5625, 360)),
          zoom: 1.0,
          rotation: 0,
        },
      }));
      setImageError(false);
      setSuccess('Image uploaded successfully!');
      toast.success('Image uploaded successfully!');
    } catch (err) {
      setError(`Failed to upload image: ${err.message}`);
      toast.error(`Failed to upload image: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleImageDrag = (e, data) => {
    setIsInteracting(true);
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, x: data.x, y: data.y },
    }));
  };

  const handleImageDragStop = () => {
    setIsInteracting(false);
  };

  const handleImageResize = (newWidth, newHeight, x, y) => {
    setIsInteracting(true);
    setData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        width: Math.round(newWidth),
        heightPx: Math.round(newHeight),
        x: Math.round(x),
        y: Math.round(y),
      },
    }));
  };

  const handleImageZoom = (zoom) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, zoom: Math.max(0.2, Math.min(2.0, zoom)) },
    }));
  };

  const handleImageRotate = (rotation) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, rotation: Math.round(rotation) % 360 },
    }));
  };

  const handleImageReset = () => {
    const editorWidth = editorRef.current ? editorRef.current.offsetWidth : 800;
    setData((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        x: 0,
        y: 20,
        width: Math.round(Math.min(editorWidth * 0.8, 640)),
        heightPx: Math.round(Math.min(editorWidth * 0.8 * 0.5625, 360)),
        zoom: 1.0,
        rotation: 0,
      },
    }));
    setImageError(false);
    toast.success('Image reset to default.');
  };

  const handleImageResizeStop = () => {
    setIsInteracting(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess('');
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session?.user) {
        throw new Error('User not authenticated. Please log in to save changes.');
      }

      const sanitizedData = {
        ...data,
        hero: {
          ...data.hero,
          title: stripHtmlTags(data.hero.title),
          subtitle: stripHtmlTags(data.hero.subtitle),
        },
        tipOfTheWeek: {
          ...data.tipOfTheWeek,
          title: stripHtmlTags(data.tipOfTheWeek.title),
          text: stripHtmlTags(data.tipOfTheWeek.text),
        },
        keyFeatures: data.keyFeatures.map((feature) => ({
          ...feature,
          title: stripHtmlTags(feature.title),
          description: stripHtmlTags(feature.description),
        })),
      };

      const { data: heroRecord, error: heroFetchError } = await supabase
        .from('home_content')
        .select('*')
        .eq('section', 'hero')
        .single();
      if (heroFetchError && heroFetchError.code !== 'PGRST116') {
        throw new Error(`Failed to fetch hero record: ${heroFetchError.message}`);
      }
      if (heroRecord) {
        const { error: heroUpdateError } = await supabase
          .from('home_content')
          .update({ content: sanitizedData.hero, updated_at: new Date().toISOString() })
          .eq('section', 'hero');
        if (heroUpdateError) {
          throw new Error(`Failed to update hero: ${heroUpdateError.message}`);
        }
      } else {
        const { error: heroInsertError } = await supabase
          .from('home_content')
          .insert({ section: 'hero', content: sanitizedData.hero });
        if (heroInsertError) {
          throw new Error(`Failed to insert hero: ${heroInsertError.message}`);
        }
      }

      const { data: tipRecord, error: tipFetchError } = await supabase
        .from('home_content')
        .select('*')
        .eq('section', 'tip_of_the_week')
        .single();
      if (tipFetchError && tipFetchError.code !== 'PGRST116') {
        throw new Error(`Failed to fetch tip record: ${tipFetchError.message}`);
      }
      if (tipRecord) {
        const { error: tipUpdateError } = await supabase
          .from('home_content')
          .update({ content: sanitizedData.tipOfTheWeek, updated_at: new Date().toISOString() })
          .eq('section', 'tip_of_the_week');
        if (tipUpdateError) {
          throw new Error(`Failed to update tip: ${tipUpdateError.message}`);
        }
      } else {
        const { error: tipInsertError } = await supabase
          .from('home_content')
          .insert({ section: 'tip_of_the_week', content: sanitizedData.tipOfTheWeek });
        if (tipInsertError) {
          throw new Error(`Failed to insert tip: ${tipInsertError.message}`);
        }
      }

      const { data: existingFeatures, error: fetchFeaturesError } = await supabase
        .from('home_content')
        .select('id')
        .eq('section', 'key_feature');
      if (fetchFeaturesError) {
        throw new Error(`Failed to fetch features: ${fetchFeaturesError.message}`);
      }
      if (existingFeatures.length > 0) {
        const { error: deleteFeaturesError } = await supabase
          .from('home_content')
          .delete()
          .eq('section', 'key_feature');
        if (deleteFeaturesError) {
          throw new Error(`Failed to delete old features: ${deleteFeaturesError.message}`);
        }
      }
      for (const feature of sanitizedData.keyFeatures) {
        const { error: featureInsertError } = await supabase
          .from('home_content')
          .insert({ section: 'key_feature', content: feature });
        if (featureInsertError) {
          throw new Error(`Failed to insert feature: ${featureInsertError.message}`);
        }
      }

      setSavedData(sanitizedData);
      setData(sanitizedData);
      setSuccess('Content saved successfully.');
      toast.success('Content saved successfully!');
    } catch (err) {
      setError(`Failed to save content: ${err.message}.`);
      if (err.message.includes('not authenticated')) {
        navigate('/login', { replace: true });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setData(savedData);
    setImageError(false);
  };

  const handleResetToDefault = () => {
    setData((prev) => ({
      ...prev,
      hero: defaultData.hero,
    }));
    setImageError(false);
  };

  const openEditor = (section, field, value, index = null) => {
    setActiveField({ section, field, index });
    setEditorValue(value);
  };

  const saveEditor = () => {
    if (!activeField) return;

    const { section, field, index } = activeField;
    const sanitizedValue = stripHtmlTags(editorValue);
    setData((prev) => {
      if (section === 'hero') {
        return {
          ...prev,
          hero: { ...prev.hero, [field]: sanitizedValue },
        };
      } else if (section === 'tipOfTheWeek') {
        return {
          ...prev,
          tipOfTheWeek: { ...prev.tipOfTheWeek, [field]: sanitizedValue },
        };
      } else if (section === 'keyFeatures' && index !== null) {
        const newFeatures = [...prev.keyFeatures];
        newFeatures[index] = { ...newFeatures[index], [field]: sanitizedValue };
        return { ...prev, keyFeatures: newFeatures };
      }
      return prev;
    });
    setActiveField(null);
    setEditorValue('');
    toast.success(`${field.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())} updated.`);
  };

  const closeEditor = () => {
    setActiveField(null);
    setEditorValue('');
  };

  const updateHero = (field, value) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: field === 'title' || field === 'subtitle' ? stripHtmlTags(value) : value },
    }));
    if (field === 'image') {
      setImageError(false);
    }
  };

  const updateTip = (field, value) => {
    setData((prev) => ({
      ...prev,
      tipOfTheWeek: { ...prev.tipOfTheWeek, [field]: field === 'title' || field === 'text' ? stripHtmlTags(value) : value },
    }));
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...data.keyFeatures];
    newFeatures[index] = { ...newFeatures[index], [field]: field === 'title' || field === 'description' ? stripHtmlTags(value) : value };
    setData((prev) => ({ ...prev, keyFeatures: newFeatures }));
  };

  const addFeature = () => {
    setData((prev) => ({
      ...prev,
      keyFeatures: [
        ...prev.keyFeatures,
        { icon: 'shield-check', title: 'New Feature', description: 'Describe the feature...' },
      ],
    }));
  };

  const removeFeature = (index) => {
    setData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'shield-check':
        return <ShieldCheck className="w-12 h-12 text-cyan-700 mx-auto mb-4" />;
      case 'light-bulb':
        return <Lightbulb className="w-12 h-12 text-cyan-700 mx-auto mb-4" />;
      case 'exclamation-triangle':
        return <AlertTriangle className="w-12 h-12 text-cyan-700 mx-auto mb-4" />;
      default:
        return <ShieldCheck className="w-12 h-12 text-cyan-700 mx-auto mb-4" />;
    }
  };

  const handleTextAlignmentChange = (e) => {
    updateHero('textAlignment', e.target.value);
  };

  const handleHeightChange = (e) => {
    const newHeight = parseInt(e.target.value, 10);
    updateHero('height', newHeight);
  };

  const alignmentOptions = ['bottom-left', 'center', 'top-right'];

  const renderFieldPreview = (section, field, value, label, index = null) => {
    const sanitizedValue = stripHtmlTags(value);
    return (
      <div
        className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
        onClick={() => openEditor(section, field, value, index)}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
        {sanitizedValue ? (
          <p className="text-gray-900 dark:text-gray-100">{sanitizedValue}</p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">Click to edit {label.toLowerCase()}</p>
        )}
      </div>
    );
  };

  const getImageBoxBounds = () => {
    if (!imageBoxRef.current) return { top: 0, left: 0, right: 800, bottom: 600 };
    const rect = imageBoxRef.current.getBoundingClientRect();
    return {
      top: 0,
      left: 0,
      right: rect.width,
      bottom: rect.height,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900">
        <svg className="animate-spin h-8 w-8 text-cyan-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900 text-gray-900 dark:text-gray-100">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <section className="mt-8">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500 mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Link>
        </section>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-2" />
            {success}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Hero Section</h2>
          <div className="space-y-4">
            {renderFieldPreview('hero', 'title', data.hero.title, 'Title')}
            {renderFieldPreview('hero', 'subtitle', data.hero.subtitle, 'Subtitle')}
            <div className="mt-4" ref={editorRef}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hero Image (Drag, Resize, Zoom, Rotate)
              </label>
              <div
                ref={dropZoneRef}
                className={`drop-zone p-6 rounded-lg text-center mb-4 relative ${
                  isDraggingOver ? 'drag-over' : ''
                } ${isUploading ? 'uploading' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <PhotoIcon className="w-12 h-12 mx-auto text-cyan-600 mb-2" />
                <p className="text-gray-600 dark:text-gray-300">
                  Drag and drop an image here or{' '}
                  <label className="text-cyan-600 cursor-pointer hover:underline">
                    click to upload
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  PNG or JPG, max 2MB. Drag to position, resize with corners (Shift for free resize), zoom/rotate to fit.
                </p>
              </div>
              <div
                ref={imageBoxRef}
                className={`article-image-box ${isInteracting ? 'highlight' : ''}`}
              >
                {data.hero.image && (
                  <div className="image-editor">
                    <Draggable
                      onStart={() => setIsInteracting(true)}
                      onStop={handleImageDragStop}
                      onDrag={handleImageDrag}
                      defaultPosition={{ x: data.hero.x, y: data.hero.y }}
                      bounds={getImageBoxBounds()}
                    >
                      <div
                        className="image-container"
                        style={{
                          width: `${data.hero.width}px`,
                          height: `${data.hero.heightPx}px`,
                          position: 'absolute',
                        }}
                      >
                        <div
                          className="image-wrapper"
                          style={{
                            transform: `scale(${data.hero.zoom}) rotate(${data.hero.rotation}deg)`,
                            transformOrigin: 'center',
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <img
                            src={imageError ? fraudCheckImage : data.hero.image}
                            alt="Hero Image"
                            className="w-full h-full object-contain rounded-lg"
                            onError={() => setImageError(true)}
                          />
                        </div>
                        <div className="resize-handles">
                          <div
                            className="resize-handle top-left"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleResizeStart('top-left', e);
                            }}
                          />
                          <div
                            className="resize-handle top-right"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleResizeStart('top-right', e);
                            }}
                          />
                          <div
                            className="resize-handle bottom-left"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleResizeStart('bottom-left', e);
                            }}
                          />
                          <div
                            className="resize-handle bottom-right"
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              handleResizeStart('bottom-right', e);
                            }}
                          />
                        </div>
                      </div>
                    </Draggable>
                    <div className="image-controls mt-2 flex gap-2 flex-wrap">
                      <label className="flex items-center px-3 py-1 bg-cyan-600 text-white rounded-lg cursor-pointer hover:bg-cyan-700">
                        <PhotoIcon className="w-5 h-5 mr-1" />
                        Replace
                        <input
                          type="file"
                          accept="image/png,image/jpeg"
                          onChange={(e) => handleFileUpload(e.target.files[0])}
                          className="hidden"
                          disabled={isUploading}
                        />
                      </label>
                      <button
                        onClick={() => updateHero('image', fraudCheckImage)}
                        className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <TrashIcon className="w-5 h-5 mr-1" />
                        Remove
                      </button>
                      <button
                        onClick={handleImageReset}
                        className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        <ArrowPathIcon className="w-5 h-5 mr-1" />
                        Reset
                      </button>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Zoom:</label>
                        <input
                          type="range"
                          min="0.2"
                          max="2.0"
                          step="0.1"
                          value={data.hero.zoom}
                          onChange={(e) => handleImageZoom(parseFloat(e.target.value))}
                          className="w-24"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{(data.hero.zoom * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-700 dark:text-gray-300">Rotate:</label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          step="15"
                          value={data.hero.rotation}
                          onChange={(e) => handleImageRotate(parseInt(e.target.value))}
                          className="w-24"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{data.hero.rotation}°</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Hero Height (px)
              </label>
              <input
                type="range"
                min="400"
                max="800"
                value={data.hero.height || 600}
                onChange={handleHeightChange}
                className="w-full"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Height: {data.hero.height}px</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Text Alignment
              </label>
              <select
                value={data.hero.textAlignment || 'bottom-left'}
                onChange={handleTextAlignmentChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100"
              >
                {alignmentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Text Color</label>
              <input
                type="color"
                value={data.hero.textColor || '#FFFFFF'}
                onChange={(e) => updateHero('textColor', e.target.value)}
                className="w-16 h-10 rounded-md border border-gray-200 dark:border-slate-600 cursor-pointer"
              />
            </div>
            <div>
              <button
                onClick={handleResetToDefault}
                className="px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-900 dark:text-slate-100 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-all"
              >
                Reset Hero to Default
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Why Use Fraud Check?</h2>
          {data.keyFeatures.map((feature, index) => (
            <div
              key={index}
              className="space-y-4 mb-4 p-4 border border-gray-200 dark:border-slate-600 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Feature {index + 1}</h3>
                <button
                  onClick={() => removeFeature(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                  aria-label={`Remove feature ${index + 1}`}
                >
                  Remove
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
                <select
                  value={feature.icon || 'shield-check'}
                  onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100"
                >
                  <option value="shield-check">Shield Check</option>
                  <option value="light-bulb">Light Bulb</option>
                  <option value="exclamation-triangle">Exclamation Triangle</option>
                </select>
              </div>
              {renderFieldPreview('keyFeatures', 'title', feature.title, 'Title', index)}
              {renderFieldPreview('keyFeatures', 'description', feature.description, 'Description', index)}
            </div>
          ))}
          <button
            onClick={addFeature}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all"
            aria-label="Add new feature"
          >
            Add Feature
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Tip of the Week</h2>
          <div className="space-y-4">
            {renderFieldPreview('tipOfTheWeek', 'title', data.tipOfTheWeek.title, 'Tip Title')}
            {renderFieldPreview('tipOfTheWeek', 'text', data.tipOfTheWeek.text, 'Tip Text')}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Optional Link
              </label>
              <input
                type="text"
                value={data.tipOfTheWeek.link || ''}
                onChange={(e) => updateTip('link', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100"
                placeholder="Enter link URL (e.g., /advice)"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Live Preview</h2>
          <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
            <div className="w-full pt-16">
              <section
                className="relative rounded-b-2xl shadow-xl overflow-hidden"
                aria-label="Hero section"
                style={{
                  height: `${data.hero.height}px`,
                  width: '100%',
                  margin: 0,
                }}
              >
                <div className="absolute inset-0 z-0">
                  <div
                    style={{
                      position: 'absolute',
                      left: `${data.hero.x}px`,
                      top: `${data.hero.y}px`,
                      width: `${data.hero.width}px`,
                      height: `${data.hero.heightPx}px`,
                    }}
                  >
                    <img
                      src={imageError ? fraudCheckImage : data.hero.image}
                      alt="Hero Preview"
                      className="w-full h-full object-contain rounded-lg"
                      style={{
                        transform: `scale(${data.hero.zoom}) rotate(${data.hero.rotation}deg)`,
                        transformOrigin: 'center',
                      }}
                      onError={() => setImageError(true)}
                    />
                  </div>
                  <div className={`absolute inset-0 ${data.hero.overlay}`}></div>
                </div>
                <div
                  className={`absolute z-10 ${(() => {
                    switch (data.hero.textAlignment) {
                      case 'top-right':
                        return 'top-8 right-8';
                      case 'center':
                        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
                      case 'bottom-left':
                      default:
                        return 'bottom-8 left-8';
                    }
                  })()}`}
                >
                  <div className="text-left max-w-xl">
                    <h1
                      className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
                      style={{ color: data.hero.textColor || '#FFFFFF' }}
                    >
                      {stripHtmlTags(data.hero.title) || 'Stay Scam Safe'}
                    </h1>
                    <p
                      className="text-sm sm:text-base md:text-lg font-semibold mb-4"
                      style={{ color: data.hero.textColor || '#FFFFFF' }}
                    >
                      {stripHtmlTags(data.hero.subtitle) || 'Use our tools to identify, report, and stay informed about fraud.'}
                    </p>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 mt-4">
                      <button
                        className="bg-cyan-700 text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-cyan-800 transition-all text-sm sm:text-base"
                        disabled
                      >
                        Scam Checker
                      </button>
                      <button
                        className="bg-white text-black px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-100 transition-all text-sm sm:text-base"
                        disabled
                      >
                        Community Reports
                      </button>
                      <button
                        className="bg-cyan-700 text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-cyan-800 transition-all text-sm sm:text-base"
                        disabled
                      >
                        Contact Database
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                Why Use Fraud Check?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.keyFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                    role="region"
                    aria-label={stripHtmlTags(feature.title)}
                  >
                    {renderIcon(feature.icon)}
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{stripHtmlTags(feature.title)}</h3>
                    <p className="text-gray-600 dark:text-slate-300 text-sm">{stripHtmlTags(feature.description)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              <div className="bg-sky-50 dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition px-6 py-10 max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  {stripHtmlTags(data.tipOfTheWeek.title)}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-snug mb-4">
                  {stripHtmlTags(data.tipOfTheWeek.text)}
                </p>
                <button
                  className="inline-block bg-cyan-700 text-white px-4 py-2 rounded-md transition-all mt-4"
                  disabled
                >
                  Visit Help & Advice
                </button>
              </div>
            </section>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-4 px-6 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-end space-x-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-900 dark:text-slate-100 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-all"
              disabled={isSaving}
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all flex items-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                'Save All Changes'
              )}
            </button>
          </div>
        </div>

        {activeField && (
          <>
            <div className="modal-overlay" onClick={closeEditor}></div>
            <div className="editor-modal">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Editing {activeField.field.replace(/([A-Z])/g, ' $1').trim().replace(/^./, str => str.toUpperCase())}
                  </h3>
                  <button onClick={closeEditor} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                <ReactQuill
                  theme="snow"
                  value={editorValue}
                  onChange={setEditorValue}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white dark:bg-slate-700"
                  placeholder={`Edit ${activeField.field}...`}
                />
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={saveEditor}
                    className="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-700 transition-colors rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={closeEditor}
                    className="px-6 py-2 bg-gray-500 text-white hover:bg-gray-600 transition-colors rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  function handleResizeStart(corner, e) {
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = data.hero.width;
    const startHeight = data.hero.heightPx;
    const startLeft = data.hero.x;
    const startTop = data.hero.y;
    const aspectRatio = startHeight / startWidth;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      let newWidth, newHeight, newX, newY;

      switch (corner) {
        case 'top-left':
          newWidth = Math.max(100, startWidth - deltaX);
          newHeight = isShiftPressed ? Math.max(100, startHeight - deltaY) : newWidth * aspectRatio;
          newX = startLeft + (startWidth - newWidth);
          newY = startTop + (startHeight - newHeight);
          break;
        case 'top-right':
          newWidth = Math.max(100, startWidth + deltaX);
          newHeight = isShiftPressed ? Math.max(100, startHeight - deltaY) : newWidth * aspectRatio;
          newX = startLeft;
          newY = startTop + (startHeight - newHeight);
          break;
        case 'bottom-left':
          newWidth = Math.max(100, startWidth - deltaX);
          newHeight = isShiftPressed ? Math.max(100, startHeight + deltaY) : newWidth * aspectRatio;
          newX = startLeft + (startWidth - newWidth);
          newY = startTop;
          break;
        case 'bottom-right':
          newWidth = Math.max(100, startWidth + deltaX);
          newHeight = isShiftPressed ? Math.max(100, startHeight + deltaY) : newWidth * aspectRatio;
          newX = startLeft;
          newY = startTop;
          break;
        default:
          return;
      }

      const boxBounds = getImageBoxBounds();
      newWidth = Math.min(newWidth, boxBounds.right);
      newHeight = Math.min(newHeight, boxBounds.bottom);
      newX = Math.max(0, Math.min(newX, boxBounds.right - newWidth));
      newY = Math.max(0, Math.min(newY, boxBounds.bottom - newHeight));

      handleImageResize(newWidth, newHeight, newX, newY);
    };

    const handleMouseUp = () => {
      handleImageResizeStop();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }
}

export default AdminHomeEditor;