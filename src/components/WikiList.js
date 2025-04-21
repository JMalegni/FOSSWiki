import WikiItem from './WikiItem.js';
function WikiList({ entries }) {
    if (!entries || entries.length === 0) {
        return <p className="text-center text-gray-500 mt-10">Loading entries or no entries found...</p>;
    }

    return (
        <div className="space-y-6">
            {entries.map(entry => (
                entry && entry.id ? <WikiItem key={entry.id} entry={entry} /> : null
            ))}
        </div>
    );
}
export default WikiList;