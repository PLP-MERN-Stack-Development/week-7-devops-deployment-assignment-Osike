import ConstitutionArticle from '../models/ConstitutionArticle.js';
import LegalTopic from '../models/LegalTopic.js';
import FAQ from '../models/FAQ.js';
import LegalAidProvider from '../models/LegalAidProvider.js';

// Main chatbot response generation service
export const generateChatResponse = async (userMessage, session) => {
  try {
    const message = userMessage.toLowerCase().trim();
    
    // Initialize response object
    const response = {
      text: '',
      confidence: 0,
      matchedTopics: [],
      referencedArticles: [],
      suggestions: []
    };

    // Check for FAQ matches first
    const faqMatch = await findFAQMatch(message);
    if (faqMatch && faqMatch.confidence > 0.7) {
      response.text = faqMatch.answer;
      response.confidence = faqMatch.confidence;
      response.referencedArticles = faqMatch.relatedArticles;
      response.suggestions = generateSuggestions(faqMatch.category);
      return response;
    }

    // Check for constitution article queries
    const constitutionMatch = await findConstitutionMatch(message);
    if (constitutionMatch && constitutionMatch.confidence > 0.6) {
      response.text = constitutionMatch.response;
      response.confidence = constitutionMatch.confidence;
      response.referencedArticles = constitutionMatch.articles;
      response.matchedTopics = ['constitution'];
      response.suggestions = generateConstitutionSuggestions();
      return response;
    }

    // Check for legal topic matches
    const topicMatch = await findLegalTopicMatch(message);
    if (topicMatch && topicMatch.confidence > 0.6) {
      response.text = topicMatch.response;
      response.confidence = topicMatch.confidence;
      response.matchedTopics = [topicMatch.category];
      response.referencedArticles = topicMatch.relatedArticles;
      response.suggestions = generateTopicSuggestions(topicMatch.category);
      return response;
    }

    // Check for legal aid queries
    const legalAidMatch = await findLegalAidMatch(message);
    if (legalAidMatch && legalAidMatch.confidence > 0.6) {
      response.text = legalAidMatch.response;
      response.confidence = legalAidMatch.confidence;
      response.matchedTopics = ['legal-aid'];
      response.suggestions = generateLegalAidSuggestions();
      return response;
    }

    // Default response for unmatched queries
    response.text = generateDefaultResponse(message);
    response.confidence = 0.3;
    response.suggestions = generateGeneralSuggestions();

    return response;

  } catch (error) {
    console.error('Chatbot service error:', error);
    return {
      text: "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact our legal aid partners for immediate assistance.",
      confidence: 0,
      matchedTopics: [],
      referencedArticles: [],
      suggestions: []
    };
  }
};

// Find FAQ matches
const findFAQMatch = async (message) => {
  try {
    const faqs = await FAQ.find({ is_active: true })
      .populate('related_articles', 'article_number title');

    let bestMatch = null;
    let highestScore = 0;

    for (const faq of faqs) {
      const score = calculateTextSimilarity(message, faq.question.toLowerCase());
      
      // Also check keywords
      const keywordScore = faq.keywords.reduce((acc, keyword) => {
        return message.includes(keyword.toLowerCase()) ? acc + 0.2 : acc;
      }, 0);

      const totalScore = Math.min(score + keywordScore, 1);

      if (totalScore > highestScore && totalScore > 0.5) {
        highestScore = totalScore;
        bestMatch = {
          answer: faq.answer,
          confidence: totalScore,
          category: faq.category,
          relatedArticles: faq.related_articles.map(a => a.article_number)
        };
      }
    }

    return bestMatch;
  } catch (error) {
    console.error('FAQ matching error:', error);
    return null;
  }
};

