// src/utils/scamLogic.js
import paymentFlows from '../data/paymentFlows';

function calculateRisk(answers, flow, category) {
  let redFlags = [];
  let missedBestPractices = [];
  let bestPractices = [];
  let patternSuggestions = [];

  // Analyze each answer against the flow's questions
  answers.forEach((answer, index) => {
    const question = flow[index].question;
    if (category === 'other') {
      switch (question) {
        case 'What is this payment for?':
          // No risk assessment for Q1; it's a classifier
          break;
        case 'Did someone ask you to make this payment?':
          if (answer === 'yes') redFlags.push('Payment requested by someone else.');
          else if (answer === 'not-sure') missedBestPractices.push('Uncertain if payment was requested by someone.');
          else bestPractices.push('Payment initiated independently.');
          break;
        case 'Have you been asked to keep this payment secret or not tell your bank the full story?':
          if (answer === 'yes') redFlags.push('Requested to keep payment secret.');
          else bestPractices.push('No secrecy requested.');
          break;
        case 'Have you been told to lie about the reason for the payment?':
          if (answer === 'yes') redFlags.push('Instructed to lie about payment reason.');
          else bestPractices.push('No instructions to lie about payment.');
          break;
        case 'Do you know and trust the person or company you are paying?':
          if (answer === 'no' || answer === 'not-sure') missedBestPractices.push('Recipient not known or trusted.');
          else bestPractices.push('Recipient known and trusted.');
          break;
        case 'Was this payment your idea, without pressure or instructions from anyone?':
          if (answer === 'no') redFlags.push('Payment influenced by external pressure.');
          else if (answer === 'not-sure') missedBestPractices.push('Uncertain if payment was your idea.');
          else bestPractices.push('Payment was your own initiative.');
          break;
        case 'Did you contact them first, or did they contact you?':
          if (answer === 'they-contacted-me') missedBestPractices.push('Recipient initiated contact.');
          else bestPractices.push('You initiated contact.');
          break;
        case 'Have you sent them money before?':
          // Informational, no risk assessment
          break;
        case 'Is this payment emotionally pressured, rushed, or urgent?':
          if (answer === 'yes') missedBestPractices.push('Payment involves emotional pressure or urgency.');
          else bestPractices.push('No emotional pressure or urgency.');
          break;
        case 'Do you understand exactly what the money will be used for?':
          if (answer === 'no' || answer === 'not-sure') missedBestPractices.push('Purpose of payment unclear.');
          else bestPractices.push('Purpose of payment clear.');
          break;
        default:
          console.warn(`Unhandled question in Other flow: ${question}`);
          break;
      }
    } else {
      // Existing logic for other categories
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
        case 'Did someone ask you to scan a QR code to pay?':
          if (answer === 'yes') redFlags.push('Requested to scan QR code for payment.');
          else bestPractices.push('No QR code scan requested.');
          break;
        case 'Did you verify the QR code source (e.g., official website, trusted provider)?':
          if (answer === 'no') missedBestPractices.push('QR code source not verified.');
          else bestPractices.push('QR code source verified.');
          break;
        case 'Does the QR code lead to a secure payment page with HTTPS?':
          if (answer === 'no') missedBestPractices.push('QR code leads to non-secure page.');
          else bestPractices.push('QR code leads to secure page.');
          break;
        case 'Is the payment recipient clearly identified?':
          if (answer === 'no') missedBestPractices.push('Payment recipient not clearly identified.');
          else bestPractices.push('Payment recipient clearly identified.');
          break;

        // Delivery or Post Office
        case 'Did you receive an unexpected delivery fee request?':
          if (answer === 'yes') redFlags.push('Unexpected delivery fee request.');
          else bestPractices.push('Expected delivery fee.');
          break;
        case 'Does the message include a link or QR code to pay?':
          if (answer === 'yes') redFlags.push('Includes unverified link/QR code.');
          else bestPractices.push('No unverified link/QR code.');
          break;
        case 'Have you verified the request with the official delivery company?':
          if (answer === 'no') missedBestPractices.push('Request not verified with delivery company.');
          else bestPractices.push('Request verified with delivery company.');
          break;
        case 'Is the sender’s email or number unusual or not official?':
          if (answer === 'yes') redFlags.push('Suspicious sender email/number.');
          else bestPractices.push('Sender email/number official.');
          break;

        // Building Work
        case 'Did the builder approach you unsolicited (e.g., door knock, flyer)?':
          if (answer === 'yes') redFlags.push('Unsolicited builder contact.');
          else bestPractices.push('You contacted the builder.');
          break;
        case 'Are they asking for full payment upfront?':
          if (answer === 'yes') redFlags.push('Full payment requested upfront.');
          else bestPractices.push('No full upfront payment.');
          break;
        case 'Do they have verifiable reviews or references?':
          if (answer === 'no') missedBestPractices.push('No verifiable reviews/references.');
          else bestPractices.push('Verifiable reviews/references available.');
          break;
        case 'Is there a written contract or agreement?':
          if (answer === 'no') missedBestPractices.push('No written contract.');
          else bestPractices.push('Written contract available.');
          break;

        // Threat or Duress
        case 'Are you being threatened or pressured to make a payment?':
          if (answer === 'yes') redFlags.push('Threatened or pressured to pay.');
          else bestPractices.push('No threats or pressure.');
          break;
        case 'Did they claim you owe money for something unexpected (e.g., tax, fine)?':
          if (answer === 'yes') redFlags.push('Unexpected debt claim.');
          else bestPractices.push('No unexpected debt claim.');
          break;
        case 'Are they asking for payment via unusual methods (e.g., gift cards, crypto)?':
          if (answer === 'yes') redFlags.push('Unusual payment method requested.');
          else bestPractices.push('Standard payment method.');
          break;
        case 'Have you verified the claim with an official source (e.g., HMRC, police)?':
          if (answer === 'no') missedBestPractices.push('Claim not verified with official source.');
          else bestPractices.push('Claim verified with official source.');
          break;
        default:
          console.warn(`Unhandled question in ${category}: ${question}`);
          break;
      }
    }
  });

  // Pattern matching for "Other" category
  if (category === 'other') {
    const q2Answer = answers[1]; // Did someone ask you to make this payment?
    const q3Answer = answers[2]; // Keep payment secret?
    const q4Answer = answers[3]; // Lie about reason?
    const q5Answer = answers[4]; // Know and trust recipient?
    const q7Answer = answers[6]; // Who contacted whom?
    const q9Answer = answers[8]; // Emotionally pressured?

    if (q2Answer === 'yes' && (q3Answer === 'yes' || q4Answer === 'yes') && q9Answer === 'yes') {
      patternSuggestions.push('This sounds like it could involve emotional manipulation or pressure. You may want to check the Threat or Duress scam type.');
    }
    if (q5Answer === 'no' && q7Answer === 'they-contacted-me') {
      patternSuggestions.push('This could be a fake or impersonated business. Review our Service Provider scam advice.');
    }
    // Future AI enhancement placeholder for crypto, romance, tech support, courier detection
  }

  // Determine risk level
  let riskLevel = 'Low Risk';
  let summary = 'Your payment appears to follow best practices and shows no immediate red flags.';
  let advice = 'Continue to follow best practices, such as verifying recipients and using secure payment methods.';

  if (redFlags.length > 0) {
    riskLevel = 'High Risk';
    summary = 'Your payment raises several red flags indicating a potential scam.';
    advice = 'Pause and verify the recipient’s identity and payment purpose with official sources. Contact your bank and report to Action Fraud if suspicious.';
  } else if (missedBestPractices.length > 0) {
    riskLevel = 'Neutral Risk';
    summary = 'Your payment has no immediate red flags but misses some best practices.';
    advice = 'Review the missed best practices and verify the payment details independently before proceeding.';
  }

  return {
    riskLevel,
    summary,
    redFlags,
    missedBestPractices,
    bestPractices,
    advice,
    patternSuggestions,
  };
}

export default calculateRisk;