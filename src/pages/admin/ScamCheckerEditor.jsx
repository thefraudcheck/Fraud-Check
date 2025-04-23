import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import paymentFlows from '../../data/paymentFlows';
import ResultCard from '../../components/ResultCard';
import { ExclamationTriangleIcon, CheckCircleIcon, ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon as ArrowLeftIconSolid } from '@heroicons/react/24/solid';

// Placeholder assets
const botImage = 'https://via.placeholder.com/24';
const fraudCheckLogo = 'https://via.placeholder.com/100x40?text=Fraud+Check';

// Initialize answerMetadata
const defaultAnswerMetadata = Object.keys(paymentFlows).reduce((acc, category) => {
  acc[category] = {};
  paymentFlows[category].forEach((q, idx) => {
    const qId = `q${idx}`;
    acc[category][qId] = q.options.reduce((optAcc, opt) => ({
      ...optAcc,
      [opt.value]: {
        redFlag: opt.risk >= 3,
        bestPractice: opt.risk === 0,
      },
    }), {});
  });
  return acc;
}, {});

// Initialize paymentFlows with resultCard
const initializedPaymentFlows = Object.keys(paymentFlows).reduce((acc, category) => {
  acc[category] = paymentFlows[category].map((q, idx) => ({
    ...q,
    id: `q${idx}`, // Add unique ID for questions
    options: q.options.map((opt, optIdx) => ({
      ...opt,
      id: `opt${optIdx}`, // Add unique ID for options
    })),
    resultCard: q.resultCard || {
      title: `${category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Risk`,
      description: 'Based on your answers, here’s the risk assessment.',
      redFlags: [],
      bestPractices: [],
      actions: [],
    },
  }));
  return acc;
}, {});

