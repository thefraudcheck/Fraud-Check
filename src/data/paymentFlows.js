const paymentFlows = {
  'buying-a-vehicle': [
    {
      question: 'Did you find the vehicle on a well-known website?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
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
        { label: 'Yes', value: 'yes', risk: 3 },
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
        { label: 'Don’t know', value: 'dont-know', risk: 1 }, // Added "Don’t know"
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
        { label: 'Friend/Family', value: 'friend-family', risk: 1 }, // Neutral
        { label: 'FCA-Regulated Advisor', value: 'fca-advisor', risk: 0 }, // Green with caution
        { label: 'Bank/Service', value: 'bank-service', risk: 3 }, // Red flag
        { label: 'Someone Else', value: 'someone-else', risk: 4 }, // Red flag
      ],
    },
    {
      question: 'Are you being asked to send it to a crypto platform (e.g., Kraken, Coinbase, Binance, Revolut)?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 3 },
      ],
    },
    {
      question: 'Can you verify the recipient’s identity?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 3 },
      ],
    },
    {
      question: 'Did they promise quick profits?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
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
    },
    {
      question: 'Did you open the account yourself?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 3 },
        { label: 'Don’t know', value: 'dont-know', risk: 2 }, // Added "Don’t know"
      ],
    },
    {
      question: 'Does anyone else have access to the account?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
        { label: 'Don’t know', value: 'dont-know', risk: 2 }, // Added "Don’t know"
      ],
    },
    {
      question: 'Have you received unexpected instructions or payment codes?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Can you view this account online or via an app?', // New question
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
        { label: 'Don’t know', value: 'dont-know', risk: 1 },
      ],
    },
    {
      question: 'Does anyone else have access to the app?', // New question
      type: 'multi',
      options: [
        { label: 'No', value: 'no', risk: 0 },
        { label: 'Yes', value: 'yes', risk: 2 },
        { label: 'Don’t know', value: 'dont-know', risk: 1 },
      ],
      next: {
        'yes': 6, // Jump to follow-up question
      },
    },
    {
      question: 'Who has access to the app?', // New follow-up question
      type: 'multi',
      options: [
        { label: 'Friend/Family', value: 'friend-family', risk: 1 }, // Best practice caution
        { label: '3rd Party on Phone', value: 'third-party-phone', risk: 3 }, // Red flag
        { label: 'Someone Else', value: 'someone-else', risk: 4 }, // Red flag
      ],
    },
  ],
  'investment': [
    {
      question: 'Were you referred to this investment by someone you met online?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Did they promise guaranteed returns?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Is the company FCA regulated?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
        { label: 'Not Sure', value: 'not-sure', risk: 2 },
      ],
    },
    {
      question: 'Is the business registered with Companies House (UK)?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
        { label: 'Not Sure', value: 'not-sure', risk: 2 },
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
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
  ],
  'marketplace': [
    {
      question: 'Is the seller asking for payment outside the platform?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
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
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Are you being told to collect the item from a random or unverified location?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
  ],
  'card-payment': [
    {
      question: 'Did they ask for your card details over the phone?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Is the website secure and starts with HTTPS?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 3 },
      ],
    },
    {
      question: 'Are you being redirected to a third-party website to pay?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
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
        { label: 'They Approached Me', value: 'they-approached-me', risk: 3 },
        { label: 'I Found Them', value: 'i-found-them', risk: 0 },
      ],
    },
    {
      question: 'Are you being asked to pay an upfront or advance fee before receiving the loan?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Is the loan company FCA regulated?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 3 },
        { label: 'Not Sure', value: 'not-sure', risk: 2 },
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
        { label: 'Yes', value: 'yes', risk: 4 },
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
    },
    {
      question: 'Were you asked to pay for training, uniform, or equipment upfront?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Is the company website or contact information verifiable?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
        { label: 'Not Sure', value: 'not-sure', risk: 2 },
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
    },
    {
      question: 'Have they asked you for money or financial help?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Do they avoid video or phone calls?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Have they made excuses about not being able to meet?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Are they pressuring you emotionally (e.g., urgent need, guilt trips)?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
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
    },
    {
      question: 'Did they ask for remote access to your device?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
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
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Can you verify they work for the real company (e.g., Microsoft, BT)?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
        { label: 'Not Sure', value: 'not-sure', risk: 2 },
      ],
    },
  ],
  'family-member-request': [
    {
      question: 'Did the message come from a new or unknown number claiming to be family?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Are they asking for money urgently due to an “emergency”?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Have you called or verified with the person another way?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 3 },
      ],
    },
    {
      question: 'Are they asking you not to tell anyone else?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Do they refuse video or voice confirmation?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
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
      question: 'Did someone ask you to scan a QR code to pay or claim something?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Did the QR code appear in a message or flyer from an unknown sender?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Does the QR lead to a site asking for login or card details?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Did they pressure you to scan quickly or avoid asking questions?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Can you verify the source of the QR code?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
        { label: 'Not Sure', value: 'not-sure', risk: 2 },
      ],
    },
  ],
  'delivery-or-post-office': [
    {
      question: 'Did the message say you missed a parcel or delivery attempt?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Did it include a link to reschedule or pay a fee?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Does the sender domain or number look suspicious or generic?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Have you checked your tracking via the real courier website?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 2 },
      ],
    },
    {
      question: 'Does the site request card or personal info?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
  ],
  'building-work': [ // New category
    {
      question: 'Is the worker/company verifiable, reviewed, and credible?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 3 },
        { label: 'Unsure', value: 'unsure', risk: 2 },
      ],
    },
    {
      question: 'Are they asking for full payment on Day 1?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Are you paying them for materials?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 2 },
        { label: 'No', value: 'no', risk: 0 },
      ],
      guidance: 'Consider buying materials yourself to reduce risk.',
    },
  ],
  'other': [
    {
      question: 'Were you asked to pay using a method other than card or secure transfer?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Did someone pressure you to make this payment quickly?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Do you know the person asking for payment?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 0 },
        { label: 'No', value: 'no', risk: 3 },
      ],
    },
    {
      question: 'Have you been contacted repeatedly or aggressively?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 3 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
    {
      question: 'Was the payment request unexpected or out of the blue?',
      type: 'multi',
      options: [
        { label: 'Yes', value: 'yes', risk: 4 },
        { label: 'No', value: 'no', risk: 0 },
      ],
    },
  ],
};

export default paymentFlows;