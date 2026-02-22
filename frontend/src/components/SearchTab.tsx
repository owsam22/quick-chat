import React from 'react';
import { Search } from 'lucide-react';

const SearchTab = () => {
    return (
        <div className="tab-view-content">
            <div className="view-header">
                <Search size={24} />
                <h2>Global Search</h2>
            </div>
            <div className="search-bar-ui">
                <Search size={20} />
                <input type="text" placeholder="Search across rooms, messages and users..." />
            </div>
            <p className="placeholder-text">AI is indexing your workspace... No results yet.</p>
        </div>
    );
};

export default SearchTab;
