// src/data/paymentFlows.js
const paymentFlows = {
  'buying-a-vehicle': [
    {
      question: 'Did you find the vehicle on a well-known website?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
      resultCard: {
        title: 'Vehicle Purchase Risk',
        description: 'Based on your answers, here’s the risk assessment for your vehicle purchase.',
        redFlags: ['Requested payment before viewing', 'Price significantly below market value'],
        bestPractices: ['Found on a well-known website', 'Seen in person', 'Seller communicates openly'],
        actions: ['Verify seller identity', 'Inspect vehicle in person', 'Report suspicious listings'],
      },
    },
    {
      question: 'Have you seen the vehicle in person?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
    {
      question: 'Were you asked to pay before viewing or collection?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Is the seller refusing a phone call?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 2 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Is the vehicle location in a different area than advertised?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 2 },
        { label: 'No', value: 'no', risk: 0 },
        { label: 'Don’t know', value: 'dont-know', risk: 1 },
      ],
    },
    {
      question: 'Is the price significantly below market value?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
  ],
  'crypto-payment': [
    {
      question: 'Who asked you to make the payment?',
      type: 'multi',
      options: [
        { label: 'An FCA-regulated financial advisor', value: 'advisor', risk: 0 },
        { label: 'A friend or family member', value: 'friend-family', risk: 2 },
        { label: 'A bank or service', value: 'bank-service', risk: 4 },
        { label: 'Someone else', value: 'someone-else', risk: 4 },
      ],
      resultCard: {
        title: 'Crypto Payment Risk',
        description: 'Based on your answers, here’s the risk assessment for your crypto payment.',
        redFlags: ['Requested by an unknown person', 'Promised quick profits'],
        bestPractices: ['Using a known crypto platform', 'Recipient identity verified'],
        actions: ['Verify recipient', 'Use regulated platforms', 'Report suspicious requests'],
      },
    },
    {
      question: 'Are you being asked to send it to a crypto platform (e.g., Kraken, Coinbase, Binance, Revolut)?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
    {
      question: 'Can you verify the recipient’s identity?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
    {
      question: 'Did they promise quick profits?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Do you fully understand the purpose of the payment?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
  ],
  'own-account-transfer': [
    {
      question: 'Did someone instruct you to move the money?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
      resultCard: {
        title: 'Own Account Transfer Risk',
        description: 'Based on your answers, here’s the risk assessment for your account transfer.',
        redFlags: ['Instructed by someone', 'Account not opened by you', 'Others have access'],
        bestPractices: ['You opened the account', 'Only you have access', 'Viewable online'],
        actions: ['Contact bank', 'Verify account ownership', 'Report suspicious instructions'],
      },
    },
    {
      question: 'Did you open the account yourself?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 4 },
        { label: 'Don’t know', value: 'dont-know', risk: 2 },
      ],
    },
    {
      question: 'Does anyone else have access to the account?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
        { label: 'Don’t know', value: 'dont-know', risk: 2 },
      ],
    },
    {
      question: 'Have you received unexpected instructions or payment codes?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Can you view this account online or via an app?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
        { label: 'Don’t know', value: 'dont-know', risk: 2 },
      ],
    },
    {
      question: 'Does anyone else have access to the app?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 2 },
        { label: 'No', value: 'no', risk: 0 },
        { label: 'Don’t know', value: 'dont-know', risk: 2 },
      ],
    },
    {
      question: 'Who has access to the app?',
      type: 'multi',
      options: [
        { label: 'A friend or family member', value: 'friend-family', risk: 2 },
        { label: 'Someone else', value: 'someone-else', risk: 3 },
        { label: 'A third-party claiming to be on the phone', value: 'third-party-phone', risk: 4 },
      ],
    },
  ],
  investment: [
    {
      question: 'Were you referred to this investment by someone you met online?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
      resultCard: {
        title: 'Investment Risk',
        description: 'Based on your answers, here’s the risk assessment for your investment.',
        redFlags: ['Referred online', 'Guaranteed returns', 'Social media only'],
        bestPractices: ['FCA regulated', 'Companies House registered', 'Verified channels'],
        actions: ['Check FCA register', 'Verify Companies House', 'Report suspicious offers'],
      },
    },
    {
      question: 'Did they promise guaranteed returns?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Is the company FCA regulated?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
        { label: 'Not sure', value: 'not-sure', risk: 2 },
      ],
    },
    {
      question: 'Is the business registered with Companies House (UK)?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
        { label: 'Not sure', value: 'not-sure', risk: 2 },
      ],
    },
    {
      question: 'Is the communication happening via social media or WhatsApp only?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Are you being asked to invest immediately to "secure" a deal?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
  ],
  marketplace: [
    {
      question: 'Is the seller asking for payment outside the platform?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
      resultCard: {
        title: 'Marketplace Purchase Risk',
        description: 'Based on your answers, here’s the risk assessment for your marketplace purchase.',
        redFlags: ['Payment outside platform'],
        bestPractices: ['Payment within platform', 'Item seen in person', 'Seller profile verified'],
        actions: ['Use platform payment', 'Verify seller', 'Report suspicious listings'],
      },
    },
    {
      question: 'Have you seen the item in person?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
    {
      question: 'Was the seller’s profile recently created or has no reviews?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 2 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Are you being told to collect the item from a random or unverified location?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 2 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
  ],
  'card-payment': [
    {
      question: 'Did they ask for your card details over the phone?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
      resultCard: {
        title: 'Card Payment Risk',
        description: 'Based on your answers, here’s the risk assessment for your card payment.',
        redFlags: ['Card details over phone'],
        bestPractices: ['Secure website', 'Payment on original site', 'Customer service available'],
        actions: ['Verify website security', 'Contact card provider', 'Report suspicious requests'],
      },
    },
    {
      question: 'Is the website secure and starts with HTTPS?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
    {
      question: 'Are you being redirected to a third-party website to pay?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 2 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Is there no customer service or support info available?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 2 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
  ],
  'loan-or-grant-payment': [
    {
      question: 'How did you find the loan company?',
      type: 'multi',
      options: [
        { label: 'I found them myself', value: 'found-myself', risk: 0 },
        { label: 'They approached me', value: 'they-approached-me', risk: 3 },
      ],
      resultCard: {
        title: 'Loan or Grant Payment Risk',
        description: 'Based on your answers, here’s the risk assessment for your loan or grant payment.',
        redFlags: ['Unsolicited approach', 'Upfront fee', 'Unusually generous offer'],
        bestPractices: ['FCA regulated', 'Secure online access', 'Known successful use'],
        actions: ['Check FCA register', 'Verify company', 'Report suspicious offers'],
      },
    },
    {
      question: 'Are you being asked to pay an upfront or advance fee before receiving the loan?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Is the loan company FCA regulated?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
        { label: 'Not sure', value: 'not-sure', risk: 2 },
      ],
    },
    {
      question: 'Has anyone you know used this company successfully?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
    {
      question: 'Can you view the loan account or application online with a secure login?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
    {
      question: 'Does the offer seem unusually generous or guaranteed?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
  ],
  'job-or-work-opportunity': [
    {
      question: 'Did the company contact you first with the job offer?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
      resultCard: {
        title: 'Job or Work Opportunity Risk',
        description: 'Based on your answers, here’s the risk assessment for your job or work opportunity.',
        redFlags: ['Unsolicited offer', 'Upfront payment', 'Too good to be true'],
        bestPractices: ['Verified company', 'Proper interview'],
        actions: ['Verify company', 'Avoid upfront payments', 'Report suspicious offers'],
      },
    },
    {
      question: 'Were you asked to pay for training, uniform, or equipment upfront?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Is the company website or contact information verifiable?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
        { label: 'Not sure', value: 'not-sure', risk: 2 },
      ],
    },
    {
      question: 'Does the job sound too good to be true?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Have you had a proper interview or phone call?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
  ],
  'partner-or-loved-one': [
    {
      question: 'Did you meet this person online or via an app?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
      resultCard: {
        title: 'Partner or Loved One Payment Risk',
        description: 'Based on your answers, here’s the risk assessment for your payment to a partner or loved one.',
        redFlags: ['Met online', 'Financial requests', 'Emotional pressure'],
        bestPractices: ['Met in person', 'Willing to video call'],
        actions: ['Verify identity', 'Avoid financial help without verification', 'Report suspicious behavior'],
      },
    },
    {
      question: 'Have they asked you for money or financial help?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Do they avoid video or phone calls?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 2 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Have they made excuses about not being able to meet?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 2 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Are they pressuring you emotionally (e.g., urgent need, guilt trips)?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
  ],
  'service-provider': [
    {
      question: 'Did they contact you out of the blue (email, call, popup)?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
      resultCard: {
        title: 'Service Provider Payment Risk',
        description: 'Based on your answers, here’s the risk assessment for your payment to a service provider.',
        redFlags: ['Unsolicited contact', 'Remote access requested', 'Unusual payment method'],
        bestPractices: ['You contacted them', 'Verified with real company'],
        actions: ['Verify provider', 'Avoid remote access', 'Report suspicious contact'],
      },
    },
    {
      question: 'Did they ask for remote access to your device?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Did they claim urgent action is needed (e.g., virus, hacking)?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Did they ask for payment via gift cards, crypto, or wire transfer?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Can you verify they work for the real company (e.g., Microsoft, BT)?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
        { label: 'Not sure', value: 'not-sure', risk: 2 },
      ],
    },
  ],
  'family-member-request': [
    {
      question: 'Did the message come from a new or unknown number claiming to be family?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
      resultCard: {
        title: 'Family Member Request Risk',
        description: 'Based on your answers, here’s the risk assessment for your payment to a family member.',
        redFlags: ['Unknown number', 'Urgent emergency', 'Secrecy requested'],
        bestPractices: ['Known number', 'Identity verified'],
        actions: ['Verify identity', 'Contact family directly', 'Report suspicious messages'],
      },
    },
    {
      question: 'Are they asking for money urgently due to an “emergency”?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Have you called or verified with the person another way?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
    {
      question: 'Are they asking you not to tell anyone else?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Do they refuse video or voice confirmation?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 2 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
  ],
  'subscription-renewal': [
    {
      question: 'Did you receive an unexpected renewal or charge alert?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
      resultCard: {
        title: 'Subscription Renewal Risk',
        description: 'Based on your answers, here’s the risk assessment for your subscription renewal.',
        redFlags: ['Unexpected alert', 'Unverified link', 'Service stoppage threat'],
        bestPractices: ['Verified with provider', 'Sender matches provider'],
        actions: ['Verify with provider', 'Avoid clicking links', 'Report suspicious messages'],
      },
    },
    {
      question: 'Does the message include a phone number or link to click?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Have you verified the charge directly with the official provider?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
    {
      question: 'Did they claim your service will stop unless you act now?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Does the link or sender look unusual or not match the provider?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
  ],
  'qr-code-payment': [
    {
      question: 'Did someone ask you to scan a QR code to pay?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
      resultCard: {
        title: 'QR Code Payment Risk',
        description: 'Based on your answers, here’s the risk assessment for your QR code payment.',
        redFlags: ['Requested QR code scan'],
        bestPractices: ['Verified source', 'Secure payment page', 'Recipient identified'],
        actions: ['Verify QR source', 'Check payment page', 'Report suspicious codes'],
      },
    },
    {
      question: 'Did you verify the QR code source (e.g., official website, trusted provider)?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
    {
      question: 'Does the QR code lead to a secure payment page with HTTPS?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
    {
      question: 'Is the payment recipient clearly identified?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
  ],
  'delivery-or-post-office': [
    {
      question: 'Did you receive an unexpected delivery fee request?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
      resultCard: {
        title: 'Delivery or Post Office Risk',
        description: 'Based on your answers, here’s the risk assessment for your delivery or post office payment.',
        redFlags: ['Unexpected fee', 'Unverified link/QR code', 'Suspicious sender'],
        bestPractices: ['Verified with company', 'Official sender'],
        actions: ['Verify with delivery company', 'Avoid unverified links', 'Report suspicious requests'],
      },
    },
    {
      question: 'Does the message include a link or QR code to pay?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Have you verified the request with the official delivery company?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
    {
      question: 'Is the sender’s email or number unusual or not official?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
  ],
  'building-work': [
    {
      question: 'Did the builder approach you unsolicited (e.g., door knock, flyer)?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
      resultCard: {
        title: 'Building Work Payment Risk',
        description: 'Based on your answers, here’s the risk assessment for your payment for building work.',
        redFlags: ['Unsolicited contact', 'Full payment upfront'],
        bestPractices: ['Verifiable reviews', 'Written contract'],
        actions: ['Verify builder', 'Get written contract', 'Report suspicious builders'],
      },
    },
    {
      question: 'Are they asking for full payment upfront?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Do they have verifiable reviews or references?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
    {
      question: 'Is there a written contract or agreement?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
  ],
  'threat-or-duress': [
    {
      question: 'Are you being threatened or pressured to make a payment?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
      resultCard: {
        title: 'Threat or Duress Payment Risk',
        description: 'Based on your answers, here’s the risk assessment for your payment under threat or duress.',
        redFlags: ['Threat or pressure', 'Unexpected debt', 'Unusual payment method'],
        bestPractices: ['Verified with official source'],
        actions: ['Contact police', 'Verify with official source', 'Report to Action Fraud'],
      },
    },
    {
      question: 'Did they claim you owe money for something unexpected (e.g., tax, fine)?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Are they asking for payment via unusual methods (e.g., gift cards, crypto)?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Have you verified the claim with an official source (e.g., HMRC, police)?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
  ],
  other: [
    {
      question: 'What is this payment for?',
      type: 'multi',
      options: [
        { label: 'A purchase or item I’m buying', value: 'purchase-or-item', risk: 0 },
        { label: 'A payment to someone helping me (e.g., tech, finance)', value: 'helping-service', risk: 0 },
        { label: 'A request from a friend, partner, or family member', value: 'friend-partner-family', risk: 0 },
        { label: 'A business or investment opportunity', value: 'business-investment', risk: 0 },
        { label: 'Someone asked me to transfer money to my own account', value: 'own-account-transfer', risk: 0 },
        { label: 'A service like building work or tradesman', value: 'building-work-service', risk: 0 },
        { label: 'I was told to move money for safety or security', value: 'safety-security', risk: 0 },
        { label: 'None of these / I’m not sure', value: 'none-not-sure', risk: 0 },
      ],
      resultCard: {
        title: 'Other Payment Risk',
        description: 'Based on your answers, here’s the risk assessment for your payment.',
        redFlags: [
          'Payment requested by someone else',
          'Requested to keep payment secret',
          'Instructed to lie about payment reason',
          'Payment influenced by external pressure',
        ],
        bestPractices: [
          'Payment initiated independently',
          'No secrecy requested',
          'No instructions to lie about payment',
          'Recipient known and trusted',
          'Payment was your own initiative',
          'You initiated contact',
          'No emotional pressure or urgency',
          'Purpose of payment clear',
        ],
        actions: ['Verify recipient identity', 'Contact your bank', 'Report to Action Fraud if suspicious'],
      },
    },
    {
      question: 'Did someone ask you to make this payment?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
        { label: 'Not sure', value: 'not-sure', risk: 2 },
      ],
    },
    {
      question: 'Have you been asked to keep this payment secret or not tell your bank the full story?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Have you been told to lie about the reason for the payment?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Do you know and trust the person or company you are paying?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
        { label: 'Not sure', value: 'not-sure', risk: 2 },
      ],
    },
    {
      question: 'Was this payment your idea, without pressure or instructions from anyone?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 3 },
        { label: 'Not sure', value: 'not-sure', risk: 2 },
      ],
    },
    {
      question: 'Did you contact them first, or did they contact you?',
      type: 'multi',
      options: [
        { label: 'I contacted them', value: 'i-contacted-them', risk: 0 },
        { label: 'They contacted me', value: 'they-contacted-me', risk: 2 },
        { label: 'Not sure', value: 'not-sure', risk: 1 },
      ],
    },
    {
      question: 'Have you sent them money before?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 0 },
        { label: 'Not sure', value: 'not-sure', risk: 0 },
      ],
    },
    {
      question: 'Is this payment emotionally pressured, rushed, or urgent?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 2 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Do you understand exactly what the money will be used for?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
        { label: 'Not sure', value: 'not-sure', risk: 2 },
      ],
    },
  ],
};

export default paymentFlows;