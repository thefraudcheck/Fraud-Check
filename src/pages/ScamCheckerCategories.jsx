// src/components/ScamCheckerCategories.jsx
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import paymentFlows from '../data/paymentFlows';
import calculateRisk from '../utils/scamLogic';
import Header from '../components/Header';
import ResultCard from '../components/ResultCard';
import botImage from '../assets/bot-image.png';
import fraudCheckLogo from '../assets/fraud-check-logo.png';
import fraudCheckerBackground from '../assets/fraud-checker-background.png';
import {
  TruckIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  BriefcaseIcon,
  HeartIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  CalendarIcon,
  QrCodeIcon,
  CubeIcon,
  QuestionMarkCircleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

function ScamCheckerCategories() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Welcome to Scam Checker! I’m here to help you assess the safety of your payment. Let’s get started.',
      timestamp: new Date(),
    },
    {
      sender: 'bot',
      text: 'What type of payment are you checking today?',
      type: 'multi',
      options: [
        { label: <><TruckIcon className="w-5 h-5" /> Buying a Vehicle</>, value: 'buying-a-vehicle' },
        { label: <><CurrencyDollarIcon className="w-5 h-5" /> Crypto Payment</>, value: 'crypto-payment' },
        { label: <><ArrowsRightLeftIcon className="w-5 h-5" /> Own Account Transfer</>, value: 'own-account-transfer' },
        { label: <><ChartBarIcon className="w-5 h-5" /> Investment</>, value: 'investment' },
        { label: <><ShoppingCartIcon className="w-5 h-5" /> Marketplace</>, value: 'marketplace' },
        { label: <><CreditCardIcon className="w-5 h-5" /> Card Payment</>, value: 'card-payment' },
        { label: <><BuildingLibraryIcon className="w-5 h-5" /> Loan or Grant Payment</>, value: 'loan-or-grant-payment' },
        { label: <><BriefcaseIcon className="w-5 h-5" /> Job or Work Opportunity</>, value: 'job-or-work-opportunity' },
        { label: <><HeartIcon className="w-5 h-5" /> Partner or Loved One</>, value: 'partner-or-loved-one' },
        { label: <><WrenchScrewdriverIcon className="w-5 h-5" /> Service Provider</>, value: 'service-provider' },
        { label: <><UserGroupIcon className="w-5 h-5" /> Family Member Request</>, value: 'family-member-request' },
        { label: <><CalendarIcon className="w-5 h-5" /> Subscription Renewal</>, value: 'subscription-renewal' },
        { label: <><QrCodeIcon className="w-5 h-5" /> QR Code Payment</>, value: 'qr-code-payment' },
        { label: <><CubeIcon className="w-5 h-5" /> Delivery or Post Office</>, value: 'delivery-or-post-office' },
        { label: <><WrenchScrewdriverIcon className="w-5 h-5" /> Building Work</>, value: 'building-work' },
        { label: <><QuestionMarkCircleIcon className="w-5 h-5" /> Other</>, value: 'other' },
      ],
      timestamp: new Date(),
    },
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [dynamicPaymentFlows, setDynamicPaymentFlows] = useState(paymentFlows);
  const chatEndRef = useRef(null);

  useEffect(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem('scamCheckerData'));
      if (storedData?.paymentFlows) {
        setDynamicPaymentFlows(storedData.paymentFlows);
      }
    } catch (error) {
      console.error('Failed to load scamCheckerData:', error);
      setDynamicPaymentFlows(paymentFlows);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleOptionClick = (value) => {
    if (!selectedCategory) {
      // Handle initial category selection
      if (!dynamicPaymentFlows[value] || !dynamicPaymentFlows[value][0]) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Sorry, the "${value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}" category is unavailable. Please try another option.`,
            timestamp: new Date(),
          },
        ]);
        return;
      }

      setSelectedCategory(value);
      setMessages((prev) => [
        ...prev,
        { sender: 'user', text: value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), timestamp: new Date() },
      ]);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const firstQuestion = dynamicPaymentFlows[value][0];
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `Got it! You’re checking a "${value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}" payment. Let’s dive in.`,
            timestamp: new Date(),
          },
          {
            sender: 'bot',
            text: firstQuestion.question,
            type: firstQuestion.type,
            options: firstQuestion.options,
            timestamp: new Date(),
          },
        ]);
        setCurrentStep(1);
      }, 1000);
    } else if (selectedCategory === 'other' && currentStep === 1) {
      // Handle Q1 redirect for "Other" category
      const redirectMap = {
        'purchase-or-item': 'marketplace',
        'helping-service': 'service-provider',
        'friend-partner-family': 'partner-or-loved-one',
        'business-investment': 'investment',
        'own-account-transfer': 'own-account-transfer',
        'building-work-service': 'building-work',
        'safety-security': 'other',
        'none-not-sure': 'other',
      };

      const redirectCategory = redirectMap[value];
      if (redirectCategory && redirectCategory !== 'other') {
        if (!dynamicPaymentFlows[redirectCategory] || !dynamicPaymentFlows[redirectCategory][0]) {
          setMessages((prev) => [
            ...prev,
            {
              sender: 'bot',
              text: `Sorry, the "${redirectCategory.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}" category is unavailable. Please try another option.`,
              timestamp: new Date(),
            },
          ]);
          return;
        }
        setSelectedCategory(redirectCategory);
        setCurrentStep(1);
        setAnswers([]);
        setMessages((prev) => [
          ...prev,
          { sender: 'user', text: value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), timestamp: new Date() },
          {
            sender: 'bot',
            text: `This sounds like a "${redirectCategory.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}" payment. Let’s check it.`,
            timestamp: new Date(),
          },
          {
            sender: 'bot',
            text: dynamicPaymentFlows[redirectCategory][0].question,
            type: dynamicPaymentFlows[redirectCategory][0].type,
            options: dynamicPaymentFlows[redirectCategory][0].options,
            timestamp: new Date(),
          },
        ]);
      } else {
        // Proceed with "Other" flow
        setAnswers((prev) => [...prev, value]);
        setMessages((prev) => [
          ...prev,
          { sender: 'user', text: 'None of these / I’m not sure', timestamp: new Date() },
        ]);
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const nextQuestion = dynamicPaymentFlows[selectedCategory][1];
          setMessages((prev) => [
            ...prev,
            {
              sender: 'bot',
              text: nextQuestion.question,
              type: nextQuestion.type,
              options: nextQuestion.options,
              timestamp: new Date(),
            },
          ]);
          setCurrentStep(2);
        }, 1000);
      }
    } else {
      // Handle subsequent questions
      const flow = dynamicPaymentFlows[selectedCategory];
      if (!flow || currentStep > flow.length) {
        setMessages((prev) => [
          ...prev,
          { sender: 'bot', text: 'An error occurred. Please restart the assessment.', timestamp: new Date() },
        ]);
        return;
      }

      const previousOptions = flow[currentStep - 1]?.options || [];
      const selectedOption = previousOptions.find((opt) => opt.value === value) || { label: 'Unknown Response' };
      const userText = typeof selectedOption.label === 'string' ? selectedOption.label : value.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

      setAnswers((prev) => [...prev, value]);
      setMessages((prev) => [
        ...prev,
        { sender: 'user', text: userText, timestamp: new Date() },
      ]);

      const nextQuestionIndex = flow[currentStep - 1].next ? flow[currentStep - 1].next[value] : currentStep;
      if (nextQuestionIndex < flow.length) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const nextQuestion = flow[nextQuestionIndex];
          setMessages((prev) => [
            ...prev,
            {
              sender: 'bot',
              text: nextQuestion.question,
              type: nextQuestion.type,
              options: nextQuestion.options,
              timestamp: new Date(),
            },
          ]);
          setCurrentStep(nextQuestionIndex + 1);
        }, 1000);
      } else {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const result = calculateRisk(answers, flow, selectedCategory);
          setMessages((prev) => [
            ...prev,
            {
              sender: 'bot',
              text: 'Here’s a summary of your answers before we assess the risk:',
              timestamp: new Date(),
            },
            {
              sender: 'bot',
              text: '',
              summary: answers.map((ans, idx) => ({
                question: flow[idx].question,
                answer: flow[idx].options.find((opt) => opt.value === ans)?.label || ans,
              })),
              timestamp: new Date(),
            },
            {
              sender: 'bot',
              text: 'Now, here’s your payment risk assessment:',
              timestamp: new Date(),
            },
            {
              sender: 'bot',
              text: '',
              resultData: result,
              timestamp: new Date(),
            },
          ]);
          setCurrentStep(0);
          setAnswers([]);
          setSelectedCategory(null);
        }, 1500);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setAnswers((prev) => prev.slice(0, -1));
      setMessages((prev) => prev.slice(0, -2).concat([
        {
          sender: 'bot',
          text: dynamicPaymentFlows[selectedCategory][currentStep - 2].question,
          type: dynamicPaymentFlows[selectedCategory][currentStep - 2].type,
          options: dynamicPaymentFlows[selectedCategory][currentStep - 2].options,
          timestamp: new Date(),
        },
      ]));
    }
  };

  const handleReset = () => {
    setMessages([
      {
        sender: 'bot',
        text: 'Welcome to Scam Checker! I’m here to help you assess the safety of your payment. Let’s get started.',
        timestamp: new Date(),
      },
      {
        sender: 'bot',
        text: 'What type of payment are you checking today?',
        type: 'multi',
        options: [
          { label: <><TruckIcon className="w-5 h-5" /> Buying a Vehicle</>, value: 'buying-a-vehicle' },
          { label: <><CurrencyDollarIcon className="w-5 h-5" /> Crypto Payment</>, value: 'crypto-payment' },
          { label: <><ArrowsRightLeftIcon className="w-5 h-5" /> Own Account Transfer</>, value: 'own-account-transfer' },
          { label: <><ChartBarIcon className="w-5 h-5" /> Investment</>, value: 'investment' },
          { label: <><ShoppingCartIcon className="w-5 h-5" /> Marketplace</>, value: 'marketplace' },
          { label: <><CreditCardIcon className="w-5 h-5" /> Card Payment</>, value: 'card-payment' },
          { label: <><BuildingLibraryIcon className="w-5 h-5" /> Loan or Grant Payment</>, value: 'loan-or-grant-payment' },
          { label: <><BriefcaseIcon className="w-5 h-5" /> Job or Work Opportunity</>, value: 'job-or-work-opportunity' },
          { label: <><HeartIcon className="w-5 h-5" /> Partner or Loved One</>, value: 'partner-or-loved-one' },
          { label: <><WrenchScrewdriverIcon className="w-5 h-5" /> Service Provider</>, value: 'service-provider' },
          { label: <><UserGroupIcon className="w-5 h-5" /> Family Member Request</>, value: 'family-member-request' },
          { label: <><CalendarIcon className="w-5 h-5" /> Subscription Renewal</>, value: 'subscription-renewal' },
          { label: <><QrCodeIcon className="w-5 h-5" /> QR Code Payment</>, value: 'qr-code-payment' },
          { label: <><CubeIcon className="w-5 h-5" /> Delivery or Post Office</>, value: 'delivery-or-post-office' },
          { label: <><WrenchScrewdriverIcon className="w-5 h-5" /> Building Work</>, value: 'building-work' },
          { label: <><QuestionMarkCircleIcon className="w-5 h-5" /> Other</>, value: 'other' },
        ],
        timestamp: new Date(),
      },
    ]);
    setCurrentStep(0);
    setSelectedCategory(null);
    setAnswers([]);
    setIsTyping(false);
    setExpandedSections({});
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const riskStyles = {
    'High Risk': { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-600', text: 'text-gray-900' },
    'Neutral Risk': { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-600', text: 'text-gray-900' },
    'Low Risk': { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-600', text: 'text-gray-900' },
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${fraudCheckerBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Header />
      <section className="flex-grow flex flex-col px-4 sm:px-6 py-8">
        <div className="w-full max-w-6xl mx-auto flex flex-col flex-grow">
          <div className="bg-white dark:bg-slate-850 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 flex flex-col min-h-[600px] h-[80vh] w-full">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center gap-4 bg-white dark:bg-slate-850">
              <img
                src={fraudCheckLogo}
                alt="Fraud Check Logo"
                className="h-12 w-auto object-contain"
              />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white font-sans">Scam Checker Assistant</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-sans">Your tool to verify payment safety</p>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'bot' ? 'justify-start items-start gap-x-3' : 'justify-end items-end gap-x-3'} animate-slideIn`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {msg.sender === 'bot' && (
                    <img
                      src={botImage}
                      alt="Bot Avatar"
                      className="w-6 h-6 rounded-full shadow-sm flex-shrink-0 mt-1"
                    />
                  )}
                  <div className={`flex flex-col ${msg.sender === 'bot' ? 'max-w-[80%]' : 'max-w-[80%]'}`}>
                    <div className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'} items-end`}>
                      {msg.sender === 'bot' ? (
                        <div className="flex flex-col">
                          {msg.text && (
                            <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-2 rounded-xl shadow-sm border border-slate-600">
                              <p className="text-sm font-sans leading-relaxed">{msg.text}</p>
                            </div>
                          )}
                          {msg.options && (
                            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {msg.options.map((opt, optIndex) => (
                                <button
                                  key={optIndex}
                                  onClick={() => handleOptionClick(opt.value)}
                                  className="flex items-center gap-2 justify-start bg-gradient-to-r from-cyan-700 to-cyan-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full shadow-md hover:bg-cyan-500 hover:shadow-lg transition-all duration-200 border border-cyan-800 whitespace-nowrap"
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                          {msg.summary && (
                            <div className="mt-3 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-sm">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Answers</h3>
                              <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                {msg.summary.map((item, idx) => (
                                  <li key={idx}>
                                    <strong>Q:</strong> {item.question} <br />
                                    <strong>A:</strong> {typeof item.answer === 'string' ? item.answer : item.answer}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {msg.resultData && (
                            <div className={`mt-3 p-4 rounded-xl ${riskStyles[msg.resultData.riskLevel].bg} border-l-4 ${riskStyles[msg.resultData.riskLevel].border} shadow-md`}>
                              <h3 className={`text-lg font-semibold ${riskStyles[msg.resultData.riskLevel].color}`}>
                                {msg.resultData.riskLevel}
                              </h3>
                              <ResultCard
                                isScam={msg.resultData.riskLevel === 'High Risk'}
                                message={msg.resultData.summary}
                              />
                              {msg.resultData.redFlags.length > 0 && (
                                <div className="mt-4 bg-red-100 dark:bg-red-900/20 p-3 rounded-md">
                                  <button
                                    onClick={() => toggleSection('redFlags')}
                                    className="flex items-center gap-2 text-sm font-medium text-red-700 dark:text-red-400 hover:underline w-full"
                                  >
                                    <span className="text-red-600">❌</span> Red Flags Detected ({msg.resultData.redFlags.length})
                                  </button>
                                  {expandedSections.redFlags && (
                                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1 animate-fadeIn">
                                      {msg.resultData.redFlags.map((flag, i) => (
                                        <li key={i}>{flag}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                              {msg.resultData.missedBestPractices.length > 0 && (
                                <div className="mt-4 bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-md">
                                  <button
                                    onClick={() => toggleSection('missedBestPractices')}
                                    className="flex items-center gap-2 text-sm font-medium text-yellow-700 dark:text-yellow-400 hover:underline w-full"
                                  >
                                    <span className="text-yellow-600">⚠️</span> Missed Best Practices ({msg.resultData.missedBestPractices.length})
                                  </button>
                                  {expandedSections.missedBestPractices && (
                                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1 animate-fadeIn">
                                      {msg.resultData.missedBestPractices.map((missed, i) => (
                                        <li key={i}>{missed}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                              {msg.resultData.bestPractices.length > 0 && (
                                <div className="mt-4 bg-green-100 dark:bg-green-900/20 p-3 rounded-md">
                                  <button
                                    onClick={() => toggleSection('bestPractices')}
                                    className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400 hover:underline w-full"
                                  >
                                    <span className="text-green-600">✅</span> Best Practices Followed ({msg.resultData.bestPractices.length})
                                  </button>
                                  {expandedSections.bestPractices && (
                                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1 animate-fadeIn">
                                      {msg.resultData.bestPractices.map((practice, i) => (
                                        <li key={i}>{practice}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              )}
                              {msg.resultData.patternSuggestions?.length > 0 && (
                                <div className="mt-4 bg-blue-100 dark:bg-blue-900/20 p-3 rounded-md">
                                  <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                    This situation may be related to another scam type:
                                  </p>
                                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                                    {msg.resultData.patternSuggestions.map((suggestion, i) => (
                                      <li key={i}>{suggestion}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">What to Do Next:</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{msg.resultData.advice}</p>
                              </div>
                            </div>
                          )}
                          <div className="text-xs text-gray-400 dark:text-gray-500 ml-2 mt-1">{formatTimestamp(msg.timestamp)}</div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 text-white px-4 py-2 rounded-xl shadow-sm border border-cyan-800">
                            <p className="text-sm font-sans leading-relaxed">{msg.text}</p>
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500 mr-2 mt-1">{formatTimestamp(msg.timestamp)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start items-start gap-x-3 animate-slideIn">
                  <img
                    src={botImage}
                    alt="Bot Avatar"
                    className="w-6 h-6 rounded-full shadow-sm flex-shrink-0 mt-1"
                  />
                  <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white px-4 py-2 rounded-xl shadow-sm border border-slate-600 max-w-[80%]">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                      <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-slate-700 flex flex-col items-center gap-4 bg-white dark:bg-slate-850">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-semibold text-sm px-4 py-2 rounded-full shadow-md hover:bg-gray-400 hover:shadow-lg transition-all duration-200 border border-gray-700"
                >
                  <ArrowLeftIcon className="w-4 h-4" /> Back
                </button>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Fraud Check</p>
              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-cyan-700 to-cyan-600 text-white font-semibold text-sm px-6 py-2 rounded-full shadow-md hover:bg-cyan-500 hover:shadow-lg transition-all duration-200 border border-cyan-800"
              >
                Restart Assessment
              </button>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

ScamCheckerCategories.propTypes = {};

export default ScamCheckerCategories;