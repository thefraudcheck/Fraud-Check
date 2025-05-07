// src/utils/storage.js
import scamTrendsData from '../data/scamTrendsData.json';

// Home Data
const defaultHomeData = {
  hero: {
    title: 'Stay Scam Safe',
    subtitle: 'Use our tools to identify, report, and stay informed about fraud.',
    image: null,
    textColor: '#FFFFFF',
    imageOffset: '20%',
  },
  features: [
    {
      id: 'feature-1',
      title: 'Expert Guidance',
      description: 'Built with insider fraud experience, our platform helps you spot scams before it’s too late.',
      icon: 'shield-check',
    },
    {
      id: 'feature-2',
      title: 'Real Scam Data',
      description: 'Learn from real reports submitted by people like you — updated weekly.',
      icon: 'light-bulb',
    },
    {
      id: 'feature-3',
      title: 'Instant Scam Checker',
      description: 'Answer a few questions and get an instant risk assessment, tailored to your situation.',
      icon: 'exclamation-triangle',
    },
  ],
  tipOfTheWeek: {
    title: '🛡️ Tip of the Week',
    text: 'Always verify before you trust. Scammers often pretend to be your bank, HMRC, or other trusted providers to create a false sense of urgency. Never act on unexpected messages alone — always use the company’s official website or app to verify what’s real.',
    link: '/advice',
  },
  communityReports: {
    title: 'Community Reports',
  },
  articles: {
    title: 'Latest Articles',
    layout: 'grid',
  },
};

export function getHomeData() {
  const data = localStorage.getItem('homeData');
  if (!data) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('No homeData, setting default');
    }
    localStorage.setItem('homeData', JSON.stringify(defaultHomeData));
    return defaultHomeData;
  }

  try {
    const parsedData = JSON.parse(data);
    return {
      ...defaultHomeData,
      ...parsedData,
      hero: { ...defaultHomeData.hero, ...parsedData.hero },
      features: parsedData.features || defaultHomeData.features,
      tipOfTheWeek: parsedData.tipOfTheWeek || defaultHomeData.tipOfTheWeek,
      communityReports: parsedData.communityReports || defaultHomeData.communityReports,
      articles: parsedData.articles || defaultHomeData.articles,
    };
  } catch (e) {
    console.error('Error parsing homeData:', e);
    localStorage.setItem('homeData', JSON.stringify(defaultHomeData));
    return defaultHomeData;
  }
}

export function setHomeData(data) {
  try {
    localStorage.setItem('homeData', JSON.stringify(data));
    if (process.env.NODE_ENV !== 'production') {
      console.log('Saved homeData:', data);
    }
  } catch (e) {
    console.error('Error saving homeData:', e);
  }
}

// Scam Trends Data
const defaultScamTrendsData = scamTrendsData;

export function getScamTrendsData() {
  const data = localStorage.getItem('scamTrendsData');
  if (!data) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('No scamTrendsData in localStorage, using scamTrendsData.json:', defaultScamTrendsData);
    }
    localStorage.setItem('scamTrendsData', JSON.stringify(defaultScamTrendsData));
    return defaultScamTrendsData;
  }

  try {
    const parsedData = JSON.parse(data);
    if (process.env.NODE_ENV !== 'production') {
      console.log('Parsed scamTrendsData from localStorage:', parsedData);
    }
    const userReportedScams = Array.isArray(parsedData.userReportedScams)
      ? parsedData.userReportedScams.map(report => ({
          name: report.name || report.type || 'Unknown Scam',
          type: report.type || report.name || 'Unknown Scam',
          description: report.description || 'No description provided.',
          redFlags: Array.isArray(report.redFlags) ? report.redFlags : ['Suspicious request'],
          action: report.action || 'Report to Action Fraud and verify with the official entity.',
          url: report.url || '',
          reportDate: report.reportDate || new Date().toISOString().split('T')[0],
        }))
      : [];
    return {
      ...defaultScamTrendsData,
      ...parsedData,
      hero: { ...defaultScamTrendsData.hero, ...parsedData.hero },
      scamOfTheWeek: parsedData.scamOfTheWeek || defaultScamTrendsData.scamOfTheWeek,
      pastScamOfTheWeek: Array.isArray(parsedData.pastScamOfTheWeek) ? parsedData.pastScamOfTheWeek : defaultScamTrendsData.pastScamOfTheWeek || [],
      scamCategories: Array.isArray(parsedData.scamCategories) ? parsedData.scamCategories : defaultScamTrendsData.scamCategories,
      userReportedScams,
    };
  } catch (e) {
    console.error('Error parsing scamTrendsData:', e);
    localStorage.setItem('scamTrendsData', JSON.stringify(defaultScamTrendsData));
    return defaultScamTrendsData;
  }
}

