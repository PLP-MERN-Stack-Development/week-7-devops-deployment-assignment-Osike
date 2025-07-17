import React, { useState } from 'react';
import { Book, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { constitutionData } from '../data/constitution';

const ConstitutionPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const toggleChapter = (chapterNumber: number) => {
    setExpandedChapters(prev =>
      prev.includes(chapterNumber)
        ? prev.filter(num => num !== chapterNumber)
        : [...prev, chapterNumber]
    );
  };

  const filteredChapters = constitutionData.chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chapter.articles.some(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 pt-16">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Book className="mr-4 h-10 w-10 text-blue-800" />
            Constitution of Kenya 2010
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse and search the complete Constitution of Kenya. Click on any chapter to expand and view articles.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search the Constitution..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chapters List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Chapters</h2>
              <div className="space-y-4">
                {filteredChapters.map((chapter) => (
                  <div key={chapter.number} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleChapter(chapter.number)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Chapter {chapter.number}: {chapter.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {chapter.articles.length} articles
                        </p>
                      </div>
                      {expandedChapters.includes(chapter.number) ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedChapters.includes(chapter.number) && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <div className="space-y-2">
                          {chapter.articles.map((article) => (
                            <button
                              key={article.number}
                              onClick={() => setSelectedArticle(article)}
                              className="block w-full text-left p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
                            >
                              <h4 className="font-medium text-blue-800">
                                Article {article.number}: {article.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {article.content.substring(0, 150)}...
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
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
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedArticle.content}
                    </p>
                  </div>
                  {selectedArticle.isBillOfRights && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800 font-medium">
                        📜 This article is part of the Bill of Rights
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Book className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Select an article to view its full content</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstitutionPage;