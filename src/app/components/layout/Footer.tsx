'use client';

import React, { useState } from 'react';
import { client } from '@/sanity/lib/client'; // Import Sanity client

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) {
      setSubmitMessage("Please enter a suggestion.");
      setTimeout(() => setSubmitMessage(null), 3000);
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Assuming your Sanity schema for suggestions is named 'suggestion'
      // and has a field named 'text' for the suggestion content.
      await client.create({ 
        _type: 'suggestion', // Make sure this matches your Sanity schema type
        text: suggestion 
      });
      setSubmitMessage('Suggestion submitted successfully!');
      setSuggestion('');
    } catch (err) {
      console.error("Failed to submit suggestion:", err);
      setSubmitMessage('Failed to submit suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(null), 5000); // Clear message after 5 seconds
    }
  };

  return (
    <footer className="py-8 mt-12 border-t border-black/10 bg-gray-50">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Me Section */}
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Contact Me</h3>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
              <a 
                href="https://www.linkedin.com/in/kaushik-iyer-8aa347216/" 
                className="text-indigo-600 hover:text-indigo-800 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com/Kaushik-Iyer" 
                className="text-indigo-600 hover:text-indigo-800 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a 
                href="https://x.com/kaushikiyer_" 
                className="text-indigo-600 hover:text-indigo-800 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter/X
              </a>
            </div>
          </div>

          {/* Suggestions Section */}
          <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Have a Suggestion?</h3>
            <form onSubmit={handleSuggestionSubmit} className="space-y-3">
              <div>
                <label htmlFor="footer-suggestion" className="sr-only">
                  Your Suggestion
                </label>
                <textarea
                  id="footer-suggestion"
                  name="suggestion"
                  rows={2}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-700"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Any travel spots or feedback?"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Send Suggestion'}
                </button>
              </div>
              {submitMessage && (
                <p className={`text-sm mt-2 ${submitMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="text-center text-sm text-black/60 pt-8">
          <p>© {currentYear} Kaushik Iyer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;