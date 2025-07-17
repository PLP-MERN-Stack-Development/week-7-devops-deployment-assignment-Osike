import React, { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Users, Scale, Filter } from 'lucide-react';
import { legalAidData } from '../data/legalAid';

const LegalAidPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Organizations' },
    { id: 'legal-aid', name: 'Legal Aid Organizations' },
    { id: 'human-rights', name: 'Human Rights Organizations' },
    { id: 'government', name: 'Government Bodies' },
    { id: 'pro-bono', name: 'Pro Bono Services' },
    { id: 'advocacy', name: 'Advocacy Groups' },
  ];

  const locations = [
    { id: 'all', name: 'All Locations' },
    { id: 'mombasa', name: 'Mombasa County' },
    { id: 'nairobi', name: 'Nairobi County' },
    { id: 'coastal', name: 'Coastal Region' },
    { id: 'national', name: 'National Coverage' },
  ];

  const filteredOrganizations = legalAidData.organizations.filter(org => {
    const categoryMatch = selectedCategory === 'all' || org.category === selectedCategory;
    const locationMatch = selectedLocation === 'all' || org.location === selectedLocation;
    return categoryMatch && locationMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Users className="mr-4 h-10 w-10 text-green-600" />
            Legal Aid Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find legal aid organizations, pro-bono services, and government bodies that can help you 
            access justice in Kenya, with special focus on Mombasa County.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Organizations</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Type
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-4">Emergency Legal Situations</h2>
          <p className="text-red-800 mb-4">
            If you are in immediate danger or facing urgent legal issues, contact these emergency services:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-red-900">Police Emergency</h3>
              <p className="text-red-700">Call: 999 or 112</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-red-900">Legal Aid Hotline</h3>
              <p className="text-red-700">Call: 0800 720 440 (NLAS)</p>
            </div>
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <div key={org.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{org.name}</h3>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {org.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <Scale className="h-6 w-6 text-green-600 flex-shrink-0" />
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">{org.description}</p>

              {/* Contact Information */}
              <div className="space-y-3 mb-4">
                {org.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{org.phone}</span>
                  </div>
                )}
                {org.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{org.email}</span>
                  </div>
                )}
                {org.website && (
                  <div className="flex items-center text-sm">
                    <Globe className="h-4 w-4 mr-2 flex-shrink-0 text-gray-600" />
                    <a 
                      href={org.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{org.address}</span>
                </div>
              </div>

              {/* Services */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Services Offered</h4>
                <div className="flex flex-wrap gap-1">
                  {org.services.map((service, index) => (
                    <span 
                      key={index}
                      className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Focus Areas */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Focus Areas</h4>
                <div className="flex flex-wrap gap-1">
                  {org.focusAreas.map((area, index) => (
                    <span 
                      key={index}
                      className="inline-block px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrganizations.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Organizations Found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        )}

        {/* Additional Resources */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Online Legal Resources</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <a href="http://kenyalaw.org" className="text-green-600 hover:underline">Kenya Law Reports</a> - Official legal database</li>
                <li>• <a href="http://www.knchr.org" className="text-green-600 hover:underline">KNCHR</a> - Human rights information</li>
                <li>• <a href="http://www.judiciary.go.ke" className="text-green-600 hover:underline">Judiciary</a> - Court information and procedures</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Self-Help Resources</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Small Claims Court procedures</li>
                <li>• Legal forms and templates</li>
                <li>• Know Your Rights guides</li>
                <li>• Legal education materials</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalAidPage;