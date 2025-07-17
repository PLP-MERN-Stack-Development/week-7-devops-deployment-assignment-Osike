import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ConstitutionArticle from '../models/ConstitutionArticle.js';
import LegalTopic from '../models/LegalTopic.js';
import LegalAidProvider from '../models/LegalAidProvider.js';
import FAQ from '../models/FAQ.js';

// Load environment variables
dotenv.config();

// Sample data for seeding
const constitutionArticles = [
  {
    article_number: 1,
    chapter_number: 1,
    chapter_title: "CHAPTER ONE—SOVEREIGNTY OF THE PEOPLE AND SUPREMACY OF THIS CONSTITUTION",
    title: "Sovereignty of the people",
    full_text: `(1) All sovereign power belongs to the people of Kenya and shall be exercised only in accordance with this Constitution.

(2) The people may exercise their sovereign power either directly or through their democratically elected representatives.

(3) Sovereign power under this Constitution is delegated to the following State organs, which shall perform their functions in accordance with this Constitution—
  (a) Parliament and the legislative assemblies in the county governments;
  (b) the national executive and the executive structures in the county governments; and
  (c) the Judiciary and independent tribunals.

(4) The sovereign power of the people is exercised at—
  (a) the national level; and
  (b) the county level.`,
    keywords: ["sovereignty", "people", "power", "democracy", "constitution"],
    summary: "Establishes that all sovereign power belongs to the people of Kenya and outlines how this power is exercised through democratic institutions.",
    is_bill_of_rights_article: false
  },
  {
    article_number: 27,
    chapter_number: 4,
    chapter_title: "CHAPTER FOUR—THE BILL OF RIGHTS",
    title: "Equality and freedom from discrimination",
    full_text: `(1) Every person is equal before the law and has the right to equal protection and equal benefit of the law.

(2) Equality includes the full and equal enjoyment of all rights and fundamental freedoms.

(3) Women and men have the right to equal treatment, including the right to equal opportunities in political, economic, cultural and social spheres.

(4) The State shall not discriminate directly or indirectly against any person on any ground, including race, sex, pregnancy, marital status, health status, ethnic or social origin, colour, age, disability, religion, conscience, belief, culture, dress, language or birth.

(5) A person shall not discriminate directly or indirectly against another person on any of the grounds specified or contemplated in clause (4).`,
    keywords: ["equality", "discrimination", "gender", "race", "disability", "religion", "rights"],
    summary: "Guarantees equality before the law and prohibits discrimination on various grounds including race, gender, religion, and disability.",
    practical_examples: [
      "You cannot be denied a job because of your race or gender",
      "Women and men must receive equal pay for equal work",
      "You cannot be discriminated against because of your religion or disability"
    ],
    is_bill_of_rights_article: true
  },
  {
    article_number: 49,
    chapter_number: 4,
    chapter_title: "CHAPTER FOUR—THE BILL OF RIGHTS",
    title: "Rights of arrested persons",
    full_text: `(1) An arrested person has the right—
  (a) to remain silent;
  (b) to be informed promptly, in language that the person understands, of—
    (i) the reason for the arrest;
    (ii) the right to remain silent; and
    (iii) the consequences of not remaining silent;
  (c) not to be compelled to make any confession or admission that could be used in evidence against the person;
  (d) to be held separately from persons who are serving a sentence;
  (e) to be brought before a court as soon as reasonably possible, but not later than—
    (i) twenty-four hours after being arrested; or
    (ii) if the twenty-four hours ends outside ordinary court hours, or on a day that is not an ordinary court day, the end of the next court day;
  (f) at the first court appearance, to be charged or informed of the reason for the detention continuing, or to be released; and
  (g) to be released on bond or bail, on reasonable conditions, pending a charge or trial, unless there are compelling reasons not to be released.`,
    keywords: ["arrest", "rights", "silent", "bail", "court", "detention", "police"],
    summary: "Protects the rights of persons who are arrested, including the right to remain silent, be informed of charges, and appear before a court within 24 hours.",
    practical_examples: [
      "When arrested, you don't have to answer police questions",
      "Police must tell you why you're being arrested",
      "You must appear in court within 24 hours",
      "You have the right to be released on bail"
    ],
    is_bill_of_rights_article: true
  }
];

