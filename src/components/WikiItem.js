function WikiItem({ entry }) {
    const hasAlternatives = Array.isArray(entry.alternatives) && entry.alternatives.length > 0;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 transition-shadow duration-300 hover:shadow-lg">
            <div className="p-5">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{entry.name || 'Unnamed Entry'}</h2>
                <p className="text-sm text-gray-500 mb-3 uppercase tracking-wider">{entry.category || 'Uncategorized'}</p>
                <p className="text-gray-600 mb-4">{entry.description || 'No description available.'}</p>

                <h3 className="text-lg font-medium text-gray-700 mb-3 border-t pt-3 mt-4">Ethical Alternatives:</h3>
                {hasAlternatives ? (
                    <ul className="space-y-3">
                        {entry.alternatives.map((alt, index) => (
                            alt && typeof alt === 'object' ? (
                                <li key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                                    <div>
                                        <span className="font-medium text-blue-600">{alt.name || 'N/A'}</span>
                                        {alt.type && (
                                            <span className={`text-xs font-semibold ml-2 px-2 py-0.5 rounded-full ${alt.type === 'Open Source' ? 'bg-green-100 text-green-700' : alt.type.includes('Freemium') ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {alt.type}
                                            </span>
                                        )}
                                        {alt.cost && (
                                            <span className="text-sm text-gray-600 ml-2">({alt.cost})</span>
                                        )}
                                    </div>
                                    {alt.link && (
                                        <a
                                            href={alt.link} target="_blank" rel="noopener noreferrer"
                                            className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline mt-1 sm:mt-0"
                                        >
                                            Visit Website &rarr;
                                        </a>
                                    )}
                                </li>
                            ) : null
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 italic">No alternatives listed for this entry.</p>
                )}
            </div>
        </div>
    );
}
export default WikiItem;