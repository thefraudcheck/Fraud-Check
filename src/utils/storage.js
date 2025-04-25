import scamTrendsData from '../data/scamTrendsData.json';

export function getHomeData() {
  const data = localStorage.getItem('homeData');
  const defaultData = {
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

  if (!data) {
    console.log('No homeData, setting default');
    localStorage.setItem('homeData', JSON.stringify(defaultData));
    return defaultData;
  }

  try {
    const parsedData = JSON.parse(data);
    return {
      ...defaultData,
      ...parsedData,
      hero: {
        ...defaultData.hero,
        ...parsedData.hero,
      },
      features: parsedData.features || defaultData.features,
      tipOfTheWeek: parsedData.tipOfTheWeek || defaultData.tipOfTheWeek,
      communityReports: parsedData.communityReports || defaultData.communityReports,
      articles: parsedData.articles || defaultData.articles,
    };
  } catch (e) {
    console.error('Error parsing homeData:', e);
    localStorage.setItem('homeData', JSON.stringify(defaultData));
    return defaultData;
  }
}

export function setHomeData(data) {
  try {
    localStorage.setItem('homeData', JSON.stringify(data));
    console.log('Saved homeData:', data);
  } catch (e) {
    console.error('Error saving homeData:', e);
  }
}

export function getHomeArticlesData() {
  const data = localStorage.getItem('homeArticlesData');
  const defaultData = {
    articles: [
      {
        slug: 'welcome-to-fraud-check',
        title: 'Welcome to Fraud Check',
        description:
          'Your free tool for staying safe online. Learn about our mission to help you identify, report, and stay informed about fraud.',
        date: '2024-10-01',
        image: null,
        content: 'Full content goes here...',
        category: 'General',
      },
      {
        slug: 'how-to-spot-a-scam',
        title: 'How to Spot a Scam',
        description: 'Learn the top 5 signs of a scam and how to protect yourself from fraudsters.',
        date: '2024-10-02',
        image: null,
        content: 'Full content goes here...',
        category: 'Tips',
      },
      {
        slug: 'reporting-fraud',
        title: 'Why Reporting Fraud Matters',
        description: 'Understand the importance of reporting scams and how it helps keep everyone safer.',
        date: '2024-10-03',
        image: null,
        content: 'Full content goes here...',
        category: 'Community',
      },
    ],
  };

  if (!data) {
    localStorage.setItem('homeArticlesData', JSON.stringify(defaultData));
    return defaultData;
  }

  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing homeArticlesData:', e);
    localStorage.setItem('homeArticlesData', JSON.stringify(defaultData));
    return defaultData;
  }
}

export function setHomeArticlesData(data) {
  try {
    localStorage.setItem('homeArticlesData', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving homeArticlesData:', e);
  }
}

export function getScamTrendsData() {
  const data = localStorage.getItem('scamTrendsData');
  const defaultData = scamTrendsData;

  if (!data) {
    console.log('No scamTrendsData in localStorage, using scamTrendsData.json');
    return defaultData;
  }

  try {
    const parsedData = JSON.parse(data);
    return {
      ...defaultData,
      ...parsedData,
      hero: {
        ...defaultData.hero,
        ...parsedData.hero,
      },
      scamOfTheWeek: parsedData.scamOfTheWeek || defaultData.scamOfTheWeek,
      pastScamOfTheWeek: parsedData.pastScamOfTheWeek || defaultData.pastScamOfTheWeek || [],
      scamCategories: parsedData.scamCategories || defaultData.scamCategories,
      userReportedScams: parsedData.userReportedScams || defaultData.userReportedScams,
    };
  } catch (e) {
    console.error('Error parsing scamTrendsData:', e);
    return defaultData;
  }
}

export function setScamTrendsData(data) {
  try {
    localStorage.setItem('scamTrendsData', JSON.stringify(data));
    console.log('Saved scamTrendsData to localStorage:', data);
  } catch (e) {
    console.error('Error saving scamTrendsData:', e);
    throw e; // Re-throw to be caught in the editor
  }
}

export function getScamCheckerData() {
  const data = localStorage.getItem('scamCheckerData');
  const defaultData = {
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

  if (!data) {
    localStorage.setItem('scamCheckerData', JSON.stringify(defaultData));
    return defaultData;
  }

  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing scamCheckerData:', e);
    localStorage.setItem('scamCheckerData', JSON.stringify(defaultData));
    return defaultData;
  }
}

export function setScamCheckerData(data) {
  try {
    localStorage.setItem('scamCheckerData', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving scamCheckerData:', e);
  }
}

export function getArticleSettings() {
  const data = localStorage.getItem('articleSettings');
  const defaultData = {
    backgroundImage: null,
    defaultHeroImage: null,
  };

  if (!data) {
    localStorage.setItem('articleSettings', JSON.stringify(defaultData));
    return defaultData;
  }

  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing articleSettings:', e);
    localStorage.setItem('articleSettings', JSON.stringify(defaultData));
    return defaultData;
  }
}

export function setArticleSettings(data) {
  try {
    localStorage.setItem('articleSettings', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving articleSettings:', e);
  }
}