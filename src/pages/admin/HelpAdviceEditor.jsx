// pages/admin/HelpAdviceEditor.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ExclamationTriangleIcon,
  LockClosedIcon,
  UserIcon,
  ShoppingCartIcon,
  BanknotesIcon,
  CreditCardIcon,
  LinkIcon,
  KeyIcon,
  WifiIcon,
  PhoneIcon,
  ComputerDesktopIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  ClipboardDocumentCheckIcon,
  BuildingLibraryIcon,
  ShieldExclamationIcon,
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  ClockIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

// Icon options for dropdown
const iconOptions = [
  { name: 'ExclamationTriangleIcon', component: <ExclamationTriangleIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'LockClosedIcon', component: <LockClosedIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'UserIcon', component: <UserIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'ShoppingCartIcon', component: <ShoppingCartIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'BanknotesIcon', component: <BanknotesIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'CreditCardIcon', component: <CreditCardIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'LinkIcon', component: <LinkIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'KeyIcon', component: <KeyIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'WifiIcon', component: <WifiIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'PhoneIcon', component: <PhoneIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'ComputerDesktopIcon', component: <ComputerDesktopIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'IdentificationIcon', component: <IdentificationIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'ShieldCheckIcon', component: <ShieldCheckIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'EnvelopeIcon', component: <EnvelopeIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'ClipboardDocumentCheckIcon', component: <ClipboardDocumentCheckIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'BuildingLibraryIcon', component: <BuildingLibraryIcon className="w-6 h-6 text-cyan-700" /> },
  { name: 'ShieldExclamationIcon', component: <ShieldExclamationIcon className="w-6 h-6 text-cyan-700" /> },
];

