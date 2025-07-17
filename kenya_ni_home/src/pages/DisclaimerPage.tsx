import React from 'react';
import { AlertTriangle, Scale, Shield, FileText } from 'lucide-react';

const DisclaimerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-amber-50 pt-16">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Legal Disclaimer</h1>
          </div>
          <p className="text-xl text-gray-600">
            Important information about using SheriaBot
          </p>
        </div>

        <div className="space-y-8">
          {/* Main Disclaimer */}
          <section className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-red-500">
            <div className="flex items-center mb-4">
              <Scale className="h-6 w-6 text-red-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">No Legal Advice</h2>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>SheriaBot provides general legal information only and does not provide legal advice.</strong> 
              The information provided through this platform is for educational and informational purposes only 
              and should not be construed as legal advice or as creating an attorney-client relationship.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Legal advice is counsel about a specific legal matter and can only be provided by a qualified 
              attorney who is familiar with the facts and circumstances of your particular situation.
            </p>
          </section>

          {/* No Attorney-Client Relationship */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">No Attorney-Client Relationship</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Use of SheriaBot does not create an attorney-client relationship between you and the creators, 
              operators, or any legal professionals associated with this platform. Confidential or 
              time-sensitive information should not be sent through this platform.
            </p>
          </section>

          {/* Accuracy of Information */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Accuracy of Information</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                While we strive to provide accurate and up-to-date legal information, we make no warranties 
                or representations about the accuracy, completeness, or reliability of the information provided.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Laws change frequently, and the interpretation of laws can vary. The information provided 
                may not reflect the most current legal developments or may not apply to your specific 
                situation.
              </p>
            </div>
          </section>

          {/* Limitations */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Limitations</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                SheriaBot cannot provide personalized legal advice for your specific situation
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                The platform cannot guarantee the accuracy or completeness of information
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Information provided may not be applicable to all jurisdictions within Kenya
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                The platform cannot replace consultation with qualified legal professionals
              </li>
            </ul>
          </section>

          {/* When to Seek Professional Help */}
          <section className="bg-blue-50 border border-blue-200 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">When to Seek Professional Legal Help</h2>
            <p className="text-blue-800 leading-relaxed mb-4">
              You should consult with qualified legal professionals in the following situations:
            </p>
            <ul className="space-y-2 text-blue-800">
              <li>• You are facing criminal charges</li>
              <li>• You are involved in a civil lawsuit</li>
              <li>• You need to file legal documents with courts</li>
              <li>• You are dealing with complex legal matters</li>
              <li>• Your rights have been violated</li>
              <li>• You need representation in legal proceedings</li>
              <li>• Time-sensitive legal issues</li>
            </ul>
          </section>

          {/* Liability */}
          <section className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              To the fullest extent permitted by law, the creators and operators of SheriaBot disclaim 
              all liability for any damages arising from the use of this platform or reliance on the 
              information provided. This includes but is not limited to direct, indirect, incidental, 
              consequential, or punitive damages.
            </p>
          </section>

          {/* Acceptance */}
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-amber-900 mb-4">Acceptance of Terms</h2>
            <p className="text-amber-800 leading-relaxed">
              By using SheriaBot, you acknowledge that you have read, understood, and agree to be bound 
              by this disclaimer. If you do not agree with these terms, please do not use this platform.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Questions About This Disclaimer?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about this disclaimer or need clarification about SheriaBot's limitations, 
              please review our About page or consult with a qualified legal professional.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Remember:</strong> When in doubt, seek professional legal advice. No online platform 
                can replace the personalized guidance of a qualified attorney.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;