export function setScamTrendsData(data) {
  try {
    const dataToSave = {
      ...data,
      userReportedScams: Array.isArray(data.userReportedScams) ? data.userReportedScams : [],
    };
    localStorage.setItem('scamTrendsData', JSON.stringify(dataToSave));
    if (process.env.NODE_ENV !== 'production') {
      console.log('Saved scamTrendsData to localStorage:', dataToSave);
    }
  } catch (e) {
    console.error('Error saving scamTrendsData:', e);
    throw e;
  }
}

// Scam Checker Data
const defaultScamCheckerData = {
  questions: [
    {
      id: 'q1',
      text: 'Did you receive an unexpected call, email, or message?',
      options: [
        { value: 'yes', label: 'Yes', score: 2 },
        { value: 'no', label: 'No', score: 0 },
      ],
    },
    {
      id: 'q2',
      text: 'Does the communication ask for personal or financial information?',
      options: [
        { value: 'yes', label: 'Yes', score: 3 },
        { value: 'no', label: 'No', score: 0 },
      ],
    },
    {
      id: 'q3',
      text: 'Is there a sense of urgency or pressure to act quickly?',
      options: [
        { value: 'yes', label: 'Yes', score: 3 },
        { value: 'no', label: 'No', score: 0 },
      ],
    },
    {
      id: 'q4',
      text: 'Does the communication come from a trusted source you can verify?',
      options: [
        { value: 'yes', label: 'Yes', score: -2 },
        { value: 'no', label: 'No', score: 2 },
      ],
    },
    {
      id: 'q5',
      text: 'Are there spelling or grammar mistakes in the message?',
      options: [
        { value: 'yes', label: 'Yes', score: 2 },
        { value: 'no', label: 'No', score: 0 },
      ],
    },
  ],
};

export function getScamCheckerData() {
  const data = localStorage.getItem('scamCheckerData');
  if (!data) {
    localStorage.setItem('scamCheckerData', JSON.stringify(defaultScamCheckerData));
    return defaultScamCheckerData;
  }

  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing scamCheckerData:', e);
    localStorage.setItem('scamCheckerData', JSON.stringify(defaultScamCheckerData));
    return defaultScamCheckerData;
  }
}

export function setScamCheckerData(data) {
  try {
    localStorage.setItem('scamCheckerData', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving scamCheckerData:', e);
  }
}

// Article Settings
const defaultArticleSettings = {
  backgroundImage: null,
  defaultHeroImage: null,
};

export function getArticleSettings() {
  const data = localStorage.getItem('articleSettings');
  if (!data) {
    localStorage.setItem('articleSettings', JSON.stringify(defaultArticleSettings));
    return defaultArticleSettings;
  }

  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing articleSettings:', e);
    localStorage.setItem('articleSettings', JSON.stringify(defaultArticleSettings));
    return defaultArticleSettings;
  }
}

export function setArticleSettings(data) {
  try {
    localStorage.setItem('articleSettings', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving articleSettings:', e);
  }
}

// About Data
const defaultAboutData = {
  title: 'About Fraud Check',
  intro:
    'Fraud Check is your trusted ally in the fight against financial fraud. Built by fraud prevention experts, our platform empowers you with cutting-edge tools, real-time scam detection, and actionable advice to safeguard your finances and identity.',
  precision:
    'Precision protection, powered by expertise. Whether you’re transferring funds, evaluating an investment, or responding to a suspicious contact, Fraud Check delivers insights drawn from the latest UK fraud trends, FCA data, and Action Fraud intelligence.',
  community:
    'Lead the charge against fraud. Join a community dedicated to staying ahead of scammers. Explore our Help & Advice resources, assess risks with our Scam Checker, and share your experiences to protect others.',
  trustedText: 'Trusted by thousands • Backed by FCA-aligned data • Committed to your financial security',
  missionTitle: 'Our Mission',
  missionText1:
    'At Fraud Check, we’re dedicated to equipping you with the knowledge and tools to navigate today’s complex fraud landscape. Inspired by world-class banking standards, our mission is to reduce fraud’s impact on individuals and communities across the UK and beyond.',
  missionText2:
    'We combine advanced analytics, real-world scam reports, and expert guidance to deliver a proactive defense system — because staying safe shouldn’t be a guessing game.',
  footerAbout:
    'Fraud Check is your free tool for staying safe online. Built by fraud experts to help real people avoid modern scams.',
  footerCopyright: '© 2025 Fraud Check. All rights reserved.',
};

export function getAboutData() {
  const data = localStorage.getItem('aboutData');
  if (!data) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('No aboutData in localStorage, setting default:', defaultAboutData);
    }
    localStorage.setItem('aboutData', JSON.stringify(defaultAboutData));
    return defaultAboutData;
  }

  try {
    const parsedData = JSON.parse(data);
    if (process.env.NODE_ENV !== 'production') {
      console.log('Parsed aboutData from localStorage:', parsedData);
    }
    return {
      ...defaultAboutData,
      ...parsedData,
    };
  } catch (e) {
    console.error('Error parsing aboutData:', e);
    localStorage.setItem('aboutData', JSON.stringify(defaultAboutData));
    return defaultAboutData;
  }
}

