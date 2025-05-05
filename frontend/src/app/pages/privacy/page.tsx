import React from "react";
import { Home, ArrowRight, Shield, Lock, Eye, Database, FileText, Clock, Globe, Bell } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
    // Basic animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4 }
        }
    };

    // Sections of the Privacy Policy
    const sections = [
        {
            id: "introduction",
            title: "1. Introduction",
            icon: <Shield className="h-5 w-5" />,
            content: `
                <p>R3SEC Inc. ("R3SEC," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our platform, or utilize our services, including our smart contract audit services, security monitoring, code reviews, and bug bounty programs (collectively, the "Services").</p>
                
                <p>Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.</p>
                
                <p>We may change this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
            `
        },
        {
            id: "information-collected",
            title: "2. Information We Collect",
            icon: <Database className="h-5 w-5" />,
            content: `
                <p>We collect several types of information from and about users of our Services, including:</p>
                
                <p>2.1 <strong>Personal Information</strong></p>
                <p>Personal information is data that can be used to identify you individually. Depending on your use of our Services, we may collect:</p>
                <ul>
                    <li>Contact information (such as name, email address, phone number, and business address)</li>
                    <li>Account credentials (such as username and password)</li>
                    <li>Professional information (such as job title, company name, and professional experience)</li>
                    <li>Payment information (such as billing address and payment method details; however, we do not store complete credit card information)</li>
                    <li>Communication data (information contained in communications you send to us)</li>
                </ul>
                
                <p>2.2 <strong>Technical and Usage Information</strong></p>
                <p>As you interact with our Services, we may automatically collect certain technical information about your equipment, browsing actions, and patterns, including:</p>
                <ul>
                    <li>Device information (such as your IP address, operating system, browser type, and device type)</li>
                    <li>Usage data (such as pages visited, time spent on pages, navigation paths, and other usage patterns)</li>
                    <li>Cookies and similar technologies (as described in our Cookie Policy)</li>
                    <li>Log data (such as access times, hardware and software information, and referring website addresses)</li>
                </ul>
                
                <p>2.3 <strong>Code and Project Information</strong></p>
                <p>When you submit code for audit or review, we collect:</p>
                <ul>
                    <li>Source code and related documentation</li>
                    <li>Project specifications and requirements</li>
                    <li>Deployment information for monitored contracts</li>
                    <li>Transaction data for security monitoring purposes</li>
                </ul>
                
                <p>2.4 <strong>Information From Third Parties</strong></p>
                <p>We may receive information about you from third parties, including:</p>
                <ul>
                    <li>Business partners (such as payment processors and authentication services)</li>
                    <li>Public databases or blockchain analytics platforms</li>
                    <li>Social media platforms (if you choose to connect your account to our Services)</li>
                </ul>
            `
        },
        {
            id: "information-use",
            title: "3. How We Use Your Information",
            icon: <FileText className="h-5 w-5" />,
            content: `
                <p>We use the information we collect about you for various purposes, including:</p>
                
                <p>3.1 <strong>Providing and Improving Our Services</strong></p>
                <ul>
                    <li>To provide, operate, and maintain our Services</li>
                    <li>To process and complete transactions, and send related information including confirmations and invoices</li>
                    <li>To perform security audits, code reviews, and monitoring services</li>
                    <li>To improve, personalize, and expand our Services</li>
                    <li>To understand how users use our Services, and to analyze trends and gather demographic information</li>
                    <li>To develop new products, services, features, and functionality</li>
                    <li>To generate aggregate, non-identifying analytics and benchmarks</li>
                </ul>
                
                <p>3.2 <strong>Communications</strong></p>
                <ul>
                    <li>To communicate with you about our Services, including sending service announcements, updates, security alerts, and support and administrative messages</li>
                    <li>To respond to your comments, questions, and requests</li>
                    <li>To provide customer service and technical support</li>
                    <li>To send you marketing communications, if you have opted in to receive them</li>
                </ul>
                
                <p>3.3 <strong>Security and Legal Compliance</strong></p>
                <ul>
                    <li>To protect the security and integrity of our Services</li>
                    <li>To detect, prevent, and address technical issues, security breaches, and fraudulent activities</li>
                    <li>To comply with legal obligations and enforce our terms of service</li>
                    <li>To protect our rights, property, or safety, and that of our users or others</li>
                </ul>
                
                <p>3.4 <strong>With Your Consent</strong></p>
                <p>We may use your information for any other purpose with your consent.</p>
            `
        },
        {
            id: "information-sharing",
            title: "4. How We Share Your Information",
            icon: <Eye className="h-5 w-5" />,
            content: `
                <p>We may share your information in the following situations:</p>
                
                <p>4.1 <strong>With Service Providers</strong></p>
                <p>We may share your information with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work. These third parties are contractually obligated to use your personal information only for the purposes for which we disclose it to them and to provide adequate protection for your data. Examples include:</p>
                <ul>
                    <li>Cloud service providers for data storage and processing</li>
                    <li>Payment processors for handling transactions</li>
                    <li>Analytics providers to help us understand service usage</li>
                    <li>Email and communication platforms for user communications</li>
                </ul>
                
                <p>4.2 <strong>With Auditors and Security Experts</strong></p>
                <p>If you use our audit marketplace, we may share your code and project information with selected security auditors who will perform the requested security assessment. These auditors are bound by confidentiality obligations and are prohibited from using your information for any purpose other than providing the requested services.</p>
                
                <p>4.3 <strong>For Business Transfers</strong></p>
                <p>We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company. We will notify you of such a change in ownership or transfer of assets by posting a notice on our website.</p>
                
                <p>4.4 <strong>For Legal Compliance</strong></p>
                <p>We may disclose your information where required to do so by law or subpoena or if we believe that such action is necessary to:</p>
                <ul>
                    <li>Comply with a legal obligation</li>
                    <li>Protect and defend our rights or property</li>
                    <li>Prevent or investigate possible wrongdoing in connection with the Services</li>
                    <li>Protect the personal safety of users of the Services or the public</li>
                    <li>Protect against legal liability</li>
                </ul>
                
                <p>4.5 <strong>With Your Consent</strong></p>
                <p>We may share your information with third parties when we have your consent to do so.</p>
                
                <p>4.6 <strong>Aggregated or Anonymized Data</strong></p>
                <p>We may share aggregated or anonymized information that cannot reasonably be used to identify you with third parties for industry analysis, research, and similar purposes.</p>
            `
        },
        {
            id: "data-security",
            title: "5. Data Security",
            icon: <Lock className="h-5 w-5" />,
            content: `
                <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. These measures include:</p>
                
                <p>5.1 <strong>Technical Safeguards</strong></p>
                <ul>
                    <li>Encryption of personal information in transit and at rest</li>
                    <li>Secure access controls and authentication systems</li>
                    <li>Firewalls and network security measures</li>
                    <li>Regular security assessments and penetration testing</li>
                    <li>Continuous monitoring for unauthorized access or data breaches</li>
                </ul>
                
                <p>5.2 <strong>Organizational Safeguards</strong></p>
                <ul>
                    <li>Employee training on privacy and security practices</li>
                    <li>Access restrictions based on job responsibilities</li>
                    <li>Confidentiality agreements with employees and contractors</li>
                    <li>Vendor security assessment and management processes</li>
                    <li>Incident response and breach notification procedures</li>
                </ul>
                
                <p>5.3 <strong>Limitations</strong></p>
                <p>However, please understand that no security system is impenetrable, and we cannot guarantee the absolute security of our databases, nor can we guarantee that information you supply will not be intercepted while being transmitted to us over the Internet. We will make any legally required disclosures of any breach of the security, confidentiality, or integrity of your unencrypted electronically stored personal information to you via email or conspicuous posting on our website in the most expedient time possible and without unreasonable delay, consistent with (i) the legitimate needs of law enforcement or (ii) any measures necessary to determine the scope of the breach and restore the reasonable integrity of the data system.</p>
            `
        },
        {
            id: "data-retention",
            title: "6. Data Retention",
            icon: <Clock className="h-5 w-5" />,
            content: `
                <p>6.1 <strong>Retention Period</strong></p>
                <p>We will retain your personal information for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements. In general:</p>
                <ul>
                    <li>Account information is retained for the duration of your account with us, plus a reasonable period thereafter</li>
                    <li>Service data, including audit reports and security findings, are retained for the period specified in your service agreement, typically between 1-3 years</li>
                    <li>Usage data and analytics may be retained for up to 2 years</li>
                    <li>Communication records are typically retained for 3 years after your last interaction with us</li>
                </ul>
                
                <p>6.2 <strong>Retention Criteria</strong></p>
                <p>To determine the appropriate retention period for personal information, we consider:</p>
                <ul>
                    <li>The amount, nature, and sensitivity of the personal information</li>
                    <li>The potential risk of harm from unauthorized use or disclosure</li>
                    <li>The purposes for which we process the personal information</li>
                    <li>Whether we can achieve those purposes through other means</li>
                    <li>Applicable legal, regulatory, tax, accounting, or other requirements</li>
                </ul>
                
                <p>6.3 <strong>Data Deletion</strong></p>
                <p>Upon account closure or upon your request, we will delete or anonymize your personal information unless:</p>
                <ul>
                    <li>We are required to retain it to comply with applicable laws</li>
                    <li>We are required to retain it for our legitimate business purposes, such as fraud prevention or to maintain financial records</li>
                    <li>There are outstanding issues, claims, or disputes requiring us to retain the data</li>
                </ul>
                
                <p>To request deletion of your personal information, please contact us at support@r3sec.xyz.</p>
            `
        },
        {
            id: "your-rights",
            title: "7. Your Rights and Choices",
            icon: <Shield className="h-5 w-5" />,
            content: `
                <p>Depending on your location, you may have certain rights regarding your personal information. These may include:</p>
                
                <p>7.1 <strong>Access and Data Portability</strong></p>
                <p>You may request access to the personal information we hold about you. Upon request, we will provide you with a copy of your personal information in a structured, commonly used, and machine-readable format.</p>
                
                <p>7.2 <strong>Correction</strong></p>
                <p>You have the right to have inaccurate personal information about you corrected and incomplete information completed. You can update much of your personal information directly through your account settings. For information that cannot be changed through your account, please contact us.</p>
                
                <p>7.3 <strong>Deletion</strong></p>
                <p>You have the right to request the deletion of your personal information in certain circumstances, such as when the information is no longer necessary for the purposes for which it was collected.</p>
                
                <p>7.4 <strong>Restriction of Processing</strong></p>
                <p>You have the right to request that we restrict the processing of your personal information in certain circumstances, such as when you contest the accuracy of your personal information.</p>
                
                <p>7.5 <strong>Objection to Processing</strong></p>
                <p>You have the right to object to the processing of your personal information in certain circumstances, such as when the processing is based on our legitimate interests.</p>
                
                <p>7.6 <strong>Withdrawal of Consent</strong></p>
                <p>Where we process your personal information based on your consent, you have the right to withdraw that consent at any time. This will not affect the lawfulness of processing based on your consent before its withdrawal.</p>
                
                <p>7.7 <strong>Marketing Communications</strong></p>
                <p>You can opt out of receiving marketing communications from us by clicking the "unsubscribe" link in any marketing email we send, or by contacting us directly. Please note that you may continue to receive service-related communications even if you opt out of marketing communications.</p>
                
                <p>7.8 <strong>Cookies and Tracking Technologies</strong></p>
                <p>Most web browsers are set to accept cookies by default. You can usually choose to set your browser to remove or reject cookies. Please note that such actions could affect the availability and functionality of our Services.</p>
                
                <p>7.9 <strong>How to Exercise Your Rights</strong></p>
                <p>To exercise any of these rights, please contact us at privacy@r3sec.xyz. We may need to verify your identity before responding to your request.</p>
            `
        },
        {
            id: "international-data",
            title: "8. International Data Transfers",
            icon: <Globe className="h-5 w-5" />,
            content: `
                <p>8.1 <strong>Global Operations</strong></p>
                <p>R3SEC is headquartered in the United States and has operations and service providers in various countries. Your personal information may be transferred to, stored, and processed in countries outside of your country of residence, including the United States and other countries that may have different data protection laws than those in your country.</p>
                
                <p>8.2 <strong>Transfer Safeguards</strong></p>
                <p>When we transfer personal information from the European Economic Area (EEA), the United Kingdom, or Switzerland to countries that have not been deemed to provide an adequate level of protection, we use one or more of the following safeguards:</p>
                <ul>
                    <li>Standard Contractual Clauses approved by the European Commission</li>
                    <li>Binding Corporate Rules for transfers to group companies</li>
                    <li>Derogations for specific situations, such as when the transfer is necessary for the performance of a contract</li>
                </ul>
                
                <p>8.3 <strong>EU-U.S. Data Privacy Framework and Swiss-U.S. Privacy Framework</strong></p>
                <p>R3SEC participates in and complies with the EU-U.S. Data Privacy Framework and the Swiss-U.S. Privacy Framework as set forth by the U.S. Department of Commerce regarding the collection, use, and retention of personal information transferred from the European Union, the United Kingdom, and Switzerland to the United States, respectively.</p>
                
                <p>8.4 <strong>Your Consent</strong></p>
                <p>By using our Services, you consent to the transfer of your personal information to countries outside of your country of residence, including the United States. If you are located in the EEA, the United Kingdom, or Switzerland, you have the right to withdraw your consent at any time by contacting us, but please note that this will not affect the lawfulness of any processing carried out before you withdraw your consent.</p>
            `
        },
        {
            id: "children-privacy",
            title: "9. Children's Privacy",
            icon: <Shield className="h-5 w-5" />,
            content: `
                <p>Our Services are not intended for use by children under the age of 16, and we do not knowingly collect personal information from children under 16. If you are a parent or guardian and you believe that your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from children without verification of parental consent, we will take steps to remove that information from our servers.</p>
            `
        },
        {
            id: "third-party-sites",
            title: "10. Third-Party Websites and Services",
            icon: <Globe className="h-5 w-5" />,
            content: `
                <p>10.1 <strong>Links to Third-Party Websites</strong></p>
                <p>Our Services may contain links to third-party websites and services that are not owned or controlled by R3SEC. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the privacy policy of every site you visit.</p>
                
                <p>10.2 <strong>Third-Party Services</strong></p>
                <p>We may use third-party services, such as analytics providers, payment processors, and customer support tools, to help us operate our Services. These third-party services may collect information about you when you use our Services. The information collected by these third parties is subject to their own privacy policies.</p>
                
                <p>10.3 <strong>Social Media Features</strong></p>
                <p>Our Services may include social media features, such as the Facebook "Like" button or Twitter "Share" button. These features may collect your IP address, which page you are visiting on our Services, and may set a cookie to enable the feature to function properly. Social media features are either hosted by a third party or hosted directly on our Services. Your interactions with these features are governed by the privacy policy of the company providing the feature.</p>
            `
        },
        {
            id: "changes",
            title: "11. Changes to this Privacy Policy",
            icon: <Bell className="h-5 w-5" />,
            content: `
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.</p>
                
                <p>We will let you know via email and/or a prominent notice on our Services, prior to the change becoming effective and update the "Last Updated" date at the top of this Privacy Policy.</p>
                
                <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
            `
        },
        {
            id: "data-protection-officer",
            title: "12. Data Protection Officer",
            icon: <Lock className="h-5 w-5" />,
            content: `
                <p>We have appointed a Data Protection Officer (DPO) who is responsible for overseeing questions in relation to this Privacy Policy. If you have any questions about this Privacy Policy, including any requests to exercise your legal rights, please contact our DPO using the details set out below.</p>
                
                <p><strong>Data Protection Officer</strong><br>
                R3SEC Inc.<br>
                Email: dpo@r3sec.xyz<br>
                Phone: +1 (555) 123-4567<br>
                Address: 123 Blockchain Way, Suite 500, New York, NY 10001, United States</p>
            `
        },
        {
            id: "your-legal-rights",
            title: "13. Your Legal Rights Under GDPR and CCPA",
            icon: <Shield className="h-5 w-5" />,
            content: `
                <p>13.1 <strong>European Privacy Rights (GDPR)</strong></p>
                <p>If you are a resident of the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR). These rights are summarized in Section 7, but specifically include:</p>
                <ul>
                    <li>The right to access, update or delete the information we have on you</li>
                    <li>The right of rectification - to have your information rectified if it is inaccurate or incomplete</li>
                    <li>The right to object to our processing of your personal data</li>
                    <li>The right of restriction - to request that we restrict the processing of your personal information</li>
                    <li>The right to data portability - to receive your personal information in a structured, commonly used, and machine-readable format</li>
                    <li>The right to withdraw consent at any time where we relied on your consent to process your personal information</li>
                </ul>
                <p>You have the right to complain to a Data Protection Authority about our collection and use of your personal information. For more information, please contact your local data protection authority in the EEA.</p>
                
                <p>13.2 <strong>California Privacy Rights (CCPA/CPRA)</strong></p>
                <p>If you are a California resident, the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA) provides you with specific rights regarding your personal information. These include:</p>
                <ul>
                    <li>The right to know what personal information we collect about you and how we use and disclose it</li>
                    <li>The right to access your personal information</li>
                    <li>The right to request deletion of your personal information</li>
                    <li>The right to correct inaccurate personal information</li>
                    <li>The right to opt-out of the sale or sharing of your personal information</li>
                    <li>The right to limit the use and disclosure of sensitive personal information</li>
                    <li>The right to non-discrimination for exercising your CCPA rights</li>
                </ul>
                <p>To exercise your rights under the CCPA/CPRA, please contact us as described in Section 14 below. We will verify your request using the information associated with your account, including email address. Government identification may be required.</p>
                
                <p>13.3 <strong>Other State Privacy Laws</strong></p>
                <p>Residents of Virginia, Colorado, Connecticut, and Utah may also have similar privacy rights under their state laws. To exercise these rights, please contact us as described in Section 14 below.</p>
            `
        },
        {
            id: "contact",
            title: "14. Contact Information",
            icon: <FileText className="h-5 w-5" />,
            content: `
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                
                <p>
                R3SEC Inc.<br />
                Email: privacy@r3sec.xyz<br />
                Address: 123 Blockchain Way, Suite 500<br />
                New York, NY 10001<br />
                United States<br />
                Phone: +1 (555) 123-4567
                </p>
                
                <p>Last Updated: May 1, 2025</p>
            `
        }
    ];

    return (
        <div className="bg-white text-black">
            <div className="container mx-auto px-4 py-16">
                {/* Top Home Button */}
                <div className="mb-8 flex justify-start">
                    <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 border border-black rounded font-medium hover:bg-black hover:text-white transition-colors"
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Return to Home
                    </Link>
                </div>

                {/* Privacy Policy Header */}
                <div
                    className="max-w-4xl mx-auto mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
                    <p className="text-center text-gray-700 mb-8">
                        Last Updated: May 1, 2025
                    </p>
                    <hr className="border-t border-gray-300 mb-8" />
                </div>

                {/* Table of Contents */}
                <div
                    className="max-w-4xl mx-auto mb-12 p-6 border border-gray-300 rounded"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {sections.map((section, index) => (
                            <a
                                key={index}
                                href={`#${section.id}`}
                                className="inline-flex items-center py-1 hover:underline"
                            >
                                <span className="mr-2">{section.icon}</span>
                                <span>{section.title}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Privacy Policy Content */}
                <div
                    className="max-w-4xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            id={section.id}
                            className="mb-12 scroll-mt-24"
                            variants={itemVariants}
                        >
                            <div className="flex items-center mb-4">
                                <span className="mr-3">{section.icon}</span>
                                <h2 className="text-2xl font-bold">{section.title}</h2>
                            </div>
                            <div
                                className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: section.content }}
                            />
                            <div className="mt-6 text-right">
                            </div>
                            {index < sections.length - 1 && (
                                <hr className="border-t border-gray-200 mt-8" />
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom Home Button */}
                <div className="mt-16 mb-8 flex justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-3 border-2 border-black rounded-lg font-medium hover:bg-black hover:text-white transition-colors"
                    >
                        <Home className="mr-2 h-5 w-5" />
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
