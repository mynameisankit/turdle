const React = require('react');

const PageContext = React.createContext('');

function PageProvider({ value, children }) {
    return (
        <PageContext.Provider value={value}>
            {children}
        </PageContext.Provider>
    );
}

module.exports = { PageContext, PageProvider };