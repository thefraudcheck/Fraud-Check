import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ShieldCheckIcon, CreditCardIcon, KeyIcon, PlusIcon, TrashIcon, ChevronDownIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ShieldCheck, Lightbulb, AlertTriangle, Link2, Mail, AlertCircle } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '../../utils/supabase';
import { toast, Toaster } from 'react-hot-toast';
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
      overlay: 'bg-black/60',
    },
    keyFeatures: [
      { icon: 'shield-check', title: 'Expert Guidance', description: 'Built with insider fraud experience, our platform helps you spot scams before it’s too late.' },
      { icon: 'light-bulb', title: 'Real Scam Data', description: 'Learn from real reports submitted by people like you — updated weekly.' },
      { icon: 'exclamation-triangle', title: 'Instant Scam Checker', description: 'Answer a few questions and get an instant risk assessment, tailored to your situation.' },
    ],
    tipOfTheWeek: {
      title: '🛡️ Tip of the Week',
      text: 'Always verify before you trust. Scammers often pretend to be your bank, HMRC, or other trusted providers to create a false sense of urgency. Never act on unexpected messages alone — always use the company’s official website or app to verify what’s real.',
      whatToDo: ['Verify via official channels.', 'Report to Action Fraud.'],
      link: '/help-advice',
      icon: 'ShieldCheckIcon',
    },
    whatToDoIf: [
      { title: 'Been Scammed', preview: 'Act fast to report and mitigate damage if you’ve been defrauded.', whatToDo: ['Contact your bank within 24 hours to freeze funds or initiate a chargeback.', 'Report to Action Fraud online or call 0300 123 2040 with all evidence.', 'Change passwords and enable 2FA on affected accounts.'], icon: 'ExclamationTriangleIcon', link: '/help-advice#been-scammed' },
      { title: 'Paid Wrong Person', preview: 'Steps to take if you’ve sent money to the wrong person.', whatToDo: ['Contact your bank immediately to attempt to reverse the transaction.', 'Provide transaction details to your bank.', 'Report to Action Fraud if fraudulent.'], icon: 'CreditCardIcon', link: '/help-advice#wrong-person' },
      { title: 'Shared Bank Details', preview: 'Protect yourself if you’ve shared sensitive bank information.', whatToDo: ['Notify your bank immediately to secure your account.', 'Monitor your account for unauthorized transactions.', 'Change online banking passwords and enable 2FA.'], icon: 'KeyIcon', link: '/help-advice#shared-details' },
      { title: 'Clicked Suspicious Link', preview: 'Actions to take after clicking a potentially malicious link.', whatToDo: ['Disconnect from the internet immediately.', 'Run a full antivirus scan on your device.', 'Change passwords for affected accounts.'], icon: 'Link2Icon', link: '/help-advice#clicked-link' },
      { title: 'Sent a Code', preview: 'Steps to take if you’ve shared a verification code with a scammer.', whatToDo: ['Contact your bank or service provider immediately.', 'Secure your account by changing passwords.', 'Report the incident to Action Fraud.'], icon: 'MailIcon', link: '/help-advice#sent-code' },
      { title: 'Gave Away Passwords', preview: 'Protect your accounts if you’ve shared passwords with a scammer.', whatToDo: ['Change all affected passwords immediately.', 'Enable two-factor authentication where possible.', 'Monitor accounts for suspicious activity.'], icon: 'AlertCircleIcon', link: '/help-advice#gave-passwords' },
    ],
  };

  const [data, setData] = useState(defaultData);
  const [savedData, setSavedData] = useState(defaultData);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [openFeatureSections, setOpenFeatureSections] = useState([]);
  const [openScenarioSections, setOpenScenarioSections] = useState([]);

  const quillModules = {
    toolbar: [
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ color: [] }, { background: [] }],
      ['clean'],
    ],
  };
  const quillFormats = ['font', 'size', 'bold', 'italic', 'underline', 'color', 'background'];

  useEffect(() => {
    const fetchContent = async (retryCount = 0, maxRetries = 2) => {
      try {
        setIsLoading(true);
        setError(null);
        console.log(`Fetching home_content records (Attempt ${retryCount + 1}/${maxRetries + 1})...`);
        const { data: records, error: fetchError } = await supabase.from('home_content').select('*');
        if (fetchError) {
          if (fetchError.code === '42P01') {
            setError('The home_content table does not exist in your Supabase database. Please create it with the correct schema.');
            console.error('Table home_content not found. Create it with the following SQL:');
            console.error(`
              CREATE TABLE home_content (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                type TEXT NOT NULL,
                content JSONB NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
              );
              ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;
              CREATE POLICY "Allow anon read" ON home_content FOR SELECT TO anon USING (true);
            `);
            return;
          }
          if (retryCount < maxRetries) {
            console.warn(`Retrying fetch (${retryCount + 1}/${maxRetries})...`);
            setTimeout(() => fetchContent(retryCount + 1, maxRetries), 1000);
            return;
          }
          throw new Error(`Supabase fetch error: ${fetchError.message} (Code: ${fetchError.code || 'Unknown'})`);
        }
        console.log('Records fetched:', records);
        if (!records || records.length === 0) {
          console.warn('No records in home_content. Attempting to initialize with defaults.');
          console.log('Inserting default __SETTINGS__ record...');
          const { data: newSettings, error: settingsError } = await supabase.from('home_content').insert({ type: '__SETTINGS__', content: { hero: defaultData.hero, tipOfTheWeek: defaultData.tipOfTheWeek } }).select().single();
          if (settingsError) {
            console.error('Settings insert error:', settingsError);
            throw new Error(`Supabase settings insert error: ${settingsError.message} (Code: ${settingsError.code || 'Unknown'}). This may be due to Row-Level Security (RLS) policies.`);
          }
          console.log('Inserted __SETTINGS__:', newSettings);
          console.log('Inserting default keyFeatures...');
          for (const feature of defaultData.keyFeatures) {
            const { error: featureError } = await supabase.from('home_content').insert({ type: 'key_feature', content: { icon: feature.icon, title: feature.title, description: feature.description } });
            if (featureError) {
              console.error('Feature insert error:', featureError);
              throw new Error(`Supabase feature insert error: ${featureError.message} (Code: ${featureError.code || 'Unknown'}). This may be due to RLS policies.`);
            }
          }
          console.log('Inserting default whatToDoIf...');
          for (const scenario of defaultData.whatToDoIf) {
            const { error: scenarioError } = await supabase.from('home_content').insert({ type: 'what_to_do_if', content: { title: scenario.title, preview: scenario.preview, whatToDo: scenario.whatToDo, icon: scenario.icon, link: scenario.link } });
            if (scenarioError) {
              console.error('Scenario insert error:', scenarioError);
              throw new Error(`Supabase scenario insert error: ${scenarioError.message} (Code: ${scenarioError.code || 'Unknown'}). This may be due to RLS policies.`);
            }
          }
          console.log('Re-fetching records after initialization...');
          const { data: newRecords, error: newFetchError } = await supabase.from('home_content').select('*');
          if (newFetchError) {
            throw new Error(`Supabase re-fetch error: ${newFetchError.message} (Code: ${newFetchError.code || 'Unknown'})`);
          }
          records = newRecords;
          console.log('Re-fetched records:', records);
        }
        const settingsRecord = records.find((record) => record.type === '__SETTINGS__');
        const keyFeatures = records.filter((record) => record.type === 'key_feature');
        const whatToDoIf = records.filter((record) => record.type === 'what_to_do_if');
        const fetchedData = {
          hero: {
            ...defaultData.hero,
            ...(settingsRecord?.content?.hero || {}),
            image: settingsRecord?.content?.hero?.image === '/assets/fraud-check-image.png' ? fraudCheckImage : settingsRecord?.content?.hero?.image || fraudCheckImage,
          },
          keyFeatures: keyFeatures.length > 0 ? keyFeatures.map((feature) => ({ id: feature.id, ...feature.content })) : defaultData.keyFeatures,
          tipOfTheWeek: settingsRecord?.content?.tipOfTheWeek || defaultData.tipOfTheWeek,
          whatToDoIf: whatToDoIf.length > 0 ? whatToDoIf.map((scenario) => ({ id: scenario.id, ...scenario.content })) : defaultData.whatToDoIf,
        };
        setData(fetchedData);
        setSavedData(fetchedData);
        setOpenFeatureSections(new Array(fetchedData.keyFeatures.length).fill(false));
        setOpenScenarioSections(new Array(fetchedData.whatToDoIf.length).fill(false));
        toast.success('Content loaded successfully!', { duration: 3000, style: { background: '#10B981', color: '#FFFFFF', borderRadius: '8px' } });
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(`Failed to load content: ${err.message}. Using defaults. If this is due to Row-Level Security (RLS), please check the Supabase dashboard and ensure the anon role has the necessary permissions.`);
        setData(defaultData);
        setOpenFeatureSections(new Array(defaultData.keyFeatures.length).fill(false));
        setOpenScenarioSections(new Array(defaultData.whatToDoIf.length).fill(false));
        toast.error(`Failed to load content: ${err.message}.`, { duration: 5000, style: { background: '#EF4444', color: '#FFFFFF', borderRadius: '8px' } });
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `hero-images/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('home-assets').upload(filePath, file);
      if (uploadError) throw new Error(`Image upload error: ${uploadError.message}`);
      const { data: publicUrlData } = supabase.storage.from('home-assets').getPublicUrl(filePath);
      if (!publicUrlData.publicUrl) throw new Error('Failed to retrieve public URL for the uploaded image.');
      updateHero('image', publicUrlData.publicUrl);
      toast.success('Image uploaded successfully!', { duration: 3000, style: { background: '#10B981', color: '#FFFFFF', borderRadius: '8px' } });
    } catch (err) {
      console.error('Image upload error:', err);
      setImageError(true);
      toast.error(`Failed to upload image: ${err.message}`, { duration: 5000, style: { background: '#EF4444', color: '#FFFFFF', borderRadius: '8px' } });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      console.log('Saving content to home_content...');
      const settingsPayload = {
        type: '__SETTINGS__',
        content: {
          hero: { ...data.hero, image: data.hero.image === fraudCheckImage ? '/assets/fraud-check-image.png' : data.hero.image },
          tipOfTheWeek: { ...data.tipOfTheWeek, whatToDo: data.tipOfTheWeek.whatToDo || [] },
        },
      };
      const { data: settingsData, error: fetchError } = await supabase.from('home_content').select('*').eq('type', '__SETTINGS__').single();
      if (fetchError && fetchError.code !== 'PGRST116') throw new Error(`Supabase settings fetch error: ${fetchError.message} (Code: ${fetchError.code || 'Unknown'})`);
      if (settingsData) {
        console.log('Updating __SETTINGS__ record...');
        const { error } = await supabase.from('home_content').update(settingsPayload).eq('type', '__SETTINGS__');
        if (error) throw new Error(`Supabase settings update error: ${error.message} (Code: ${error.code || 'Unknown'}). This may be due to RLS policies.`);
      } else {
        console.log('Inserting new __SETTINGS__ record...');
        const { error } = await supabase.from('home_content').insert(settingsPayload);
        if (error) throw new Error(`Supabase settings insert error: ${error.message} (Code: ${error.code || 'Unknown'}). This may be due to RLS policies.`);
      }
      const existingFeatureIds = data.keyFeatures.map((f) => f.id).filter(Boolean);
      const { data: currentFeatures, error: fetchFeaturesError } = await supabase.from('home_content').select('id').eq('type', 'key_feature');
      if (fetchFeaturesError) throw new Error(`Supabase fetch features error: ${fetchFeaturesError.message} (Code: ${fetchFeaturesError.code || 'Unknown'})`);
      const featuresToDelete = currentFeatures.filter((f) => !existingFeatureIds.includes(f.id)).map((f) => f.id);
      if (featuresToDelete.length > 0) {
        console.log('Deleting old keyFeatures:', featuresToDelete);
        const { error } = await supabase.from('home_content').delete().eq('type', 'key_feature').in('id', featuresToDelete);
        if (error) throw new Error(`Supabase delete features error: ${error.message} (Code: ${error.code || 'Unknown'}). This may be due to RLS policies.`);
      }
      for (const feature of data.keyFeatures) {
        const featurePayload = { type: 'key_feature', content: { icon: feature.icon, title: feature.title, description: feature.description } };
        if (feature.id) {
          console.log(`Updating keyFeature ID ${feature.id}...`);
          const { error } = await supabase.from('home_content').update(featurePayload).eq('id', feature.id);
          if (error) throw new Error(`Supabase update feature error: ${error.message} (Code: ${error.code || 'Unknown'}). This may be due to RLS policies.`);
        } else {
          console.log('Inserting new keyFeature...');
          const { data: newFeature, error } = await supabase.from('home_content').insert(featurePayload).select().single();
          if (error) throw new Error(`Supabase insert feature error: ${error.message} (Code: ${error.code || 'Unknown'}). This may be due to RLS policies.`);
          feature.id = newFeature.id;
        }
      }
      const existingScenarioIds = data.whatToDoIf.map((s) => s.id).filter(Boolean);
      const { data: currentScenarios, error: fetchScenariosError } = await supabase.from('home_content').select('id').eq('type', 'what_to_do_if');
      if (fetchScenariosError) throw new Error(`Supabase fetch scenarios error: ${fetchScenariosError.message} (Code: ${fetchScenariosError.code || 'Unknown'})`);
      const scenariosToDelete = currentScenarios.filter((s) => !existingScenarioIds.includes(s.id)).map((s) => s.id);
      if (scenariosToDelete.length > 0) {
        console.log('Deleting old whatToDoIf scenarios:', scenariosToDelete);
        const { error } = await supabase.from('home_content').delete().eq('type', 'what_to_do_if').in('id', scenariosToDelete);
        if (error) throw new Error(`Supabase delete scenarios error: ${error.message} (Code: ${error.code || 'Unknown'}). This may be due to RLS policies.`);
      }
      for (const scenario of data.whatToDoIf) {
        const scenarioPayload = { type: 'what_to_do_if', content: { title: scenario.title, preview: scenario.preview, whatToDo: scenario.whatToDo, icon: scenario.icon, link: scenario.link } };
        if (scenario.id) {
          console.log(`Updating whatToDoIf ID ${scenario.id}...`);
          const { error } = await supabase.from('home_content').update(scenarioPayload).eq('id', scenario.id);
          if (error) throw new Error(`Supabase update scenario error: ${error.message} (Code: ${error.code || 'Unknown'}). This may be due to RLS policies.`);
        } else {
          console.log('Inserting new whatToDoIf scenario...');
          const { data: newScenario, error } = await supabase.from('home_content').insert(scenarioPayload).select().single();
          if (error) throw new Error(`Supabase insert scenario error: ${error.message} (Code: ${error.code || 'Unknown'}). This may be due to RLS policies.`);
          scenario.id = newScenario.id;
        }
      }
      setSavedData(data);
      setSuccess('Content saved successfully!');
      toast.success('Changes saved successfully!', { duration: 3000, style: { background: '#10B981', color: '#FFFFFF', borderRadius: '8px' } });
      setTimeout(() => setSuccess(null), 3000);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Error saving content:', err);
      setError(`Failed to save content: ${err.message}. If this is due to Row-Level Security (RLS), please check the Supabase dashboard and ensure the anon role has the necessary permissions.`);
      toast.error(`Failed to save content: ${err.message}.`, { duration: 5000, style: { background: '#EF4444', color: '#FFFFFF', borderRadius: '8px' } });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setData(defaultData);
    setOpenFeatureSections(new Array(defaultData.keyFeatures.length).fill(false));
    setOpenScenarioSections(new Array(defaultData.whatToDoIf.length).fill(false));
    setError(null);
    setSuccess(null);
    setImageError(false);
    toast.success('Settings reset to default!', { duration: 3000, style: { background: '#10B981', color: '#FFFFFF', borderRadius: '8px' } });
  };

  const handleCancel = () => {
    setData(savedData);
    setOpenFeatureSections(new Array(savedData.keyFeatures.length).fill(false));
    setOpenScenarioSections(new Array(savedData.whatToDoIf.length).fill(false));
    setError(null);
    setSuccess(null);
    setImageError(false);
    navigate('/admin/dashboard');
  };

  const updateHero = (field, value) => {
    setData((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
    if (field === 'image') setImageError(false);
  };

  const updateTipOfTheWeek = (field, value) => {
    setData((prev) => ({ ...prev, tipOfTheWeek: { ...prev.tipOfTheWeek, [field]: value } }));
  };

  const updateTipWhatToDo = (index, value) => {
    setData((prev) => {
      const newWhatToDo = [...prev.tipOfTheWeek.whatToDo];
      newWhatToDo[index] = value;
      return { ...prev, tipOfTheWeek: { ...prev.tipOfTheWeek, whatToDo: newWhatToDo } };
    });
  };

  const addTipWhatToDo = () => {
    setData((prev) => ({ ...prev, tipOfTheWeek: { ...prev.tipOfTheWeek, whatToDo: [...prev.tipOfTheWeek.whatToDo, ''] } }));
  };

  const removeTipWhatToDo = (index) => {
    setData((prev) => ({ ...prev, tipOfTheWeek: { ...prev.tipOfTheWeek, whatToDo: prev.tipOfTheWeek.whatToDo.filter((_, i) => i !== index) } }));
  };

  const updateWhatToDoIf = (index, field, value) => {
    setData((prev) => {
      const newWhatToDoIf = [...prev.whatToDoIf];
      newWhatToDoIf[index] = { ...newWhatToDoIf[index], [field]: value };
      return { ...prev, whatToDoIf: newWhatToDoIf };
    });
  };

  const updateScenarioWhatToDo = (scenarioIndex, actionIndex, value) => {
    setData((prev) => {
      const newWhatToDoIf = [...prev.whatToDoIf];
      const newWhatToDo = [...newWhatToDoIf[scenarioIndex].whatToDo];
      newWhatToDo[actionIndex] = value;
      newWhatToDoIf[scenarioIndex] = { ...newWhatToDoIf[scenarioIndex], whatToDo: newWhatToDo };
      return { ...prev, whatToDoIf: newWhatToDoIf };
    });
  };

  const addScenarioWhatToDo = (scenarioIndex) => {
    setData((prev) => {
      const newWhatToDoIf = [...prev.whatToDoIf];
      newWhatToDoIf[scenarioIndex] = { ...newWhatToDoIf[scenarioIndex], whatToDo: [...newWhatToDoIf[scenarioIndex].whatToDo, ''] };
      return { ...prev, whatToDoIf: newWhatToDoIf };
    });
  };

  const removeScenarioWhatToDo = (scenarioIndex, actionIndex) => {
    setData((prev) => {
      const newWhatToDoIf = [...prev.whatToDoIf];
      newWhatToDoIf[scenarioIndex] = { ...newWhatToDoIf[scenarioIndex], whatToDo: newWhatToDoIf[scenarioIndex].whatToDo.filter((_, i) => i !== actionIndex) };
      return { ...prev, whatToDoIf: newWhatToDoIf };
    });
  };

  const addWhatToDoIf = () => {
    setData((prev) => ({
      ...prev,
      whatToDoIf: [...prev.whatToDoIf, { title: 'New Scenario', preview: 'Describe the scenario...', whatToDo: ['Take action...'], icon: 'ExclamationTriangleIcon', link: '/help-advice#new-scenario' }],
    }));
    setOpenScenarioSections((prev) => [...prev, true]);
  };

  const removeWhatToDoIf = (index) => {
    setData((prev) => ({ ...prev, whatToDoIf: prev.whatToDoIf.filter((_, i) => i !== index) }));
    setOpenScenarioSections((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleScenarioSection = (index) => {
    setOpenScenarioSections((prev) => {
      const newOpenSections = [...prev];
      newOpenSections[index] = !newOpenSections[index];
      return newOpenSections;
    });
  };

  const updateFeature = (index, field, value) => {
    setData((prev) => {
      const newFeatures = [...prev.keyFeatures];
      newFeatures[index] = { ...newFeatures[index], [field]: value };
      return { ...prev, keyFeatures: newFeatures };
    });
  };

  const addFeature = () => {
    setData((prev) => ({ ...prev, keyFeatures: [...prev.keyFeatures, { icon: 'shield-check', title: 'New Feature', description: 'Describe the feature...' }] }));
    setOpenFeatureSections((prev) => [...prev, true]);
  };

  const removeFeature = (index) => {
    setData((prev) => ({ ...prev, keyFeatures: prev.keyFeatures.filter((_, i) => i !== index) }));
    setOpenFeatureSections((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleFeatureSection = (index) => {
    setOpenFeatureSections((prev) => {
      const newOpenSections = [...prev];
      newOpenSections[index] = !newOpenSections[index];
      return newOpenSections;
    });
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'shield-check': return <ShieldCheck className="w-12 h-12 text-cyan-700 mx-auto mb-4" />;
      case 'light-bulb': return <Lightbulb className="w-12 h-12 text-cyan-700 mx-auto mb-4" />;
      case 'exclamation-triangle': return <AlertTriangle className="w-12 h-12 text-cyan-700 mx-auto mb-4" />;
      default: return <ShieldCheck className="w-12 h-12 text-cyan-700 mx-auto mb-4" />;
    }
  };

  const renderScenarioIcon = (iconName) => {
    switch (iconName) {
      case 'ShieldCheckIcon': return <ShieldCheckIcon className="w-8 h-8 text-cyan-700 mb-3" />;
      case 'CreditCardIcon': return <CreditCardIcon className="w-8 h-8 text-cyan-700 mb-3" />;
      case 'KeyIcon': return <KeyIcon className="w-8 h-8 text-cyan-700 mb-3" />;
      case 'Link2Icon': return <Link2 className="w-8 h-8 text-cyan-700 mb-3" />;
      case 'MailIcon': return <Mail className="w-8 h-8 text-cyan-700 mb-3" />;
      case 'AlertCircleIcon': return <AlertCircle className="w-8 h-8 text-cyan-700 mb-3" />;
      case 'ExclamationTriangleIcon': return <AlertTriangle className="w-8 h-8 text-cyan-700 mb-3" />;
      default: return <ShieldCheckIcon className="w-8 h-8 text-cyan-700 mb-3" />;
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
  const overlayOptions = ['bg-black/60', 'bg-black/40', 'bg-white/60', 'none'];
  const iconOptions = ['ShieldCheckIcon', 'CreditCardIcon', 'KeyIcon', 'Link2Icon', 'MailIcon', 'AlertCircleIcon', 'ExclamationTriangleIcon'];
  const featureIconOptions = ['shield-check', 'light-bulb', 'exclamation-triangle'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-8">
        <Link to="/admin/dashboard" className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>
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
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Title</label>
              <input type="text" value={data.hero.title || ''} onChange={(e) => updateHero('title', e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100" placeholder="Enter hero title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Subtitle</label>
              <ReactQuill theme="snow" value={data.hero.subtitle || ''} onChange={(value) => updateHero('subtitle', value)} modules={quillModules} formats={quillFormats} className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100" placeholder="Enter hero subtitle" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Background Image URL</label>
              <input type="text" value={data.hero.image === fraudCheckImage ? '/assets/fraud-check-image.png' : data.hero.image} onChange={handleImageChange} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100" placeholder="Enter background image URL (leave blank for fraud-check-image.png)" />
              <p className="text-sm text-gray-500 mt-1">Default: fraud-check-image.png</p>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mt-2 mb-1">Upload New Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" />
              {data.hero.image && (
                <div className="mt-2">
                  {imageError ? (
                    <p className="text-red-500 text-sm">Failed to load image</p>
                  ) : (
                    <img src={data.hero.image} alt="Hero Background Preview" className="h-24 w-auto rounded-md border border-gray-200 dark:border-slate-600 object-cover" onError={() => setImageError(true)} />
                  )}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Background Y-Offset (%)</label>
              <input type="range" min="0" max="100" step="1" value={data.hero.position.y || 40} onChange={handleYOffsetChange} className="w-full" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Y-Offset: {data.hero.position.y}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Adjust Height (px)</label>
              <input type="range" min="300" max="600" value={data.hero.height} onChange={handleHeightChange} className="w-full" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Height: {data.hero.height}px</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Text Alignment</label>
              <select value={data.hero.textAlignment || 'bottom-left'} onChange={handleTextAlignmentChange} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100">
                {alignmentOptions.map((option) => (
                  <option key={option} value={option}>{option.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Text Color</label>
              <input type="color" value={data.hero.textColor || '#FFFFFF'} onChange={(e) => updateHero('textColor', e.target.value)} className="w-16 h-10 rounded-md border border-gray-200 dark:border-slate-600 cursor-pointer" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Overlay</label>
              <select value={data.hero.overlay || 'bg-black/60'} onChange={(e) => updateHero('overlay', e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900 dark:text-slate-100">
                {overlayOptions.map((option) => (
                  <option key={option} value={option}>{option === 'none' ? 'None' : option}</option>
                ))}
              </select>
            </div>
            <div>
              <button onClick={handleResetToDefault} className="px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-900 dark:text-slate-100 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-all">Reset Hero to Default</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Subtitle Preview</label>
              <div className="text-sm text-gray-600 dark:text-slate-300 mt-2 preview-text" dangerouslySetInnerHTML={{ __html: data.hero.subtitle || 'No subtitle provided.' }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Mini Preview</label>
              <div className="relative w-64 h-40 bg-gray-200 rounded-md border border-gray-200 dark:border-slate-600 overflow-hidden" style={{ backgroundImage: `url(${data.hero.image || fraudCheckImage})`, backgroundSize: 'cover', backgroundPosition: `center ${data.hero.position.y}%` }}>
                <div className={`absolute inset-0 ${data.hero.overlay || 'bg-black/60'}`}></div>
                <div className={`absolute p-2 text-white text-xs ${(() => {
                  switch (data.hero.textAlignment) {
                    case 'top-right': return 'top-0 right-0';
                    case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
                    case 'bottom-left': default: return 'bottom-0 left-0';
                  }
                })()}`} style={{ color: data.hero.textColor || '#FFFFFF' }}>
                  <span className="font-bold">{data.hero.title.slice(0, 10)}...</span>
                  <br />
                  <span className="preview-text" dangerouslySetInnerHTML={{ __html: data.hero.subtitle.slice(0, 20) + '...' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Why Use Fraud Check?</h2>
          {data.keyFeatures.map((feature, index) => (
            <div key={index} className="space-y-4 mb-4 p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
              <div className="flex justify-between items-center">
                <button onClick={() => toggleFeatureSection(index)} className="flex justify-between items-center w-full text-left">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Feature {index + 1}: {feature.title || '[Enter a feature title]'}</h3>
                  <ChevronDownIcon className={`w-5 h-5 text-cyan-600 dark:text-cyan-300 transition-transform duration-200 ${openFeatureSections[index] ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {openFeatureSections[index] && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Icon</label>
                    <select value={feature.icon} onChange={(e) => updateFeature(index, 'icon', e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100">
                      {featureIconOptions.map((option) => (
                        <option key={option} value={option}>{option.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Title</label>
                    <input type="text" value={feature.title} onChange={(e) => updateFeature(index, 'title', e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100" placeholder="Enter feature title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Description</label>
                    <ReactQuill theme="snow" value={feature.description || ''} onChange={(value) => updateFeature(index, 'description', value)} modules={quillModules} formats={quillFormats} className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100" placeholder="Enter feature description" />
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">Description Preview:</strong>
                    <div className="text-sm text-gray-600 dark:text-slate-300 mt-2 preview-text" dangerouslySetInnerHTML={{ __html: feature.description || 'No description provided.' }} />
                  </div>
                  <button onClick={() => removeFeature(index)} className="text-red-600 hover:text-red-800 text-sm flex items-center" aria-label={`Remove feature ${index + 1}`}>
                    <TrashIcon className="w-5 h-5 mr-1" />
                    Remove
                  </button>
                </>
              )}
            </div>
          ))}
          <button onClick={addFeature} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all" aria-label="Add new feature">Add Feature</button>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Tip of the Week</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tip Title</label>
              <input type="text" value={data.tipOfTheWeek.title || ''} onChange={(e) => updateTipOfTheWeek('title', e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100" placeholder="Enter tip title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Tip Text</label>
              <ReactQuill theme="snow" value={data.tipOfTheWeek.text || ''} onChange={(value) => updateTipOfTheWeek('text', value)} modules={quillModules} formats={quillFormats} className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100" placeholder="Enter tip text" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">What To Do</label>
              {data.tipOfTheWeek.whatToDo?.map((action, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input type="text" value={action} onChange={(e) => updateTipWhatToDo(index, e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100" placeholder={`Action ${index + 1}`} />
                  <button type="button" onClick={() => removeTipWhatToDo(index)} className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                    <TrashIcon className="w-5 h-5 mr-1" />
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addTipWhatToDo} className="mt-2 flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all">
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Action
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Icon</label>
              <select value={data.tipOfTheWeek.icon || 'ShieldCheckIcon'} onChange={(e) => updateTipOfTheWeek('icon', e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100">
                {iconOptions.map((option) => (
                  <option key={option} value={option}>{option.replace('Icon', '')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Optional Link</label>
              <input type="text" value={data.tipOfTheWeek.link || ''} onChange={(e) => updateTipOfTheWeek('link', e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100" placeholder="Enter link URL (e.g., /help-advice)" />
            </div>
            <div>
              <strong className="text-gray-900 dark:text-gray-100">Preview:</strong>
              <div className="text-sm text-gray-600 dark:text-slate-300 mt-2 preview-text" dangerouslySetInnerHTML={{ __html: data.tipOfTheWeek.text || 'No text provided.' }} />
              {data.tipOfTheWeek.whatToDo?.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-sm text-gray-600 dark:text-slate-300">
                  {data.tipOfTheWeek.whatToDo.map((action, idx) => (
                    <li key={idx}>{action}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">What To Do If…</h2>
          {data.whatToDoIf.map((scenario, index) => (
            <div key={index} className="space-y-4 mb-4 p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
              <div className="flex justify-between items-center">
                <button onClick={() => toggleScenarioSection(index)} className="flex justify-between items-center w-full text-left">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Scenario {index + 1}: {scenario.title || '[Enter a scenario title]'}</h3>
                  <ChevronDownIcon className={`w-5 h-5 text-cyan-600 dark:text-cyan-300 transition-transform duration-200 ${openScenarioSections[index] ? 'rotate-180' : ''}`} />
                </button>
              </div>
              {openScenarioSections[index] && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Title</label>
                    <input type="text" value={scenario.title} onChange={(e) => updateWhatToDoIf(index, 'title', e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100" placeholder="Enter scenario title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Preview</label>
                    <ReactQuill theme="snow" value={scenario.preview || ''} onChange={(value) => updateWhatToDoIf(index, 'preview', value)} modules={quillModules} formats={quillFormats} className="bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-slate-100" placeholder="Enter scenario preview" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">What To Do</label>
                    {scenario.whatToDo.map((action, actionIndex) => (
                      <div key={actionIndex} className="flex items-center space-x-2 mb-2">
                        <input type="text" value={action} onChange={(e) => updateScenarioWhatToDo(index, actionIndex, e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100" placeholder={`Action ${actionIndex + 1}`} />
                        <button type="button" onClick={() => removeScenarioWhatToDo(index, actionIndex)} className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                          <TrashIcon className="w-5 h-5 mr-1" />
                          Remove
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addScenarioWhatToDo(index)} className="mt-2 flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all">
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Add Action
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Icon</label>
                    <select value={scenario.icon} onChange={(e) => updateWhatToDoIf(index, 'icon', e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100">
                      {iconOptions.map((option) => (
                        <option key={option} value={option}>{option.replace('Icon', '')}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Link</label>
                    <input type="text" value={scenario.link} onChange={(e) => updateWhatToDoIf(index, 'link', e.target.value)} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100" placeholder="Enter link URL (e.g., /help-advice#scenario)" />
                  </div>
                  <div>
                    <strong className="text-gray-900 dark:text-gray-100">Preview:</strong>
                    <div className="text-sm text-gray-600 dark:text-slate-300 mt-2 preview-text" dangerouslySetInnerHTML={{ __html: scenario.preview || 'No preview provided.' }} />
                    {scenario.whatToDo.length > 0 && (
                      <ul className="mt-2 list-disc list-inside text-sm text-gray-600 dark:text-slate-300">
                        {scenario.whatToDo.map((action, actionIndex) => (
                          <li key={actionIndex}>{action}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button onClick={() => removeWhatToDoIf(index)} className="text-red-600 hover:text-red-800 text-sm flex items-center" aria-label={`Remove scenario ${index + 1}`}>
                    <TrashIcon className="w-5 h-5 mr-1" />
                    Remove
                  </button>
                </>
              )}
            </div>
          ))}
          <button onClick={addWhatToDoIf} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all" aria-label="Add new scenario">Add Scenario</button>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Live Preview</h2>
          <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100" style={{ backgroundImage: `url(${fraudCheckerBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <section className="relative rounded-b-2xl shadow-xl overflow-hidden" aria-label="Hero section" style={{ height: `${data.hero.height}px`, backgroundImage: `url(${data.hero.image || fraudCheckImage})`, backgroundSize: 'cover', backgroundPosition: `center ${data.hero.position.y}%`, width: '100%', margin: 0 }}>
                <div className={`absolute inset-0 ${data.hero.overlay || 'bg-black/60'} z-0`}></div>
                <div className={`absolute z-10 ${(() => {
                  switch (data.hero.textAlignment) {
                    case 'top-right': return 'top-8 right-8';
                    case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
                    case 'bottom-left': default: return 'bottom-8 left-8';
                  }
                })()}`}>
                  <div className="text-left max-w-xl">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: data.hero.textColor || '#FFFFFF' }}>{data.hero.title || 'Stay Scam Safe'}</h1>
                    <div className="text-sm sm:text-base md:text-lg font-semibold mb-4 preview-text" style={{ color: data.hero.textColor || '#FFFFFF' }} dangerouslySetInnerHTML={{ __html: data.hero.subtitle || 'Use our tools to identify, report, and stay informed about fraud.' }} />
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 mt-4">
                      <button className="bg-cyan-700 text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-cyan-800 transition-all text-sm sm:text-base" disabled>Scam Checker</button>
                      <button className="bg-white text-black px-6 py-3 rounded-md font-semibold shadow hover:bg-gray-100 transition-all text-sm sm:text-base" disabled>Community Reports</button>
                      <button className="bg-cyan-700 text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-cyan-800 transition-all text-sm sm:text-base" disabled>Contact Database</button>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Why Use Fraud Check?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.keyFeatures.map((feature, index) => (
                  <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1" role="region" aria-label={feature.title}>
                    {renderIcon(feature.icon)}
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                    <div className="text-gray-600 dark:text-slate-300 text-sm preview-text" dangerouslySetInnerHTML={{ __html: feature.description }} />
                  </div>
                ))}
              </div>
            </section>
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-sky-50 dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition px-6 py-10 text-center">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{data.tipOfTheWeek.title}</h2>
                  <div className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-snug mb-4 preview-text" dangerouslySetInnerHTML={{ __html: data.tipOfTheWeek.text }} />
                  {data.tipOfTheWeek.whatToDo?.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">What To Do</h3>
                      <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                        {data.tipOfTheWeek.whatToDo.map((action, idx) => (
                          <li key={idx}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <button className="inline-block bg-cyan-700 text-white px-4 py-2 rounded-md transition-all mt-4" disabled>Visit Help & Advice</button>
                </div>
                <div className="bg-sky-50 dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition px-6 py-10">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">What To Do If…</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {data.whatToDoIf.slice(0, 3).map((scenario, idx) => (
                      <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 flex flex-col items-center">
                        {renderScenarioIcon(scenario.icon)}
                        <h3 className="text-base font-medium text-slate-800 dark:text-white mb-3 text-center">{scenario.title}</h3>
                        <button className="mt-auto bg-cyan-700 text-white px-4 py-2 rounded-md transition-all text-sm" disabled>Learn More</button>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <button className="inline-block bg-cyan-700 text-white px-4 py-2 rounded-md transition-all" disabled>View All Scenarios</button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-4 px-6 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-end space-x-4">
            <button onClick={handleResetToDefault} className="px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-900 dark:text-slate-100 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-all" disabled={isSaving}>Reset to Default</button>
            <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-900 dark:text-slate-100 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-all" disabled={isSaving}>Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all flex items-center" disabled={isSaving}>
              {isSaving ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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