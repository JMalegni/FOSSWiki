import AddEntryForm from '../components/AddEntryForm.js';
function ContributePage({ onAddEntry }) {
    return (
        <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Contribute to the Wiki</h2>
            <p className="text-gray-600 mb-6">
                Help grow this resource by adding software and its ethical alternatives. Please ensure the information is accurate and the alternatives are genuinely open-source, free, or significantly more affordable/ethically produced than the original.
            </p>
            <AddEntryForm onAddEntry={onAddEntry} />
        </div>
    );
}
export default ContributePage;