// Find constitution article matches
const findConstitutionMatch = async (message) => {
  try {
    // Check for specific article number mentions
    const articleNumberMatch = message.match(/article\s+(\d+)/i);
    if (articleNumberMatch) {
      const articleNumber = parseInt(articleNumberMatch[1]);
      const article = await ConstitutionArticle.findOne({ article_number: articleNumber });
      
      if (article) {
        return {
          response: formatArticleResponse(article),
          confidence: 0.9,
          articles: [articleNumber]
        };
      }
    }

    // Check for Bill of Rights queries
    if (message.includes('bill of rights') || message.includes('human rights') || message.includes('fundamental rights')) {
      const billOfRightsArticles = await ConstitutionArticle.findBillOfRightsArticles()
        .limit(5);
      
      return {
        response: formatBillOfRightsResponse(billOfRightsArticles),
        confidence: 0.8,
        articles: billOfRightsArticles.map(a => a.article_number)
      };
    }

    // Search for keyword matches in constitution
    const searchResults = await ConstitutionArticle.searchArticles(message, { limit: 3 });
    
    if (searchResults.length > 0) {
      const topResult = searchResults[0];
      return {
        response: formatArticleResponse(topResult),
        confidence: 0.7,
        articles: [topResult.article_number]
      };
    }

    return null;
  } catch (error) {
    console.error('Constitution matching error:', error);
    return null;
  }
};

// Find legal topic matches
const findLegalTopicMatch = async (message) => {
  try {
    const topics = await LegalTopic.find({ review_status: 'approved' })
      .populate('constitution_articles', 'article_number title');

    let bestMatch = null;
    let highestScore = 0;

    for (const topic of topics) {
      let score = 0;

      // Check title similarity
      score += calculateTextSimilarity(message, topic.title.toLowerCase()) * 0.4;

      // Check keyword matches
      const keywordScore = topic.keywords.reduce((acc, keyword) => {
        return message.includes(keyword.toLowerCase()) ? acc + 0.15 : acc;
      }, 0);
      score += keywordScore;

      // Check summary similarity
      score += calculateTextSimilarity(message, topic.summary.toLowerCase()) * 0.2;

      if (score > highestScore && score > 0.5) {
        highestScore = score;
        bestMatch = {
          response: formatTopicResponse(topic),
          confidence: score,
          category: topic.category,
          relatedArticles: topic.constitution_articles.map(a => a.article_number)
        };
      }
    }

    return bestMatch;
  } catch (error) {
    console.error('Legal topic matching error:', error);
    return null;
  }
};

// Find legal aid matches
const findLegalAidMatch = async (message) => {
  try {
    const legalAidKeywords = [
      'legal aid', 'free lawyer', 'pro bono', 'legal help', 'legal assistance',
      'kituo cha sheria', 'nlas', 'legal advice', 'lawyer', 'attorney'
    ];

    const isLegalAidQuery = legalAidKeywords.some(keyword => 
      message.includes(keyword.toLowerCase())
    );

    if (!isLegalAidQuery) return null;

    // Get Mombasa providers
    const mombasaProviders = await LegalAidProvider.findMombasaProviders()
      .limit(5);

    return {
      response: formatLegalAidResponse(mombasaProviders),
      confidence: 0.8
    };
  } catch (error) {
    console.error('Legal aid matching error:', error);
    return null;
  }
};

// Text similarity calculation (simplified)
const calculateTextSimilarity = (text1, text2) => {
  const words1 = text1.split(' ').filter(word => word.length > 2);
  const words2 = text2.split(' ').filter(word => word.length > 2);
  
  let matches = 0;
  words1.forEach(word => {
    if (words2.some(w => w.includes(word) || word.includes(w))) {
      matches++;
    }
  });

  return words1.length > 0 ? matches / words1.length : 0;
};

// Response formatters
const formatArticleResponse = (article) => {
  return `**Article ${article.article_number}: ${article.title}**

${article.summary || article.full_text.substring(0, 500) + '...'}

${article.is_bill_of_rights_article ? '📜 This article is part of the Bill of Rights.' : ''}

For the complete text and more information, you can browse the Constitution section of this website.

**Need legal help?** Contact:
• Kituo Cha Sheria Mombasa: 041-2316185
• NLAS Hotline: 0800-720-440`;
};

const formatBillOfRightsResponse = (articles) => {
  const articleList = articles.slice(0, 3).map(a => 
    `• Article ${a.article_number}: ${a.title}`
  ).join('\n');

  return `**The Bill of Rights (Chapter 4 of the Constitution)**

The Bill of Rights contains your fundamental rights and freedoms. Here are some key articles:

${articleList}

**Your rights include:**
• Right to life and security
• Equality and freedom from discrimination  
• Freedom of expression and assembly
• Right to healthcare, housing, and education
• Fair hearing and access to justice

**If your rights are violated:**
• Contact KNCHR Coast Office: 041-2230496
• Seek legal aid: Kituo Cha Sheria 041-2316185
• File a constitutional petition in court

Browse the Bill of Rights section for complete information.`;
};

