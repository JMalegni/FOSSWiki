import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";

import { db } from './firebase.js';
import Navbar from './components/Navbar.js';
import WikiPage from './pages/WikiPage.js';
import ContributePage from './pages/ContributePage.js';
import AboutPage from './pages/AboutPage.js';
import AdminPage from './pages/AdminPage.js';
import emailjs from '@emailjs/browser';

function App() {
  const [wikiEntries, setWikiEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState('wiki'); // Default page is 'wiki'

  // --- Firebase Data Fetching ---
  useEffect(() => {
      const fetchEntries = async () => {
          setLoading(true); setError(null);
          try {
              const querySnapshot = await getDocs(collection(db, "wikiEntries"));
              const entriesData = querySnapshot.docs.map(doc => ({
                  id: doc.id, ...doc.data(),
                  alternatives: Array.isArray(doc.data().alternatives) ? doc.data().alternatives : []
              }));
              entriesData.sort((a, b) => a.name.localeCompare(b.name));
              setWikiEntries(entriesData);
          } catch (err) {
              console.error("Error fetching data from Firebase:", err);
              setError("Failed to load wiki entries.");
          } finally { setLoading(false); }
      };
      fetchEntries();
  }, []); // Runs once on mount

  // --- EmailJS Submission Handler ---
  const handleAddEntry = (formData) => {
      console.log("Form data for EmailJS:", formData);

      // Read EmailJS credentials from environment variables
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

      // Basic check if variables are loaded
      if (!serviceId || !templateId || !publicKey) {
          console.error("EmailJS environment variables not configured correctly.");
          alert("Email configuration error. Could not send submission.");
          return;
      }
      
      // --- Create the structured data object for JSON ---
        const dataForJson = {
          name: formData.name,
          category: formData.category,
          description: formData.description,
          alternatives: formData.alternatives_array // Use the array passed from AddEntryForm
      };

      // --- Generate the JSON string ---
      let jsonDataString;
      try {
           jsonDataString = JSON.stringify(dataForJson, null, 2);
      } catch (stringifyError) {
          console.error("Failed to stringify data for email:", stringifyError);
          alert("Error preparing data for submission.");
          return;
      }

      // Prepare template params - must match EmailJS template
      const templateParams = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        alternatives_string: formData.alternatives_string,
        from_name: "Wiki Contribution Form",
        jsonDataString: jsonDataString
      };

      // Send email using EmailJS
      emailjs.send(serviceId, templateId, templateParams, publicKey)
          .then((response) => {
              console.log('EmailJS SUCCESS!', response.status, response.text);
              alert('Submission sent successfully for review! Thank you.');
              setCurrentPage('wiki');
          }, (error) => {
              console.error('EmailJS FAILED...', error);
              alert('Failed to send submission. Please try again later.');
          });
  };

  // --- Navigation Handler ---
  const handleNavigate = (page) => {
       // Define valid pages
      const validPages = ['wiki', 'contribute', 'about', 'admin'];
      if (validPages.includes(page)) {
           setCurrentPage(page);
      } else {
          console.warn(`Navigation attempt to invalid page: ${page}. Defaulting to wiki.`);
          setCurrentPage('wiki'); // Fallback to default page
      }
  };

  // --- Render Current Page ---
  const renderPage = () => {
      switch (currentPage) {
          case 'wiki':
              return <WikiPage entries={wikiEntries} loading={loading} error={error} />;
          case 'contribute':
              return <ContributePage onAddEntry={handleAddEntry} />;
          case 'about':
              return <AboutPage />;
          case 'admin':
              // IMPORTANT: The actual AdminPage component should handle its own
              // authentication check internally before rendering sensitive content.
              return <AdminPage />;
          default:
              // Fallback case, should ideally not be reached if handleNavigate is correct
              return <WikiPage entries={wikiEntries} loading={loading} error={error} />;
      }
  };

  // --- Main Render ---
  return (
      <div className="min-h-screen bg-gray-100 font-sans">
          {/* Navbar receives the navigation handler */}
          <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

          {/* Main content area renders the current page */}
          <main className="container mx-auto px-4 py-8 max-w-4xl">
              {renderPage()}
          </main>

          {/* Footer with optional Admin link */}
          <footer className="text-center py-4 mt-8 text-gray-500 text-sm border-t border-gray-200">
              Created for Engineering Ethics Class - Promoting Ethical Software Choices.
              {/* Simple button/link to navigate to the admin page */}
              <button
                  onClick={() => handleNavigate('admin')}
                  className="ml-4 text-xs text-indigo-600 hover:underline focus:outline-none"
                  aria-label="Admin Access"
              >
                  (Admin)
              </button>
          </footer>
      </div>
  );
}

export default App;
