import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card>
            <CardContent className="prose prose-slate max-w-none p-6 text-foreground">
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                  <div className="text-muted-foreground space-y-3">
                    <h3 className="text-lg font-medium text-foreground">Personal Information</h3>
                    <p>We collect information you provide directly to us, such as:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Name, email address, phone number</li>
                      <li>Educational information (institution, course, level)</li>
                      <li>Profile information and preferences</li>
                      <li>CV/Resume and other documents you upload</li>
                      <li>Communication preferences</li>
                    </ul>
                  </div>
                  
                  <div className="text-muted-foreground space-y-3 mt-4">
                    <h3 className="text-lg font-medium text-foreground">Usage Information</h3>
                    <p>We automatically collect certain information about your use of our platform:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Device information (IP address, browser type, operating system)</li>
                      <li>Usage patterns (pages visited, time spent, clicks)</li>
                      <li>Application and search history</li>
                      <li>Log data and analytics information</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                  <div className="text-muted-foreground space-y-3">
                    <p>We use the information we collect to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Provide and maintain our placement services</li>
                      <li>Process your applications and communicate with companies</li>
                      <li>Send you notifications about application status and opportunities</li>
                      <li>Improve our platform and develop new features</li>
                      <li>Provide customer support and respond to your inquiries</li>
                      <li>Send you updates about our services (with your consent)</li>
                      <li>Prevent fraud and ensure platform security</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">3. Information Sharing and Disclosure</h2>
                  <div className="text-muted-foreground space-y-3">
                    <h3 className="text-lg font-medium text-foreground">With Companies</h3>
                    <p>When you apply for a placement, we share relevant information from your profile and application with the company, including:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Personal and contact information</li>
                      <li>Educational background and qualifications</li>
                      <li>CV and supporting documents</li>
                      <li>Application responses and preferences</li>
                    </ul>
                  </div>
                  
                  <div className="text-muted-foreground space-y-3 mt-4">
                    <h3 className="text-lg font-medium text-foreground">Service Providers</h3>
                    <p>We may share your information with third-party service providers who help us operate our platform, such as:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Cloud storage and hosting providers</li>
                      <li>Email and communication service providers</li>
                      <li>Analytics and performance monitoring services</li>
                      <li>Payment processors (if applicable)</li>
                    </ul>
                  </div>
                  
                  <div className="text-muted-foreground space-y-3 mt-4">
                    <h3 className="text-lg font-medium text-foreground">Legal Requirements</h3>
                    <p>We may disclose your information if required to do so by law or in response to valid requests by public authorities.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                  <div className="text-muted-foreground space-y-3">
                    <p>We implement appropriate technical and organizational measures to protect your personal information against:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Unauthorized access, alteration, disclosure, or destruction</li>
                      <li>Accidental loss or damage</li>
                      <li>Unlawful processing</li>
                    </ul>
                    <p className="mt-3">
                      However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal information, we cannot guarantee its absolute security.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">5. Your Rights and Choices</h2>
                  <div className="text-muted-foreground space-y-3">
                    <p>You have the right to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                      <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete information</li>
                      <li><strong>Erasure:</strong> Request deletion of your personal information</li>
                      <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                      <li><strong>Restriction:</strong> Request limitation of processing of your information</li>
                      <li><strong>Objection:</strong> Object to processing of your information for certain purposes</li>
                      <li><strong>Withdraw consent:</strong> Where processing is based on consent</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
                  <div className="text-muted-foreground space-y-3">
                    <p>We retain your personal information for as long as necessary to:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Provide our services to you</li>
                      <li>Comply with legal obligations</li>
                      <li>Resolve disputes and enforce agreements</li>
                      <li>Improve our services</li>
                    </ul>
                    <p className="mt-3">
                      When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal reasons.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
                  <p className="text-muted-foreground mb-4">
                    Our platform is not intended for children under 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
                  <p className="text-muted-foreground mb-4">
                    Your information may be transferred to and processed in countries other than Nigeria. We ensure that such transfers are subject to appropriate safeguards and comply with applicable data protection laws.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
                  <p className="text-muted-foreground mb-4">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
                  <div className="text-muted-foreground space-y-2">
                    <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us:</p>
                    <p>Email: privacy@studentplacenigeria.com</p>
                    <p>Phone: +234 800 STUDENT</p>
                    <p>Address: Lagos, Nigeria</p>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;