const formatTopicResponse = (topic) => {
  const practicalSteps = topic.practical_steps.slice(0, 3).map((step, index) => 
    `${index + 1}. ${step.description}`
  ).join('\n');

  return `**${topic.title}**

${topic.summary}

**What you can do:**
${practicalSteps}

${topic.mombasa_specific_info?.local_contacts?.length > 0 ? 
  `**Local Mombasa contacts:**
${topic.mombasa_specific_info.local_contacts.slice(0, 2).map(c => 
  `• ${c.organization}: ${c.phone}`
).join('\n')}` : ''}

**Constitutional basis:** ${topic.relevant_constitution_articles.length > 0 ? 
  `Articles ${topic.relevant_constitution_articles.slice(0, 3).join(', ')}` : 
  'General legal principles'}

For detailed guidance, consult with a legal professional.`;
};

const formatLegalAidResponse = (providers) => {
  const providerList = providers.slice(0, 3).map(p => 
    `• **${p.name}**
  Phone: ${p.primary_phone || 'Contact via website'}
  Address: ${p.location.address}
  Services: ${p.focus_areas.slice(0, 2).join(', ')}`
  ).join('\n\n');

  return `**Free Legal Aid in Mombasa County**

Here are legal aid organizations that can help you:

${providerList}

**Emergency Legal Help:**
• NLAS Hotline: 0800-720-440 (Free)
• Police Emergency: 999 or 112

**Your Constitutional Right:** Article 48 guarantees access to justice for all!

Visit our Legal Aid Resources page for the complete directory.`;
};

// Generate default response
const generateDefaultResponse = (message) => {
  const responses = [
    `I understand you're asking about "${message}". While I can provide general legal information, I'd recommend:

• Browsing our Constitution section for relevant articles
• Checking our Legal Aid Resources for professional help
• Contacting NLAS at 0800-720-440 for immediate assistance

**Remember:** This is general information only, not legal advice.`,

    `Thank you for your question. For specific legal guidance on "${message}", please:

• Contact Kituo Cha Sheria Mombasa: 041-2316185
• Call NLAS Legal Aid Hotline: 0800-720-440  
• Browse our Bill of Rights section for your fundamental rights

Could you be more specific about your legal question?`,

    `I see you're asking about "${message}". Here's how I can help:

• Search our Constitution database
• Provide information about your rights
• Connect you with legal aid resources

For personalized legal advice, contact a qualified lawyer or legal aid organization.`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
};

// Suggestion generators
const generateSuggestions = (category) => {
  const suggestions = {
    'constitution': [
      "What is Article 27 about equality?",
      "Tell me about the Bill of Rights",
      "What are my rights if arrested?"
    ],
    'criminal-law': [
      "How do I report a crime?",
      "What are my rights when arrested?",
      "How do I get legal aid for criminal cases?"
    ],
    'landlord-tenant': [
      "What can I do about illegal eviction?",
      "How much notice should my landlord give?",
      "Where can I file a landlord-tenant dispute?"
    ],
    'legal-aid': [
      "Where can I get free legal help in Mombasa?",
      "What is pro-bono legal service?",
      "How do I contact NLAS?"
    ]
  };

  return suggestions[category] || generateGeneralSuggestions();
};

const generateConstitutionSuggestions = () => [
  "What is the Bill of Rights?",
  "Tell me about Article 43 on economic rights",
  "What does Article 50 say about fair hearing?",
  "How do I file a constitutional petition?"
];

const generateTopicSuggestions = (category) => [
  "Where can I get legal help?",
  "What are the court procedures?",
  "How much does legal assistance cost?",
  "What documents do I need?"
];

const generateLegalAidSuggestions = () => [
  "What services does Kituo Cha Sheria offer?",
  "How do I qualify for free legal aid?",
  "Where is the nearest legal aid office?",
  "What is the NLAS hotline number?"
];

const generateGeneralSuggestions = () => [
  "What are my constitutional rights?",
  "How do I access legal aid in Mombasa?",
  "What should I do if arrested?",
  "How do I file a case in Small Claims Court?"
];