const legalTopics = [
  {
    title: "Landlord-Tenant Rights and Eviction Procedures",
    category: "landlord-tenant",
    keywords: ["landlord", "tenant", "eviction", "rent", "housing", "lease"],
    summary: "Understanding your rights and obligations as a tenant or landlord, including proper eviction procedures and rent dispute resolution.",
    detailed_content: [
      {
        section_title: "Tenant Rights",
        content: "Tenants have the right to peaceful enjoyment of the property, adequate notice before eviction, and protection from illegal eviction.",
        subsections: [
          {
            title: "Notice Requirements",
            content: "Landlords must give proper notice before eviction, usually 30 days for month-to-month tenancies."
          },
          {
            title: "Illegal Eviction",
            content: "Landlords cannot forcibly remove tenants without following proper legal procedures."
          }
        ]
      }
    ],
    relevant_constitution_articles: [43], // Right to housing
    practical_steps: [
      {
        step_number: 1,
        description: "Document all communications with your landlord",
        required_documents: ["Lease agreement", "Payment receipts", "Written notices"],
        estimated_time: "Ongoing",
        cost_estimate: "Free"
      },
      {
        step_number: 2,
        description: "Seek mediation through local authorities",
        required_documents: ["Complaint letter", "Evidence of dispute"],
        estimated_time: "2-4 weeks",
        cost_estimate: "Minimal fees"
      }
    ],
    mombasa_specific_info: {
      local_contacts: [
        {
          organization: "Mombasa County Housing Department",
          phone: "041-2222000",
          address: "Mombasa County Headquarters",
          services: ["Housing disputes", "Tenant protection"]
        }
      ],
      local_procedures: "Contact Mombasa County Housing Department for mediation services",
      court_locations: [
        {
          court_name: "Mombasa Small Claims Court",
          address: "Mombasa Law Courts, Mombasa-Malindi Road",
          phone: "041-2312421",
          jurisdiction: "Claims under 1M KES"
        }
      ]
    }
  }
];

const legalAidProviders = [
  {
    name: "Kituo Cha Sheria - Mombasa Office",
    type: "legal-aid-organization",
    location: {
      county: "Mombasa",
      town: "Mombasa",
      address: "Tom Mboya Street, Haile Selassie Road, Mombasa",
      coordinates: {
        latitude: -4.0435,
        longitude: 39.6682
      }
    },
    contact_info: {
      phone_numbers: [
        { type: "+254-41-2316185", label: "main" },
        { type: "+254-722-516185", label: "mobile" }
      ],
      email: "mombasa@kituochasheria.or.ke",
      website: "https://www.kituochasheria.or.ke"
    },
    services_offered: [
      {
        service_name: "Free legal representation",
        description: "Court representation for indigent clients",
        eligibility_criteria: "Low income individuals",
        cost: "free"
      },
      {
        service_name: "Legal advice and counseling",
        description: "General legal guidance and consultation",
        eligibility_criteria: "All members of the public",
        cost: "free"
      }
    ],
    focus_areas: ["human-rights", "landlord-tenant", "family-law", "criminal-defense"],
    target_demographics: ["low-income", "women", "general-public"],
    operating_hours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed",
      notes: "Emergency services available on weekends"
    },
    verification_status: "verified",
    last_verified: new Date(),
    is_mombasa_based: true
  },
  {
    name: "National Legal Aid Service (NLAS) - Coast Region",
    type: "government-body",
    location: {
      county: "Mombasa",
      town: "Mombasa",
      address: "Kenyatta Avenue, Treasury Square, Mombasa"
    },
    contact_info: {
      phone_numbers: [
        { type: "0800-720-440", label: "hotline" },
        { type: "+254-41-2230440", label: "main" }
      ],
      email: "info@legal-aid.go.ke",
      website: "https://www.legal-aid.go.ke"
    },
    services_offered: [
      {
        service_name: "Free legal representation",
        description: "Government-provided legal aid for qualifying cases",
        eligibility_criteria: "Indigent persons as per NLAS criteria",
        cost: "free"
      }
    ],
    focus_areas: ["criminal-defense", "family-law", "constitutional-matters"],
    target_demographics: ["low-income", "general-public"],
    emergency_contact: {
      available: true,
      phone: "0800-720-440",
      hours: "24/7"
    },
    verification_status: "verified",
    is_mombasa_based: true
  }
];

