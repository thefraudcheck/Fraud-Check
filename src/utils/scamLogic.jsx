import paymentFlows from '../data/paymentFlows';

function calculateRisk(answers, flow) {
  let redFlags = [];
  let missedBestPractices = [];
  let bestPractices = [];

  // Analyze each answer against the flow's questions
  answers.forEach((answer, index) => {
    const question = flow[index].question;
    switch (question) {
      // Buying a Vehicle
      case 'Did you find the vehicle on a well-known website?':
        if (answer === 'no') missedBestPractices.push('Vehicle not found on a well-known website.');
        else bestPractices.push('Vehicle found on a well-known website.');
        break;
      case 'Have you seen the vehicle in person?':
        if (answer === 'no') missedBestPractices.push('Vehicle not seen in person.');
        else bestPractices.push('Vehicle seen in person.');
        break;
      case 'Were you asked to pay before viewing or collection?':
        if (answer === 'yes') redFlags.push('Requested payment before viewing or collection.');
        else bestPractices.push('No payment requested before viewing.');
        break;
      case 'Is the seller refusing a phone call?':
        if (answer === 'yes') missedBestPractices.push('Seller refuses phone call.');
        else bestPractices.push('Seller willing to communicate via phone.');
        break;
      case 'Is the vehicle location in a different area than advertised?':
        if (answer === 'yes') missedBestPractices.push('Vehicle location differs from advertised.');
        else if (answer === 'dont-know') missedBestPractices.push('Uncertain if vehicle location matches advertised.');
        else bestPractices.push('Vehicle location matches advertised.');
        break;
      case 'Is the price significantly below market value?':
        if (answer === 'yes') redFlags.push('Price significantly below market value.');
        else bestPractices.push('Price aligns with market value.');
        break;

      // Crypto Payment
      case 'Who asked you to make the payment?':
        if (answer === 'someone-else') redFlags.push('Payment requested by an unknown person.');
        else if (answer === 'bank-service') redFlags.push('Payment requested by an unverified bank/service.');
        else if (answer === 'friend-family') missedBestPractices.push('Payment requested by friend/family—verify independently.');
        else bestPractices.push('Payment requested by FCA-regulated advisor.');
        break;
      case 'Are you being asked to send it to a crypto platform (e.g., Kraken, Coinbase, Binance, Revolut)?':
        if (answer === 'no') missedBestPractices.push('Not using a known crypto platform.');
        else bestPractices.push('Using a known crypto platform.');
        break;
      case 'Can you verify the recipient’s identity?':
        if (answer === 'no') missedBestPractices.push('Recipient identity not verified.');
        else bestPractices.push('Recipient identity verified.');
        break;
      case 'Did they promise quick profits?':
        if (answer === 'yes') redFlags.push('Promised quick profits.');
        else bestPractices.push('No unrealistic profit promises.');
        break;
      case 'Do you fully understand the purpose of the payment?':
        if (answer === 'no') missedBestPractices.push('Purpose of payment unclear.');
        else bestPractices.push('Purpose of payment understood.');
        break;

      // Own Account Transfer
      case 'Did someone instruct you to move the money?':
        if (answer === 'yes') redFlags.push('Instructed by someone to move money.');
        else bestPractices.push('Moved money independently.');
        break;
      case 'Did you open the account yourself?':
        if (answer === 'no') redFlags.push('Account not opened by you.');
        else if (answer === 'dont-know') missedBestPractices.push('Uncertain who opened the account.');
        else bestPractices.push('Account opened by you.');
        break;
      case 'Does anyone else have access to the account?':
        if (answer === 'yes') redFlags.push('Others have access to the account.');
        else if (answer === 'dont-know') missedBestPractices.push('Uncertain if others have account access.');
        else bestPractices.push('Only you have account access.');
        break;
      case 'Have you received unexpected instructions or payment codes?':
        if (answer === 'yes') redFlags.push('Received unexpected instructions or codes.');
        else bestPractices.push('No unexpected instructions received.');
        break;
      case 'Can you view this account online or via an app?':
        if (answer === 'no') missedBestPractices.push('Account not viewable online or via app.');
        else if (answer === 'dont-know') missedBestPractices.push('Uncertain if account is viewable online/app.');
        else bestPractices.push('Account viewable online or via app.');
        break;
      case 'Does anyone else have access to the app?':
        if (answer === 'yes') missedBestPractices.push('Someone else has access to the app.');
        else if (answer === 'dont-know') missedBestPractices.push('Uncertain if others have app access.');
        else bestPractices.push('Only you have access to the app.');
        break;
      case 'Who has access to the app?':
        if (answer === 'third-party-phone') redFlags.push('Third-party on phone has app access.');
        else if (answer === 'someone-else') redFlags.push('Unknown person has app access.');
        else missedBestPractices.push('Friend/family has app access—best practice is sole access.');
        break;

      // Investment
      case 'Were you referred to this investment by someone you met online?':
        if (answer === 'yes') redFlags.push('Referred by someone met online.');
        else bestPractices.push('Found investment independently.');
        break;
      case 'Did they promise guaranteed returns?':
        if (answer === 'yes') redFlags.push('Promised guaranteed returns.');
        else bestPractices.push('No guaranteed returns promised.');
        break;
      case 'Is the company FCA regulated?':
        if (answer === 'no' || answer === 'not-sure') missedBestPractices.push('Company not confirmed FCA regulated.');
        else bestPractices.push('Company FCA regulated.');
        break;
      case 'Is the business registered with Companies House (UK)?':
        if (answer === 'no' || answer === 'not-sure') missedBestPractices.push('Business not confirmed registered with Companies House.');
        else bestPractices.push('Business registered with Companies House.');
        break;
      case 'Is the communication happening via social media or WhatsApp only?':
        if (answer === 'yes') redFlags.push('Communication via social media/WhatsApp only.');
        else bestPractices.push('Communication through verified channels.');
        break;
      case 'Are you being asked to invest immediately to "secure" a deal?':
        if (answer === 'yes') redFlags.push('Pressured to invest immediately.');
        else bestPractices.push('No immediate investment pressure.');
        break;

      // Marketplace
      case 'Is the seller asking for payment outside the platform?':
        if (answer === 'yes') redFlags.push('Payment requested outside the platform.');
        else bestPractices.push('Payment within platform.');
        break;
      case 'Have you seen the item in person?':
        if (answer === 'no') missedBestPractices.push('Item not seen in person.');
        else bestPractices.push('Item seen in person.');
        break;
      case 'Was the seller’s profile recently created or has no reviews?':
        if (answer === 'yes') missedBestPractices.push('Seller profile new or unverified.');
        else bestPractices.push('Seller profile established and reviewed.');
        break;
      case 'Are you being told to collect the item from a random or unverified location?':
        if (answer === 'yes') missedBestPractices.push('Collection from unverified location.');
        else bestPractices.push('Collection from verified location.');
        break;

      // Card Payment
      case 'Did they ask for your card details over the phone?':
        if (answer === 'yes') redFlags.push('Card details requested over phone.');
        else bestPractices.push('Card details not requested over phone.');
        break;
      case 'Is the website secure and starts with HTTPS?':
        if (answer === 'no') missedBestPractices.push('Website not secure (no HTTPS).');
        else bestPractices.push('Website secure with HTTPS.');
        break;
      case 'Are you being redirected to a third-party website to pay?':
        if (answer === 'yes') missedBestPractices.push('Redirected to third-party site—verify legitimacy.');
        else bestPractices.push('Payment on original site.');
        break;
      case 'Is there no customer service or support info available?':
        if (answer === 'yes') missedBestPractices.push('No customer service/support info available.');
        else bestPractices.push('Customer service/support info available.');
        break;

      // Loan or Grant Payment
      case 'How did you find the loan company?':
        if (answer === 'they-approached-me') redFlags.push('Loan company approached you unsolicited.');
        else bestPractices.push('You found the loan company.');
        break;
      case 'Are you being asked to pay an upfront or advance fee before receiving the loan?':
        if (answer === 'yes') redFlags.push('Upfront fee requested before loan.');
        else bestPractices.push('No upfront fee required.');
        break;
      case 'Is the loan company FCA regulated?':
        if (answer === 'no' || answer === 'not-sure') missedBestPractices.push('Loan company not confirmed FCA regulated.');
        else bestPractices.push('Loan company FCA regulated.');
        break;
      case 'Has anyone you know used this company successfully?':
        if (answer === 'no') missedBestPractices.push('No known successful use by others.');
        else bestPractices.push('Known successful use by others.');
        break;
      case 'Can you view the loan account or application online with a secure login?':
        if (answer === 'no') missedBestPractices.push('No secure online loan account access.');
        else bestPractices.push('Secure online loan account access available.');
        break;
      case 'Does the offer seem unusually generous or guaranteed?':
        if (answer === 'yes') redFlags.push('Offer unusually generous or guaranteed.');
        else bestPractices.push('Offer realistic and not guaranteed.');
        break;

      // Job or Work Opportunity
      case 'Did the company contact you first with the job offer?':
        if (answer === 'yes') redFlags.push('Unsolicited job offer.');
        else bestPractices.push('You applied for the job.');
        break;
      case 'Were you asked to pay for training, uniform, or equipment upfront?':
        if (answer === 'yes') redFlags.push('Upfront payment for job requirements.');
        else bestPractices.push('No upfront job costs.');
        break;
      case 'Is the company website or contact information verifiable?':
        if (answer === 'no' || answer === 'not-sure') missedBestPractices.push('Company website/contact not verified.');
        else bestPractices.push('Company website/contact verified.');
        break;
      case 'Does the job sound too good to be true?':
        if (answer === 'yes') redFlags.push('Job sounds too good to be true.');
        else bestPractices.push('Job sounds realistic.');
        break;
      case 'Have you had a proper interview or phone call?':
        if (answer === 'no') missedBestPractices.push('No proper interview conducted.');
        else bestPractices.push('Proper interview conducted.');
        break;

      // Partner or Loved One
      case 'Did you meet this person online or via an app?':
        if (answer === 'yes') redFlags.push('Met online or via app.');
        else bestPractices.push('Met in person.');
        break;
      case 'Have they asked you for money or financial help?':
        if (answer === 'yes') redFlags.push('Requested money or financial help.');
        else bestPractices.push('No financial requests.');
        break;
      case 'Do they avoid video or phone calls?':
        if (answer === 'yes') missedBestPractices.push('Avoids video or phone calls.');
        else bestPractices.push('Willing to video or phone call.');
        break;
      case 'Have they made excuses about not being able to meet?':
        if (answer === 'yes') missedBestPractices.push('Excuses for not meeting.');
        else bestPractices.push('No meeting excuses.');
        break;
      case 'Are they pressuring you emotionally (e.g., urgent need, guilt trips)?':
        if (answer === 'yes') redFlags.push('Emotional pressure applied.');
        else bestPractices.push('No emotional pressure.');
        break;

      // Service Provider
      case 'Did they contact you out of the blue (email, call, popup)?':
        if (answer === 'yes') redFlags.push('Unsolicited contact from provider.');
        else bestPractices.push('You contacted the provider.');
        break;
      case 'Did they ask for remote access to your device?':
        if (answer === 'yes') redFlags.push('Requested remote access to device.');
        else bestPractices.push('No remote access requested.');
        break;
      case 'Did they claim urgent action is needed (e.g., virus, hacking)?':
        if (answer === 'yes') redFlags.push('Claimed urgent action needed.');
        else bestPractices.push('No urgency claimed.');
        break;
      case 'Did they ask for payment via gift cards, crypto, or wire transfer?':
        if (answer === 'yes') redFlags.push('Unusual payment method requested.');
        else bestPractices.push('Standard payment method used.');
        break;
      case 'Can you verify they work for the real company (e.g., Microsoft, BT)?':
        if (answer === 'no' || answer === 'not-sure') missedBestPractices.push('Provider not verified with real company.');
        else bestPractices.push('Provider verified with real company.');
        break;

      // Family Member Request
      case 'Did the message come from a new or unknown number claiming to be family?':
        if (answer === 'yes') redFlags.push('Message from unknown number claiming family.');
        else bestPractices.push('Message from known number.');
        break;
      case 'Are they asking for money urgently due to an “emergency”?':
        if (answer === 'yes') redFlags.push('Urgent money request for emergency.');
        else bestPractices.push('No urgent money request.');
        break;
      case 'Have you called or verified with the person another way?':
        if (answer === 'no') missedBestPractices.push('Identity not verified.');
        else bestPractices.push('Identity verified.');
        break;
      case 'Are they asking you not to tell anyone else?':
        if (answer === 'yes') redFlags.push('Requested secrecy.');
        else bestPractices.push('No secrecy requested.');
        break;
      case 'Do they refuse video or voice confirmation?':
        if (answer === 'yes') missedBestPractices.push('Refuses video/voice confirmation.');
        else bestPractices.push('Allows video/voice confirmation.');
        break;

      // Subscription Renewal
      case 'Did you receive an unexpected renewal or charge alert?':
        if (answer === 'yes') redFlags.push('Unexpected renewal alert.');
        else bestPractices.push('Expected renewal alert.');
        break;
      case 'Does the message include a phone number or link to click?':
        if (answer === 'yes') redFlags.push('Includes unverified phone/link.');
        else bestPractices.push('No unverified phone/link.');
        break;
      case 'Have you verified the charge directly with the official provider?':
        if (answer === 'no') missedBestPractices.push('Charge not verified with provider.');
        else bestPractices.push('Charge verified with provider.');
        break;
      case 'Did they claim your service will stop unless you act now?':
        if (answer === 'yes') redFlags.push('Threatened service stoppage.');
        else bestPractices.push('No service stoppage threat.');
        break;
      case 'Does the link or sender look unusual or not match the provider?':
        if (answer === 'yes') redFlags.push('Suspicious sender/link.');
        else bestPractices.push('Sender/link matches provider.');
        break;

      // QR Code Payment
      case 'Did someone ask you to scan a QR code to pay or claim something?':
        if (answer === 'yes') redFlags.push('Requested QR code scan.');
        else bestPractices.push('Initiated QR scan yourself.');
        break;
      case 'Did the QR code appear in a message or flyer from an unknown sender?':
        if (answer === 'yes') redFlags.push('QR from unknown sender.');
        else bestPractices.push('QR from known source.');
        break;
      case 'Does the QR lead to a site asking for login or card details?':
        if (answer === 'yes') redFlags.push('QR leads to credential request.');
        else bestPractices.push('QR leads to safe site.');
        break;
      case 'Did they pressure you to scan quickly or avoid asking questions?':
        if (answer === 'yes') redFlags.push('Pressured to scan QR quickly.');
        else bestPractices.push('No pressure to scan QR.');
        break;
      case 'Can you verify the source of the QR code?':
        if (answer === 'no' || answer === 'not-sure') missedBestPractices.push('QR source not verified.');
        else bestPractices.push('QR source verified.');
        break;

      // Delivery or Post Office
      case 'Did the message say you missed a parcel or delivery attempt?':
        if (answer === 'yes') redFlags.push('Claimed missed delivery.');
        else bestPractices.push('No missed delivery claim.');
        break;
      case 'Did it include a link to reschedule or pay a fee?':
        if (answer === 'yes') redFlags.push('Link to reschedule/pay fee.');
        else bestPractices.push('No reschedule/pay link.');
        break;
      case 'Does the sender domain or number look suspicious or generic?':
        if (answer === 'yes') redFlags.push('Suspicious sender domain/number.');
        else bestPractices.push('Sender domain/number verified.');
        break;
      case 'Have you checked your tracking via the real courier website?':
        if (answer === 'no') missedBestPractices.push('Tracking not checked with courier.');
        else bestPractices.push('Tracking checked with courier.');
        break;
      case 'Does the site request card or personal info?':
        if (answer === 'yes') redFlags.push('Site requests card/personal info.');
        else bestPractices.push('Site does not request info.');
        break;

      // Building Work
      case 'Is the worker/company verifiable, reviewed, and credible?':
        if (answer === 'no') redFlags.push('Worker/company not verifiable or credible.');
        else if (answer === 'unsure') missedBestPractices.push('Uncertain if worker/company is verifiable.');
        else bestPractices.push('Worker/company verifiable, reviewed, and credible.');
        break;
      case 'Are they asking for full payment on Day 1?':
        if (answer === 'yes') redFlags.push('Full payment requested on Day 1.');
        else bestPractices.push('No full payment on Day 1.');
        break;
      case 'Are you paying them for materials?':
        if (answer === 'yes') missedBestPractices.push('Paying for materials—consider buying yourself.');
        else bestPractices.push('Not paying for materials directly.');
        break;

      // Other
      case 'Were you asked to pay using a method other than card or secure transfer?':
        if (answer === 'yes') redFlags.push('Unusual payment method requested.');
        else bestPractices.push('Standard payment method used.');
        break;
      case 'Did someone pressure you to make this payment quickly?':
        if (answer === 'yes') redFlags.push('Pressured to pay quickly.');
        else bestPractices.push('No payment pressure.');
        break;
      case 'Do you know the person asking for payment?':
        if (answer === 'no') missedBestPractices.push('Payer identity unknown.');
        else bestPractices.push('Payer identity known.');
        break;
      case 'Have you been contacted repeatedly or aggressively?':
        if (answer === 'yes') redFlags.push('Repeated/aggressive contact.');
        else bestPractices.push('No aggressive contact.');
        break;
      case 'Was the payment request unexpected or out of the blue?':
        if (answer === 'yes') redFlags.push('Unexpected payment request.');
        else bestPractices.push('Expected payment request.');
        break;

      default:
        console.warn(`Unhandled question: ${question}`);
        break;
    }
  });

  // Determine risk level with refined logic
  let riskLevel, summary, advice;
  if (redFlags.length > 0) {
    riskLevel = 'High Risk';
    summary = 'This situation shows signs of potential fraud due to red flags.';
    advice = 'Stop immediately and report this to the authorities or your bank.';
  } else if (missedBestPractices.length > 0) {
    riskLevel = 'Neutral Risk';
    summary = 'No red flags detected, but some best practices were missed.';
    advice = 'Proceed with caution and address the missed best practices before continuing.';
  } else {
    riskLevel = 'Low Risk';
    summary = 'This appears safe with all best practices followed.';
    advice = 'You can proceed confidently, but always stay vigilant.';
  }

  // Special case messages
  if (flow === paymentFlows['own-account-transfer']) {
    if (
      answers[0] === 'no' && // Did someone instruct you to move the money?
      answers[1] === 'yes' && // Did you open the account yourself?
      answers[2] === 'no' && // Does anyone else have access to the account?
      answers[3] === 'no' && // Have you received unexpected instructions or payment codes?
      answers[4] === 'yes' && // Can you view this account online or via an app?
      answers[5] === 'no' // Does anyone else have access to the app?
    ) {
      summary = 'If this was set up and accessed solely by you, with no 3rd party contact, it’s likely safe—but always proceed with caution.';
    }
  }
  if (flow === paymentFlows['crypto-payment']) {
    if (
      answers[0] === 'fca-advisor' && // Who asked you to make the payment?
      answers[1] === 'yes' && // Are you being asked to send it to a crypto platform?
      answers[2] === 'yes' // Can you verify the recipient’s identity?
    ) {
      summary = 'Even with FCA-regulated advisors, crypto remains volatile. Always confirm identity and intentions clearly.';
    }
  }

  return {
    riskLevel,
    summary,
    redFlags,
    missedBestPractices,
    bestPractices,
    advice,
  };
}

// Existing checkForScam function unchanged
export const checkForScam = (text) => {
  const lowerText = text.toLowerCase();
  const scamKeywords = [
    'urgent',
    'immediate payment',
    'bank transfer',
    'cryptocurrency',
    'gift card',
    'you won',
    'lottery',
    'inheritance',
    'verify your account',
    'click this link',
  ];

  const foundKeywords = scamKeywords.filter((keyword) => lowerText.includes(keyword));

  if (foundKeywords.length > 0) {
    return {
      isScam: true,
      message: `Detected potential scam indicators: ${foundKeywords.join(', ')}. Be cautious and verify the source.`,
    };
  }

  return {
    isScam: false,
    message: 'No obvious scam indicators detected, but always remain vigilant.',
  };
};

export default calculateRisk;