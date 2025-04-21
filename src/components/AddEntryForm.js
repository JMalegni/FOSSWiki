import React, { useState } from 'react';

// This component now requires at least one alternative to be submitted.
function AddEntryForm({ onAddEntry }) {
    // State for form fields
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    // State specifically for the single alternative entry fields
    const [altName, setAltName] = useState('');
    const [altType, setAltType] = useState('Open Source');
    const [altCost, setAltCost] = useState('Free');
    const [altLink, setAltLink] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default HTML form submission

        // --- Updated Validation ---
        // Now also checks if altName is empty
        if (!name.trim() || !category.trim() || !altName.trim()) {
            alert("Please fill in all required fields: Software Name, Category, and Alternative Name.");
            return; // Stop submission if any required field is empty
        }
        // --- --- --- --- --- --- ---

        // --- Construct the alternatives array ---
        // Since altName is now required, this array will always have at least one element.
        const alternativesArray = [];
        // We already checked altName.trim() above, but double-check doesn't hurt
        if (altName.trim()) {
            alternativesArray.push({
                name: altName.trim(),
                type: altType,
                cost: altCost.trim(),
                link: altLink.trim() || ''
            });
        } else {
             // This case should ideally not be reached due to validation, but good practice
             console.error("Submit handler reached with empty altName despite validation.");
             alert("An error occurred. Alternative Name is required.");
             return;
        }
        // --- --- --- --- --- --- --- --- --- ---

        // --- Prepare the final data object to be passed up ---
        const newEntryData = {
            name: name.trim(),
            category: category.trim(),
            description: description.trim(),
            alternatives_string: alternativesArray.map(a => `${a.name} (${a.type}, ${a.cost}) ${a.link ? '- ' + a.link : ''}`).join('\n'), // Will have at least one line now
            alternatives_array: alternativesArray // Will have at least one element now
        };
        // --- --- --- --- --- --- --- --- --- --- --- --- ---

        // Call the handler function passed via props
        onAddEntry(newEntryData);

        // Clear form fields after submission attempt
        setName('');
        setCategory('');
        setDescription('');
        setAltName('');
        setAltType('Open Source');
        setAltCost('Free');
        setAltLink('');
    };

    // --- Form JSX ---
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Contribute a New Software Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Software Details */}
                <div>
                    <label htmlFor="formName" className="block text-sm font-medium text-gray-700 mb-1">Software Name*</label>
                    <input type="text" id="formName" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div>
                    <label htmlFor="formCategory" className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                    <input type="text" id="formCategory" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., Image Editing" />
                </div>
                <div>
                    <label htmlFor="formDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea id="formDescription" value={description} onChange={(e) => setDescription(e.target.value)} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Brief description of the original software" />
                </div>

                {/* Alternative Details Section */}
                <fieldset className="border-t pt-4 mt-4">
                    {/* Updated legend */}
                    <legend className="text-lg font-medium text-gray-700 mb-2">Add an Alternative*</legend>
                    {/* Removed optional text */}
                     <p className="text-xs text-gray-500 mb-3">Please provide details for at least one ethical alternative.</p>
                    <div>
                        {/* Updated label and added required attribute */}
                        <label htmlFor="formAltName" className="block text-sm font-medium text-gray-700 mb-1">Alternative Name*</label>
                        <input
                            type="text"
                            id="formAltName"
                            value={altName}
                            onChange={(e) => setAltName(e.target.value)}
                            required // Make this field required by the browser
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., GIMP"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div>
                            {/* Consider adding required to Type and Cost if they are always needed when Name is present */}
                            <label htmlFor="formAltType" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select id="formAltType" value={altType} onChange={(e) => setAltType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                                <option>Open Source</option>
                                <option>Freemium (Web)</option>
                                <option>Freemium (Desktop)</option>
                                <option>Free</option>
                                <option>Affordable</option>
                                <option>Subscription</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="formAltCost" className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                            <input type="text" id="formAltCost" value={altCost} onChange={(e) => setAltCost(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., Free, $10/mo" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <label htmlFor="formAltLink" className="block text-sm font-medium text-gray-700 mb-1">Website Link</label>
                        <input type="url" id="formAltLink" value={altLink} onChange={(e) => setAltLink(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="https://..." />
                    </div>
                </fieldset>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                    Submit Contribution for Review
                </button>
            </form>
        </div>
    );
}

export default AddEntryForm;
