import WikiList from '../components/WikiList.js';
function WikiPage({ entries, loading, error }) {
    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Software Alternatives</h2>
            {loading && <p className="text-center text-gray-500 mt-10">Loading entries...</p>}
            {error && <p className="text-center text-red-600 bg-red-100 p-3 rounded-md mt-4">{error}</p>}
            {!loading && <WikiList entries={entries} />}
        </div>
    );
}
export default WikiPage;