// Full advice categories data
const initialAdviceCategories = [
  {
    category: 'General Safety Tips',
    tips: [
      {
        title: 'Verify Before You Trust',
        preview: 'Fraudsters spoof phone numbers, emails, and logos. Always verify using official contact details from the company’s website.',
        icon: 'ShieldCheckIcon',
        details: {
          why: 'Impersonation is a cornerstone of fraud, exploiting trust in familiar brands or authorities. Independent verification disrupts their tactics.',
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
        preview: 'Scammers use phrases like "Act now!" or "Your account is compromised!" to rush you. Pause and assess calmly.',
        icon: 'ExclamationTriangleIcon',
        details: {
          why: 'Urgency triggers panic, bypassing rational decision-making and verification steps.',
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
        preview: 'Avoid sending money until you’ve verified the product, service, or recipient’s legitimacy.',
        icon: 'ClipboardDocumentCheckIcon',
        details: {
          why: 'Scammers exploit trust in transactions, vanishing after receiving untraceable payments.',
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
        preview: 'Unsolicited financial demands are suspect. Verify the sender’s identity independently.',
        icon: 'EnvelopeIcon',
        details: {
          why: 'Scammers prey on trust or curiosity with out-of-the-blue requests, often impersonating known contacts.',
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
        preview: 'Use marketplaces with buyer protection (e.g., eBay, Amazon, PayPal) and avoid off-platform deals.',
        icon: 'ShoppingCartIcon',
        details: {
          why: 'Reputable platforms offer dispute resolution and refunds; direct deals leave you exposed.',
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
        preview: 'Avoid sellers with no reviews, recent join dates, or poor feedback. Prioritize established profiles.',
        icon: 'UserIcon',
        details: {
          why: 'New or unverified accounts are common scam fronts, lacking accountability.',
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
        preview: 'For high-value items, verify in person or via live video before sending money.',
        icon: 'ClipboardDocumentCheckIcon',
        details: {
          why: 'Scammers rely on blind payments, delivering nothing or substandard goods.',
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
        preview: 'Use credit cards, PayPal, or Klarna for refunds — avoid bank transfers or crypto.',
        icon: 'CreditCardIcon',
        details: {
          why: 'Protected methods offer chargeback rights; irreversible payments do not.',
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
        preview: 'Ignore claims of suspicious basket activity. Verify via amazon.co.uk directly.',
        icon: 'ExclamationTriangleIcon',
        details: {
          why: 'Scammers impersonate Amazon to steal credentials or funds via fake alerts.',
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
        preview: 'Promises of risk-free or rapid profits are fraudulent. All investments carry risk.',
        icon: 'BanknotesIcon',
        details: {
          why: 'Guaranteeing returns is impossible due to market volatility; it’s a scammer’s bait.',
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
        preview: 'UK investment firms must be FCA-authorized. Check the FCA Register before investing.',
        icon: 'BuildingLibraryIcon',
        details: {
          why: 'Unregulated entities often operate scams, lacking oversight or accountability.',
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
        preview: 'Crypto transactions cannot be undone. Demands for crypto payments are high-risk.',
        icon: 'CreditCardIcon',
        details: {
          why: 'Cryptocurrency’s lack of regulation and traceability makes it a scammer’s favorite.',
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
        preview: 'Offers to recover lost funds for a fee are often secondary scams targeting victims.',
        icon: 'ShieldExclamationIcon',
        details: {
          why: 'Scammers exploit desperation, profiting twice from the same victim.',
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
        preview: 'Online "friends" or influencers pushing investments are often scammers or bots.',
        icon: 'LinkIcon',
        details: {
          why: 'Social media scams leverage fake trust and FOMO to drive risky investments.',
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
        preview: 'Use strong, unique passwords for every account, managed by a password manager.',
        icon: 'LockClosedIcon',
        details: {
          why: 'Weak or reused passwords are the leading cause of account breaches, enabling cascading attacks.',
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
        preview: '2FA blocks unauthorized access even if your password is compromised.',
        icon: 'KeyIcon',
        details: {
          why: 'A second verification step (e.g., app code, biometric) thwarts password-only attacks.',
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
        preview: 'Phishing links steal credentials or install malware. Type URLs manually or use bookmarks.',
        icon: 'LinkIcon',
        details: {
          why: 'Clicking malicious links is a primary vector for data theft and device compromise.',
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
        preview: 'Avoid sensitive logins on public Wi-Fi without a VPN — it’s a hacker’s playground.',
        icon: 'WifiIcon',
        details: {
          why: 'Unencrypted public networks allow data interception, exposing logins and transactions.',
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
        preview: 'Act immediately if you suspect identity theft to minimize damage.',
        icon: 'IdentificationIcon',
        details: {
          why: 'Swift action limits fraudulent use of your identity and aids recovery efforts.',
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
        preview: 'Check your credit report monthly for unauthorized activity.',
        icon: 'ShieldCheckIcon',
        details: {
          why: 'Early detection stops identity theft from spiraling into major financial loss.',
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
        preview: 'File reports with Action Fraud and CIFAS to document and protect against ID theft.',
        icon: 'ExclamationTriangleIcon',
        details: {
          why: 'Reporting creates a legal record and triggers protective measures across institutions.',
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
        preview: 'Destroy personal paperwork to prevent thieves from harvesting your details.',
        icon: 'LockClosedIcon',
        details: {
          why: 'Discarded documents provide scammers with data for impersonation or fraud.',
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
        preview: 'Scammers may hijack your phone number to bypass 2FA — secure your SIM.',
        icon: 'PhoneIcon',
        details: {
          why: 'SIM swaps grant scammers access to SMS 2FA codes, unlocking your accounts.',
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
        preview: 'Never install remote access apps for unsolicited "help" — it’s a scam tactic.',
        icon: 'ComputerDesktopIcon',
        details: {
          why: 'Remote access (e.g., TeamViewer, AnyDesk) gives scammers full control over your device and funds.',
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
        preview: 'Banks or police never ask you to move money to a "safe account" — it’s a scam.',
        icon: 'UserIcon',
        details: {
          why: 'Impersonators exploit authority to trick you into transferring funds to them.',
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
        preview: 'Fake messages mimic legit sources to steal data — verify before acting.',
        icon: 'LinkIcon',
        details: {
          why: 'Phishing and spoofing deliver malware or harvest credentials via deception.',
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
        preview: 'Weak or reused passwords invite takeovers — strengthen your defenses.',
        icon: 'KeyIcon',
        details: {
          why: 'A single breach can unlock multiple accounts if passwords are duplicated.',
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
        preview: 'Act fast to report and mitigate damage if you’ve been defrauded.',
        icon: 'ExclamationTriangleIcon',
        details: {
          why: 'Immediate action increases recovery chances and prevents further exploitation.',
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
        preview: 'Recovery is unlikely — document and report immediately.',
        icon: 'CreditCardIcon',
        details: {
          why: 'Crypto and gift cards are untraceable and irreversible, making them scam favorites.',
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
        preview: 'Secure your accounts immediately if you’ve shared sensitive financial info.',
        icon: 'BanknotesIcon',
        details: {
          why: 'Bank details allow scammers to drain accounts or commit fraud in your name.',
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
        preview: 'Hang up and verify independently — scammers often spoof legitimate numbers.',
        icon: 'PhoneIcon',
        details: {
          why: 'Caller ID spoofing tricks you into trusting fraudulent calls, leading to data or financial loss.',
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
        preview: 'Disconnect, scan, and secure your device if you’ve interacted with a phishing link.',
        icon: 'LinkIcon',
        details: {
          why: 'Malicious links can install malware, steal credentials, or lock your device for ransom.',
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
];

// Default Tip of the Week
const defaultTipOfTheWeek = {
  title: '🛡️ Tip of the Week',
  text: 'Always verify before you trust. Scammers often pretend to be your bank, HMRC, or other trusted providers to create a false sense of urgency. Never act on unexpected messages alone — always use the company’s official website or app to verify what’s real.',
  link: '/help-advice',
  icon: 'ShieldCheckIcon',
  details: {
    why: 'Scammers exploit trust by impersonating legitimate organizations, rushing you into decisions.',
    examples: ['Fake bank calls, HMRC emails, or delivery texts.'],
    whatToDo: ['Verify via official channels.', 'Report to Action Fraud.'],
    signs: ['Urgent demands, odd contact details.'],
    protect: ['Use 2FA, source contact info independently.'],
  },
};

// Function to render icons dynamically
const renderIcon = (iconName) => {
  const icon = iconOptions.find((opt) => opt.name === iconName);
  return icon ? icon.component : <ShieldCheckIcon className="w-6 h-6 text-cyan-700" />;
};

function HelpAdviceEditor() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [data, setData] = useState({
    categories: initialAdviceCategories,
    tipOfTheWeek: defaultTipOfTheWeek,
    tipArchive: [],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewTipIndex, setPreviewTipIndex] = useState(0);
  const tipRefs = useRef({});

  // Fetch content from backend on mount
  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/help-advice');
        setData({
          categories: response.data.categories || initialAdviceCategories,
          tipOfTheWeek: response.data.tipOfTheWeek || defaultTipOfTheWeek,
          tipArchive: response.data.tipArchive || [],
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load content. Using local data.');
        setData({
          categories: initialAdviceCategories,
          tipOfTheWeek: defaultTipOfTheWeek,
          tipArchive: [],
        });
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post('http://localhost:5000/api/help-advice', data);
      alert('Content updated successfully!');
      navigate('/help-advice');
    } catch (err) {
      setError('Failed to save content. Please try again.');
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  // Tip of the Week Handlers
  const updateTipOfTheWeek = (field, value) => {
    setData((prev) => ({
      ...prev,
      tipOfTheWeek: { ...prev.tipOfTheWeek, [field]: value },
    }));
  };

  const updateTipOfTheWeekDetail = (field, value, subField = null) => {
    setData((prev) => {
      const newTipOfTheWeek = { ...prev.tipOfTheWeek };
      if (subField !== null) {
        newTipOfTheWeek.details = {
          ...newTipOfTheWeek.details,
          [field]: newTipOfTheWeek.details[field].map((item, idx) =>
            idx === parseInt(subField) ? value : item
          ),
        };
      } else {
        newTipOfTheWeek.details = { ...newTipOfTheWeek.details, [field]: value };
      }
      return { ...prev, tipOfTheWeek: newTipOfTheWeek };
    });
  };

  const addTipOfTheWeekDetailItem = (field) => {
    setData((prev) => {
      const newTipOfTheWeek = { ...prev.tipOfTheWeek };
      newTipOfTheWeek.details = {
        ...newTipOfTheWeek.details,
        [field]: [...(newTipOfTheWeek.details[field] || []), 'New Item'],
      };
      return { ...prev, tipOfTheWeek: newTipOfTheWeek };
    });
  };

  const removeTipOfTheWeekDetailItem = (field, itemIndex) => {
    setData((prev) => {
      const newTipOfTheWeek = { ...prev.tipOfTheWeek };
      newTipOfTheWeek.details = {
        ...newTipOfTheWeek.details,
        [field]: newTipOfTheWeek.details[field].filter((_, idx) => idx !== itemIndex),
      };
      return { ...prev, tipOfTheWeek: newTipOfTheWeek };
    });
  };

  const archiveCurrentTip = () => {
    if (!data.tipOfTheWeek.title || !data.tipOfTheWeek.text) return;
    setData((prev) => ({
      ...prev,
      tipArchive: [
        ...prev.tipArchive,
        {
          ...prev.tipOfTheWeek,
          archivedAt: new Date().toISOString(),
        },
      ],
      tipOfTheWeek: {
        title: '🛡️ New Tip of the Week',
        text: 'Enter the new tip description.',
        link: '/help-advice',
        icon: 'ShieldCheckIcon',
        details: {
          why: 'Explain why this tip is important.',
          examples: ['Example 1'],
          whatToDo: ['Step 1'],
          signs: ['Sign 1'],
          protect: ['Protection 1'],
        },
      },
    }));
  };

  const restoreArchivedTip = (index) => {
    setData((prev) => {
      const restoredTip = prev.tipArchive[index];
      const newArchive = prev.tipArchive.filter((_, i) => i !== index);
      return {
        ...prev,
        tipOfTheWeek: {
          title: restoredTip.title,
          text: restoredTip.text,
          link: restoredTip.link,
          icon: restoredTip.icon,
          details: restoredTip.details || defaultTipOfTheWeek.details,
        },
        tipArchive: newArchive,
      };
    });
  };

  const deleteArchivedTip = (index) => {
    setData((prev) => ({
      ...prev,
      tipArchive: prev.tipArchive.filter((_, i) => i !== index),
    }));
  };

  // Category/Tip Handlers
  const updateCategory = (categoryIndex, field, value) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    setData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex] = { ...newCategories[categoryIndex], [field]: value };
      return { ...prev, categories: newCategories };
    });
  };

  const updateTip = (categoryIndex, tipIndex, field, value) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    if (tipIndex < 0 || tipIndex >= data.categories[categoryIndex].tips.length) return;
    setData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex].tips = newCategories[categoryIndex].tips.map((tip, idx) =>
        idx === tipIndex ? { ...tip, [field]: value } : tip
      );
      return { ...prev, categories: newCategories };
    });
  };

  const updateTipDetail = (categoryIndex, tipIndex, detailField, value, subField = null) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    if (tipIndex < 0 || tipIndex >= data.categories[categoryIndex].tips.length) return;
    setData((prev) => {
      const newCategories = [...prev.categories];
      const tip = { ...newCategories[categoryIndex].tips[tipIndex] };
      if (subField !== null) {
        tip.details = {
          ...tip.details,
          [detailField]: tip.details[detailField].map((item, idx) =>
            idx === parseInt(subField) ? value : item
          ),
        };
      } else {
        tip.details = { ...tip.details, [detailField]: value };
      }
      newCategories[categoryIndex].tips[tipIndex] = tip;
      return { ...prev, categories: newCategories };
    });
  };

  const addDetailItem = (categoryIndex, tipIndex, detailField) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    if (tipIndex < 0 || tipIndex >= data.categories[categoryIndex].tips.length) return;
    setData((prev) => {
      const newCategories = [...prev.categories];
      const tip = { ...newCategories[categoryIndex].tips[tipIndex] };
      tip.details = {
        ...tip.details,
        [detailField]: [...(tip.details[detailField] || []), 'New Item'],
      };
      newCategories[categoryIndex].tips[tipIndex] = tip;
      return { ...prev, categories: newCategories };
    });
  };

  const removeDetailItem = (categoryIndex, tipIndex, detailField, itemIndex) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    if (tipIndex < 0 || tipIndex >= data.categories[categoryIndex].tips.length) return;
    setData((prev) => {
      const newCategories = [...prev.categories];
      const tip = { ...newCategories[categoryIndex].tips[tipIndex] };
      tip.details = {
        ...tip.details,
        [detailField]: tip.details[detailField].filter((_, idx) => idx !== itemIndex),
      };
      newCategories[categoryIndex].tips[tipIndex] = tip;
      return { ...prev, categories: newCategories };
    });
  };

  const addTip = (categoryIndex) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    setData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex].tips = [
        ...newCategories[categoryIndex].tips,
        {
          title: 'New Tip',
          preview: 'Enter a brief preview of the tip.',
          icon: 'ShieldCheckIcon',
          details: {
            why: 'Explain why this tip is important.',
            examples: ['Example 1', 'Example 2'],
            whatToDo: ['Step 1', 'Step 2'],
            signs: ['Sign 1', 'Sign 2'],
            protect: ['Protection 1', 'Protection 2'],
          },
        },
      ];
      setTimeout(() => {
        const newTipIndex = newCategories[categoryIndex].tips.length - 1;
        const newTipRef = tipRefs.current[`${categoryIndex}-${newTipIndex}`];
        newTipRef?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
      return { ...prev, categories: newCategories };
    });
  };

  const removeTip = (categoryIndex, tipIndex) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    if (tipIndex < 0 || tipIndex >= data.categories[categoryIndex].tips.length) return;
    setData((prev) => {
      const newCategories = [...prev.categories];
      newCategories[categoryIndex].tips = newCategories[categoryIndex].tips.filter((_, idx) => idx !== tipIndex);
      return { ...prev, categories: newCategories };
    });
  };

  const addCategory = () => {
    setData((prev) => ({
      ...prev,
      categories: [
        ...prev.categories,
        {
          category: 'New Category',
          tips: [
            {
              title: 'New Tip',
              preview: 'Enter a brief preview of the tip.',
              icon: 'ShieldCheckIcon',
              details: {
                why: 'Explain why this tip is important.',
                examples: ['Example 1'],
                whatToDo: ['Step 1'],
                signs: ['Sign 1'],
                protect: ['Protection 1'],
              },
            },
          ],
        },
      ],
    }));
  };

  const removeCategory = (categoryIndex) => {
    if (categoryIndex < 0 || categoryIndex >= data.categories.length) return;
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, idx) => idx !== categoryIndex),
    }));
    setSelectedCategory(null);
  };

  const categories = data.categories.map((cat) => cat.category).sort();

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
    <div className="flex-1 p-6 bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white">
      <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        {/* Back to Dashboard Button */}
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-500"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold">Help & Advice Editor</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Tip of the Week Editor */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold mb-4">Tip of the Week</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Tip Title
              </label>
              <input
                type="text"
                value={data.tipOfTheWeek.title}
                onChange={(e) => updateTipOfTheWeek('title', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                placeholder="Enter tip title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Tip Text
              </label>
              <textarea
                value={data.tipOfTheWeek.text}
                onChange={(e) => updateTipOfTheWeek('text', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                rows="4"
                placeholder="Enter tip description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Link (Optional)
              </label>
              <input
                type="text"
                value={data.tipOfTheWeek.link}
                onChange={(e) => updateTipOfTheWeek('link', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                placeholder="Enter link URL (e.g., /help-advice)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Icon
              </label>
              <select
                value={data.tipOfTheWeek.icon}
                onChange={(e) => updateTipOfTheWeek('icon', e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
              >
                {iconOptions.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Tip of the Week Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Why It’s Important
                </label>
                <textarea
                  value={data.tipOfTheWeek.details.why}
                  onChange={(e) => updateTipOfTheWeekDetail('why', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                  rows="4"
                  placeholder="Explain why this tip is important"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Examples
                </label>
                {data.tipOfTheWeek.details.examples.map((example, exIndex) => (
                  <div key={exIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={example}
                      onChange={(e) => updateTipOfTheWeekDetail('examples', e.target.value, exIndex)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                      placeholder={`Example ${exIndex + 1}`}
                    />
                    <button
                      onClick={() => removeTipOfTheWeekDetailItem('examples', exIndex)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addTipOfTheWeekDetailItem('examples')}
                  className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                >
                  <PlusIcon className="w-4 h-4 mr-1" /> Add Example
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  What To Do
                </label>
                {data.tipOfTheWeek.details.whatToDo.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => updateTipOfTheWeekDetail('whatToDo', e.target.value, stepIndex)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                      placeholder={`Step ${stepIndex + 1}`}
                    />
                    <button
                      onClick={() => removeTipOfTheWeekDetailItem('whatToDo', stepIndex)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addTipOfTheWeekDetailItem('whatToDo')}
                  className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                >
                  <PlusIcon className="w-4 h-4 mr-1" /> Add Step
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Signs to Watch For
                </label>
                {data.tipOfTheWeek.details.signs.map((sign, signIndex) => (
                  <div key={signIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={sign}
                      onChange={(e) => updateTipOfTheWeekDetail('signs', e.target.value, signIndex)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                      placeholder={`Sign ${signIndex + 1}`}
                    />
                    <button
                      onClick={() => removeTipOfTheWeekDetailItem('signs', signIndex)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addTipOfTheWeekDetailItem('signs')}
                  className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                >
                  <PlusIcon className="w-4 h-4 mr-1" /> Add Sign
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  How to Protect Yourself
                </label>
                {data.tipOfTheWeek.details.protect.map((protection, protIndex) => (
                  <div key={protIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={protection}
                      onChange={(e) => updateTipOfTheWeekDetail('protect', e.target.value, protIndex)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                      placeholder={`Protection ${protIndex + 1}`}
                    />
                    <button
                      onClick={() => removeTipOfTheWeekDetailItem('protect', protIndex)}
                      className="text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addTipOfTheWeekDetailItem('protect')}
                  className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                >
                  <PlusIcon className="w-4 h-4 mr-1" /> Add Protection Tip
                </button>
              </div>
            </div>
            <div>
              <button
                onClick={archiveCurrentTip}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm"
                disabled={!data.tipOfTheWeek.title || !data.tipOfTheWeek.text}
              >
                Archive Current Tip
              </button>
            </div>
          </div>
          {/* Archived Tips */}
          {data.tipArchive.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Previous Tips of the Week</h3>
              <div className="space-y-4">
                {data.tipArchive.map((tip, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        {renderIcon(tip.icon)}
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {tip.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-slate-300 mt-1">
                        {tip.text.slice(0, 100)}...
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Archived: {new Date(tip.archivedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => restoreArchivedTip(index)}
                        className="text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                      >
                        <ArrowPathIcon className="w-4 h-4 mr-1" /> Restore
                      </button>
                      <button
                        onClick={() => deleteArchivedTip(index)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center"
                      >
                        <TrashIcon className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Category Selector */}
          {!selectedCategory ? (
            <div className="w-full">
              <h2 className="text-2xl font-semibold mb-4">Advice Categories</h2>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div key={category} className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setPreviewTipIndex(0);
                      }}
                      className="flex-1 text-left px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-cyan-100 dark:hover:bg-cyan-900"
                    >
                      {category}
                    </button>
                    <button
                      onClick={() => removeCategory(index)}
                      className="ml-2 text-red-600 hover:text-red-800 text-sm flex items-center"
                    >
                      <TrashIcon className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </div>
                ))}
                <button
                  onClick={addCategory}
                  className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm font-semibold"
                >
                  <PlusIcon className="w-4 h-4 inline mr-2" /> Add New Category
                </button>
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
                <h2 className="text-2xl font-semibold">Editing: {selectedCategory}</h2>
              </div>

              {/* Category Editor */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700 mb-6">
                <h3 className="text-lg font-semibold mb-4">Category Name</h3>
                <input
                  type="text"
                  value={selectedCategory}
                  onChange={(e) => {
                    const newCategoryName = e.target.value;
                    const catIndex = data.categories.findIndex((cat) => cat.category === selectedCategory);
                    if (catIndex >= 0) {
                      updateCategory(catIndex, 'category', newCategoryName);
                      setSelectedCategory(newCategoryName);
                    }
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                  placeholder="Enter category name"
                />
              </div>

              {/* Tips Editor */}
              <div className="space-y-6">
                {data.categories
                  .find((cat) => cat.category === selectedCategory)
                  ?.tips.map((tip, tipIndex) => (
                    <div
                      key={tipIndex}
                      ref={(el) => (tipRefs.current[`${selectedCategory}-${tipIndex}`] = el)}
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700"
                    >
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Tip {tipIndex + 1} Title
                        </label>
                        <input
                          type="text"
                          value={tip.title}
                          onChange={(e) =>
                            updateTip(
                              data.categories.findIndex((cat) => cat.category === selectedCategory),
                              tipIndex,
                              'title',
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                          placeholder="Enter tip title"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Preview
                        </label>
                        <textarea
                          value={tip.preview}
                          onChange={(e) =>
                            updateTip(
                              data.categories.findIndex((cat) => cat.category === selectedCategory),
                              tipIndex,
                              'preview',
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                          rows="2"
                          placeholder="Enter tip preview"
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                          Icon
                        </label>
                        <select
                          value={tip.icon}
                          onChange={(e) =>
                            updateTip(
                              data.categories.findIndex((cat) => cat.category === selectedCategory),
                              tipIndex,
                              'icon',
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                        >
                          {iconOptions.map((opt) => (
                            <option key={opt.name} value={opt.name}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Tip Details */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Why It’s Important
                          </label>
                          <textarea
                            value={tip.details.why}
                            onChange={(e) =>
                              updateTipDetail(
                                data.categories.findIndex((cat) => cat.category === selectedCategory),
                                tipIndex,
                                'why',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                            rows="4"
                            placeholder="Explain why this tip is important"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Examples
                          </label>
                          {tip.details.examples.map((example, exIndex) => (
                            <div key={exIndex} className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={example}
                                onChange={(e) =>
                                  updateTipDetail(
                                    data.categories.findIndex((cat) => cat.category === selectedCategory),
                                    tipIndex,
                                    'examples',
                                    e.target.value,
                                    exIndex
                                  )
                                }
                                className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                                placeholder={`Example ${exIndex + 1}`}
                              />
                              <button
                                onClick={() =>
                                  removeDetailItem(
                                    data.categories.findIndex((cat) => cat.category === selectedCategory),
                                    tipIndex,
                                    'examples',
                                    exIndex
                                  )
                                }
                                className="text-red-600 hover:text-red-800 text-sm flex items-center"
                              >
                                <TrashIcon className="w-4 h-4 mr-1" /> Remove
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() =>
                              addDetailItem(
                                data.categories.findIndex((cat) => cat.category === selectedCategory),
                                tipIndex,
                                'examples'
                              )
                            }
                            className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                          >
                            <PlusIcon className="w-4 h-4 mr-1" /> Add Example
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            What To Do
                          </label>
                          {tip.details.whatToDo.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={step}
                                onChange={(e) =>
                                  updateTipDetail(
                                    data.categories.findIndex((cat) => cat.category === selectedCategory),
                                    tipIndex,
                                    'whatToDo',
                                    e.target.value,
                                    stepIndex
                                  )
                                }
                                className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                                placeholder={`Step ${stepIndex + 1}`}
                              />
                              <button
                                onClick={() =>
                                  removeDetailItem(
                                    data.categories.findIndex((cat) => cat.category === selectedCategory),
                                    tipIndex,
                                    'whatToDo',
                                    stepIndex
                                  )
                                }
                                className="text-red-600 hover:text-red-800 text-sm flex items-center"
                              >
                                <TrashIcon className="w-4 h-4 mr-1" /> Remove
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() =>
                              addDetailItem(
                                data.categories.findIndex((cat) => cat.category === selectedCategory),
                                tipIndex,
                                'whatToDo'
                              )
                            }
                            className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                          >
                            <PlusIcon className="w-4 h-4 mr-1" /> Add Step
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Signs to Watch For
                          </label>
                          {tip.details.signs.map((sign, signIndex) => (
                            <div key={signIndex} className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={sign}
                                onChange={(e) =>
                                  updateTipDetail(
                                    data.categories.findIndex((cat) => cat.category === selectedCategory),
                                    tipIndex,
                                    'signs',
                                    e.target.value,
                                    signIndex
                                  )
                                }
                                className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                                placeholder={`Sign ${signIndex + 1}`}
                              />
                              <button
                                onClick={() =>
                                  removeDetailItem(
                                    data.categories.findIndex((cat) => cat.category === selectedCategory),
                                    tipIndex,
                                    'signs',
                                    signIndex
                                  )
                                }
                                className="text-red-600 hover:text-red-800 text-sm flex items-center"
                              >
                                <TrashIcon className="w-4 h-4 mr-1" /> Remove
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() =>
                              addDetailItem(
                                data.categories.findIndex((cat) => cat.category === selectedCategory),
                                tipIndex,
                                'signs'
                              )
                            }
                            className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                          >
                            <PlusIcon className="w-4 h-4 mr-1" /> Add Sign
                          </button>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            How to Protect Yourself
                          </label>
                          {tip.details.protect.map((protection, protIndex) => (
                            <div key={protIndex} className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={protection}
                                onChange={(e) =>
                                  updateTipDetail(
                                    data.categories.findIndex((cat) => cat.category === selectedCategory),
                                    tipIndex,
                                    'protect',
                                    e.target.value,
                                    protIndex
                                  )
                                }
                                className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 focus:ring-2 focus:ring-cyan-500 text-gray-900 dark:text-slate-100 text-sm"
                                placeholder={`Protection ${protIndex + 1}`}
                              />
                              <button
                                onClick={() =>
                                  removeDetailItem(
                                    data.categories.findIndex((cat) => cat.category === selectedCategory),
                                    tipIndex,
                                    'protect',
                                    protIndex
                                  )
                                }
                                className="text-red-600 hover:text-red-800 text-sm flex items-center"
                              >
                                <TrashIcon className="w-4 h-4 mr-1" /> Remove
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() =>
                              addDetailItem(
                                data.categories.findIndex((cat) => cat.category === selectedCategory),
                                tipIndex,
                                'protect'
                              )
                            }
                            className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm flex items-center"
                          >
                            <PlusIcon className="w-4 h-4 mr-1" /> Add Protection Tip
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end mt-4">
                        <button
                          onClick={() =>
                            removeTip(
                              data.categories.findIndex((cat) => cat.category === selectedCategory),
                              tipIndex
                            )
                          }
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                        >
                          <TrashIcon className="w-4 h-4 mr-2" /> Remove Tip
                        </button>
                      </div>
                    </div>
                  ))}
                <button
                  onClick={() =>
                    addTip(data.categories.findIndex((cat) => cat.category === selectedCategory))
                  }
                  className="w-full px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 text-sm font-semibold"
                >
                  <PlusIcon className="w-4 h-4 inline mr-2" /> Add New Tip
                </button>
              </div>

              {/* Live Preview */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700 mt-8">
                <h2 className="text-2xl font-semibold mb-4">Live Preview</h2>
                <div className="bg-white dark:bg-slate-850 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 min-h-[400px]">
                  <div className="p-6 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-850">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {selectedCategory}
                    </h2>
                  </div>
                  <div className="px-4 sm:px-6 py-6 space-y-6">
                    {data.categories
                      .find((cat) => cat.category === selectedCategory)
                      ?.tips[previewTipIndex] ? (
                      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-slate-600">
                        <div className="flex items-start gap-4">
                          {renderIcon(
                            data.categories.find((cat) => cat.category === selectedCategory).tips[
                              previewTipIndex
                            ].icon
                          )}
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              {
                                data.categories.find((cat) => cat.category === selectedCategory).tips[
                                  previewTipIndex
                                ].title
                              }
                            </h3>
                            <p className="text-gray-600 dark:text-slate-300 mb-4">
                              {
                                data.categories.find((cat) => cat.category === selectedCategory).tips[
                                  previewTipIndex
                                ].preview
                              }
                            </p>
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                  Why It’s Important
                                </h4>
                                <p className="text-gray-600 dark:text-slate-300">
                                  {
                                    data.categories.find((cat) => cat.category === selectedCategory)
                                      .tips[previewTipIndex].details.why
                                  }
                                </p>
                              </div>
                              <div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                  Examples
                                </h4>
                                <ul className="list-disc pl-5 text-gray-600 dark:text-slate-300">
                                  {data.categories
                                    .find((cat) => cat.category === selectedCategory)
                                    .tips[previewTipIndex].details.examples.map((example, idx) => (
                                      <li key={idx}>{example}</li>
                                    ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                  What To Do
                                </h4>
                                <ul className="list-disc pl-5 text-gray-600 dark:text-slate-300">
                                  {data.categories
                                    .find((cat) => cat.category === selectedCategory)
                                    .tips[previewTipIndex].details.whatToDo.map((step, idx) => (
                                      <li key={idx}>{step}</li>
                                    ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                  Signs to Watch For
                                </h4>
                                <ul className="list-disc pl-5 text-gray-600 dark:text-slate-300">
                                  {data.categories
                                    .find((cat) => cat.category === selectedCategory)
                                    .tips[previewTipIndex].details.signs.map((sign, idx) => (
                                      <li key={idx}>{sign}</li>
                                    ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                                  How to Protect Yourself
                                </h4>
                                <ul className="list-disc pl-5 text-gray-600 dark:text-slate-300">
                                  {data.categories
                                    .find((cat) => cat.category === selectedCategory)
                                    .tips[previewTipIndex].details.protect.map((protection, idx) => (
                                      <li key={idx}>{protection}</li>
                                    ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-slate-400">No tips available.</p>
                    )}
                    <div className="flex justify-between">
                      <button
                        onClick={() => setPreviewTipIndex((prev) => Math.max(0, prev - 1))}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                        disabled={previewTipIndex === 0}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setPreviewTipIndex((prev) =>
                            Math.min(
                              data.categories.find((cat) => cat.category === selectedCategory).tips
                                .length - 1,
                              prev + 1
                            )
                          )
                        }
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                        disabled={
                          previewTipIndex ===
                          data.categories.find((cat) => cat.category === selectedCategory).tips
                            .length - 1
                        }
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
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
    </div>
  );
}

export default HelpAdviceEditor;