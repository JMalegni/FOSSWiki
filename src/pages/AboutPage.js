function AboutPage() {
    return (
        <div className="indent-4  bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 ">About This Project</h2>
            <div className="prose max-w-none text-gray-700"> {/* */}
                <p>
                    This wiki was created as part of an Engineering Ethics class project. The goal is to provide a centralized resource for discovering ethical alternatives to popular, often expensive or proprietary, software applications.
                </p>
	    <br/>
                <p>
                    In the digital age, software piracy is a common issue, often driven by high costs or lack of awareness about viable alternatives. By highlighting Free and Open Source Software (FOSS), freemium models, or more affordably priced options, we aim to:
                </p>
	    <br/>
                <ul className="list-disc list-inside">
                    <li>Reduce the temptation for software piracy by offering legitimate, accessible solutions.</li>
                    <li>Promote the use and development of open-source software and its collaborative ethos.</li>
                    <li>Support software developers who offer fair pricing or free tiers.</li>
                    <li>Encourage ethical decision-making regarding software usage in academic and professional settings.</li>
                </ul>
	    <br/>
                <p>
                    This wiki relies on community contributions. If you know of a great ethical alternative, please use the 'Contribute' page to add it to our list!
                </p>
                <p className="indent-0 mt-6 text-sm text-gray-500">
                    Project created for educational purposes. Information accuracy is based on community contributions and may require verification.
                </p>
            </div>
        </div>
    );
}
export default AboutPage;