export function setAboutData(data) {
  try {
    localStorage.setItem('aboutData', JSON.stringify(data));
    if (process.env.NODE_ENV !== 'production') {
      console.log('Saved aboutData to localStorage:', data);
    }
  } catch (e) {
    console.error('Error saving aboutData:', e);
    throw e;
  }
}

// Help & Advice Data
const defaultHelpAdviceData = {
  categories: [
    {
      category: 'General Safety Tips',
      tips: [
        {
          title: 'Verify Before You Trust',
          preview: 'Fraudsters spoof phone numbers, emails, and logos. Always verify using official contact details from the company’s website.',
          icon: 'ShieldCheckIcon',
          details: {
            why: '<p>Impersonation is a cornerstone of fraud, exploiting trust in familiar brands or authorities. Independent verification disrupts their tactics.</p>',
            examples: [
              'A call from "your bank" requesting your PIN or OTP for an "urgent security check."',
              'An email from "HMRC" with a refund link leading to a phishing site.',
              'A text from "Royal Mail" demanding payment for a "missed delivery."',
            ],
            whatToDo: [
              'Hang up or ignore unsolicited messages.',
              'Wait 5-10 minutes, then contact the organization using a verified number or email from their official website.',
              'Report suspicious contacts to Action Fraud (0300 123 2040) or the organization directly.',
            ],
            signs: [
              'Caller ID matches a known entity but the tone or request feels unusual.',
              'Emails with grammatical errors, generic greetings (e.g., "Dear Customer"), or odd domains.',
              'Urgent demands for personal or financial details.',
            ],
            protect: [
              'Never trust contact details provided in unsolicited messages — source them yourself.',
              'Enable 2FA on critical accounts to add a security layer.',
              'UK banks and Action Fraud emphasize independent verification as a key defense.',
            ],
          },
        },
      ],
    },
  ],
  tipOfTheWeek: {
    title: '🛡️ Tip of the Week',
    text: 'Always verify before you trust. Scammers often pretend to be your bank, HMRC, or other trusted providers to create a false sense of urgency. Never act on unexpected messages alone — always use the company’s official website or app to verify what’s real.',
    link: '/help-advice',
    icon: 'ShieldCheckIcon',
    details: {
      why: '<p>Scammers exploit trust by impersonating legitimate organizations, rushing you into decisions.</p>',
      examples: ['Fake bank calls, HMRC emails, or delivery texts.'],
      whatToDo: ['Verify via official channels.', 'Report to Action Fraud.'],
      signs: ['Urgent demands, odd contact details.'],
      protect: ['Use 2FA, source contact info independently.'],
    },
  },
  tipArchive: [],
};

export function getHelpAdviceData() {
  const data = localStorage.getItem('helpAdviceData');
  if (!data) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('No helpAdviceData in localStorage, setting default:', defaultHelpAdviceData);
    }
    localStorage.setItem('helpAdviceData', JSON.stringify(defaultHelpAdviceData));
    return defaultHelpAdviceData;
  }

  try {
    const parsedData = JSON.parse(data);
    return {
      ...defaultHelpAdviceData,
      ...parsedData,
      categories: parsedData.categories || defaultHelpAdviceData.categories,
      tipOfTheWeek: parsedData.tipOfTheWeek || defaultHelpAdviceData.tipOfTheWeek,
      tipArchive: parsedData.tipArchive || defaultHelpAdviceData.tipArchive,
    };
  } catch (e) {
    console.error('Error parsing helpAdviceData:', e);
    localStorage.setItem('helpAdviceData', JSON.stringify(defaultHelpAdviceData));
    return defaultHelpAdviceData;
  }
}

export function setHelpAdviceData(data) {
  try {
    localStorage.setItem('helpAdviceData', JSON.stringify(data));
    if (process.env.NODE_ENV !== 'production') {
      console.log('Saved helpAdviceData to localStorage:', data);
    }
  } catch (e) {
    console.error('Error saving helpAdviceData:', e);
    throw e;
  }
}