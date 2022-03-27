const React = require('react');

const PageContext = React.createContext('');
PageContext.displayName = 'PageContext';

const pages = {
    TUTORIAL: 'tutorial',
    GAME: 'main',
    STATISTICS: 'statistics'
};

function PageProvider({ value, children }) {
    return (
        <PageContext.Provider value={value}>
            {children}
        </PageContext.Provider>
    );
}

module.exports = { PageContext, PageProvider, pages };