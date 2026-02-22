import React from 'react';
import { Search, Menu } from 'lucide-react';

interface SearchTabProps {
    onMobileMenuToggle: () => void;
}

const SearchTab: React.FC<SearchTabProps> = ({ onMobileMenuToggle }) => {
    return (
        <div className="tab-view-content">
            <div className="view-header">
                <button className="mobile-toggle" onClick={onMobileMenuToggle}>
                    <Menu size={20} />
                </button>
                <Search size={28} className="text-primary" />
                <h2>Global Intelligence</h2>
            </div>

            <div className="search-bar-ui">
                <Search size={20} />
                <input type="text" placeholder="Search across dimensions..." />
            </div>

            <div className="search-status">
                <p>AI is indexing your neural workspace... No results found.</p>
            </div>

            <div className="search-suggestions">
                <h4>Suggested Filters</h4>
                <div className="filter-chips">
                    <span className="chip">#Development</span>
                    <span className="chip">#Design</span>
                    <span className="chip">#General</span>
                </div>
            </div>
        </div>
    );
};

export default SearchTab;
