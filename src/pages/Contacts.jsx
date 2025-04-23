import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import fraudCheckLogo from '../assets/fraud-check-logo.png';
import fraudCheckerBackground from '../assets/fraud-checker-background.png';
import { ClipboardIcon } from '@heroicons/react/24/outline';

function Contacts() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fraudContacts = [
    { institution: 'Action Fraud', team: 'General Fraud Reporting', region: 'UK', contactNumber: '0300 123 2040', availability: 'Not specified', notes: 'For all fraud types in England, Wales, Northern Ireland.' },
    { institution: 'Aldermore Bank', team: 'General Fraud Team', region: 'UK', contactNumber: '0345 604 5533', availability: 'Mon-Fri 9 AM-5 PM', notes: 'For suspicious activity on savings or lending accounts.' },
    { institution: 'Aldermore Bank', team: 'Phishing Reporting', region: 'UK', contactNumber: 'Email: fraud@aldermore.co.uk', availability: 'N/A', notes: 'Forward suspicious emails or texts.' },
    { institution: 'Bank of Scotland', team: 'Credit Card Fraud Team', region: 'UK', contactNumber: '0800 028 8335 / +44 131 454 1605', availability: '24/7', notes: 'For credit card fraud.' },
    { institution: 'Bank of Scotland', team: 'Debit Card Fraud Team', region: 'UK', contactNumber: '0800 567 4971 / +44 1132 888 408', availability: '24/7', notes: 'Report via app: “Help with this transaction” > “Report this transaction.”' },
    { institution: 'Bank of Scotland', team: 'Online Banking Fraud Team', region: 'UK', contactNumber: '0800 028 8335 / +44 131 454 1605', availability: '24/7', notes: 'Specify Online Banking fraud when calling.' },
    { institution: 'Bank of Scotland', team: 'Retail Disputes Team', region: 'UK', contactNumber: '0800 028 8335 / +44 131 454 1605', availability: '24/7', notes: 'Handles card transaction disputes. Can be triggered via app or call.' },
    { institution: 'Bank of Scotland', team: 'Open Banking Fraud Team', region: 'UK', contactNumber: '0800 028 8335 / +44 131 454 1605', availability: '24/7', notes: 'For third-party access or unauthorized data sharing.' },
    { institution: 'Barclays', team: 'Credit Card Fraud Team', region: 'UK', contactNumber: 'Number on back of card', availability: '24/7', notes: 'Report via app/Online Banking. Also report to Action Fraud: 0300 123 2040.' },
    { institution: 'Barclays', team: 'Debit Card Fraud Team', region: 'UK', contactNumber: 'Number on back of card', availability: '24/7', notes: 'Report via app/Online Banking.' },
    { institution: 'Barclays', team: 'Lost/Stolen Card Team', region: 'UK', contactNumber: '03457 345 345 / +44 2476 842 099', availability: '24/7', notes: 'For lost/stolen cards to prevent fraud. Freeze card in app.' },
    { institution: 'Barclays', team: 'Phishing/Suspicious Comm. Team', region: 'UK', contactNumber: 'Email: internetsecurity@barclays.co.uk', availability: 'N/A', notes: 'Forward suspicious emails or texts.' },
    { institution: 'Barclays', team: 'Scams Team (Authorised Payments)', region: 'UK', contactNumber: '0800 328 6935 / +44 2476 842 099', availability: '24/7', notes: 'For scams where you’ve made a payment.' },
    { institution: 'Barclays', team: 'Retail Disputes Team', region: 'UK', contactNumber: 'Number on back of card', availability: '24/7', notes: 'For card transaction disputes. Report via app or Online Banking.' },
    { institution: 'Barclays', team: 'Open Banking Fraud Team', region: 'UK', contactNumber: '03457 345 345 / +44 2476 842 099', availability: '24/7', notes: 'For third-party access or unauthorized data sharing.' },
    { institution: 'Barclaycard', team: 'Credit Card Fraud Team', region: 'UK', contactNumber: '0333 200 9090', availability: 'Not specified', notes: 'Report via app’s “Help” section.' },
    { institution: 'Barclaycard', team: 'Amazon Barclaycard Fraud Team', region: 'UK', contactNumber: '0800 151 0157', availability: 'Not specified', notes: 'For Amazon Barclaycard holders.' },
    { institution: 'Binance UK', team: 'Scam or Fraud Team', region: 'UK', contactNumber: 'Submit case via https://www.binance.com/en/support', availability: 'Not specified', notes: 'Log phishing, crypto scam, or impersonation reports.' },
    { institution: 'Bitstamp UK', team: 'Fraud Support Team', region: 'UK', contactNumber: 'Submit case via https://www.bitstamp.net/support', availability: 'Not specified', notes: 'For phishing or crypto fraud.' },
    { institution: 'Bud Financial', team: 'N/A', region: 'UK', contactNumber: 'N/A', availability: 'N/A', notes: 'Report to bank. Open banking provider for financial insights/payments.' },
    { institution: 'Chase (UK)', team: 'General Fraud Team', region: 'UK', contactNumber: '0800 376 3333 / +44 203 493 0829', availability: '24/7', notes: 'For credit/debit/online banking fraud. Email: ChaseSupportUK@chase.com. No international payments.' },
    { institution: 'CIBC', team: 'Fraud Alerts Team', region: 'Canada', contactNumber: '1-800-267-5193 / 1-866-999-9884', availability: '24/7', notes: 'For credit/debit card fraud alerts. Email: fraud@cibc.com.' },
    { institution: 'Cifas', team: 'General Fraud Reporting', region: 'UK', contactNumber: '0300 123 2040', availability: 'Not specified', notes: 'Works with Action Fraud to report fraud cases.' },
    { institution: 'Citi UK', team: 'Fraud Team', region: 'UK', contactNumber: '0800 096 7711 / +44 203 567 1234', availability: '24/7', notes: 'For credit card or banking fraud.' },
    { institution: 'Close Brothers', team: 'General Fraud Team', region: 'UK', contactNumber: '020 7655 3100', availability: 'Mon-Fri 9 AM-5 PM', notes: 'For fraud on savings or loan accounts.' },
    { institution: 'Close Brothers', team: 'Phishing/Suspicious Comm. Team', region: 'UK', contactNumber: 'Email: fraud@closebrothers.com', availability: 'N/A', notes: 'Forward suspicious communications.' },
    { institution: 'Clydesdale Bank', team: 'Credit Card Fraud Team', region: 'UK', contactNumber: '0800 015 1234 / +44 141 951 7320', availability: '24/7', notes: 'Report via app or Online Banking.' },
    { institution: 'Clydesdale Bank', team: 'Debit Card Fraud Team', region: 'UK', contactNumber: '0800 015 1234 / +44 141 951 7320', availability: '24/7', notes: 'Report via app or Online Banking.' },
    { institution: 'Clydesdale Bank', team: 'Phishing Reporting', region: 'UK', contactNumber: 'Email: phishing@clydesdalebank.co.uk', availability: 'N/A', notes: 'Forward suspicious emails or texts.' },
    { institution: 'Coinbase', team: 'Fraud Department', region: 'UK', contactNumber: 'support.coinbase.com', availability: 'Not specified', notes: 'No phone, support via ticket only.' },
    { institution: 'Coinbase', team: 'Account Access/Breach Team', region: 'UK', contactNumber: 'In-app or site support', availability: '24/7', notes: 'For account recovery issues.' },
    { institution: 'Co-operative Bank', team: 'Credit Card Fraud Team', region: 'UK', contactNumber: '0345 600 6000 / +44 161 696 8585', availability: '24/7', notes: 'Select option for fraud reporting.' },
    { institution: 'Co-operative Bank', team: 'Debit Card Fraud Team', region: 'UK', contactNumber: '0345 721 3213 / +44 161 696 8585', availability: '24/7', notes: 'Report via app under “Report Fraud”.' },
    { institution: 'Co-operative Bank', team: 'Online Banking Fraud Team', region: 'UK', contactNumber: '0345 600 6000 / +44 161 696 8585', availability: '24/7', notes: 'For suspicious online activity.' },
    { institution: 'Co-operative Bank', team: 'Retail Disputes Team', region: 'UK', contactNumber: '0345 600 6000 / +44 161 696 8585', availability: '24/7', notes: 'For card transaction disputes.' },
    { institution: 'Co-operative Bank', team: 'Open Banking Fraud Team', region: 'UK', contactNumber: '0345 600 6000 / +44 161 696 8585', availability: '24/7', notes: 'For third-party access issues.' },
    { institution: 'Coutts', team: 'Fraud Team', region: 'UK', contactNumber: '0207 770 0011', availability: 'Not specified', notes: 'Specialist Coutts fraud assistance line.' },
    { institution: 'Coventry Building Society', team: 'Card Disputes and Fraud Team', region: 'UK', contactNumber: '0800 121 8899', availability: 'Not specified', notes: 'Follow options for lost/stolen cards or unauthorised transactions.' },
    { institution: 'Financial Ombudsman Service', team: 'Fraud Complaints Team', region: 'UK', contactNumber: '0800 023 4567 / +44 20 7964 0500', availability: 'Mon-Fri, 8 AM-5 PM', notes: 'Handles unresolved fraud complaints. 8,734 fraud complaints in Q2 2024.' },
    { institution: 'Gemini UK', team: 'Fraud or Security Team', region: 'UK', contactNumber: 'Submit case via https://support.gemini.com', availability: 'Not specified', notes: 'For crypto scams or account breaches.' },
    { institution: 'Halifax', team: 'Credit Card Fraud Team', region: 'UK', contactNumber: '0800 015 1515 / +44 113 242 8196', availability: '24/7', notes: 'For credit card fraud.' },
    { institution: 'Halifax', team: 'Debit Card Fraud Team', region: 'UK', contactNumber: '0800 015 1515 / +44 113 242 8196', availability: '24/7', notes: 'Report via Mobile Banking app.' },
    { institution: 'Halifax', team: 'Online Banking Fraud Team', region: 'UK', contactNumber: '0800 015 1515 / +44 113 242 8196', availability: '24/7', notes: 'Specify Online Banking fraud when calling.' },
    { institution: 'Halifax', team: 'Retail Disputes Team', region: 'UK', contactNumber: '0800 015 1515 / +44 113 242 8196', availability: '24/7', notes: 'For card transaction disputes.' },
    { institution: 'Halifax', team: 'Open Banking Fraud Team', region: 'UK', contactNumber: '0800 015 1515 / +44 113 242 8196', availability: '24/7', notes: 'For third-party access or unauthorized data sharing.' },
    { institution: 'Hodge Bank', team: 'General Fraud Team', region: 'UK', contactNumber: '0800 035 7040', availability: 'Mon-Fri 9 AM-5 PM', notes: 'For suspicious activity on savings or mortgage accounts.' },
    { institution: 'HSBC Innovation Banking', team: 'Wholesale Digital Fraud Team', region: 'Global', contactNumber: '0800 169 9903 / +1 778 452 2774', availability: 'Not specified', notes: 'For all fraud types (credit/debit/online).' },
    { institution: 'HSBC Innovation Banking', team: 'Client Service Team', region: 'Global', contactNumber: '0800 023 1441 / +44 207 367 7881', availability: 'Not specified', notes: 'To verify suspicious communications or report fraud.' },
    { institution: 'HSBC UK', team: 'Credit Card Fraud Team', region: 'UK', contactNumber: '03456 008 050 / +44 1470 697 093', availability: 'Mon-Sun, 8 AM-8 PM', notes: 'For credit card fraud or chargebacks. HSBCnet payments: 0800 169 9903 (24/7).' },
    { institution: 'HSBC UK', team: 'Debit Card Fraud Team', region: 'UK', contactNumber: '03456 008 050 / +44 1470 697 093', availability: 'Mon-Sun, 8 AM-8 PM', notes: 'For debit card fraud or chargebacks.' },
    { institution: 'HSBC UK', team: 'Online Banking Fraud Team', region: 'UK', contactNumber: '03455 873 523 / +44 1226 260 878', availability: '24/7', notes: 'For disclosed security details (e.g., online banking credentials).' },
    { institution: 'HSBC UK', team: 'Fraudulent Bank Transfer Team', region: 'UK', contactNumber: '03452 669 337 / +44 1470 697 107', availability: 'Mon-Sun, 8 AM-8 PM', notes: 'For non-card bank transfer fraud.' },
    { institution: 'HSBC UK', team: 'Scams Team (Authorised Payments)', region: 'UK', contactNumber: '03455 873 523 / +44 1226 260 878', availability: '24/7', notes: 'For scams where you’ve made a payment.' },
    { institution: 'HSBC UK', team: 'Cheque Fraud Team', region: 'UK', contactNumber: '03457 60 60 60 / +44 1226 260 878', availability: 'Mon-Fri 8 AM-8 PM, Sat 8 AM-2 PM', notes: 'For cheque fraud.' },
    { institution: 'HSBC UK', team: 'Phishing/Suspicious Comm. Team', region: 'UK', contactNumber: 'Email: phishing@hsbc.com', availability: 'N/A', notes: 'Forward suspicious emails or texts.' },
    { institution: 'HSBC UK', team: 'Lost/Stolen Card Team', region: 'UK', contactNumber: '03456 007 010 / +44 1442 422 929', availability: '24/7', notes: 'Freeze card in app if needed.' },
    { institution: 'HSBC UK', team: 'Retail Disputes Team', region: 'UK', contactNumber: '03456 008 050 / +44 1470 697 093', availability: 'Mon-Sun 8 AM-8 PM', notes: 'For credit or debit card transaction disputes.' },
    { institution: 'HSBC UK', team: 'Open Banking Fraud Team', region: 'UK', contactNumber: '03455 873 523 / +44 1226 260 878', availability: '24/7', notes: 'For third-party access or unauthorized data sharing.' },
    { institution: 'IBC Bank', team: 'Unauthorized Debit Card Team', region: 'USA', contactNumber: '1-866-902-5860 (Option 4)', availability: 'Not specified', notes: 'For unauthorized debit card transactions.' },
    { institution: 'IBC Bank', team: 'Fraud and Ethics Hotline', region: 'USA', contactNumber: '1-800-894-6076', availability: 'Not specified', notes: 'Anonymous hotline for all fraud types. Use outside phone.' },
    { institution: 'Investec', team: 'Fraud Team', region: 'UK', contactNumber: '020 7597 4000', availability: 'Mon-Fri 8 AM-6 PM', notes: 'For fraud on banking or investment accounts.' },
    { institution: 'Investec', team: 'Phishing Reporting', region: 'UK', contactNumber: 'Email: fraud@investec.co.uk', availability: 'N/A', notes: 'Forward suspicious emails.' },
    { institution: 'Kraken UK', team: 'Fraud or Security Team', region: 'UK', contactNumber: 'support.kraken.com', availability: 'Not specified', notes: 'Log incidents like investment scams, hijacks, or phishing.' },
    { institution: 'Kroo', team: 'General Fraud Team', region: 'UK', contactNumber: '0330 094 0130', availability: 'Not specified', notes: 'For credit/debit/online banking fraud. No joint accounts.' },
    { institution: 'Leeds Building Society', team: 'Fraud or Suspicious Activity Team', region: 'UK', contactNumber: '0345 050 5075', availability: 'Mon-Fri 8 AM-8 PM, Sat 9 AM-1 PM', notes: 'For reporting scams or unauthorised transactions.' },
    { institution: 'Lloyds Bank', team: 'Credit Card Fraud Team', region: 'UK', contactNumber: '0345 606 2172 / +44 1702 278 272', availability: '24/7', notes: 'For credit card fraud. Also report via app.' },
    { institution: 'Lloyds Bank', team: 'Debit Card Fraud Team', region: 'UK', contactNumber: '0800 917 7017 / +44 2074 812 614', availability: '24/7', notes: 'Report via app: “Help with this transaction” > “Report this transaction.”' },
    { institution: 'Lloyds Bank', team: 'Internet Banking Fraud Team', region: 'UK', contactNumber: '0345 606 2172 / +44 1702 278 272', availability: '24/7', notes: 'Specify Internet Banking fraud when calling.' },
    { institution: 'Lloyds Bank', team: 'Phishing/Suspicious Comm. Team', region: 'UK', contactNumber: 'Email: emailscams@lloydsbanking.com', availability: 'N/A', notes: 'Forward suspicious emails. Text suspicious messages to 61111.' },
    { institution: 'Lloyds Bank', team: 'Scams Team (Authorised Payments)', region: 'UK', contactNumber: '0800 917 7017 / +44 2074 812 614', availability: '24/7', notes: 'For scams where you’ve made a payment.' },
    { institution: 'Lloyds Bank', team: 'Retail Disputes Team', region: 'UK', contactNumber: '0345 606 2172 / +44 1702 278 272', availability: '24/7', notes: 'For card transaction disputes.' },
    { institution: 'Lloyds Bank', team: 'Open Banking Fraud Team', region: 'UK', contactNumber: '0345 606 2172 / +44 1702 278 272', availability: '24/7', notes: 'For third-party access or unauthorized data sharing.' },
    { institution: 'Metro Bank', team: 'General Fraud Team', region: 'UK', contactNumber: '0345 080 8500', availability: 'Not specified', notes: 'For suspicious payments or fraud reports.' },
    { institution: 'Metro Bank', team: 'Retail Disputes Team', region: 'UK', contactNumber: '0345 080 8500', availability: 'Not specified', notes: 'For card transaction disputes.' },
    { institution: 'Metro Bank', team: 'Open Banking Fraud Team', region: 'UK', contactNumber: '0345 080 8500', availability: 'Not specified', notes: 'For third-party access issues.' },
    { institution: 'Monese', team: 'General Fraud Team', region: 'UK', contactNumber: '+44 1706 304 001', availability: 'Not specified', notes: 'For credit/debit/online banking fraud. Popular with international students.' },
    { institution: 'Monzo', team: 'General Fraud Team', region: 'UK', contactNumber: '0800 802 1281 / +44 20 3872 0620', availability: '24/7', notes: 'For credit/debit/online banking fraud. Report via app. 1,864 FOS complaints in H1 2024.' },
    { institution: 'Monzo', team: 'Account Security Team', region: 'UK', contactNumber: 'In-app only', availability: 'Not specified', notes: 'All fraud must be reported via in-app support.' },
    { institution: 'Monzo', team: 'Phishing Email Reporting', region: 'UK', contactNumber: 'phishing@monzo.com', availability: 'N/A', notes: 'For scam emails or fake Monzo websites.' },
    { institution: 'NAB', team: 'Lost/Stolen Card Team', region: 'Australia', contactNumber: '1800 033 103 / +61 3 8641 9121', availability: '24/7', notes: 'For blocking lost/stolen cards to prevent fraud. Dispute via app.' },
    { institution: 'National Crime Agency (NCA)', team: 'Verification Team', region: 'UK', contactNumber: '0370 496 7622', availability: '24/7', notes: 'To verify NCA officer identity in impersonation fraud cases.' },
    { institution: 'Nationwide', team: 'General Fraud Team', region: 'UK', contactNumber: '0800 055 66 22', availability: '24/7', notes: 'For credit/debit/online banking fraud. Supports BSL interpreted calls.' },
    { institution: 'Nationwide', team: 'Retail Disputes Team', region: 'UK', contactNumber: '0800 055 66 22', availability: '24/7', notes: 'For card transaction disputes.' },
    { institution: 'Nationwide', team: 'Open Banking Fraud Team', region: 'UK', contactNumber: '0800 055 66 22', availability: '24/7', notes: 'For third-party access or unauthorized data sharing.' },
    { institution: 'NatWest', team: 'Credit Card Fraud Team', region: 'UK', contactNumber: '03457 888 444 (Relay UK 18001)', availability: '24/7', notes: 'Report via app. Also for suspicious calls/fraudulent websites.' },
    { institution: 'NatWest', team: 'Debit Card Fraud Team', region: 'UK', contactNumber: '03457 888 444 (Relay UK 18001)', availability: '24/7', notes: 'Report via app/Online Banking. Freeze card in app if needed.' },
    { institution: 'NatWest', team: 'Phishing/Suspicious Comm. Team', region: 'UK', contactNumber: 'Email: phishing@natwest.com', availability: 'N/A', notes: 'Forward suspicious emails. Text suspicious messages to 88355.' },
    { institution: 'NatWest', team: 'Retail Disputes Team', region: 'UK', contactNumber: '0800 015 4212', availability: 'Not specified', notes: 'Handles card transaction disputes. Can be triggered via app or call.' },
    { institution: 'NatWest', team: 'Credit Card Disputes Team', region: 'UK', contactNumber: '0800 904 7015', availability: 'Not specified', notes: 'For challenging unauthorised credit card transactions.' },
    { institution: 'NatWest', team: 'Scams Line', region: 'UK', contactNumber: '0800 028 9237', availability: 'Not specified', notes: 'Dedicated scams helpline.' },
    { institution: 'NatWest', team: 'Open Banking Fraud Team', region: 'UK', contactNumber: '0800 051 9010', availability: 'Not specified', notes: 'For third-party access or unauthorised data sharing.' },
    { institution: 'NatWest', team: 'Offshore Banking Customer Service', region: 'Jersey', contactNumber: '01534 282850', availability: 'Not specified', notes: 'For NatWest International or Offshore account support.' },
    { institution: 'NatWest', team: 'Faster Payments Team', region: 'UK', contactNumber: '0800 161 5165', availability: 'Not specified', notes: 'For when the bank is holding payments pending review.' },
    { institution: 'NatWest', team: 'Lost/Stolen Card Team', region: 'UK', contactNumber: '03457 888 444 (Relay UK 18001)', availability: '24/7', notes: 'Freeze card in app if needed.' },
    { institution: 'NatWest International', team: 'Debit Card Fraud Team', region: 'International', contactNumber: '0800 032 5963 / +44 131 339 7609', availability: 'Outside local hours', notes: 'For debit card fraud, including suspicious websites. Freeze card in app.' },
    { institution: 'NatWest International', team: 'General Fraud Team', region: 'International', contactNumber: '0800 032 5963 / +44 131 278 0277', availability: 'Outside local hours', notes: 'For credit card and online banking fraud.' },
    { institution: 'Nutmeg', team: 'Fraud or Security Team', region: 'UK', contactNumber: '020 3598 1515', availability: 'Mon-Fri 8 AM-8 PM, Sat 9 AM-5 PM', notes: 'For investment account fraud.' },
    { institution: 'Open Banking Limited', team: 'N/A', region: 'UK', contactNumber: 'N/A', availability: 'N/A', notes: 'Report to bank, then Action Fraud (0300 123 2040). Oversees open banking ecosystem.' },
    { institution: 'PayPal UK', team: 'Fraud and Security Team', region: 'UK', contactNumber: '0800 107 8666 / +44 203 901 6890', availability: '24/7', notes: 'Report via app or website under “Resolution Centre”.' },
    { institution: 'PayPal UK', team: 'Phishing Reporting', region: 'UK', contactNumber: 'Email: phishing@paypal.com', availability: 'N/A', notes: 'Forward suspicious emails.' },
    { institution: 'Payment Systems Regulator', team: 'N/A', region: 'UK', contactNumber: 'N/A', availability: 'N/A', notes: 'Oversees payment systems. Mandatory APP fraud reimbursement rules since Oct 2024.' },
    { institution: 'Plaid', team: 'N/A', region: 'UK/Global', contactNumber: 'N/A', availability: 'N/A', notes: 'Report to bank. Open banking provider for app-bank connections.' },
    { institution: 'Police Scotland', team: 'General Fraud Reporting', region: 'UK (Scotland)', contactNumber: '101', availability: 'Not specified', notes: 'For reporting fraud in Scotland. Alternative: 0808 164 6000.' },
    { institution: 'Principality Building Society', team: 'General Fraud Team', region: 'UK', contactNumber: '0330 123 9860', availability: 'Mon-Fri 8 AM-8 PM, Sat 9 AM-1 PM', notes: 'For suspicious activity on savings or mortgage accounts.' },
    { institution: 'Rathbones', team: 'Fraud or Security Team', region: 'UK', contactNumber: '020 7399 0000', availability: 'Mon-Fri 8 AM-5 PM', notes: 'For fraud on investment accounts.' },
    { institution: 'Revolut', team: 'General Fraud Team', region: 'UK', contactNumber: '+44 203 322 8352', availability: '24/7', notes: 'For credit/debit/online banking fraud. Block card via app. High complaint volume (2,888 to FOS in H1 2024).' },
    { institution: 'Revolut', team: 'Fraud Support Team', region: 'UK', contactNumber: 'In-app chat only', availability: 'Not specified', notes: 'Report scams, card fraud, or suspicious logins via the app.' },
    { institution: 'Revolut', team: 'Fraud Email Reporting', region: 'UK', contactNumber: 'reportfraud@revolut.com', availability: 'N/A', notes: 'Secondary fraud reporting option.' },
    { institution: 'Royal Bank of Scotland', team: 'Credit Card Fraud Team', region: 'UK', contactNumber: '03457 888 444 (Relay UK 18001)', availability: '24/7', notes: 'Report via app. Also for suspicious calls/fraudulent websites.' },
    { institution: 'Royal Bank of Scotland', team: 'Debit Card Fraud Team', region: 'UK', contactNumber: '03457 24 24 24 (Relay UK 18001)', availability: '24/7', notes: 'Report via app/Digital Banking. Freeze card in app if needed.' },
    { institution: 'Royal Bank of Scotland', team: 'Retail Disputes Team', region: 'UK', contactNumber: '03457 888 444 (Relay UK 18001)', availability: '24/7', notes: 'For card transaction disputes.' },
    { institution: 'Royal Bank of Scotland', team: 'Open Banking Fraud Team', region: 'UK', contactNumber: '03457 888 444 (Relay UK 18001)', availability: '24/7', notes: 'For third-party access or unauthorized data sharing.' },
    { institution: 'Santander UK', team: 'Credit Card Fraud Team', region: 'UK', contactNumber: '0800 171 2171 / +44 1908 237 963', availability: '24/7', notes: 'Report via app or Online Banking.' },
    { institution: 'Santander UK', team: 'Debit Card Fraud Team', region: 'UK', contactNumber: '0800 171 2171 / +44 1908 237 963', availability: '24/7', notes: 'Report via app or Online Banking.' },
    { institution: 'Santander UK', team: 'Online Banking Fraud Team', region: 'UK', contactNumber: '0800 917 9329 / +44 1512 328 445', availability: '24/7', notes: 'For compromised online banking credentials.' },
    { institution: 'Santander UK', team: 'Lost/Stolen Card Team', region: 'UK', contactNumber: '0800 171 2171 / +44 1908 237 963', availability: '24/7', notes: 'Freeze card in app if needed.' },
    { institution: 'Santander UK', team: 'Retail Disputes Team', region: 'UK', contactNumber: '0800 171 2171 / +44 1908 237 963', availability: '24/7', notes: 'For card transaction disputes.' },
    { institution: 'Santander UK', team: 'Open Banking Fraud Team', region: 'UK', contactNumber: '0800 917 9329 / +44 1512 328 445', availability: '24/7', notes: 'For third-party access or unauthorized data sharing.' },
    { institution: 'Shawbrook Bank', team: 'General Customer Support', region: 'UK', contactNumber: '0345 600 6260', availability: 'Not specified', notes: 'For fraud concerns or suspicious activity on savings or lending.' },
    { institution: 'Skipton Building Society', team: 'General Fraud Team', region: 'UK', contactNumber: '0345 850 1722', availability: 'Mon-Fri 8 AM-6 PM, Sat 9 AM-12 PM', notes: 'For suspicious activity on savings accounts.' },
    { institution: 'Standard Chartered UK', team: 'General Fraud Team', region: 'UK', contactNumber: '0800 056 5555 / +44 207 885 8888', availability: '24/7', notes: 'For credit/debit/online banking fraud.' },
    { institution: 'Starling Bank', team: 'General Fraud Team', region: 'UK', contactNumber: '0330 094 0130 / +44 20 3828 0888', availability: '24/7', notes: 'For credit/debit/online banking fraud. 378 FOS complaints in H1 2024. 127 fraudulent transactions per million in 2022.' },
    { institution: 'Stop Scams UK (159 Helpline)', team: 'General Fraud Helpline', region: 'UK', contactNumber: '159', availability: 'Not specified', notes: 'Connects to your bank’s fraud team. Supported by Revolut, Monzo, Starling, NatWest.' },
    { institution: 'Stripe UK', team: 'Fraud Support Team', region: 'UK', contactNumber: 'Submit case via https://support.stripe.com', availability: 'Not specified', notes: 'For payment fraud or suspicious transactions.' },
    { institution: 'Tesco Bank', team: 'Credit Card Fraud Team', region: 'UK', contactNumber: '0345 300 4278 / +44 1268 508027', availability: '24/7', notes: 'Report via app or Online Banking.' },
    { institution: 'Tesco Bank', team: 'Debit Card Fraud Team', region: 'UK', contactNumber: '0345 300 4278 / +44 1268 508027', availability: '24/7', notes: 'Report via app or Online Banking.' },
    { institution: 'Tesco Bank', team: 'Online Banking Fraud Team', region: 'UK', contactNumber: '0345 300 4278 / +44 1268 508027', availability: '24/7', notes: 'For compromised online banking credentials.' },
    { institution: 'Tesco Bank', team: 'Phishing Reporting', region: 'UK', contactNumber: 'Email: phishing@tescobank.com', availability: 'N/A', notes: 'Forward suspicious emails or texts.' },
    { institution: 'TrueLayer', team: 'N/A', region: 'UK/Global', contactNumber: 'N/A', availability: 'N/A', notes: 'Report to bank. Open banking provider for payments/data access.' },
    { institution: 'TSB', team: 'General Fraud Team', region: 'UK', contactNumber: '0800 096 8669 / +44 203 284 1575', availability: '24/7', notes: 'For credit/debit/online banking fraud. Report via app.' },
    { institution: 'TSB', team: 'Phishing/Suspicious Comm. Team', region: 'UK', contactNumber: 'Email: phishing@tsb.co.uk', availability: 'N/A', notes: 'Forward suspicious emails or texts.' },
    { institution: 'TSB', team: 'Retail Disputes Team', region: 'UK', contactNumber: '0800 096 8669 / +44 203 284 1575', availability: '24/7', notes: 'For card transaction disputes.' },
    { institution: 'TSB', team: 'Open Banking Fraud Team', region: 'UK', contactNumber: '0800 096 8669 / +44 203 284 1575', availability: '24/7', notes: 'For third-party access issues.' },
    { institution: 'UK Finance', team: 'Press Office (Not Fraud)', region: 'UK', contactNumber: '020 7416 6750', availability: 'Not specified', notes: 'Not for fraud reporting; for media inquiries. Report to bank/Action Fraud.' },
    { institution: 'Ulster Bank', team: 'Credit Card Fraud Team', region: 'UK', contactNumber: '03457 888 444 (Relay UK 18001)', availability: '24/7', notes: 'Report via app. Also for suspicious calls/fraudulent websites.' },
    { institution: 'Ulster Bank', team: 'Debit Card Fraud Team', region: 'UK', contactNumber: '03457 424 365 (Relay UK 18001)', availability: '24/7', notes: 'Report via app/Anytime Banking. Freeze card in app if needed.' },
    { institution: 'Ulster Bank', team: 'Retail Disputes Team', region: 'UK', contactNumber: '03457 888 444 (Relay UK 18001)', availability: '24/7', notes: 'For card transaction disputes.' },
    { institution: 'Ulster Bank', team: 'Open Banking Fraud Team', region: 'UK', contactNumber: '03457 888 444 (Relay UK 18001)', availability: '24/7', notes: 'For third-party access or unauthorized data sharing.' },
    { institution: 'Virgin Money', team: 'Credit Card Fraud Team', region: 'UK', contactNumber: '0800 015 1234 / +44 141 951 7320', availability: '24/7', notes: 'Report via app or Online Banking.' },
    { institution: 'Virgin Money', team: 'Debit Card Fraud Team', region: 'UK', contactNumber: '0800 015 1234 / +44 141 951 7320', availability: '24/7', notes: 'Report via app or Online Banking.' },
    { institution: 'Virgin Money', team: 'Phishing Reporting', region: 'UK', contactNumber: 'Email: phishing@virginmoney.com', availability: 'N/A', notes: 'Forward suspicious emails or texts.' },
    { institution: 'Virgin Money', team: 'Retail Disputes Team', region: 'UK', contactNumber: '0800 015 1234 / +44 141 951 7320', availability: '24/7', notes: 'For card transaction disputes.' },
    { institution: 'Virgin Money', team: 'Open Banking Fraud Team', region: 'UK', contactNumber: '0800 015 1234 / +44 141 951 7320', availability: '24/7', notes: 'For third-party access or unauthorized data sharing.' },
    { institution: 'Wise', team: 'General Fraud Team', region: 'UK/Global', contactNumber: '+44 808 175 1506', availability: 'Not specified', notes: 'For credit/debit/online banking fraud. Log case via app. Multi-currency accounts.' },
    { institution: 'Yorkshire Building Society', team: 'Fraud or Suspicious Activity Team', region: 'UK', contactNumber: '0345 1200 100', availability: 'Not specified', notes: 'Select relevant option for reporting scams or unauthorised use.' },
    { institution: 'Zopa', team: 'General Fraud Team', region: 'UK', contactNumber: '020 3870 2100', availability: 'Mon-Fri 9 AM-5 PM', notes: 'For loan or savings account fraud. Report via app.' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'institution', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedNumber, setCopiedNumber] = useState(null);
  const entriesPerPage = 10;

  const filteredData = useMemo(() => {
    let filtered = [...fraudContacts];

    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleCopyNumber = (number) => {
    navigator.clipboard.writeText(number).then(() => {
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(null), 2000);
    });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchTerm(e.target.value);
    }
  };

  return (
    <div
      className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
      style={{
        backgroundImage: `url(${fraudCheckerBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#e0f7fa',
      }}
    >
      <Header />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <section className="animate-fadeSlideIn">
          <div className="text-center mb-8">
            <img
              src={fraudCheckLogo}
              alt="Fraud Check Logo"
              className="h-24 sm:h-32 md:h-40 max-h-24 sm:max-h-32 md:max-h-40 mx-auto mb-0 object-contain"
            />
            <h1 className="text-3xl sm:text-4xl font-bold text-[#01355B] dark:text-[#01355B] -mt-4 sm:-mt-6">
              Fraud Contact Database
            </h1>
          </div>

          <div className="max-w-3xl mx-auto text-center mb-8">
            <p className="text-sm sm:text-base text-[#01355B] dark:text-[#01355B] italic">
              This database provides publicly available fraud contact numbers for informational purposes. Numbers may change, so please verify with the institution. We are not affiliated with these organizations. Always report fraud to your bank first, then to Action Fraud (0300 123 2040 in the UK).
            </p>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <input
              type="text"
              placeholder="Search by Institution or Region..."
              className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-[#01355B] focus:outline-none shadow-sm text-sm sm:text-base"
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              aria-label="Search fraud contacts"
            />
          </div>

          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse"
              role="grid"
              aria-label="Fraud Contact Database"
            >
              <thead>
                <tr className="bg-slate-200 dark:bg-slate-700">
                  <th
                    className="p-2 sm:p-4 text-left cursor-pointer text-[#01355B] dark:text-[#01355B] font-semibold text-sm sm:text-base"
                    onClick={() => handleSort('institution')}
                    aria-sort={sortConfig.key === 'institution' ? sortConfig.direction : 'none'}
                  >
                    Institution {sortConfig.key === 'institution' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-4 text-left cursor-pointer text-[#01355B] dark:text-[#01355B] font-semibold text-sm sm:text-base"
                    onClick={() => handleSort('team')}
                    aria-sort={sortConfig.key === 'team' ? sortConfig.direction : 'none'}
                  >
                    Team {sortConfig.key === 'team' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-4 text-left cursor-pointer text-[#01355B] dark:text-[#01355B] font-semibold text-sm sm:text-base"
                    onClick={() => handleSort('region')}
                    aria-sort={sortConfig.key === 'region' ? sortConfig.direction : 'none'}
                  >
                    Region {sortConfig.key === 'region' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-4 text-left cursor-pointer text-[#01355B] dark:text-[#01355B] font-semibold text-sm sm:text-base"
                    onClick={() => handleSort('contactNumber')}
                    aria-sort={sortConfig.key === 'contactNumber' ? sortConfig.direction : 'none'}
                  >
                    Fraud Contact Number {sortConfig.key === 'contactNumber' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    className="p-2 sm:p-4 text-left cursor-pointer text-[#01355B] dark:text-[#01355B] font-semibold text-sm sm:text-base"
                    onClick={() => handleSort('availability')}
                    aria-sort={sortConfig.key === 'availability' ? sortConfig.direction : 'none'}
                  >
                    Availability {sortConfig.key === 'availability' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-2 sm:p-4 text-left text-[#01355B] dark:text-[#01355B] font-semibold text-sm sm:text-base">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((entry, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? 'bg-slate-100 dark:bg-slate-800' : 'bg-white dark:bg-slate-900'
                    } hover:bg-slate-200 dark:hover:bg-slate-700 transition`}
                  >
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{entry.institution}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{entry.team}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{entry.region}</td>
                    <td className="p-2 sm:p-4 flex items-center space-x-2 text-sm sm:text-base">
                      <span>{entry.contactNumber}</span>
                      {entry.contactNumber !== 'N/A' &&
                        !entry.contactNumber.startsWith('Email:') &&
                        !entry.contactNumber.startsWith('phishing@') &&
                        !entry.contactNumber.startsWith('reportfraud@') &&
                        !entry.contactNumber.startsWith('emailscams@') &&
                        !entry.contactNumber.startsWith('internetsecurity@') &&
                        !entry.contactNumber.includes('paypal.com') &&
                        !entry.contactNumber.includes('virginmoney.com') &&
                        !entry.contactNumber.includes('clydesdalebank.co.uk') &&
                        !entry.contactNumber.includes('aldermore.co.uk') &&
                        !entry.contactNumber.includes('closebrothers.com') &&
                        !entry.contactNumber.includes('investec.co.uk') &&
                        !entry.contactNumber.includes('tescobank.com') && (
                          <button
                            onClick={() => handleCopyNumber(entry.contactNumber)}
                            className="text-[#01355B] hover:text-[#012A47] focus:outline-none"
                            aria-label={`Copy ${entry.contactNumber}`}
                          >
                            <ClipboardIcon className="w-4 sm:w-5 h-4 sm:h-5" aria-hidden="true" />
                          </button>
                        )}
                      {copiedNumber === entry.contactNumber && (
                        <span className="text-green-500 text-xs sm:text-sm">Copied!</span>
                      )}
                    </td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{entry.availability}</td>
                    <td className="p-2 sm:p-4 text-sm sm:text-base">{entry.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center items-center space-x-4 mt-6 text-[#01355B] dark:text-[#01355B]">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-white text-sm sm:text-base ${
                currentPage === 1
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#01355B] hover:bg-[#012A47]'
              } focus:outline-none focus:ring-2 focus:ring-[#01355B]`}
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="text-sm sm:text-base">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-white text-sm sm:text-base ${
                currentPage === totalPages
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#01355B] hover:bg-[#012A47]'
              } focus:outline-none focus:ring-2 focus:ring-[#01355B]`}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Contacts;