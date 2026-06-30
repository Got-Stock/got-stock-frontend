import React from 'react';
import GenericFooterPage from './GenericFooterPage';
import { Eye, Keyboard, Volume2, Smartphone } from 'lucide-react';

const Accessibility = () => {
  return (
    <GenericFooterPage 
      title="Accessibility" 
      subtitle="Our commitment to making Got-Stock accessible to everyone"
    >
      <div className="space-y-12">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
          <p className="text-gray-700 text-lg">
            Got-Stock is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Accessibility Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-purple-200 p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Visual Accessibility</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• High contrast color schemes</li>
                <li>• Resizable text and clear typography</li>
                <li>• Alternative text for images</li>
                <li>• Screen reader compatible</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-pink-200 p-6 rounded-xl">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Keyboard className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Keyboard Navigation</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Full keyboard navigation support</li>
                <li>• Skip navigation links</li>
                <li>• Clear focus indicators</li>
                <li>• Logical tab order</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-purple-200 p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Mobile Accessibility</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Responsive design for all devices</li>
                <li>• Touch-friendly interface</li>
                <li>• Compatible with mobile screen readers</li>
                <li>• Adjustable font sizes</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-pink-200 p-6 rounded-xl">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Volume2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Audio & Content</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Clear and simple language</li>
                <li>• Meaningful link text</li>
                <li>• Structured headings</li>
                <li>• Easy-to-read formatting</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Standards Conformance</h2>
          <p className="text-gray-700 mb-4">
            We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
          </p>
          <p className="text-gray-700">
            While we strive to adhere to the accepted guidelines and standards for accessibility and usability, it may not always be possible to do so in all areas of the website. We are continually seeking solutions to enhance accessibility.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Assistive Technology Compatibility</h2>
          <p className="text-gray-700 mb-4">
            Our website is designed to be compatible with:
          </p>
          <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
            <li>• Screen readers (JAWS, NVDA, VoiceOver)</li>
            <li>• Screen magnification software</li>
            <li>• Speech recognition software</li>
            <li>• Browser accessibility features</li>
          </ul>
        </section>

        <section className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback and Contact</h2>
          <p className="text-gray-700 mb-4">
            We welcome your feedback on the accessibility of Got-Stock. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:
          </p>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong> admin@got-stock.com<br />
              <strong>Subject Line:</strong> "Accessibility Feedback"<br />
              <strong>Response Time:</strong> We aim to respond within 2 business days
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ongoing Improvements</h2>
          <p className="text-gray-700">
            Accessibility is an ongoing effort. We regularly:
          </p>
          <ul className="space-y-2 text-gray-700 mt-4">
            <li>✓ Test our website with assistive technologies</li>
            <li>✓ Conduct accessibility audits</li>
            <li>✓ Train our team on accessibility best practices</li>
            <li>✓ Update our platform based on user feedback</li>
            <li>✓ Monitor emerging accessibility standards</li>
          </ul>
        </section>
      </div>
    </GenericFooterPage>
  );
};

export default Accessibility;