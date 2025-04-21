import React, { useState } from 'react';
import { db } from '../firebase.js'; 
import { collection, addDoc } from "firebase/firestore";

// Read the password from environment variables.
// NOT SECURE
const CORRECT_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

function AdminPage() {
    // State for the password check
    const [enteredPassword, setEnteredPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Track if password is correct
    const [loginError, setLoginError] = useState('');

    // State for individual form fields
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [alternatives, setAlternatives] = useState([]);

    // State for the JSON paste area
    const [jsonInput, setJsonInput] = useState('');
    const [parseError, setParseError] = useState('');
    const [submitStatus, setSubmitStatus] = useState('');

    // Handle the simple password check
    const handleLogin = (e) => {
        e.preventDefault();
        setLoginError(''); // Clear previous errors

        if (!CORRECT_PASSWORD) {
            console.error("Admin password environment variable (REACT_APP_ADMIN_PASSWORD) is not set!");
            setLoginError("Configuration error: Admin password not set.");
            return;
        }

        if (enteredPassword === CORRECT_PASSWORD) {
            setIsAuthenticated(true); // Grant access
        } else {
            setLoginError('Incorrect password.');
            setIsAuthenticated(false);
        }
    };


    // Parse JSON and populate fields
    const handleParseAndPopulate = () => {
        setParseError(''); 
        if (!jsonInput.trim()) { setParseError('Paste area is empty.'); return; }
        try {
            const parsedData = JSON.parse(jsonInput);

            // --- Validation ---
            if (!parsedData.name || !parsedData.category) {
                throw new Error("Invalid data structure. Required fields: name, category.");
            }
            if (parsedData.hasOwnProperty('alternatives') && !Array.isArray(parsedData.alternatives)) {
                throw new Error("Invalid data structure. If 'alternatives' field exists, it must be an array.");
            }

            // Populate state from parsed data
            setName(parsedData.name || '');
            setCategory(parsedData.category || '');
            setDescription(parsedData.description || ''); // Description is optional

            // --- Use default empty array ---
            const alternativesData = parsedData.alternatives || [];

            setAlternatives(alternativesData.map(alt => ({
                name: alt && alt.name ? alt.name : 'N/A',
                type: alt && alt.type ? alt.type : 'Unknown',
                cost: alt && alt.cost ? alt.cost : '?',
                link: alt && alt.link ? alt.link : ''
            })));

        } catch (error) {
            console.error("JSON Parse Error:", error);
            setParseError(`Failed to parse JSON: ${error.message}`);
            // Clear potentially broken form fields
            setName(''); setCategory(''); setDescription(''); setAlternatives([]);
        }
    };

    // Final submission to Firestore 
    const handleSubmitToFirestore = async (e) => {
         e.preventDefault(); setSubmitStatus('Submitting...');
        if (!name || !category || alternatives.length === 0) { setSubmitStatus('Error: Required fields missing.'); return; }
        const entryData = { name, category, description, alternatives: alternatives.map(alt => ({ name: alt.name, type: alt.type, cost: alt.cost, link: alt.link })) };
        try {
            const docRef = await addDoc(collection(db, "wikiEntries"), entryData);
            setSubmitStatus(`Success! Entry "${name}" added.`);
            setName(''); setCategory(''); setDescription(''); setAlternatives([]); setJsonInput(''); setParseError('');
        } catch (error) { console.error("Error adding document: ", error); setSubmitStatus(`Error adding document: ${error.message}`); }
    };


    // --- Render Logic ---

    // If not authenticated, show the password prompt
    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Admin Access</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
                        <input
                            type="password"
                            id="adminPassword"
                            value={enteredPassword}
                            onChange={(e) => setEnteredPassword(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    {loginError && <p className="text-red-600 text-sm text-center">{loginError}</p>}
                    <button
                        type="submit"
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Enter
                    </button>
                </form>
            </div>
        );
    }

    // If authenticated, show the main admin page content
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-800">Admin Approval Page</h2>
            <p className="text-sm text-green-700 bg-green-50 p-2 rounded border border-green-200">Authenticated.</p> {/* Simple auth indicator */}

            {/* JSON Paste Section */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                 <h3 className="text-lg font-medium text-yellow-800 mb-2">1. Paste Data Block</h3>
                 <textarea rows="8" value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} placeholder='Paste JSON data here...' className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-indigo-500 focus:border-indigo-500" />
                 <button onClick={handleParseAndPopulate} className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm">Parse & Populate Form</button>
                 {parseError && <p className="text-red-600 text-sm mt-2">{parseError}</p>}
            </div>

            {/* Approval Form Section */}
            <form onSubmit={handleSubmitToFirestore} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 space-y-4">
                 <h3 className="text-lg font-medium text-gray-800 mb-2">2. Review and Submit</h3>
                 {/* Form fields (Name, Category, Description, Alternatives)*/}
                 <div><label htmlFor="adminName" className="block text-sm font-medium text-gray-700 mb-1">Name*</label><input type="text" id="adminName" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
                 <div><label htmlFor="adminCategory" className="block text-sm font-medium text-gray-700 mb-1">Category*</label><input type="text" id="adminCategory" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
                 <div><label htmlFor="adminDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea id="adminDescription" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" /></div>
                 <fieldset className="border-t pt-4"><legend className="text-md font-medium text-gray-700 mb-2">Alternatives*</legend>{alternatives.length > 0 ? (<div className="space-y-2">{alternatives.map((alt, index) => (<div key={index} className="text-sm p-2 border rounded bg-gray-50"><p><strong>Name:</strong> {alt.name}</p><p><strong>Type:</strong> {alt.type}</p><p><strong>Cost:</strong> {alt.cost}</p><p><strong>Link:</strong> {alt.link || 'N/A'}</p></div>))}</div>) : (<p className="text-sm text-gray-500 italic">No alternatives populated.</p>)}</fieldset>

                 <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Approve & Add to Firestore</button>
                 {submitStatus && <p className={`text-sm mt-2 ${submitStatus.startsWith('Error:') ? 'text-red-600' : 'text-green-600'}`}>{submitStatus}</p>}
            </form>
        </div>
    );
}

export default AdminPage; 
