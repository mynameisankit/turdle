const React = require('react');

const CacheContext = React.createContext('');
CacheContext.displayName = 'CacheContext';

//Key Names
const keys = {
    ATTEMPTS: 'attempts',
    GAME_CACHE_SET: 'ttl',
    STATISTICS_SET: 'statistics_ttl',
    STATISTICS: 'statistics'
};

function CacheProvider({ value, children }) {
    return (
        <CacheContext.Provider value={value}>
            {children}
        </CacheContext.Provider>
    );
}

module.exports = { CacheContext, CacheProvider, keys };