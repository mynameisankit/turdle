import React, { useContext } from "react";

const CACHE_CONTEXT = React.createContext("");
CACHE_CONTEXT.displayName = "CacheContext";

//Key Names
const CACHE_KEYS = {
    ATTEMPTS: "attempts",
    GAME_CACHE_SET: "ttl",
    STATISTICS_SET: "statistics_ttl",
    STATISTICS: "statistics",
};

function CacheProvider({ value, children }) {
    return (
        <CACHE_CONTEXT.Provider value={value}>
            {children}
        </CACHE_CONTEXT.Provider>
    );
}

function useCache() {
    return useContext(CACHE_CONTEXT);
}

export { useCache, CacheProvider, CACHE_KEYS };
