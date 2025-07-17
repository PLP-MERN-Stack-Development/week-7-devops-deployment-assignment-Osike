import React, { useState } from 'react';
import { Scale, Users, Shield, Heart, Eye, Briefcase } from 'lucide-react';
import { billOfRightsData } from '../data/billOfRights';

const BillOfRightsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const categories = [
    { id: 'all', name: 'All Rights', icon: Scale },
    { id: 'fundamental', name: 'Fundamental Rights', icon: Shield },
    { id: 'equality', name: 'Equality & Non-Discrimination', icon: Users },
    { id: 'life', name: 'Life & Security', icon: Heart },
    { id: 'freedom', name: 'Freedom & Privacy', icon: Eye },
    { id: 'economic', name: 'Economic & Social Rights', icon: Briefcase },
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? billOfRightsData.articles 
    : billOfRightsData.articles.filter(article => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Scale className="mr-4 h-10 w-10 text-amber-600" />
            Bill of Rights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chapter Four of the Constitution of Kenya 2010 - Your fundamental rights and freedoms.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-amber-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-amber-50 hover:text-amber-700 shadow-md'
                  }`}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Articles List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                Articles ({filteredArticles.length})
              </h2>
              <div className="grid gap-4">
                {filteredArticles.map((article) => (
                  <div
                    key={article.number}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedArticle?.number === article.number
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300 hover:bg-amber-25'
                    }`}
                    onClick={() => setSelectedArticle(article)}
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Article {article.number}: {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                        {article.category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                      <span className="text-xs text-gray-500">
                        {article.keyRights.length} key rights
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Article Detail */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              {selectedArticle ? (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Article {selectedArticle.number}: {selectedArticle.title}
                  </h3>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-2">Summary</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedArticle.summary}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-2">Key Rights</h4>
                    <ul className="space-y-2">
                      {selectedArticle.keyRights.map((right: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span className="text-sm text-gray-700">{right}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-2">Full Text</h4>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedArticle.fullText}
                      </p>
                    </div>
                  </div>

                  {selectedArticle.examples && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-2">Examples</h4>
                      <ul className="space-y-2">
                        {selectedArticle.examples.map((example: string, index: number) => (
                          <li key={index} className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800">
                      💡 <strong>Remember:</strong> These are your constitutional rights. If you believe any of these rights have been violated, seek legal advice immediately.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Scale className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Select an article to learn about your rights</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillOfRightsPage;