import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lightbulb, AlertTriangle } from 'lucide-react'; // Removed ChevronLeft, ChevronRight
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { supabase } from '../../utils/supabase';
import fraudCheckerBackground from '../../assets/fraud-checker-background.png';
import fraudCheckImage from '../../assets/fraud-check-image.png';

function AdminHomeEditor() {
  const navigate = useNavigate();

  const defaultData = {
    hero: {
      title: 'Stay Scam Safe',
      subtitle: 'Use our tools to identify, report, and stay informed about fraud.',
      image: fraudCheckImage,
      textColor: '#FFFFFF',
      height: 450,
      position: { y: 40 },
      textAlignment: 'bottom-left',
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
  };

  const [data, setData] = useState(defaultData);
  const [savedData, setSavedData] = useState(defaultData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error('Authentication error:', authError?.message || 'No user found');
          setError('User not authenticated. Please log in to access this page.');
          navigate('/login');
          return;
        }
        console.log('Authenticated user:', user.id, 'Role:', user.role);

        const { data: records, error: fetchError } = await supabase
          .from('home_content')
          .select('*');
        if (fetchError) {
          throw new Error(`Failed to fetch content: ${fetchError.message} (Code: ${fetchError.code || 'Unknown'})`);
        }

        let fetchedData = { ...defaultData };
        if (records && records.length > 0) {
          const heroRecord = records.find((r) => r.section === 'hero');
          const tipRecord = records.find((r) => r.section === 'tip_of_the_week');
          const features = records.filter((r) => r.section === 'key_feature');

          fetchedData = {
            hero: heroRecord?.content || defaultData.hero,
            tipOfTheWeek: tipRecord?.content || defaultData.tipOfTheWeek,
            keyFeatures: features.length > 0 ? features.map((f) => f.content) : defaultData.keyFeatures,
          };
        } else {
          await initializeDefaultData();
          fetchedData = { ...defaultData };
        }

        setData(fetchedData);
        setSavedData(fetchedData);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(`Failed to load content: ${err.message}. Using defaults.`);
        setData(defaultData);
      } finally {
        setIsLoading(false);
      }
    };

    const initializeDefaultData = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Authentication error during initialization:', authError?.message);
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
    };

    fetchContent();
  }, [navigate, defaultData]); // Added defaultData to dependency array

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('User not authenticated. Please log in to save changes.');
      }
      console.log('Saving content as authenticated user:', user.id, 'Role:', user.role);

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
          .update({ content: data.hero, updated_at: new Date().toISOString() })
          .eq('section', 'hero');
        if (heroUpdateError) throw new Error(`Failed to update hero: ${heroUpdateError.message}`);
      } else {
        const { error: heroInsertError } = await supabase
          .from('home_content')
          .insert({ section: 'hero', content: data.hero });
        if (heroInsertError) throw new Error(`Failed to insert hero: ${heroInsertError.message}`);
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
          .update({ content: data.tipOfTheWeek, updated_at: new Date().toISOString() })
          .eq('section', 'tip_of_the_week');
        if (tipUpdateError) throw new Error(`Failed to update tip: ${tipUpdateError.message}`);
      } else {
        const { error: tipInsertError } = await supabase
          .from('home_content')
          .insert({ section: 'tip_of_the_week', content: data.tipOfTheWeek });
        if (tipInsertError) throw new Error(`Failed to insert tip: ${tipInsertError.message}`);
      }

      const { data: existingFeatures, error: fetchFeaturesError } = await supabase
        .from('home_content')
        .select('id')
        .eq('section', 'key_feature');
      if (fetchFeaturesError) throw new Error(`Failed to fetch features: ${fetchFeaturesError.message}`);
      if (existingFeatures.length > 0) {
        const { error: deleteFeaturesError } = await supabase
          .from('home_content')
          .delete()
          .eq('section', 'key_feature');
        if (deleteFeaturesError) throw new Error(`Failed to delete old features: ${deleteFeaturesError.message}`);
      }
      for (const feature of data.keyFeatures) {
        const { error: featureInsertError } = await supabase
          .from('home_content')
          .insert({ section: 'key_feature', content: feature });
        if (featureInsertError) throw new Error(`Failed to insert feature: ${featureInsertError.message}`);
      }

      setSavedData(data);
      console.log('Content saved successfully');
    } catch (err) {
      console.error('Error saving content:', err);
      setError(`Failed to save content: ${err.message}.`);
      if (err.message.includes('not authenticated')) {
        navigate('/login');
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

  const updateHero = (field, value) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
    if (field === 'image') {
      setImageError(false);
    }
  };

  const updateTip = (field, value) => {
    setData((prev) => ({
      ...prev,
      tipOfTheWeek: { ...prev.tipOfTheWeek, [field]: value },
    }));
  };

  const updateFeature = (index, field, value) => {
    const newFeatures = [...data.keyFeatures];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
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

  const handleYOffsetChange = (e) => {
    const newY = parseInt(e.target.value, 10);
    updateHero('position', { y: newY });
  };

  const handleTextAlignmentChange = (e) => {
    updateHero('textAlignment', e.target.value);
  };

  const handleHeightChange = (e) => {
    const newHeight = parseInt(e.target.value, 10);
    updateHero('height', newHeight);
  };

  const handleImageChange = (e) => {
    const newImage = e.target.value || fraudCheckImage;
    updateHero('image', newImage);
  };

  const alignmentOptions = ['bottom-left', 'center', 'top-right'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <svg className="animate-spin h-8 w-8 text-cyan-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Title</label>
              <input
                type="text"
                value={data.hero.title || ''}
                onChange={(e) => updateHero('title', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                placeholder="Enter hero title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Subtitle</label>
              <textarea
                value={data.hero.subtitle || ''}
                onChange={(e) => updateHero('subtitle', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                rows="4"
                placeholder="Enter hero subtitle"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Background Image URL
              </label>
              <input
                type="text"
                value={data.hero.image === fraudCheckImage ? '/assets/fraud-check-image.png' : data.hero.image}
                onChange={handleImageChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100"
                placeholder="Enter background image URL (leave blank for fraud-check-image.png)"
              />
              <p className="text-sm text-gray-500 mt-1">Default: fraud-check-image.png</p>
              {data.hero.image && (
                <div className="mt-2">
                  {imageError ? (
                    <p className="text-red-500 text-sm">Failed to load image</p>
                  ) : (
                    <img
                      src={data.hero.image}
                      alt="Hero Background Preview"
                      className="h-24 w-auto rounded-md border border-gray-200 dark:border-slate-600 object-cover"
                      onError={() => setImageError(true)}
                    />
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Background Y-Offset (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={data.hero.position.y || 40}
                onChange={handleYOffsetChange}
                className="w-full"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Y-Offset: {data.hero.position.y}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Adjust Height (px)
              </label>
              <input
                type="range"
                min="300"
                max="600"
                value={data.hero.height || 450}
                onChange={handleHeightChange}
                className="w-full"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Height: {data.hero.height}px</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Text Color</label>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Mini Preview
              </label>
              <div
                className="relative w-64 h-40 bg-gray-200 rounded-md border border-gray-200 dark:border-slate-600 overflow-hidden"
                style={{
                  backgroundImage: `url(${data.hero.image || fraudCheckImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: `center ${data.hero.position.y}%`,
                }}
              >
                <div className="absolute inset-0 bg-black/40"></div>
                <div
                  className={`absolute p-2 text-white text-xs ${(() => {
                    switch (data.hero.textAlignment) {
                      case 'top-right':
                        return 'top-0 right-0';
                      case 'center':
                        return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
                      case 'bottom-left':
                      default:
                        return 'bottom-0 left-0';
                    }
                  })()}`}
                  style={{ color: data.hero.textColor || '#FFFFFF' }}
                >
                  <span className="font-bold">{data.hero.title.slice(0, 10)}...</span>
                  <br />
                  {data.hero.subtitle.slice(0, 20)}...
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Why Use Fraud Check?</h2>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Icon</label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={feature.title || ''}
                  onChange={(e) => updateFeature(index, 'title', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100"
                  placeholder="Enter feature title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={feature.description || ''}
                  onChange={(e) => updateFeature(index, 'description', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100"
                  rows="3"
                  placeholder="Enter feature description"
                />
              </div>
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

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Tip of the Week</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tip Title</label>
              <input
                type="text"
                value={data.tipOfTheWeek.title || ''}
                onChange={(e) => updateTip('title', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100"
                placeholder="Enter tip title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tip Text</label>
              <textarea
                value={data.tipOfTheWeek.text || ''}
                onChange={(e) => updateTip('text', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100"
                rows="4"
                placeholder="Enter tip text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
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

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Live Preview</h2>
          <div
            className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
            style={{
              backgroundImage: `url(${fraudCheckerBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <section
                className="relative rounded-b-2xl shadow-xl overflow-hidden"
                aria-label="Hero section"
                style={{
                  height: `${data.hero.height}px`,
                  backgroundImage: `url(${data.hero.image || fraudCheckImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: `center ${data.hero.position.y}%`,
                  width: '100%',
                  margin: 0,
                }}
              >
                <div className="absolute inset-0 bg-black/40 z-0"></div>
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
                      {data.hero.title || 'Stay Scam Safe'}
                    </h1>
                    <p
                      className="text-sm sm:text-base md:text-lg font-semibold mb-4"
                      style={{ color: data.hero.textColor || '#FFFFFF' }}
                    >
                      {data.hero.subtitle || 'Use our tools to identify, report, and stay informed about fraud.'}
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
                    aria-label={feature.title}
                  >
                    {renderIcon(feature.icon)}
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-slate-300 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              <div className="bg-sky-50 dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition px-6 py-10 max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  {data.tipOfTheWeek.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-snug mb-4">
                  {data.tipOfTheWeek.text}
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
      </div>
    </div>
  );
}

export default AdminHomeEditor;