'use client';

import React, { useState } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [suggestion, setSuggestion] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
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
      const response = await fetch('/api/admin/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: suggestion,
          userName: userName || undefined,
          userEmail: userEmail || undefined,
        }),
      });

      if (response.ok) {
        setSubmitMessage('Suggestion submitted successfully!');
        setSuggestion('');
        setUserName('');
        setUserEmail('');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (err) {
      console.error("Failed to submit suggestion:", err);
      setSubmitMessage('Failed to submit suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(null), 5000);
    }
  };

  return (
    <footer className="py-8 mt-12 border-t border-primary/10 bg-background text-text"> {/* Changed bg-gray-50 to bg-background, text-text, border-primary/10 */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Me Section */}
          <div className="p-4 border border-accent rounded-lg shadow-sm bg-background"> {/* Changed border-gray-200 to border-accent, bg-white to bg-background */}
            <h3 className="text-lg font-semibold mb-3 text-text">Contact Me</h3> {/* Changed text-gray-800 to text-text */}
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
              <a 
                href="https://www.linkedin.com/in/kaushik-iyer-8aa347216/" 
                className="text-primary hover:text-primary/80 hover:underline" // Changed text-indigo-600 to text-primary
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com/Kaushik-Iyer" 
                className="text-primary hover:text-primary/80 hover:underline" // Changed text-indigo-600 to text-primary
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a 
                href="https://x.com/kaushikiyer_" 
                className="text-primary hover:text-primary/80 hover:underline" // Changed text-indigo-600 to text-primary
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter/X
              </a>
            </div>
          </div>

          {/* Suggestions Section */}
          <div className="p-4 border border-accent rounded-lg shadow-sm bg-background"> {/* Changed border-gray-200 to border-accent, bg-white to bg-background */}
            <h3 className="text-lg font-semibold mb-3 text-text">Have a Suggestion?</h3> {/* Changed text-gray-800 to text-text */}
            <form onSubmit={handleSuggestionSubmit} className="space-y-3">
              <div>
                <label htmlFor="footer-suggestion" className="sr-only">
                  Your Suggestion
                </label>
                <textarea
                  id="footer-suggestion"
                  name="suggestion"
                  rows={2}
                  className="mt-1 block w-full px-3 py-2 border border-accent rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-text" // Adjusted border, bg, text
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Any travel spots or feedback? (Required)"
                  disabled={isSubmitting}
                  required
                />
              </div>
              <div>
                <label htmlFor="footer-user-name" className="sr-only">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  id="footer-user-name"
                  name="userName"
                  className="mt-1 block w-full px-3 py-2 border border-accent rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your Name (Optional)"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="footer-user-email" className="sr-only">
                  Your Email (Optional)
                </label>
                <input
                  type="email"
                  id="footer-user-email"
                  name="userEmail"
                  className="mt-1 block w-full px-3 py-2 border border-accent rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-text"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Your Email (Optional, for follow-up)"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-text bg-primary hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50" // Changed text-white, bg-indigo-600 to bg-primary
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

        <div className="text-center text-sm text-text/60 pt-8"> {/* Changed text-black/60 to text-text/60 */}
          <p>© {currentYear} Kaushik Iyer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;