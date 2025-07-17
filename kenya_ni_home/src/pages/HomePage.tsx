import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Book, Scale, Users, ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.3)' }}
        >
          <source
            src="src/assets/video.mp4"
            type="video/mp4"
          />
          {/* Fallback image */}
          <img
            src="https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="Legal Justice Background"
            className="w-full h-full object-cover"
          />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Welcome to <span className="text-amber-400">SheriaBot</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
            Your AI-powered legal assistant for Kenya. Get instant access to legal information,
            understand your rights, and find the help you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/chat"
              className="inline-flex items-center px-8 py-4 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Chatting
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/constitution"
              className="inline-flex items-center px-8 py-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Book className="mr-2 h-5 w-5" />
              Browse Constitution
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl border border-white border-opacity-20">
              <Scale className="h-12 w-12 text-amber-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">Legal Guidance</h3>
              <p className="text-gray-200">
                Get instant answers to common legal questions and understand your rights under Kenyan law.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl border border-white border-opacity-20">
              <Book className="h-12 w-12 text-amber-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">Constitution Access</h3>
              <p className="text-gray-200">
                Browse and search the Constitution of Kenya 2010, with special focus on the Bill of Rights.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl border border-white border-opacity-20">
              <Users className="h-12 w-12 text-amber-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">Legal Aid Resources</h3>
              <p className="text-gray-200">
                Find local legal aid organizations and pro-bono services in Mombasa and across Kenya.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="relative z-10 bg-red-900 bg-opacity-90 text-white py-4">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm">
            <strong>Important:</strong> SheriaBot provides general legal information only and does not offer personalized legal advice.{' '}
            <Link to="/disclaimer" className="underline hover:text-yellow-300">
              Read full disclaimer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;