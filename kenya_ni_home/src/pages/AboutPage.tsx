import React from 'react';
import { Target, Users, Globe, Scale, Heart, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 pt-16">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About SheriaBot</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Democratizing access to legal information in Kenya through artificial intelligence
          </p>
        </div>

        <div className="space-y-12">
          {/* Mission */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 text-blue-800 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              SheriaBot is designed to bridge the gap between ordinary citizens and legal knowledge in Kenya. 
              Our AI-powered chatbot provides instant access to legal information, helping users understand 
              their rights and navigate legal procedures with confidence.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We focus specifically on common issues faced by residents in Mombasa County while serving 
              all Kenyans seeking legal guidance. Our goal is to make legal information accessible, 
              understandable, and actionable for everyone.
            </p>
          </section>

          {/* SDG 16 Connection */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Globe className="h-8 w-8 text-blue-800 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Supporting SDG 16</h2>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Sustainable Development Goal 16: Peace, Justice and Strong Institutions
              </h3>
              <p className="text-blue-800">
                "Promote peaceful and inclusive societies for sustainable development, provide access to 
                justice for all and build effective, accountable and inclusive institutions at all levels."
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              SheriaBot directly contributes to SDG 16 by promoting access to justice through technology. 
              We believe that informed citizens are empowered citizens, and that access to legal information 
              is a fundamental step toward achieving justice for all.
            </p>
          </section>

          {/* Features */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Scale className="h-8 w-8 text-blue-800 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Key Features</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <Heart className="h-6 w-6 text-amber-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Constitution Access</h3>
                  <p className="text-gray-700 text-sm">
                    Complete access to the Constitution of Kenya 2010, with special focus on the Bill of Rights.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="h-6 w-6 text-amber-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Legal Aid Resources</h3>
                  <p className="text-gray-700 text-sm">
                    Comprehensive directory of legal aid organizations and pro-bono services in Kenya.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Award className="h-6 w-6 text-amber-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Guidance</h3>
                  <p className="text-gray-700 text-sm">
                    Intelligent chatbot that understands legal queries and provides relevant information.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Globe className="h-6 w-6 text-amber-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Local Focus</h3>
                  <p className="text-gray-700 text-sm">
                    Special attention to legal issues common in Mombasa County and coastal Kenya.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Important Notice */}
          <section className="bg-red-50 border border-red-200 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-red-900 mb-4">Important Legal Notice</h2>
            <p className="text-red-800 leading-relaxed mb-4">
              SheriaBot provides general legal information for educational purposes only. The information 
              provided should not be considered as legal advice, and does not create an attorney-client 
              relationship.
            </p>
            <p className="text-red-800 leading-relaxed">
              For specific legal situations, always consult with qualified legal professionals. 
              The accuracy of information is maintained to the best of our ability, but laws may change 
              and individual circumstances vary.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get Involved</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              SheriaBot is an ongoing project committed to improving access to justice in Kenya. 
              We welcome feedback, suggestions, and collaboration opportunities.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 font-medium">
                Together, we can build a more just and informed society.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;