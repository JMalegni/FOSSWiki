function Navbar({ currentPage, onNavigate }) {
    const linkClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150";
    const activeClasses = "bg-indigo-700 text-white";
    const inactiveClasses = "text-indigo-100 hover:bg-indigo-500 hover:text-white";

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md sticky top-0 z-20">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Title */}
                    <div className="flex-shrink-0">
                        <h1 className="text-xl font-bold">Ethical Software Wiki</h1>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <button
                                onClick={() => onNavigate('wiki')}
                                className={`${linkClasses} ${currentPage === 'wiki' ? activeClasses : inactiveClasses}`}
                            >
                                Wiki
                            </button>
                            <button
                                onClick={() => onNavigate('contribute')}
                                className={`${linkClasses} ${currentPage === 'contribute' ? activeClasses : inactiveClasses}`}
                            >
                                Contribute
                            </button>
                            <button
                                onClick={() => onNavigate('about')}
                                className={`${linkClasses} ${currentPage === 'about' ? activeClasses : inactiveClasses}`}
                            >
                                About
                            </button>
                        </div>
                    </div>
                     {/* Mobile Menu Button*/}
                     <div className="md:hidden">
                        {/* Basic text links for mobile for simplicity */}
                         <button onClick={() => onNavigate('wiki')} className="text-indigo-100 px-2">Wiki</button>
                         <button onClick={() => onNavigate('contribute')} className="text-indigo-100 px-2">Contribute</button>
                         <button onClick={() => onNavigate('about')} className="text-indigo-100 px-2">About</button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
export default Navbar;