function ScamCheckerEditor() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [data, setData] = useState({
    paymentFlows: initializedPaymentFlows,
    answerMetadata: defaultAnswerMetadata,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [previewQuestionIndex, setPreviewQuestionIndex] = useState(0);
  const questionRefs = useRef({});

  useEffect(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem('scamCheckerData'));
      if (storedData) {
        const updatedMetadata = { ...defaultAnswerMetadata, ...storedData.answerMetadata };
        const updatedFlows = { ...storedData.paymentFlows };
        Object.keys(updatedFlows).forEach((cat) => {
          if (!updatedMetadata[cat]) updatedMetadata[cat] = {};
          updatedFlows[cat] = updatedFlows[cat].map((q, idx) => ({
            ...q,
            id: `q${idx}`,
            options: q.options.map((opt, optIdx) => ({
              ...opt,
              id: opt.id || `opt${optIdx}`,
            })),
          }));
          updatedFlows[cat].forEach((q, idx) => {
            const qId = `q${idx}`;
            if (!updatedMetadata[cat][qId]) {
              updatedMetadata[cat][qId] = q.options.reduce((acc, opt) => ({
                ...acc,
                [opt.value]: { redFlag: false, bestPractice: false },
              }), {});
            }
          });
        });
        setData({
          paymentFlows: updatedFlows,
          answerMetadata: updatedMetadata,
        });
      }
    } catch (error) {
      console.error('Failed to load scamCheckerData:', error);
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('scamCheckerData', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save scamCheckerData:', error);
    } finally {
      setTimeout(() => setIsSaving(false), 500);
    }
  };

  const handleCancel = () => {
    setData({ paymentFlows: initializedPaymentFlows, answerMetadata: defaultAnswerMetadata });
    setSelectedCategory(null);
    localStorage.removeItem('scamCheckerData');
  };

  const updateQuestion = (category, index, field, value) => {
    setData((prev) => {
      const newFlows = { ...prev.paymentFlows };
      newFlows[category] = [...newFlows[category]];
      newFlows[category][index] = { ...newFlows[category][index], [field]: value };
      return { ...prev, paymentFlows: newFlows };
    });
  };

  const updateAnswer = useCallback((category, qIndex, aIndex, field, value) => {
    setData((prev) => {
      const newFlows = { ...prev.paymentFlows };
      newFlows[category] = [...newFlows[category]];
      const currentOption = newFlows[category][qIndex].options[aIndex];
      const newValue = field === 'label' ? value.toLowerCase().replace(/\s+/g, '-') : currentOption.value;

      // Update options
      newFlows[category][qIndex] = {
        ...newFlows[category][qIndex],
        options: newFlows[category][qIndex].options.map((opt, idx) =>
          idx === aIndex ? { ...opt, [field]: value, value: newValue } : opt
        ),
      };

      // Update metadata if label changed
      let newMetadata = prev.answerMetadata;
      if (field === 'label' && currentOption.value !== newValue) {
        newMetadata = { ...prev.answerMetadata };
        const qId = `q${qIndex}`;
        newMetadata[category] = { ...newMetadata[category] };
        newMetadata[category][qId] = { ...newMetadata[category][qId] };
        newMetadata[category][qId][newValue] = newMetadata[category][qId][currentOption.value] || {
          redFlag: false,
          bestPractice: false,
        };
        delete newMetadata[category][qId][currentOption.value];
      }

      return { ...prev, paymentFlows: newFlows, answerMetadata: newMetadata };
    });
  }, []);

  const toggleMetadata = (category, qIndex, answerValue, field) => {
    setData((prev) => {
      const newMetadata = { ...prev.answerMetadata };
      const qId = `q${qIndex}`;
      newMetadata[category][qId] = newMetadata[category][qId] || {};
      newMetadata[category][qId][answerValue] = newMetadata[category][qId][answerValue] || {
        redFlag: false,
        bestPractice: false,
      };
      newMetadata[category][qId][answerValue][field] = !newMetadata[category][qId][answerValue][field];
      const newFlows = { ...prev.paymentFlows };
      newFlows[category] = newFlows[category].map((q, idx) => {
        if (idx === qIndex) {
          return {
            ...q,
            options: q.options.map((opt) => ({
              ...opt,
              [field]: opt.value === answerValue ? newMetadata[category][qId][answerValue][field] : opt[field],
            })),
          };
        }
        return q;
      });
      return { ...prev, paymentFlows: newFlows, answerMetadata: newMetadata };
    });
  };

  const addAnswer = (category, qIndex) => {
    setData((prev) => {
      const newFlows = { ...prev.paymentFlows };
      newFlows[category] = [...newFlows[category]];
      const newValue = `new-answer-${Date.now()}`;
      const newOptionId = `opt${newFlows[category][qIndex].options.length}`;
      newFlows[category][qIndex] = {
        ...newFlows[category][qIndex],
        options: [
          ...newFlows[category][qIndex].options,
          { label: 'New Answer', value: newValue, id: newOptionId, risk: 0, redFlag: false, bestPractice: false },
        ],
      };
      const newMetadata = { ...prev.answerMetadata };
      const qId = `q${qIndex}`;
      newMetadata[category][qId] = newMetadata[category][qId] || {};
      newMetadata[category][qId][newValue] = { redFlag: false, bestPractice: false };

      // Auto-scroll to new answer
      setTimeout(() => {
        const lastAnswer = questionRefs.current[`${qIndex}-${newFlows[category][qIndex].options.length - 1}`];
        lastAnswer?.scrollIntoView({ behavior: 'smooth' });
      }, 0);

      return { ...prev, paymentFlows: newFlows, answerMetadata: newMetadata };
    });
  };

  const removeAnswer = (category, qIndex, aIndex) => {
    setData((prev) => {
      const newFlows = { ...prev.paymentFlows };
      newFlows[category] = [...newFlows[category]];
      const removedValue = newFlows[category][qIndex].options[aIndex].value;
      newFlows[category][qIndex] = {
        ...newFlows[category][qIndex],
        options: newFlows[category][qIndex].options.filter((_, idx) => idx !== aIndex),
      };
      const newMetadata = { ...prev.answerMetadata };
      const qId = `q${qIndex}`;
      delete newMetadata[category][qId][removedValue];
      return { ...prev, paymentFlows: newFlows, answerMetadata: newMetadata };
    });
  };

  const addQuestion = (category) => {
    setData((prev) => {
      const newFlows = { ...prev.paymentFlows };
      const newQuestionIndex = newFlows[category].length;
      newFlows[category] = [
        ...newFlows[category],
        {
          id: `q${newQuestionIndex}`,
          question: 'New Question',
          type: 'multi',
          options: [
            { id: 'opt0', label: 'Yes', value: 'yes', risk: 0, redFlag: false, bestPractice: false },
            { id: 'opt1', label: 'No', value: 'no', risk: 0, redFlag: false, bestPractice: false },
          ],
          resultCard: newFlows[category][0]?.resultCard || {
            title: `${category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Risk`,
            description: 'Based on your answers, here’s the risk assessment.',
            redFlags: [],
            bestPractices: [],
            actions: [],
          },
        },
      ];
      const newMetadata = { ...prev.answerMetadata };
      const qId = `q${newQuestionIndex}`;
      newMetadata[category][qId] = {
        yes: { redFlag: false, bestPractice: false },
        no: { redFlag: false, bestPractice: false },
      };

      // Auto-scroll to new question
      setTimeout(() => {
        const newQuestionRef = questionRefs.current[newQuestionIndex];
        newQuestionRef?.scrollIntoView({ behavior: 'smooth' });
      }, 0);

      return { ...prev, paymentFlows: newFlows, answerMetadata: newMetadata };
    });
  };

  const removeQuestion = (category, qIndex) => {
    setData((prev) => {
      const newFlows = { ...prev.paymentFlows };
      newFlows[category] = newFlows[category].filter((_, idx) => idx !== qIndex);
      const newMetadata = { ...prev.answerMetadata };
      const qId = `q${qIndex}`;
      delete newMetadata[category][qId];
      Object.keys(newMetadata[category]).forEach((key) => {
        const match = key.match(/^q(\d+)$/);
        if (match && parseInt(match[1]) > qIndex) {
          const newKey = `q${parseInt(match[1]) - 1}`;
          newMetadata[category][newKey] = newMetadata[category][key];
          delete newMetadata[category][key];
        }
      });
      return { ...prev, paymentFlows: newFlows, answerMetadata: newMetadata };
    });
  };

  const updateResultCard = (category, field, value) => {
    setData((prev) => {
      const newFlows = { ...prev.paymentFlows };
      newFlows[category] = newFlows[category].map((q) => ({
        ...q,
        resultCard: {
          ...q.resultCard,
          [field]: field === 'redFlags' || field === 'bestPractices' || field === 'actions'
            ? value.split(',').map((item) => item.trim()).filter(Boolean)
            : value,
        },
      }));
      return { ...prev, paymentFlows: newFlows };
    });
  };

  const categories = Object.keys(data.paymentFlows).sort();

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        {/* Back Button */}
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500"
        >
          <ArrowLeftIconSolid className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold">Scam Checker Editor</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Category Selector */}
          {!selectedCategory ? (
            <div className="w-full">
              <h2 className="text-2xl font-semibold mb-4">Scam Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setPreviewQuestionIndex(0);
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-cyan-100 dark:hover:bg-cyan-900"
                  >
                    {category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full">
              {/* Header */}
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mr-4 p-2 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600"
                >
                  <ArrowLeftIcon className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>
                <h2 className="text-2xl font-semibold">
                  Editing: {selectedCategory.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} Questions
                </h2>
              </div>

              {/* Questions Editor */}
              <div className="space-y-6">
                {data.paymentFlows[selectedCategory].map((question, qIndex) => (
                  <div
                    key={question.id}
                    ref={(el) => (questionRefs.current[qIndex] = el)}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700"
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                        Question {qIndex + 1}
                      </label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(selectedCategory, qIndex, 'question', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                        placeholder="Enter question"
                      />
                    </div>
                    <div className="space-y-2">
                      {question.options.map((option, aIndex) => (
                        <div
                          key={option.id}
                          ref={(el) => (questionRefs.current[`${qIndex}-${aIndex}`] = el)}
                          className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-gray-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 shadow-sm"
                        >
                          <input
                            type="text"
                            value={option.label}
                            onChange={(e) => updateAnswer(selectedCategory, qIndex, aIndex, 'label', e.target.value)}
                            className="flex-1 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-700 to-cyan-600 text-white border border-cyan-800 focus:ring-2 focus:ring-cyan-500 text-sm"
                            placeholder="Answer text"
                          />
                          <div className="flex items-center gap-4">
                            <label className="flex items-center text-sm">
                              <input
                                type="checkbox"
                                checked={data.answerMetadata[selectedCategory][`q${qIndex}`]?.[option.value]?.redFlag || false}
                                onChange={() => toggleMetadata(selectedCategory, qIndex, option.value, 'redFlag')}
                                className="hidden"
                              />
                              <span
                                className={`relative inline-block w-10 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                                  data.answerMetadata[selectedCategory][`q${qIndex}`]?.[option.value]?.redFlag
                                    ? 'bg-red-500'
                                    : 'bg-gray-300 dark:bg-slate-600'
                                }`}
                                title="Marks this answer as a potential scam indicator"
                              >
                                <span
                                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                                    data.answerMetadata[selectedCategory][`q${qIndex}`]?.[option.value]?.redFlag ? 'translate-x-4' : ''
                                  }`}
                                />
                                {data.answerMetadata[selectedCategory][`q${qIndex}`]?.[option.value]?.redFlag && (
                                  <ExclamationTriangleIcon className="w-4 h-4 text-white absolute left-5 top-1" />
                                )}
                              </span>
                            </label>
                            <label className="flex items-center text-sm">
                              <input
                                type="checkbox"
                                checked={data.answerMetadata[selectedCategory][`q${qIndex}`]?.[option.value]?.bestPractice || false}
                                onChange={() => toggleMetadata(selectedCategory, qIndex, option.value, 'bestPractice')}
                                className="hidden"
                              />
                              <span
                                className={`relative inline-block w-10 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                                  data.answerMetadata[selectedCategory][`q${qIndex}`]?.[option.value]?.bestPractice
                                    ? 'bg-green-500'
                                    : 'bg-gray-300 dark:bg-slate-600'
                                }`}
                                title="Marks this answer as a recommended practice"
                              >
                                <span
                                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                                    data.answerMetadata[selectedCategory][`q${qIndex}`]?.[option.value]?.bestPractice ? 'translate-x-4' : ''
                                  }`}
                                />
                                {data.answerMetadata[selectedCategory][`q${qIndex}`]?.[option.value]?.bestPractice && (
                                  <CheckCircleIcon className="w-4 h-4 text-white absolute left-5 top-1" />
                                )}
                              </span>
                            </label>
                            <button
                              onClick={() => removeAnswer(selectedCategory, qIndex, aIndex)}
                              className="text-red-600 hover:text-red-800 text-sm flex items-center"
                            >
                              <TrashIcon className="w-4 h-4 mr-1" /> Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4">
                      <button
                        onClick={() => addAnswer(selectedCategory, qIndex)}
                        className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm"
                      >
                        <PlusIcon className="w-4 h-4 mr-2" /> Add Answer
                      </button>
                      <button
                        onClick={() => removeQuestion(selectedCategory, qIndex)}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        <TrashIcon className="w-4 h-4 mr-2" /> Remove Question
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addQuestion(selectedCategory)}
                  className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm font-semibold"
                >
                  <PlusIcon className="w-4 h-4 inline mr-2" /> Add New Question
                </button>
              </div>

              {/* Result Card Editor */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700 mt-8">
                <h2 className="text-2xl font-semibold mb-4">Result Card</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={data.paymentFlows[selectedCategory][0]?.resultCard?.title || ''}
                      onChange={(e) => updateResultCard(selectedCategory, 'title', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                      placeholder="Enter result card title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">Description</label>
                    <textarea
                      value={data.paymentFlows[selectedCategory][0]?.resultCard?.description || ''}
                      onChange={(e) => updateResultCard(selectedCategory, 'description', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                      rows="4"
                      placeholder="Enter result card description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Red Flags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={data.paymentFlows[selectedCategory][0]?.resultCard?.redFlags?.join(', ') || ''}
                      onChange={(e) => updateResultCard(selectedCategory, 'redFlags', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                      placeholder="e.g., Unsolicited contact, Urgent payment"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Best Practices (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={data.paymentFlows[selectedCategory][0]?.resultCard?.bestPractices?.join(', ') || ''}
                      onChange={(e) => updateResultCard(selectedCategory, 'bestPractices', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                      placeholder="e.g., Verify identity, Use secure platform"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                      Actions (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={data.paymentFlows[selectedCategory][0]?.resultCard?.actions?.join(', ') || ''}
                      onChange={(e) => updateResultCard(selectedCategory, 'actions', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                      placeholder="e.g., Contact bank, Report to Action Fraud"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700 mt-8">
                <h2 className="text-2xl font-semibold mb-4">Live Preview</h2>
                <div className="bg-white dark:bg-slate-850 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 min-h-[400px]">
                  <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center gap-4 bg-white dark:bg-slate-850">
                    <img src={fraudCheckLogo} alt="Fraud Check Logo" className="h-12 w-auto object-contain" />
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white font-sans">Scam Checker Assistant</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">Your tool to verify payment safety</p>
                    </div>
                  </div>
                  <div className="px-4 sm:px-6 py-6 space-y-6">
                    {data.paymentFlows[selectedCategory] && data.paymentFlows[selectedCategory][previewQuestionIndex] ? (
                      <>
                        <div className="flex justify-start items-start gap-x-3">
                          <img src={botImage} alt="Bot Avatar" className="w-6 h-6 rounded-full shadow-sm flex-shrink-0 mt-1" />
                          <div className="flex flex-col max-w-[80%]">
                            <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-2 rounded-xl shadow-sm border border-slate-600">
                              <p className="text-sm font-sans leading-relaxed">
                                {data.paymentFlows[selectedCategory][previewQuestionIndex].question}
                              </p>
                            </div>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              {data.paymentFlows[selectedCategory][previewQuestionIndex].options.map((opt, idx) => (
                                <button
                                  key={opt.id}
                                  className="flex items-center justify-between bg-gradient-to-r from-cyan-700 to-cyan-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-md hover:bg-cyan-500 hover:shadow-lg transition-all duration-200 border border-cyan-800"
                                  disabled
                                >
                                  {opt.label}
                                  {(data.answerMetadata[selectedCategory][`q${previewQuestionIndex}`]?.[opt.value]?.redFlag ||
                                    data.answerMetadata[selectedCategory][`q${previewQuestionIndex}`]?.[opt.value]?.bestPractice) && (
                                    <div className="flex gap-1 ml-2">
                                      {data.answerMetadata[selectedCategory][`q${previewQuestionIndex}`]?.[opt.value]?.redFlag && (
                                        <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
                                      )}
                                      {data.answerMetadata[selectedCategory][`q${previewQuestionIndex}`]?.[opt.value]?.bestPractice && (
                                        <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                      )}
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <button
                            onClick={() => setPreviewQuestionIndex((prev) => Math.max(0, prev - 1))}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                            disabled={previewQuestionIndex === 0}
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setPreviewQuestionIndex((prev) => Math.min(data.paymentFlows[selectedCategory].length - 1, prev + 1))}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                            disabled={previewQuestionIndex === data.paymentFlows[selectedCategory].length - 1}
                          >
                            Next
                          </button>
                        </div>
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold mb-2">Result Card Preview</h3>
                          <ResultCard
                            isScam={data.paymentFlows[selectedCategory][0]?.resultCard?.redFlags?.length > 0}
                            message={data.paymentFlows[selectedCategory][0]?.resultCard?.description || 'Based on your answers, here’s the risk assessment.'}
                          />
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 dark:text-slate-400">No questions available.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Save/Cancel Buttons */}
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 dark:bg-slate-600 text-gray-900 dark:text-slate-100 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-500 transition-all text-sm"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all flex items-center text-sm"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ScamCheckerEditor;