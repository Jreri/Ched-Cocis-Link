import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Card>
            <CardContent className="prose prose-slate max-w-none p-6 text-foreground">
              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground mb-4">
                    By accessing and using StudentPlace Nigeria ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">2. Platform Description</h2>
                  <p className="text-muted-foreground mb-4">
                    StudentPlace Nigeria is an online platform that connects Nigerian students with companies offering student placement opportunities. We facilitate the connection between students and potential placement hosts but do not guarantee placement positions.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Registration</h2>
                  <div className="text-muted-foreground space-y-3">
                    <p>3.1. You must be at least 16 years old to create an account.</p>
                    <p>3.2. You are responsible for maintaining the confidentiality of your account credentials.</p>
                    <p>3.3. You must provide accurate and complete information during registration.</p>
                    <p>3.4. You are responsible for all activities that occur under your account.</p>
                    <p>3.5. We reserve the right to suspend or terminate accounts that violate these terms.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
                  <div className="text-muted-foreground space-y-3">
                    <p>4.1. Provide truthful and accurate information in all applications and profiles.</p>
                    <p>4.2. Respect the intellectual property rights of others.</p>
                    <p>4.3. Not use the platform for any illegal or unauthorized purpose.</p>
                    <p>4.4. Not attempt to gain unauthorized access to other user accounts or platform systems.</p>
                    <p>4.5. Communicate professionally with companies and other users.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">5. Platform Services</h2>
                  <div className="text-muted-foreground space-y-3">
                    <p>5.1. We provide a platform for students to discover and apply for placement opportunities.</p>
                    <p>5.2. We do not guarantee the availability or quality of placement positions.</p>
                    <p>5.3. We are not responsible for the conduct of companies or students using the platform.</p>
                    <p>5.4. We reserve the right to modify or discontinue services at any time.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">6. Privacy and Data Protection</h2>
                  <p className="text-muted-foreground mb-4">
                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the platform, to understand our practices regarding the collection and use of your personal information.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
                  <div className="text-muted-foreground space-y-3">
                    <p>7.1. All content on the platform, including text, graphics, logos, and software, is owned by StudentPlace Nigeria or our licensors.</p>
                    <p>7.2. Users retain ownership of content they upload but grant us a license to use it for platform operations.</p>
                    <p>7.3. Users may not reproduce, distribute, or create derivative works from platform content without permission.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
                  <p className="text-muted-foreground mb-4">
                    The platform is provided "as is" without any warranties, expressed or implied. We do not warrant that the service will be uninterrupted, timely, secure, or error-free.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
                  <p className="text-muted-foreground mb-4">
                    StudentPlace Nigeria shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
                  <div className="text-muted-foreground space-y-3">
                    <p>10.1. You may terminate your account at any time by contacting us.</p>
                    <p>10.2. We may terminate or suspend your account immediately for violations of these terms.</p>
                    <p>10.3. Upon termination, your right to use the platform ceases immediately.</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
                  <p className="text-muted-foreground mb-4">
                    These terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
                  <p className="text-muted-foreground mb-4">
                    We reserve the right to modify these terms at any time. We will notify users of any material changes via email or platform notification. Continued use of the platform after changes constitutes acceptance of the new terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
                  <div className="text-muted-foreground space-y-2">
                    <p>If you have any questions about these Terms of Service, please contact us:</p>
                    <p>Email: legal@studentplacenigeria.com</p>
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

export default Terms;