import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  CreditCardIcon,
  LinkIcon,
  KeyIcon,
  WifiIcon,
  PhoneIcon,
  ComputerDesktopIcon,
  IdentificationIcon,
  EnvelopeIcon,
  ClipboardDocumentCheckIcon,
  BuildingLibraryIcon,
  ShieldExclamationIcon,
  ArrowRightIcon,
  XMarkIcon,
  LockClosedIcon,
  UserIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import fraudCheckerBackground from '../assets/fraud-checker-background.png';
import logo from '../assets/fraud-check-logo.png'; // Use the same import as Header.jsx
import { supabase } from '../utils/supabase.js';
import Header from '../components/Header';

// Icon mappings
const iconOptions = {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  CreditCardIcon,
  LinkIcon,
  KeyIcon,
  WifiIcon,
  PhoneIcon,
  ComputerDesktopIcon,
  IdentificationIcon,
  EnvelopeIcon,
  ClipboardDocumentCheckIcon,
  BuildingLibraryIcon,
  ShieldExclamationIcon,
  LockClosedIcon,
  UserIcon,
};

// Full original content (fallback data)
const initialAdviceData = {
  tipOfTheWeek: {
    title: '🛡️ Tip of the Week',
    text: '<p>Always verify before you trust. Scammers often pretend to be your bank, HMRC, or other trusted providers to create a false sense of urgency. Never act on unexpected messages alone — always use the company’s official website or app to verify what’s real.</p>',
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
  categories: [
    {
      category: 'General Safety Tips',
      tips: [
        {
          title: 'Verify Before You Trust',
          preview: '<p>Fraudsters spoof phone numbers, emails, and logos. Always verify using official contact details from the company’s website.</p>',
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
        {
          title: 'Resist Urgency Tactics',
          preview: '<p>Scammers use phrases like "Act now!" or "Your account is compromised!" to rush you. Pause and assess calmly.</p>',
          icon: 'ExclamationTriangleIcon',
          details: {
            why: '<p>Urgency triggers panic, bypassing rational decision-making and verification steps.</p>',
            examples: [
              'A text claiming "Your parcel delivery failed — pay £2.99 now to reschedule" from a fake courier.',
              'A call alleging "You owe taxes — pay immediately to avoid arrest" from a bogus HMRC agent.',
              'An email saying "Your Netflix account is locked — click here within 24 hours."',
            ],
            whatToDo: [
              'Take a 10-minute break before responding; legitimate entities allow time.',
              'Verify independently via official channels (e.g., call your bank’s listed number).',
              'Report to Action Fraud and your bank if funds are involved.',
            ],
            signs: [
              'Phrases like "Immediate action required" or "Limited time offer."',
              'Pressure to share codes, install apps, or send money quickly.',
              'Threats of legal action or account closure.',
            ],
            protect: [
              'Legitimate organizations rarely demand instant action without prior notice.',
              'Adopt the "Take Five" strategy (stop, think, verify) recommended by UK banks.',
              'Educate yourself on common scam scripts via Action Fraud’s website.',
            ],
          },
        },
        {
          title: 'Never Pay Without Proof',
          preview: '<p>Avoid sending money until you’ve verified the product, service, or recipient’s legitimacy.</p>',
          icon: 'ClipboardDocumentCheckIcon',
          details: {
            why: '<p>Scammers exploit trust in transactions, vanishing after receiving untraceable payments.</p>',
            examples: [
              'A marketplace seller demands a bank transfer for a "limited stock" item, then disappears.',
              'A fake landlord requests a deposit for a rental you haven’t seen in person.',
              'A "charity" solicits donations via crypto with no verifiable details.',
            ],
            whatToDo: [
              'Demand tangible proof (e.g., video call, in-person viewing, official receipts).',
              'Use secure payment methods with buyer protection (e.g., PayPal, credit cards).',
              'Contact your bank immediately if you’ve paid and suspect fraud.',
            ],
            signs: [
              'Refusal to provide verifiable evidence or meet in person.',
              'Insistence on untraceable payments like bank transfers, crypto, or gift cards.',
              'Vague or evasive responses to questions.',
            ],
            protect: [
              'Always inspect high-value items or services before payment.',
              'Consumer Rights Act 2015 (UK) entitles you to goods as described — demand proof.',
              'FCA warns against upfront payments to unverified entities.',
            ],
          },
        },
        {
          title: 'Scrutinize Unexpected Requests',
          preview: '<p>Unsolicited financial demands are suspect. Verify the sender’s identity independently.</p>',
          icon: 'EnvelopeIcon',
          details: {
            why: '<p>Scammers prey on trust or curiosity with out-of-the-blue requests, often impersonating known contacts.</p>',
            examples: [
              'A WhatsApp message from a "friend" claiming they lost their phone and need cash.',
              'An email from a "colleague" asking for urgent payment to a new account.',
              'A romantic online contact begging for travel funds after weeks of chatting.',
            ],
            whatToDo: [
              'Do not respond; contact the person via a known, trusted method (e.g., a verified phone number).',
              'Report to the platform (e.g., WhatsApp, email provider) and Action Fraud.',
              'Notify your bank if you’ve sent money.',
            ],
            signs: [
              'Sudden tone shift from friendly to urgent.',
              'Excuses like "I’m in trouble" or "I can’t call right now."',
              'Requests for secrecy or bypassing normal channels.',
            ],
            protect: [
              'Establish a verbal codeword with close contacts for emergencies.',
              'Banks advise confirming identity via separate, known channels.',
              'Action Fraud reports a rise in impersonation scams — stay vigilant.',
            ],
          },
        },
      ],
    },
    {
      category: 'Online Shopping',
      tips: [
        {
          title: 'Stick to Trusted Platforms',
          preview: '<p>Use marketplaces with buyer protection (e.g., eBay, Amazon, PayPal) and avoid off-platform deals.</p>',
          icon: 'ShoppingCartIcon',
          details: {
            why: '<p>Reputable platforms offer dispute resolution and refunds; direct deals leave you exposed.</p>',
            examples: [
              'A seller on Facebook Marketplace insists on a bank transfer, then blocks you.',
              'A fake Etsy shop requests payment via email and never ships.',
              'A scammer lures you off Amazon with a "better price" via WhatsApp.',
            ],
            whatToDo: [
              'Keep all communication and payments within the platform.',
              'Report suspicious sellers to the platform’s support team.',
              'File a claim with your payment provider if scammed.',
            ],
            signs: [
              'Requests to move to email, text, or private apps.',
              'Unrealistically low prices paired with urgency.',
              'No visible buyer protection policies.',
            ],
            protect: [
              'Leverage platform guarantees (e.g., eBay Money Back Guarantee).',
              'UK Consumer Contracts Regulations 2013 mandate clear refund rights — enforce them.',
              'Trading Standards warns against off-platform transactions.',
            ],
          },
        },
        {
          title: 'Vet Seller Credibility',
          preview: '<p>Avoid sellers with no reviews, recent join dates, or poor feedback. Prioritize established profiles.</p>',
          icon: 'UserIcon',
          details: {
            why: '<p>New or unverified accounts are common scam fronts, lacking accountability.</p>',
            examples: [
              'A Gumtree seller joined yesterday and offers a "cheap iPhone" with no history.',
              'A fake eBay account with zero feedback sells high-end electronics.',
              'A Vinted profile with negative reviews pushes a quick sale.',
            ],
            whatToDo: [
              'Review feedback scores, comments, and account age.',
              'Avoid deals with unverified sellers; report to the platform.',
              'Request a refund via buyer protection if scammed.',
            ],
            signs: [
              'No ratings or a blank profile.',
              'Aggressive sales tactics without proof of legitimacy.',
              'Generic or copied listing descriptions.',
            ],
            protect: [
              'Favor sellers with a consistent positive history (e.g., 95%+ feedback).',
              'Consumer advice suggests checking seller tenure and reviews.',
              'Platforms like eBay flag new accounts — heed the warnings.',
            ],
          },
        },
        {
          title: 'Inspect Before Paying',
          preview: '<p>For high-value items, verify in person or via live video before sending money.</p>',
          icon: 'ClipboardDocumentCheckIcon',
          details: {
            why: '<p>Scammers rely on blind payments, delivering nothing or substandard goods.</p>',
            examples: [
              'A car seller claims to be "abroad" and demands payment without a viewing.',
              'A fake electronics deal uses stock photos and excuses delays.',
              'A puppy scam promises delivery but requires a deposit first.',
            ],
            whatToDo: [
              'Arrange an in-person inspection or live video call.',
              'Refuse payment without clear, current evidence of the item.',
              'Report to the platform and your bank if paid.',
            ],
            signs: [
              'Excuses preventing inspection (e.g., "I’m too busy").',
              'Generic or outdated images instead of real proof.',
              'Pressure to pay before verification.',
            ],
            protect: [
              'Consumer Rights Act 2015 requires goods to match descriptions — insist on proof.',
              'Action Fraud highlights inspection as a key scam deterrent.',
              'Use escrow services for remote high-value purchases.',
            ],
          },
        },
        {
          title: 'Prioritize Protected Payments',
          preview: '<p>Use credit cards, PayPal, or Klarna for refunds — avoid bank transfers or crypto.</p>',
          icon: 'CreditCardIcon',
          details: {
            why: '<p>Protected methods offer chargeback rights; irreversible payments do not.</p>',
            examples: [
              'A scammer demands Bitcoin for a "discount" and disappears.',
              'A fake retailer rejects PayPal, pushing for a wire transfer.',
              'A seller insists on Zelle or Venmo for a "quicker deal."',
            ],
            whatToDo: [
              'Opt for payment methods with buyer protection.',
              'Initiate a chargeback with your provider if scammed.',
              'Report irreversible payments to Action Fraud.',
            ],
            signs: [
              'Refusal to accept secure payment options.',
              'Excuses like "Fees are too high" for PayPal.',
              'Pressure to use untraceable methods.',
            ],
            protect: [
              'Section 75 of the Consumer Credit Act 1974 (UK) covers credit card purchases over £100.',
              'PayPal’s Buyer Protection refunds fraudulent transactions.',
              'Banks and FCA caution against unprotected payments.',
            ],
          },
        },
        {
          title: 'Amazon Basket Scam Defense',
          preview: '<p>Ignore claims of suspicious basket activity. Verify via amazon.co.uk directly.</p>',
          icon: 'ExclamationTriangleIcon',
          details: {
            why: '<p>Scammers impersonate Amazon to steal credentials or funds via fake alerts.</p>',
            examples: [
              'A call claiming "Your basket has a £500 charge — confirm now."',
              'A text with a link to "secure" your Amazon account.',
              'An email alleging "Unusual activity detected" with a login prompt.',
            ],
            whatToDo: [
              'Do not click links; log in via amazon.co.uk manually.',
              'Report to Amazon (reportphishing@amazon.co.uk) and Action Fraud.',
              'Contact your bank if details were compromised.',
            ],
            signs: [
              'Urgent demands about basket or account issues.',
              'Links or numbers not from amazon.co.uk.',
              'Poorly formatted messages with typos.',
            ],
            protect: [
              'Amazon never calls or texts about basket contents unsolicited.',
              'Use Amazon’s official app or site for all account actions.',
              'FCA and Action Fraud note a surge in Amazon impersonation scams.',
            ],
          },
        },
      ],
    },
    {
      category: 'Investment & Financial Scams',
      tips: [
        {
          title: 'Reject "Guaranteed Returns"',
          preview: '<p>Promises of risk-free or rapid profits are fraudulent. All investments carry risk.</p>',
          icon: 'BanknotesIcon',
          details: {
            why: '<p>Guaranteeing returns is impossible due to market volatility; it’s a scammer’s bait.</p>',
            examples: [
              'A Telegram group touts "200% crypto gains in 24 hours" with no risk.',
              'A fake forex trader offers "no-loss" trades via a dodgy app.',
              'An email promises "10% monthly returns" on a "secret fund."',
            ],
            whatToDo: [
              'Do not invest; research via FCA or reputable financial advisors.',
              'Report to the FCA (0800 111 6768) and Action Fraud.',
              'Freeze payments and alert your bank if involved.',
            ],
            signs: [
              'Claims of "guaranteed" or "risk-free" profits.',
              'High returns promised in unrealistically short timeframes.',
              'Pressure to invest without due diligence.',
            ],
            protect: [
              'Only deal with FCA-regulated firms (check fca.org.uk/register).',
              'FCA warns: "If it sounds too good to be true, it is."',
              'Educate yourself on investment risks via MoneyHelper (moneyhelper.org.uk).',
            ],
          },
        },
        {
          title: 'Verify FCA Regulation',
          preview: '<p>UK investment firms must be FCA-authorized. Check the FCA Register before investing.</p>',
          icon: 'BuildingLibraryIcon',
          details: {
            why: '<p>Unregulated entities often operate scams, lacking oversight or accountability.</p>',
            examples: [
              'A fake "gold investment" firm uses a cloned FCA logo.',
              'A scammer emails as a "regulated broker" with no FCA number.',
              'A crypto platform claims "FCA pending" status.',
            ],
            whatToDo: [
              'Validate the firm on the FCA Register (fca.org.uk/register).',
              'Report fakes to the FCA and Action Fraud.',
              'Contact your bank to stop payments if invested.',
            ],
            signs: [
              'No FCA registration number or unverifiable credentials.',
              'Pressure to bypass checks with "trust us" assurances.',
              'Cloned websites mimicking legitimate firms.',
            ],
            protect: [
              'FCA authorization is mandatory for UK financial services — always verify.',
              'Use FCA’s ScamSmart tool (scamsmart.fca.org.uk) to assess risks.',
              'Financial advisors recommend cross-referencing firm details.',
            ],
          },
        },
        {
          title: 'Crypto Payments Are Irreversible',
          preview: '<p>Crypto transactions cannot be undone. Demands for crypto payments are high-risk.</p>',
          icon: 'CreditCardIcon',
          details: {
            why: '<p>Cryptocurrency’s lack of regulation and traceability makes it a scammer’s favorite.</p>',
            examples: [
              'A "broker" insists on Bitcoin for "secure investing" and vanishes.',
              'A fake recovery agent demands crypto fees to "retrieve" lost funds.',
              'An "ICO" promises huge returns but disappears post-payment.',
            ],
            whatToDo: [
              'Refuse to send; verify the recipient independently.',
              'Report to Action Fraud with wallet addresses if possible.',
              'Accept that recovery is unlikely but notify your bank anyway.',
            ],
            signs: [
              'Excuses like "crypto ensures privacy" or "faster processing."',
              'Urgency to buy and send crypto immediately.',
              'No refund or recourse offered.',
            ],
            protect: [
              'Avoid crypto for unsolicited investments or payments.',
              'FCA warns crypto scams rose 40% in 2023 — proceed with caution.',
              'Use regulated exchanges (e.g., Coinbase) for legitimate trades.',
            ],
          },
        },
        {
          title: 'Beware Recovery Scams',
          preview: '<p>Offers to recover lost funds for a fee are often secondary scams targeting victims.</p>',
          icon: 'ShieldExclamationIcon',
          details: {
            why: '<p>Scammers exploit desperation, profiting twice from the same victim.</p>',
            examples: [
              'A "lawyer" cold-calls to reclaim your scam losses for an upfront fee.',
              'An email offers "hacker services" to retrieve crypto for payment.',
              'A fake "FCA agent" demands a deposit to "unlock" frozen funds.',
            ],
            whatToDo: [
              'Ignore and report to Action Fraud (include all correspondence).',
              'Contact police or your bank directly — never pay recovery fees.',
              'Keep evidence (emails, call logs) for authorities.',
            ],
            signs: [
              'Unsolicited offers referencing past scams.',
              'Demands for upfront payment (e.g., crypto, wire transfer).',
              'Vague promises with no verifiable credentials.',
            ],
            protect: [
              'Legitimate recovery is handled free via banks or Action Fraud.',
              'FCA notes recovery scams as a growing threat — verify all offers.',
              'Join fraud victim support groups (e.g., via Action Fraud) for legit help.',
            ],
          },
        },
        {
          title: 'Distrust Social Media Tips',
          preview: '<p>Online "friends" or influencers pushing investments are often scammers or bots.</p>',
          icon: 'LinkIcon',
          details: {
            why: '<p>Social media scams leverage fake trust and FOMO to drive risky investments.</p>',
            examples: [
              'A WhatsApp "mentor" pushes a shady trading platform.',
              'An Instagram influencer flaunts "crypto wins" with a referral link.',
              'A Telegram group offers "insider tips" for a fee.',
            ],
            whatToDo: [
              'Verify the person’s identity independently; do not invest.',
              'Report to the platform and Action Fraud.',
              'Consult a regulated financial advisor instead.',
            ],
            signs: [
              'Friendly chats pivot to financial pitches.',
              'Links to unverified platforms or apps.',
              'Exaggerated success stories with no proof.',
            ],
            protect: [
              'Research investments via FCA-approved sources only.',
              'FCA warns social media scams cost UK victims £63m in 2022.',
              'Block and report suspicious accounts immediately.',
            ],
          },
        },
      ],
    },
    {
      category: 'Protecting Your Online Presence',
      tips: [
        {
          title: 'Secure Passwords Are Essential',
          preview: '<p>Use strong, unique passwords for every account, managed by a password manager.</p>',
          icon: 'LockClosedIcon',
          details: {
            why: '<p>Weak or reused passwords are the leading cause of account breaches, enabling cascading attacks.</p>',
            examples: [
              'A hacker uses a leaked "password123" from a gaming site to access your bank.',
              'A scammer brute-forces "Summer2023" across your accounts.',
              'A phishing site captures a reused email password.',
            ],
            whatToDo: [
              'Generate passwords with 16+ characters, mixing letters, numbers, and symbols.',
              'Use a password manager (e.g., LastPass, 1Password).',
              'Update compromised accounts and enable 2FA.',
            ],
            signs: [
              'Unusual login alerts from unfamiliar devices.',
              'Password reset emails you didn’t request.',
              'Account lockouts or odd activity.',
            ],
            protect: [
              'Never reuse passwords — each account needs a unique key.',
              'NCSC (UK) recommends password managers for security.',
              'Test password strength with tools like Have I Been Pwned.',
            ],
          },
        },
        {
          title: 'Enable Two-Factor Authentication (2FA)',
          preview: '<p>2FA blocks unauthorized access even if your password is compromised.</p>',
          icon: 'KeyIcon',
          details: {
            why: '<p>A second verification step (e.g., app code, biometric) thwarts password-only attacks.</p>',
            examples: [
              'A hacker with your email password fails 2FA via your phone.',
              'A scammer can’t access your bank without your authenticator app.',
              'A phishing attempt is stopped by a fingerprint check.',
            ],
            whatToDo: [
              'Activate 2FA on email, banking, and social media accounts.',
              'Prefer app-based 2FA (e.g., Google Authenticator) over SMS.',
              'Store backup codes securely if locked out.',
            ],
            signs: [
              'Unexpected 2FA prompts or code requests.',
              'Delayed or missing 2FA codes.',
              'Account access attempts flagged by providers.',
            ],
            protect: [
              'Prioritize 2FA on high-value accounts (email, finance).',
              'NCSC reports 2FA reduces breach risk by 99% — enable it everywhere.',
              'Avoid SMS 2FA if possible due to SIM swap risks.',
            ],
          },
        },
        {
          title: 'Avoid Suspicious Links',
          preview: '<p>Phishing links steal credentials or install malware. Type URLs manually or use bookmarks.</p>',
          icon: 'LinkIcon',
          details: {
            why: '<p>Clicking malicious links is a primary vector for data theft and device compromise.</p>',
            examples: [
              'A text from "DHL" with a fake tracking link logs your bank details.',
              'An email from "PayPal" directs to a spoofed login page.',
              'A "security alert" link installs ransomware on your device.',
            ],
            whatToDo: [
              'Navigate to sites directly (e.g., paypal.com).',
              'Report phishing to providers (e.g., report@phishing.gov.uk) and Action Fraud.',
              'Run antivirus scans if clicked (e.g., Malwarebytes).',
            ],
            signs: [
              'Slightly altered URLs (e.g., "paypa1.com").',
              'Urgent demands for logins or codes.',
              'Hovering reveals a different destination.',
            ],
            protect: [
              'Bookmark key sites or use trusted apps.',
              'NCSC’s Active Cyber Defence blocks 7m phishing attempts yearly — report all.',
              'Enable browser anti-phishing filters (e.g., Chrome Safe Browsing).',
            ],
          },
        },
        {
          title: 'Secure Public Wi-Fi Use',
          preview: '<p>Avoid sensitive logins on public Wi-Fi without a VPN — it’s a hacker’s playground.</p>',
          icon: 'WifiIcon',
          details: {
            why: '<p>Unencrypted public networks allow data interception, exposing logins and transactions.</p>',
            examples: [
              'A café Wi-Fi hacker captures your bank login.',
              'A fake "Free_Airport_WiFi" hotspot steals your email password.',
              'A scammer on hotel Wi-Fi intercepts your PayPal session.',
            ],
            whatToDo: [
              'Switch to mobile data for sensitive tasks.',
              'Use a reputable VPN (e.g., NordVPN, ExpressVPN) if Wi-Fi is necessary.',
              'Change passwords and monitor accounts if exposed.',
            ],
            signs: [
              'No password required for Wi-Fi access.',
              'Slow connections or unexpected redirects.',
              'Unsecured (HTTP) sites on public networks.',
            ],
            protect: [
              'VPNs encrypt your traffic, thwarting interception.',
              'NCSC advises against banking on public Wi-Fi without protection.',
              'Check for HTTPS on all sites (lock icon in browser).',
            ],
          },
        },
      ],
    },
    {
      category: 'Identity Theft Prevention',
      tips: [
        {
          title: 'Respond to Suspected ID Theft',
          preview: '<p>Act immediately if you suspect identity theft to minimize damage.</p>',
          icon: 'IdentificationIcon',
          details: {
            why: '<p>Swift action limits fraudulent use of your identity and aids recovery efforts.</p>',
            examples: [
              'A scammer opens a £10,000 loan using your stolen mail.',
              'A fake HMRC refund form submits your National Insurance number.',
              'A new phone contract appears on your credit report.',
            ],
            whatToDo: [
              'Freeze all bank accounts and cards via phone or app.',
              'Check credit reports (Experian, Equifax, TransUnion) for anomalies.',
              'Report to Action Fraud and register with CIFAS (cifas.org.uk).',
            ],
            signs: [
              'Unrecognized transactions or accounts.',
              'Mail redirection or missing statements.',
              'Debt collector calls for unknown debts.',
            ],
            protect: [
              'Enable 2FA and credit monitoring (e.g., Credit Karma).',
              'CIFAS Protective Registration flags your identity for extra checks.',
              'Action Fraud’s victim support can guide recovery.',
            ],
          },
        },
        {
          title: 'Monitor Credit Regularly',
          preview: '<p>Check your credit report monthly for unauthorized activity.</p>',
          icon: 'ShieldCheckIcon',
          details: {
            why: '<p>Early detection stops identity theft from spiraling into major financial loss.</p>',
            examples: [
              'A scammer applies for three credit cards in your name.',
              'A fake utility account appears on your Experian report.',
              'A sudden credit score drop flags hidden fraud.',
            ],
            whatToDo: [
              'Use free services (e.g., ClearScore, MSE Credit Club).',
              'Dispute unrecognized entries with credit agencies.',
              'Notify your bank and Action Fraud of suspicious activity.',
            ],
            signs: [
              'Hard inquiries you didn’t initiate.',
              'Accounts or addresses you don’t recognize.',
              'Unexpected credit limit changes.',
            ],
            protect: [
              'Statutory credit reports are free in the UK — check yearly.',
              'Set up alerts for credit changes (offered by most agencies).',
              'FCA advises regular monitoring as a fraud shield.',
            ],
          },
        },
        {
          title: 'Report to Authorities',
          preview: '<p>File reports with Action Fraud and CIFAS to document and protect against ID theft.</p>',
          icon: 'ExclamationTriangleIcon',
          details: {
            why: '<p>Reporting creates a legal record and triggers protective measures across institutions.</p>',
            examples: [
              'A scammer uses your ID for a £500 phone contract.',
              'A fake passport application is linked to your details.',
              'A fraudulent bank account appears in your name.',
            ],
            whatToDo: [
              'Submit a report to Action Fraud online or call 0300 123 2040.',
              'Apply for CIFAS Protective Registration (£25, 2 years).',
              'Update passwords, enable 2FA, and notify affected providers.',
            ],
            signs: [
              'Unexpected debt collector contact.',
              'Unfamiliar account alerts or statements.',
              'Credit report anomalies.',
            ],
            protect: [
              'CIFAS flags your identity, requiring extra bank verification.',
              'Action Fraud shares data with the National Fraud Intelligence Bureau.',
              'Keep all correspondence as evidence.',
            ],
          },
        },
        {
          title: 'Shred Sensitive Documents',
          preview: '<p>Destroy personal paperwork to prevent thieves from harvesting your details.</p>',
          icon: 'LockClosedIcon',
          details: {
            why: '<p>Discarded documents provide scammers with data for impersonation or fraud.</p>',
            examples: [
              'A bin-diver finds a bank statement with your account number.',
              'A scammer uses a tossed utility bill to open accounts.',
              'A discarded prescription reveals medical data for blackmail.',
            ],
            whatToDo: [
              'Shred bills, statements, and IDs with a cross-cut shredder.',
              'Report stolen mail to your bank and Royal Mail.',
              'Monitor accounts for unusual activity post-theft.',
            ],
            signs: [
              'Missing regular mail (e.g., bank statements).',
              'Suspicious activity near your bins.',
              'Unexpected account alerts after disposal.',
            ],
            protect: [
              'Shred anything with personal info (name, address, account numbers).',
              'Royal Mail offers mail redirection if theft is suspected.',
              'NCSC recommends physical security alongside digital.',
            ],
          },
        },
      ],
    },
    {
      category: 'Bank Account Security',
      tips: [
        {
          title: 'Guard Against SIM Swap Attacks',
          preview: '<p>Scammers may hijack your phone number to bypass 2FA — secure your SIM.</p>',
          icon: 'PhoneIcon',
          details: {
            why: '<p>SIM swaps grant scammers access to SMS 2FA codes, unlocking your accounts.</p>',
            examples: [
              'A hacker impersonates you to your provider, rerouting your number.',
              'Your phone loses signal, and £5,000 is withdrawn from your bank.',
              'A scammer uses your number to reset your email password.',
            ],
            whatToDo: [
              'Contact your provider immediately if signal drops (e.g., EE: 150).',
              'Set a SIM PIN or account password with your carrier.',
              'Alert your bank and switch to app-based 2FA.',
            ],
            signs: [
              'Sudden "No Service" on your phone.',
              'Unexpected 2FA prompts or bank alerts.',
              'Inability to send/receive calls or texts.',
            ],
            protect: [
              'Add a security PIN/password to your mobile account.',
              'NCSC reports SIM swaps as a top banking threat — act fast.',
              'Use authenticator apps (e.g., Authy) over SMS.',
            ],
          },
        },
        {
          title: 'Reject Remote Access Requests',
          preview: '<p>Never install remote access apps for unsolicited "help" — it’s a scam tactic.</p>',
          icon: 'ComputerDesktopIcon',
          details: {
            why: '<p>Remote access (e.g., TeamViewer, AnyDesk) gives scammers full control over your device and funds.</p>',
            examples: [
              'A "tech support" call installs TeamViewer to "fix" your PC, then steals funds.',
              'A fake bank rep uses AnyDesk to "secure" your account, draining it.',
              'A scammer watches your screen to capture banking logins.',
            ],
            whatToDo: [
              'Disconnect internet and uninstall the app immediately.',
              'Alert your bank and change all passwords.',
              'Run antivirus scans (e.g., Kaspersky, Bitdefender).',
            ],
            signs: [
              'Unsolicited requests to install remote software.',
              'Claims of "urgent fixes" or "security checks."',
              'Unusual device activity post-installation.',
            ],
            protect: [
              'Only install software from verified sources you’ve initiated.',
              'UK banks confirm they never request remote access.',
              'NCSC advises immediate disconnection if compromised.',
            ],
          },
        },
        {
          title: 'Detect Impersonation Scams',
          preview: '<p>Banks or police never ask you to move money to a "safe account" — it’s a scam.</p>',
          icon: 'UserIcon',
          details: {
            why: '<p>Impersonators exploit authority to trick you into transferring funds to them.</p>',
            examples: [
              'A "bank" call says "Move £2,000 to protect it from fraud."',
              'A fake police officer demands payment for a "fine" or "investigation."',
              'A "FCA rep" requests funds to "verify your account."',
            ],
            whatToDo: [
              'Hang up and call your bank’s official number (from their website).',
              'Report to Action Fraud with call details.',
              'Never transfer money based on unsolicited requests.',
            ],
            signs: [
              'Instructions to send money to a new account.',
              'Official-sounding jargon with urgent tones.',
              'Caller ID spoofing a trusted number.',
            ],
            protect: [
              'Banks never request fund transfers for security — it’s a red flag.',
              'Use the 159 hotline to verify bank calls in the UK.',
              'Action Fraud notes a 30% rise in impersonation scams.',
            ],
          },
        },
        {
          title: 'Combat Phishing & Spoofing',
          preview: '<p>Fake messages mimic legit sources to steal data — verify before acting.</p>',
          icon: 'LinkIcon',
          details: {
            why: '<p>Phishing and spoofing deliver malware or harvest credentials via deception.</p>',
            examples: [
              'A "DHL" text with a fake link logs your bank details.',
              'A spoofed "Barclays" email directs to a phishing site.',
              'A call from a "known" number demands your OTP.',
            ],
            whatToDo: [
              'Avoid clicking; visit the official site manually.',
              'Report to report@phishing.gov.uk and Action Fraud.',
              'Scan your device if you’ve interacted (e.g., Windows Defender).',
            ],
            signs: [
              'Subtle URL errors (e.g., "barclayz.com").',
              'Urgent requests for codes or logins.',
              'Spoofed caller IDs or email headers.',
            ],
            protect: [
              'Use email filters and browser anti-phishing tools.',
              'NCSC’s Suspicious Email Reporting Service catches 1m+ scams monthly.',
              'Train yourself to spot phishing via Action Fraud resources.',
            ],
          },
        },
        {
          title: 'Prevent Account Takeover',
          preview: '<p>Weak or reused passwords invite takeovers — strengthen your defenses.</p>',
          icon: 'KeyIcon',
          details: {
            why: '<p>A single breach can unlock multiple accounts if passwords are duplicated.</p>',
            examples: [
              'A hacker uses a leaked LinkedIn password to access your bank.',
              'A scammer guesses "Password1" on your email and PayPal.',
              'A phishing site reuses your credentials across platforms.',
            ],
            whatToDo: [
              'Switch to unique, complex passwords (e.g., via Bitwarden).',
              'Enable 2FA on all accounts.',
              'Monitor for breaches on Have I Been Pwned.',
            ],
            signs: [
              'Logins from unknown locations.',
              'Unexpected password reset notifications.',
              'Account settings altered without consent.',
            ],
            protect: [
              'One password per account — no exceptions.',
              'NCSC reports 80% of breaches involve weak passwords.',
              'Banks recommend regular password audits.',
            ],
          },
        },
      ],
    },
    {
      category: 'What To Do If…',
      tips: [
        {
          title: 'You’ve Been Scammed',
          preview: '<p>Act fast to report and mitigate damage if you’ve been defrauded.</p>',
          icon: 'ExclamationTriangleIcon',
          details: {
            why: '<p>Immediate action increases recovery chances and prevents further exploitation.</p>',
            examples: [
              'A fake delivery scam extracts £200 via a phishing link.',
              'A romance scammer convinces you to send £1,000 over months.',
              'A marketplace deal takes your bank transfer and vanishes.',
            ],
            whatToDo: [
              'Contact your bank within 24 hours to freeze funds or initiate a chargeback.',
              'Report to Action Fraud online or call 0300 123 2040 with all evidence.',
              'Change passwords and enable 2FA on affected accounts.',
            ],
            signs: [
              'Missing funds or unauthorized charges.',
              'Realization post-payment (e.g., no delivery).',
              'Scammer cuts contact after receiving money.',
            ],
            protect: [
              'Keep screenshots, emails, and receipts as evidence.',
              'UK banks’ Contingent Reimbursement Model may refund authorized push payment fraud.',
              'Join Action Fraud’s victim support network.',
            ],
          },
        },
        {
          title: 'You Sent Crypto or Gift Cards',
          preview: '<p>Recovery is unlikely — document and report immediately.</p>',
          icon: 'CreditCardIcon',
          details: {
            why: '<p>Crypto and gift cards are untraceable and irreversible, making them scam favorites.</p>',
            examples: [
              'A "tech support" scam demands £500 in Bitcoin to "fix" your PC.',
              'A fake IRS call insists on $300 in iTunes gift cards for "tax debts."',
              'A "family emergency" WhatsApp scam requests Ethereum.',
            ],
            whatToDo: [
              'Gather transaction details (e.g., wallet address, gift card codes).',
              'Report to Action Fraud with all evidence.',
              'Notify the crypto platform or gift card issuer, though recovery is rare.',
            ],
            signs: [
              'Payment demanded in crypto or gift cards.',
              'Urgency paired with excuses for unusual payment methods.',
              'Scammer disappears post-transaction.',
            ],
            protect: [
              'Legitimate entities never request crypto or gift card payments.',
              'FCA notes crypto scams often target older victims — educate family.',
              'Keep records of all scam interactions for reporting.',
            ],
          },
        },
        {
          title: 'You Shared Bank Details',
          preview: '<p>Secure your accounts immediately if you’ve shared sensitive financial info.</p>',
          icon: 'BanknotesIcon',
          details: {
            why: '<p>Bank details allow scammers to drain accounts or commit fraud in your name.</p>',
            examples: [
              'A phishing email captures your card number and CVV.',
              'A fake "refund" call extracts your bank login credentials.',
              'A scammer uses your details for unauthorized wire transfers.',
            ],
            whatToDo: [
              'Contact your bank immediately to freeze accounts and cards.',
              'Change online banking passwords and enable 2FA.',
              'Monitor statements and report to Action Fraud.',
            ],
            signs: [
              'Unexpected transactions or alerts.',
              'Calls or emails requesting confirmation of shared details.',
              'Account lockouts or unusual activity.',
            ],
            protect: [
              'Use fraud alerts with your bank for real-time monitoring.',
              'Section 75 (Consumer Credit Act 1974) may cover credit card fraud.',
              'Banks like Barclays offer free fraud detection services.',
            ],
          },
        },
        {
          title: 'You Suspect a Scam Call',
          preview: '<p>Hang up and verify independently — scammers often spoof legitimate numbers.</p>',
          icon: 'PhoneIcon',
          details: {
            why: '<p>Caller ID spoofing tricks you into trusting fraudulent calls, leading to data or financial loss.</p>',
            examples: [
              'A "HMRC" call threatens arrest unless you pay a fine.',
              'A "bank" call requests your OTP to "secure" your account.',
              'A "police" call demands payment for a fake investigation.',
            ],
            whatToDo: [
              'Hang up immediately; do not engage.',
              'Call the organization back using an official number (e.g., from their website).',
              'Report to Action Fraud and your phone provider.',
            ],
            signs: [
              'Caller ID matches a trusted entity but the request is unusual.',
              'Pressure to share personal or financial info.',
              'Threats or urgency tactics.',
            ],
            protect: [
              'Use call-blocking apps (e.g., Truecaller) to filter scams.',
              'The 159 hotline connects you to UK banks for verification.',
              'Action Fraud notes spoofed calls as a top scam method.',
            ],
          },
        },
        {
          title: 'You Clicked a Suspicious Link',
          preview: '<p>Disconnect, scan, and secure your device if you’ve interacted with a phishing link.</p>',
          icon: 'LinkIcon',
          details: {
            why: '<p>Malicious links can install malware, steal credentials, or lock your device for ransom.</p>',
            examples: [
              'A "delivery" link downloads ransomware locking your files.',
              'A fake "PayPal" login page captures your credentials.',
              'A "security alert" link installs a keylogger.',
            ],
            whatToDo: [
              'Disconnect from the internet immediately.',
              'Run a full antivirus scan (e.g., Malwarebytes, Norton).',
              'Change passwords from a clean device and report to Action Fraud.',
            ],
            signs: [
              'Device slowdown or unusual pop-ups.',
              'Unexpected login alerts or account changes.',
              'Redirects to unfamiliar sites.',
            ],
            protect: [
              'Keep antivirus software updated (e.g., Windows Defender).',
              'NCSC advises isolating devices post-click — act fast.',
              'Use browser security extensions (e.g., uBlock Origin).',
            ],
          },
        },
      ],
    },
  ],
  tipArchive: [],
};

// Function to render icons dynamically
const renderIcon = (iconName, className = 'w-6 h-6 text-cyan-700') => {
  const Icon = iconOptions[iconName] || ShieldCheckIcon;
  return <Icon className={className} />;
};

// Validate fetched data structure
const validateData = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (!data.tipOfTheWeek || !data.categories) return false;
  if (!Array.isArray(data.categories)) return false;
  return data.categories.every(
    (cat) =>
      cat &&
      typeof cat === 'object' &&
      typeof cat.category === 'string' &&
      Array.isArray(cat.tips) &&
      cat.tips.every(
        (tip) =>
          tip &&
          typeof tip === 'object' &&
          typeof tip.title === 'string' &&
          typeof tip.preview === 'string' &&
          typeof tip.icon === 'string' &&
          tip.details &&
          typeof tip.details.why === 'string' &&
          Array.isArray(tip.details.examples) &&
          Array.isArray(tip.details.whatToDo) &&
          Array.isArray(tip.details.signs) &&
          Array.isArray(tip.details.protect)
      )
  );
};

function Advice() {
  const [categories, setCategories] = useState([]);
  const [tipOfTheWeek, setTipOfTheWeek] = useState({});
  const [selectedTip, setSelectedTip] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Step 1: Fetch data directly from help_advice
        let { data: fetchedData, error: fetchError } = await supabase
          .from('help_advice')
          .select('data')
          .eq('id', 1)
          .maybeSingle();

        if (fetchError) {
          console.error('Supabase Fetch Error:', {
            code: fetchError.code,
            message: fetchError.message,
            details: fetchError.details,
            hint: fetchError.hint,
          });
          throw new Error(`Supabase fetch failed: ${fetchError.message}. Check if the table exists, RLS policies are set, and the row with id=1 is present.`);
        }

        // Step 2: Handle no data (insert if missing)
        if (!fetchedData) {
          console.log('No data found in help_advice, attempting to insert initial data...');
          const { error: insertError } = await supabase
            .from('help_advice')
            .insert([{ id: 1, data: initialAdviceData }]);

          if (insertError) {
            console.error('Supabase Insert Error:', {
              code: insertError.code,
              message: insertError.message,
              details: insertError.details,
              hint: insertError.hint,
            });
            throw new Error(`Failed to insert initial data: ${insertError.message}. Ensure anon role has INSERT permissions.`);
          }

          // Retry fetching after insert
          const { data: retryData, error: retryError } = await supabase
            .from('help_advice')
            .select('data')
            .eq('id', 1)
            .maybeSingle();

          if (retryError) {
            console.error('Supabase Retry Error:', {
              code: retryError.code,
              message: retryError.message,
              details: retryError.details,
              hint: retryError.hint,
            });
            throw new Error(`Failed to fetch after insertion: ${retryError.message}.`);
          }

          fetchedData = retryData;
        }

        // Step 3: Process fetched data
        if (fetchedData && fetchedData.data) {
          const validData = validateData(fetchedData.data) ? fetchedData.data : initialAdviceData;
          console.log('Data fetched successfully from Supabase:', validData);
          setCategories(validData.categories);
          setTipOfTheWeek(validData.tipOfTheWeek);
        } else {
          throw new Error('No valid data returned from Supabase after fetch/insert.');
        }
      } catch (err) {
        console.error('Supabase Error:', err);
        setError(`Failed to load content from Supabase: ${err.message}. Using default data as fallback.`);
        setCategories(initialAdviceData.categories);
        setTipOfTheWeek(initialAdviceData.tipOfTheWeek);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleCategory = (categoryIdx) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryIdx]: !prev[categoryIdx],
    }));
  };

  const openTipModal = (tip) => {
    setSelectedTip(tip);
    document.body.style.overflow = 'hidden';
  };

  const closeTipModal = () => {
    setSelectedTip(null);
    document.body.style.overflow = 'auto';
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (searchRef.current) searchRef.current.focus();
  };

  // Filter categories and tips based on search query
  const filteredCategories = categories
    .filter((cat) => cat && typeof cat === 'object' && Array.isArray(cat.tips))
    .map((cat) => ({
      ...cat,
      tips: cat.tips.filter(
        (tip) =>
          tip &&
          (tip.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tip.preview?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (tip.details?.why && tip.details.why.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (tip.details?.examples &&
              tip.details.examples.some((example) => example?.toLowerCase().includes(searchQuery.toLowerCase()))) ||
            (tip.details?.whatToDo &&
              tip.details.whatToDo.some((action) => action?.toLowerCase().includes(searchQuery.toLowerCase()))) ||
            (tip.details?.signs &&
              tip.details.signs.some((sign) => sign?.toLowerCase().includes(searchQuery.toLowerCase()))) ||
            (tip.details?.protect &&
              tip.details.protect.some((protection) => protection?.toLowerCase().includes(searchQuery.toLowerCase()))))
      ),
    }))
    .filter((cat) => cat.tips.length > 0 || cat.category.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <svg className="animate-spin h-8 w-8 text-cyan-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100">
      <Header />

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 bg-gradient-to-b from-[#e6f9fd] to-[#c8edf6] dark:bg-slate-900"
        style={{
          backgroundImage: `url(${fraudCheckerBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          textSizeAdjust: '100%',
        }}
      >
        <style>
          {`
            @keyframes fadeIn {
              0% { opacity: 0; transform: translateY(8px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            @keyframes glowPulse {
              0% { box-shadow: 0 0 10px rgba(14, 165, 233, 0.3); }
              50% { box-shadow: 0 0 20px rgba(14, 165, 233, 0.5); }
              100% { box-shadow: 0 0 10px rgba(14, 165, 233, 0.3); }
            }
            @keyframes modalIn {
              0% { transform: scale(0.95); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
            .animate-glowPulse { animation: glowPulse 2s infinite; }
            .animate-modalIn { animation: modalIn 0.3s ease-out forwards; }
            .tip-card {
              position: relative;
              background: #0f1f3a;
              border-radius: 1.5rem;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
            }
            .tip-card::before {
              content: '';
              position: absolute;
              inset: 0;
              background: radial-gradient(circle at center, rgba(14,165,233,0.1) 0%, rgba(14,165,233,0) 70%);
              z-index: 0;
              pointer-events: none;
            }
            .card-hover:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 30px rgba(14, 165, 233, 0.2);
              border-color: #0ea5e9;
              transition: all 0.2s ease-in-out;
            }
            .scrollbar-thin::-webkit-scrollbar { width: 6px; }
            .scrollbar-thin::-webkit-scrollbar-track { background: #e5e7eb; }
            .scrollbar-thin::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 3px; }
            .search-bar:hover {
              border-color: #0ea5e9;
              box-shadow: 0 0 8px rgba(14, 165, 233, 0.3);
            }
            .modal-glow {
              position: relative;
              background: linear-gradient(145deg, #ffffff, #f0f9ff);
              box-shadow: 0 0 20px rgba(14, 165, 233, 0.2);
            }
            .modal-glow::before {
              content: '';
              position: absolute;
              inset: 0;
              background: radial-gradient(circle at top left, rgba(14,165,233,0.1) 0%, rgba(14,165,233,0) 70%);
              z-index: -1;
              border-radius: 1.5rem;
            }
            .font-inter {
              font-family: 'Inter', sans-serif;
              -moz-tab-size: 4;
              tab-size: 4;
            }
          `}
        </style>

        <section className="text-center animate-fadeIn">
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Fraud Check Logo"
              className="h-32 md:h-40 max-h-32 md:max-h-40 mx-auto mb-0 object-contain"
              onError={() => console.error('Failed to load logo in Advice main section')}
            />
          </div>
          <div className="-mt-6">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white font-inter flex items-center justify-center gap-3">
              <ShieldCheckIcon className="w-8 h-8 text-cyan-700" aria-hidden="true" />
              Help & Advice
            </h2>
          </div>
          <p className="mt-4 text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto font-weight-400 leading-relaxed font-inter">
            Stay one step ahead of fraudsters with our expert guidance. Learn how to spot scams, protect your accounts, and recover if something goes wrong.
          </p>
          <div className="mt-4 flex justify-center">
            <div className="relative w-full max-w-3xl">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for scam types, safety tips, or what to do if…"
                className="w-full pl-12 pr-10 py-3 text-base rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-inter search-bar transition-all duration-200 text-gray-900 placeholder-gray-500"
                aria-label="Search scam advice"
                id="search-advice"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label="Clear search"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            <span>{error}</span>
          </div>
        )}

        {tipOfTheWeek.title && (
          <section className="mt-8 tip-card animate-fadeIn">
            <div className="relative z-10 p-6">
              <span className="absolute top-4 left-4 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white text-xs font-semibold px-2 py-1 rounded-full font-inter">
                Featured
              </span>
              <h2 className="text-2xl font-bold text-white mt-8 font-inter">
                {tipOfTheWeek.title}
              </h2>
              <div className="prose text-gray-300 mt-2 mb-4 italic font-weight-400 leading-relaxed font-inter">
                <div dangerouslySetInnerHTML={{ __html: tipOfTheWeek.text || '' }} />
              </div>
              <button
                onClick={() => openTipModal(tipOfTheWeek)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-500 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-inter"
              >
                Learn More <ArrowRightIcon className="w-4 h-4 ml-2" />
              </button>
            </div>
          </section>
        )}

        <section className="mt-8">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, idx) => (
              <div key={idx} className="mb-8 animate-fadeIn">
                <h3 className="text-2xl font-semibold text-[#002E5D] dark:text-white mb-4 font-inter">
                  {category.category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {(expandedCategories[idx] ? category.tips : category.tips.slice(0, 3)).map((tip, tipIdx) => (
                    <button
                      key={tipIdx}
                      onClick={() => openTipModal(tip)}
                      className="relative bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl shadow-[0_6px_16px_rgba(0,0,0,0.05)] p-6 flex items-start gap-4 border border-gray-200 dark:border-slate-700 card-hover transition-all duration-200 text-left"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-3xl pointer-events-none"></div>
                      {renderIcon(tip.icon, 'w-6 h-6 text-cyan-700')}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 font-inter">
                          {tip.title}
                        </h4>
                        <div className="prose text-sm text-gray-600 dark:text-slate-300 font-weight-400 leading-relaxed font-inter">
                          <div dangerouslySetInnerHTML={{ __html: tip.preview || '' }} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {category.tips.length > 3 && (
                  <button
                    onClick={() => toggleCategory(idx)}
                    className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-500 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-inter"
                  >
                    {expandedCategories[idx] ? 'Show Less' : 'See All Tips'} <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 dark:text-slate-300 text-base font-inter animate-fadeIn">
              No results found. Try a different search term.
            </p>
          )}
        </section>

        {selectedTip && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="modal-glow dark:bg-slate-800 rounded-3xl p-8 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto animate-modalIn scrollbar-thin">
              <button
                onClick={closeTipModal}
                className="absolute top-4 right-4 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                aria-label="Close modal"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3 mb-6">
                {renderIcon(selectedTip.icon, 'w-8 h-8 text-cyan-700')}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-inter">{selectedTip.title}</h3>
              </div>
              <div className="prose text-gray-600 dark:text-slate-300 font-weight-400 leading-relaxed font-inter">
                <div dangerouslySetInnerHTML={{ __html: selectedTip.preview || '' }} />
                {selectedTip.details && (
                  <>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6">Why It Matters</h4>
                    <div dangerouslySetInnerHTML={{ __html: selectedTip.details.why || '' }} />
                    {selectedTip.details.examples && selectedTip.details.examples.length > 0 && (
                      <>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6">Examples</h4>
                        <ul className="list-disc pl-5">
                          {selectedTip.details.examples.map((example, i) => (
                            <li key={i} className="mb-2">{example}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {selectedTip.details.whatToDo && selectedTip.details.whatToDo.length > 0 && (
                      <>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6">What To Do</h4>
                        <ul className="list-disc pl-5">
                          {selectedTip.details.whatToDo.map((action, i) => (
                            <li key={i} className="mb-2">{action}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {selectedTip.details.signs && selectedTip.details.signs.length > 0 && (
                      <>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6">Signs to Watch For</h4>
                        <ul className="list-disc pl-5">
                          {selectedTip.details.signs.map((sign, i) => (
                            <li key={i} className="mb-2">{sign}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {selectedTip.details.protect && selectedTip.details.protect.length > 0 && (
                      <>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-6">How to Protect Yourself</h4>
                        <ul className="list-disc pl-5">
                          {selectedTip.details.protect.map((protection, i) => (
                            <li key={i} className="mb-2">{protection}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="bg-gray-800 dark:bg-slate-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm font-inter">
              © {new Date().getFullYear()} Scam Checker. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="/privacy"
                className="text-gray-300 hover:text-cyan-500 font-inter"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-gray-300 hover:text-cyan-500 font-inter"
              >
                Terms of Service
              </a>
              <a
                href="/contact"
                className="text-gray-300 hover:text-cyan-500 font-inter"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Advice;