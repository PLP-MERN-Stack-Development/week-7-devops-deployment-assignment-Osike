# SheriaBot Backend API

A comprehensive Node.js/Express.js backend for the SheriaBot legal chatbot application, providing access to Kenyan legal information and resources.

## Features

- **RESTful API** for legal information access
- **Intelligent Chatbot Service** with natural language processing
- **MongoDB Integration** with optimized schemas
- **Constitution Database** with full-text search capabilities
- **Legal Aid Provider Directory** with Mombasa focus
- **FAQ System** with voting and analytics
- **Session Management** for chat conversations
- **Analytics Dashboard** for usage insights
- **Rate Limiting** and security middleware
- **Comprehensive Error Handling**

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** with Mongoose - Database and ODM
- **JWT** - Authentication (for future admin features)
- **Helmet** - Security middleware
- **Morgan** - HTTP request logging
- **Express Rate Limit** - API rate limiting
- **Compression** - Response compression

## Project Structure

```
server/
├── controllers/          # Route controllers
├── middleware/          # Custom middleware
├── models/             # Mongoose schemas
├── routes/             # API routes
├── services/           # Business logic services
├── scripts/            # Database utilities
├── .env.example        # Environment variables template
└── server.js          # Application entry point
```

## Installation & Setup

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database Setup**
   ```bash
   # Ensure MongoDB is running
   npm run seed  # Populate database with sample data
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Chat System
- `POST /api/chat/message` - Send message to chatbot
- `GET /api/chat/session/:sessionId` - Get chat history
- `POST /api/chat/session/:sessionId/end` - End chat session
- `GET /api/chat/suggestions` - Get conversation suggestions

### Constitution
- `GET /api/constitution/chapters` - Get all chapters
- `GET /api/constitution/articles/:chapterNumber` - Get chapter articles
- `GET /api/constitution/article/:articleNumber` - Get specific article
- `GET /api/constitution/search` - Search constitution text
- `GET /api/constitution/bill-of-rights` - Get Bill of Rights articles

### Legal Aid
- `GET /api/legal-aid/providers` - Get all providers
- `GET /api/legal-aid/mombasa` - Get Mombasa providers
- `GET /api/legal-aid/search` - Search providers
- `GET /api/legal-aid/emergency` - Get emergency contacts

### FAQs
- `GET /api/faqs` - Get all FAQs
- `GET /api/faqs/search` - Search FAQs
- `GET /api/faqs/popular` - Get popular FAQs
- `POST /api/faqs/:id/helpful` - Vote FAQ helpful

### Analytics
- `GET /api/analytics/chat` - Chat usage analytics
- `GET /api/analytics/topics` - Popular topics
- `GET /api/analytics/health` - System health metrics

## Database Models

### ConstitutionArticle
- Complete Constitution of Kenya 2010
- Full-text search capabilities
- Bill of Rights identification
- Related articles linking

### LegalTopic
- Detailed legal information by category
- Practical steps and procedures
- Mombasa-specific guidance
- Constitution article references

### LegalAidProvider
- Comprehensive provider directory
- Contact information and services
- Geographic and focus area filtering
- Verification status tracking

### ChatSession
- Conversation history management
- User analytics and engagement
- Topic and article tracking
- Satisfaction ratings

### FAQ
- Frequently asked questions
- Category organization
- Voting and helpfulness tracking
- Related content linking

## Chatbot Intelligence

The chatbot service provides intelligent responses through:

- **FAQ Matching** - Direct answers to common questions
- **Constitution Queries** - Article-specific information
- **Legal Topic Matching** - Detailed guidance on legal issues
- **Legal Aid Referrals** - Provider recommendations
- **Context Awareness** - Session-based conversation flow

## Security Features

- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Sanitizes user inputs
- **CORS Protection** - Configurable cross-origin policies
- **Helmet Security** - HTTP security headers
- **Error Handling** - Secure error responses

## Development

### Adding New Legal Content

1. **Constitution Articles**: Add to seed data or import via script
2. **Legal Topics**: Create comprehensive topic documents
3. **FAQs**: Add common questions with detailed answers
4. **Providers**: Verify and add legal aid organizations

### Extending Chatbot Intelligence

1. **Update matching algorithms** in `services/chatbotService.js`
2. **Add new response templates** for different query types
3. **Enhance keyword recognition** for better accuracy
4. **Implement machine learning** for improved responses

### Database Maintenance

```bash
# Seed fresh data
npm run seed

# Backup database
mongodump --db sheriabot

# Restore database
mongorestore --db sheriabot dump/sheriabot
```

## Production Deployment

1. **Environment Variables**
   - Set production MongoDB URI
   - Configure JWT secrets
   - Set appropriate CORS origins

2. **Process Management**
   ```bash
   # Using PM2
   pm2 start server.js --name sheriabot-api
   ```

3. **Monitoring**
   - Health check endpoint: `/health`
   - Analytics dashboard: `/api/analytics/health`
   - Error logging and monitoring

## Contributing

1. Follow existing code structure and patterns
2. Add comprehensive error handling
3. Include input validation for new endpoints
4. Update documentation for API changes
5. Test with sample data before deployment

## Legal Compliance

- All legal information sourced from official Kenyan legal documents
- Regular content review and updates required
- Clear disclaimers about general information vs. legal advice
- Privacy protection for user conversations

## Support

For technical issues or questions about the SheriaBot backend:
- Review API documentation
- Check error logs and health endpoints
- Verify database connectivity and data integrity
- Contact the development team for assistance