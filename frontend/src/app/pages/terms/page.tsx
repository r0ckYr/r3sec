import React from "react";
import { Home, ArrowRight, FileText, Clock, Shield, Scale } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
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

    // Sections of the Terms of Service
    const sections = [
        {
            id: "introduction",
            title: "1. Introduction",
            icon: <FileText className="h-5 w-5" />,
            content: `
                <p>These Terms of Service ("Terms") govern your access to and use of R3SEC's website, products, and services (collectively, the "Services"). Please read these Terms carefully, as they constitute a legal agreement between you and R3SEC ("we," "us," or "our").</p>
                <p>By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Services.</p>
                <p>We may modify these Terms at any time, and such modifications shall be effective immediately upon posting on our website. Your continued use of the Services following the posting of modified Terms shall be deemed your acceptance of the modified Terms.</p>
            `
        },
        {
            id: "definitions",
            title: "2. Definitions",
            icon: <Scale className="h-5 w-5" />,
            content: `
                <p>Throughout these Terms, we use certain defined terms:</p>
                <ul>
                    <li><strong>"Services"</strong> refers to R3SEC's smart contract auditing services, security monitoring, code reviews, bug bounty programs, and all other products and services offered by R3SEC.</li>
                    <li><strong>"Client"</strong> refers to any individual or entity that engages R3SEC to provide Services.</li>
                    <li><strong>"Auditor"</strong> refers to any security expert working with R3SEC to provide security audits through our marketplace.</li>
                    <li><strong>"Report"</strong> refers to any security analysis, vulnerability assessment, or other documentation provided to Clients as part of our Services.</li>
                    <li><strong>"Platform"</strong> refers to the R3SEC website, dashboard, and any other digital interfaces we provide to access our Services.</li>
                </ul>
            `
        },
        {
            id: "account-creation",
            title: "3. Account Creation and Responsibilities",
            icon: <Shield className="h-5 w-5" />,
            content: `
                <p>3.1 <strong>Account Creation</strong></p>
                <p>To access certain features of our Services, you may be required to create an account. When you create an account, you must provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                
                <p>3.2 <strong>Account Security</strong></p>
                <p>You are solely responsible for maintaining the security of your account and for any activities or actions taken under your account. You must immediately notify R3SEC of any unauthorized use of your account or any other breach of security.</p>
                
                <p>3.3 <strong>Account Termination</strong></p>
                <p>We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we determine to be in violation of these Terms or otherwise harmful to other users, us, or third parties, or for any other reason.</p>
                
                <p>3.4 <strong>Multi-Factor Authentication</strong></p>
                <p>For security purposes, we strongly recommend enabling multi-factor authentication on your account. For certain account types or Service levels, multi-factor authentication may be mandatory.</p>
            `
        },
        {
            id: "service-description",
            title: "4. Service Description",
            icon: <FileText className="h-5 w-5" />,
            content: `
                <p>4.1 <strong>Smart Contract Audits</strong></p>
                <p>Our smart contract audit services involve a comprehensive review of smart contract code to identify vulnerabilities, security flaws, and potential improvements. The scope, methodology, and deliverables for each audit will be specified in a separate agreement between R3SEC and the Client.</p>
                
                <p>4.2 <strong>Security Monitoring</strong></p>
                <p>Our security monitoring services provide ongoing surveillance of deployed smart contracts to detect suspicious activities and potential security threats. The specific parameters, alert thresholds, and response protocols will be outlined in a separate service agreement.</p>
                
                <p>4.3 <strong>Code Reviews</strong></p>
                <p>Our code review services provide detailed analysis and feedback on code quality, security best practices, and potential vulnerabilities during the development process. The frequency, scope, and format of code reviews will be detailed in a separate agreement.</p>
                
                <p>4.4 <strong>Bug Bounty Programs</strong></p>
                <p>Our bug bounty program management services connect Clients with security researchers to identify and address vulnerabilities in exchange for rewards. The program parameters, eligibility criteria, and reward structures will be specified in a separate program agreement.</p>
                
                <p>4.5 <strong>Service Limitations</strong></p>
                <p>While we strive to provide comprehensive security services, we cannot guarantee that all vulnerabilities will be identified or that our Services will prevent all security incidents. Our Services are intended to reduce security risks, not eliminate them entirely.</p>
            `
        },
        {
            id: "client-obligations",
            title: "5. Client Obligations",
            icon: <FileText className="h-5 w-5" />,
            content: `
                <p>5.1 <strong>Accurate Information</strong></p>
                <p>Clients must provide accurate, complete, and up-to-date information about their projects, including but not limited to source code, documentation, and project specifications. Failure to provide accurate information may compromise the effectiveness of our Services.</p>
                
                <p>5.2 <strong>Cooperation</strong></p>
                <p>Clients must cooperate with R3SEC throughout the service delivery process, including responding to inquiries, providing additional information when requested, and participating in meetings or calls as necessary.</p>
                
                <p>5.3 <strong>Implementation of Recommendations</strong></p>
                <p>Clients are responsible for implementing any security recommendations provided by R3SEC. We are not responsible for security incidents that occur due to a Client's failure to implement our recommendations.</p>
                
                <p>5.4 <strong>Payment</strong></p>
                <p>Clients must pay all fees for Services as specified in their service agreement. Late payments may result in suspension or termination of Services.</p>
                
                <p>5.5 <strong>Code Ownership and Rights</strong></p>
                <p>Clients represent and warrant that they have all necessary rights to the code submitted for our Services and that such submission does not violate any third-party intellectual property rights.</p>
            `
        },
        {
            id: "auditor-terms",
            title: "6. Auditor Terms",
            icon: <FileText className="h-5 w-5" />,
            content: `
                <p>6.1 <strong>Auditor Qualifications</strong></p>
                <p>Auditors must meet and maintain certain qualifications to participate in our marketplace, including technical expertise, professional experience, and adherence to our code of conduct. R3SEC reserves the right to verify these qualifications at any time.</p>
                
                <p>6.2 <strong>Confidentiality</strong></p>
                <p>Auditors must maintain strict confidentiality regarding all Client information and code accessed through our Services. This obligation continues even after an Auditor's relationship with R3SEC ends.</p>
                
                <p>6.3 <strong>Non-Compete and Non-Solicitation</strong></p>
                <p>During their engagement with R3SEC and for a period of six months thereafter, Auditors agree not to directly solicit Clients introduced through R3SEC's platform for competing services.</p>
                
                <p>6.4 <strong>Quality Standards</strong></p>
                <p>Auditors must maintain high-quality standards in their work, follow our methodology guidelines, and meet deadlines as specified in audit agreements. R3SEC reserves the right to review Auditor work and request revisions if quality standards are not met.</p>
                
                <p>6.5 <strong>Payment Terms</strong></p>
                <p>Payment terms for Auditors, including rates, payment schedules, and processing fees, will be specified in separate agreements between R3SEC and each Auditor.</p>
            `
        },
        {
            id: "intellectual-property",
            title: "7. Intellectual Property Rights",
            icon: <FileText className="h-5 w-5" />,
            content: `
                <p>7.1 <strong>Ownership of Client Materials</strong></p>
                <p>Clients retain all intellectual property rights to their code, documentation, and other materials submitted to R3SEC. Our review, analysis, or possession of such materials does not transfer any ownership rights to R3SEC.</p>
                
                <p>7.2 <strong>Ownership of Reports</strong></p>
                <p>R3SEC retains intellectual property rights to the format, methodology, and framework of our Reports. Clients receive a perpetual, non-exclusive license to use, copy, and modify their specific Report content for their internal business purposes.</p>
                
                <p>7.3 <strong>Publicity Rights</strong></p>
                <p>Unless otherwise specified in a Client agreement, R3SEC reserves the right to publicly list Clients as customers and to describe the general nature of Services provided (without disclosing confidential details). Clients may opt out of such publicity by notifying R3SEC in writing.</p>
                
                <p>7.4 <strong>Feedback</strong></p>
                <p>If you provide us with feedback about our Services, you grant us a non-exclusive, perpetual, irrevocable, royalty-free license to use that feedback for any purpose, including improving our Services and developing new features.</p>
                
                <p>7.5 <strong>R3SEC Intellectual Property</strong></p>
                <p>All intellectual property rights in the R3SEC platform, methodology, tools, and documentation remain the exclusive property of R3SEC. No implied licenses are granted under these Terms.</p>
            `
        },
        {
            id: "confidentiality",
            title: "8. Confidentiality",
            icon: <FileText className="h-5 w-5" />,
            content: `
                <p>8.1 <strong>Definition of Confidential Information</strong></p>
                <p>Confidential Information includes all non-public information provided by a Client to R3SEC, including but not limited to source code, project documentation, business strategies, and security vulnerabilities identified during our Services.</p>
                
                <p>8.2 <strong>Protection of Confidential Information</strong></p>
                <p>R3SEC will protect Client Confidential Information with at least the same degree of care used to protect our own confidential information, but in no case less than reasonable care. We will not disclose Confidential Information to any third party without Client consent, except as required by law or as necessary to provide the Services.</p>
                
                <p>8.3 <strong>Exceptions</strong></p>
                <p>The confidentiality obligations do not apply to information that: (a) was rightfully known to R3SEC before receipt from the Client; (b) is or becomes publicly available through no fault of R3SEC; (c) is rightfully received by R3SEC from a third party without confidentiality obligations; or (d) is independently developed by R3SEC without use of Confidential Information.</p>
                
                <p>8.4 <strong>Duration of Confidentiality Obligations</strong></p>
                <p>Confidentiality obligations remain in effect for three years after the completion of Services, except for trade secrets, which remain confidential for as long as they qualify as trade secrets under applicable law.</p>
                
                <p>8.5 <strong>Return of Confidential Information</strong></p>
                <p>Upon Client request or termination of Services, R3SEC will return or destroy all Confidential Information, except as necessary to comply with legal obligations or maintain required business records.</p>
            `
        },
        {
            id: "disclaimer",
            title: "9. Disclaimer of Warranties",
            icon: <FileText className="h-5 w-5" />,
            content: `
                <p>9.1 <strong>Service Warranty</strong></p>
                <p>R3SEC warrants that the Services will be performed in a professional and workmanlike manner in accordance with generally accepted industry standards. This warranty is exclusive and in lieu of all other warranties, whether express or implied.</p>
                
                <p>9.2 <strong>Disclaimer</strong></p>
                <p>EXCEPT AS EXPRESSLY SET FORTH IN SECTION 9.1, THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. R3SEC SPECIFICALLY DISCLAIMS ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.</p>
                
                <p>9.3 <strong>No Security Guarantee</strong></p>
                <p>R3SEC DOES NOT WARRANT OR GUARANTEE THAT OUR SERVICES WILL IDENTIFY ALL SECURITY VULNERABILITIES IN CLIENT CODE OR THAT IMPLEMENTATION OF OUR RECOMMENDATIONS WILL PREVENT ALL SECURITY INCIDENTS. SECURITY AUDITS AND MONITORING ARE INHERENTLY LIMITED PROCESSES AND CANNOT GUARANTEE COMPLETE SECURITY.</p>
                
                <p>9.4 <strong>Third-Party Services</strong></p>
                <p>R3SEC MAKES NO WARRANTY REGARDING THIRD-PARTY SERVICES OR PRODUCTS THAT MAY BE USED IN CONNECTION WITH OUR SERVICES.</p>
                
                <p>9.5 <strong>Regulatory Compliance</strong></p>
                <p>R3SEC DOES NOT WARRANT THAT OUR SERVICES WILL ENSURE COMPLIANCE WITH ALL APPLICABLE LAWS, REGULATIONS, OR INDUSTRY STANDARDS. CLIENTS ARE RESPONSIBLE FOR DETERMINING WHETHER OUR SERVICES MEET THEIR REGULATORY REQUIREMENTS.</p>
            `
        },
        {
            id: "limitation-liability",
            title: "10. Limitation of Liability",
            icon: <FileText className="h-5 w-5" />,
            content: `
                <p>10.1 <strong>Limitation of Damages</strong></p>
                <p>IN NO EVENT SHALL R3SEC BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, LOSS OF DATA, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR THE USE OR INABILITY TO USE THE SERVICES, EVEN IF R3SEC HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
                
                <p>10.2 <strong>Cap on Liability</strong></p>
                <p>R3SEC'S TOTAL LIABILITY TO YOU FOR ANY DAMAGES ARISING OUT OF OR IN CONNECTION WITH THESE TERMS OR THE SERVICES, WHETHER IN CONTRACT, TORT, OR OTHERWISE, SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO R3SEC FOR THE SERVICES GIVING RISE TO THE CLAIM DURING THE TWELVE (12) MONTH PERIOD PRECEDING THE EVENT GIVING RISE TO LIABILITY.</p>
                
                <p>10.3 <strong>Essential Purpose</strong></p>
                <p>THE LIMITATIONS OF LIABILITY IN THIS SECTION SHALL APPLY TO THE FULLEST EXTENT PERMITTED BY LAW AND SHALL SURVIVE THE FAILURE OF ANY EXCLUSIVE REMEDY.</p>
                
                <p>10.4 <strong>Exclusions</strong></p>
                <p>SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATIONS OR EXCLUSIONS MAY NOT APPLY TO YOU. IN SUCH CASES, OUR LIABILITY WILL BE LIMITED TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW.</p>
                
                <p>10.5 <strong>Risk Allocation</strong></p>
                <p>THE PARTIES AGREE THAT THE LIMITATIONS OF LIABILITY SET FORTH IN THIS SECTION REPRESENT A REASONABLE ALLOCATION OF RISK AND ARE AN ESSENTIAL ELEMENT OF THE BASIS OF THE BARGAIN BETWEEN THE PARTIES.</p>
            `
        },
        {
            id: "indemnification",
            title: "11. Indemnification",
            icon: <FileText className="h-5 w-5" />,
            content: `
                <p>11.1 <strong>Client Indemnification</strong></p>
                <p>You agree to indemnify, defend, and hold harmless R3SEC and its officers, directors, employees, agents, and affiliates from and against any and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from or relating to:</p>
                <ul>
                    <li>Your violation of these Terms;</li>
                    <li>Your use of the Services;</li>
                    <li>Your violation of any rights of another person or entity;</li>
                    <li>Your breach of any representations or warranties made to R3SEC; or</li>
                    <li>Your failure to implement security recommendations provided by R3SEC.</li>
                </ul>
                
                <p>11.2 <strong>R3SEC Indemnification</strong></p>
                <p>R3SEC agrees to indemnify, defend, and hold harmless Client and its officers, directors, employees, agents, and affiliates from and against any and all third-party claims alleging that the Services infringe any intellectual property right of such third party. This indemnification obligation does not apply to claims arising from:</p>
                <ul>
                    <li>Client's modification of the Services;</li>
                    <li>Client's combination of the Services with other products, services, or materials; or</li>
                    <li>Client's continued use of the Services after being notified of alleged infringement.</li>
                </ul>
                
                <p>11.3 <strong>Indemnification Procedure</strong></p>
                <p>The indemnified party must (a) promptly notify the indemnifying party in writing of any claim; (b) give the indemnifying party sole control of the defense and settlement of the claim; and (c) provide reasonable cooperation to the indemnifying party at the indemnifying party's expense.</p>
            `
        },
        {
            id: "term-termination",
            title: "12. Term and Termination",
            icon: <Clock className="h-5 w-5" />,
            content: `
                <p>12.1 <strong>Term</strong></p>
                <p>These Terms commence on the date you first access or use our Services and continue until terminated as provided herein.</p>
                
                <p>12.2 <strong>Termination by You</strong></p>
                <p>You may terminate these Terms at any time by ceasing all use of the Services and closing your account. Termination does not relieve you of any payment obligations incurred prior to termination.</p>
                
                <p>12.3 <strong>Termination by R3SEC</strong></p>
                <p>R3SEC may terminate these Terms and your access to all or part of the Services at any time, with or without cause, with or without notice. R3SEC reserves the right to refuse service to anyone for any reason at any time.</p>
                
                <p>12.4 <strong>Effect of Termination</strong></p>
                <p>Upon termination:</p>
                <ul>
                    <li>Your right to access and use the Services will immediately cease;</li>
                    <li>R3SEC will stop providing Services to you;</li>
                    <li>You will remain liable for all amounts due under your account up to and including the date of termination; and</li>
                    <li>All payment obligations, ownership provisions, warranty disclaimers, indemnification obligations, and limitations of liability shall survive termination.</li>
                </ul>
                
                <p>12.5 <strong>Data Retention and Deletion</strong></p>
                <p>After termination, R3SEC may retain Client data for a reasonable period as required by law or for legitimate business purposes. Upon Client request, R3SEC will delete Client data in accordance with our data retention policy, except as required to comply with legal obligations.</p>
            `
        },
        {
            id: "dispute-resolution",
            title: "13. Dispute Resolution",
            icon: <Scale className="h-5 w-5" />,
            content: `
                <p>13.1 <strong>Informal Dispute Resolution</strong></p>
                <p>Before filing a claim against R3SEC, you agree to try to resolve the dispute informally by contacting us at legal@r3sec.xyz. We'll try to resolve the dispute informally by contacting you via email. If a dispute is not resolved within 30 days, you or R3SEC may proceed with formal dispute resolution.</p>
                
                <p>13.2 <strong>Agreement to Arbitrate</strong></p>
                <p>You and R3SEC agree to resolve any claims relating to these Terms or the Services through final and binding arbitration, except as set forth below. The American Arbitration Association (AAA) will administer the arbitration under its Commercial Arbitration Rules. The arbitration will be held in New York, New York, or another location mutually agreed upon by the parties.</p>
                
                <p>13.3 <strong>Exceptions to Agreement to Arbitrate</strong></p>
                <p>Either party may assert claims in small claims court if they qualify. Either party may seek injunctive or other equitable relief in any court of competent jurisdiction to prevent actual or threatened infringement, misappropriation, or violation of intellectual property rights.</p>
                
                <p>13.4 <strong>Class Action Waiver</strong></p>
                <p>YOU AND R3SEC AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.</p>
                
                <p>13.5 <strong>Governing Law</strong></p>
                <p>These Terms and any disputes arising out of or related to these Terms or the Services shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles.</p>
            `
        },
        {
            id: "general-provisions",
            title: "14. General Provisions",
            icon: <FileText className="h-5 w-5" />,
            content: `
                <p>14.1 <strong>Entire Agreement</strong></p>
                <p>These Terms constitute the entire agreement between you and R3SEC regarding the Services, superseding any prior agreements between you and R3SEC relating to the Services.</p>
                
                <p>14.2 <strong>Severability</strong></p>
                <p>If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that the Terms will otherwise remain in full force and effect and enforceable.</p>
                
                <p>14.3 <strong>Assignment</strong></p>
                <p>These Terms are not assignable, transferable, or sublicensable by you except with R3SEC's prior written consent. R3SEC may assign, transfer, or delegate any of its rights and obligations under these Terms without consent.</p>
                
                <p>14.4 <strong>Force Majeure</strong></p>
                <p>R3SEC shall not be liable for any failure or delay in performance due to causes beyond its reasonable control, including but not limited to acts of God, natural disasters, pandemic, war, terrorism, riots, civil unrest, government action, labor strikes, or internet disturbance.</p>
                
                <p>14.5 <strong>No Waiver</strong></p>
                <p>The failure of R3SEC to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision. Any waiver of any provision of these Terms will be effective only if in writing and signed by R3SEC.</p>
                
                <p>14.6 <strong>Notices</strong></p>
                <p>Any notices or other communications provided by R3SEC under these Terms will be given by posting to the Services or by email to the email address you provide. Notices to R3SEC should be sent to legal@r3sec.xyz.</p>
                
                <p>14.7 <strong>Relationship of the Parties</strong></p>
                <p>Nothing in these Terms shall be construed as creating a partnership, joint venture, agency, or employment relationship between you and R3SEC.</p>
                
                <p>14.8 <strong>Export Controls</strong></p>
                <p>You agree to comply with all applicable export and re-export control laws and regulations, including the Export Administration Regulations maintained by the U.S. Department of Commerce.</p>
                
                <p>14.9 <strong>Headings</strong></p>
                <p>The section titles in these Terms are for convenience only and have no legal or contractual effect.</p>
            `
        },
        {
            id: "contact",
            title: "15. Contact Information",
            icon: <FileText className="h-5 w-5" />,
            content: `
                <p>If you have any questions about these Terms, please contact us at:</p>
                
                <p>
                R3SEC Inc.<br />
                Email: legal@r3sec.xyz<br />
                Address: 123 Blockchain Way, Suite 500<br />
                New York, NY 10001<br />
                United States
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

                {/* Terms of Service Header */}
                <div
                    className="max-w-4xl mx-auto mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl font-bold mb-6 text-center">Terms of Service</h1>
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

                {/* Terms Content */}
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
                        Return to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