const faqs = [
  {
    question: "What should I do if I'm arrested?",
    answer: `If you're arrested, remember your rights under Article 49 of the Constitution:

1. **Remain silent** - You don't have to answer questions
2. **Ask why you're being arrested** - Police must tell you the reason
3. **Don't sign anything** you don't understand
4. **Ask to contact a lawyer or family member**
5. **Remember officer details** - Badge number, name, station

**You must be brought to court within 24 hours.**

**Get immediate help:**
• NLAS Hotline: 0800-720-440
• Kituo Cha Sheria: 041-2316185
• Police complaints: IPOA 0800-720-720`,
    category: "criminal-law",
    keywords: ["arrest", "police", "rights", "silent", "lawyer"],
    related_articles: [49, 50],
    priority: 10
  },
  {
    question: "How can I get free legal help in Mombasa?",
    answer: `Several organizations provide free legal aid in Mombasa:

**Legal Aid Organizations:**
• **Kituo Cha Sheria Mombasa**: 041-2316185
  Address: Tom Mboya Street, Haile Selassie Road
  Services: Free legal representation, advice, court accompaniment

• **NLAS Coast Region**: 0800-720-440 (Free hotline)
  Address: Kenyatta Avenue, Treasury Square
  Services: Government legal aid for qualifying cases

• **FIDA Kenya Coast**: 0722-754-322
  Services: Women and children's legal issues

**Who qualifies:** Generally low-income individuals, but many organizations provide initial consultation to everyone.

**Your Constitutional Right:** Article 48 guarantees access to justice for all!`,
    category: "legal-aid",
    keywords: ["legal aid", "free lawyer", "mombasa", "kituo", "nlas"],
    priority: 9
  },
  {
    question: "What is Article 27 about equality and discrimination?",
    answer: `Article 27 is one of the most important rights in the Constitution. It guarantees:

**Key Rights:**
• **Equality before the law** - Everyone gets equal treatment
• **Equal protection** - Same legal protections for all
• **Equal opportunities** - In politics, economics, culture, and society
• **Non-discrimination** - Cannot be treated unfairly because of:
  - Race, sex, pregnancy, marital status
  - Health status, ethnic origin, color, age
  - Disability, religion, belief, culture
  - Dress, language, or birth

**What this means:**
• You cannot be denied jobs because of your race/gender
• Women and men must get equal pay for equal work
• You cannot be discriminated against for your religion
• People with disabilities must be treated equally

**If discriminated against:** Contact KNCHR Coast Office: 041-2230496`,
    category: "bill-of-rights",
    keywords: ["equality", "discrimination", "article 27", "rights"],
    related_articles: [27],
    priority: 8
  }
];

// Database seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📊 Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await ConstitutionArticle.deleteMany({});
    await LegalTopic.deleteMany({});
    await LegalAidProvider.deleteMany({});
    await FAQ.deleteMany({});

    // Seed Constitution Articles
    console.log('📜 Seeding Constitution articles...');
    await ConstitutionArticle.insertMany(constitutionArticles);
    console.log(`✅ Inserted ${constitutionArticles.length} constitution articles`);

    // Seed Legal Topics
    console.log('⚖️  Seeding legal topics...');
    await LegalTopic.insertMany(legalTopics);
    console.log(`✅ Inserted ${legalTopics.length} legal topics`);

    // Seed Legal Aid Providers
    console.log('🏢 Seeding legal aid providers...');
    await LegalAidProvider.insertMany(legalAidProviders);
    console.log(`✅ Inserted ${legalAidProviders.length} legal aid providers`);

    // Seed FAQs
    console.log('❓ Seeding FAQs...');
    await FAQ.insertMany(faqs);
    console.log(`✅ Inserted ${faqs.length} FAQs`);

    console.log('🎉 Database seeding completed successfully!');
    
    // Display summary
    console.log('\n📊 Database Summary:');
    console.log(`Constitution Articles: ${await ConstitutionArticle.countDocuments()}`);
    console.log(`Legal Topics: ${await LegalTopic.countDocuments()}`);
    console.log(`Legal Aid Providers: ${await LegalAidProvider.countDocuments()}`);
    console.log(`FAQs: ${await FAQ.countDocuments()}`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  seedDatabase();
}

export default seedDatabase;