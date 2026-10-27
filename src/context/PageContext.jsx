import React, { useContext } from "react";

const PAGE_CONTEXT = React.createContext("");
PAGE_CONTEXT.displayName = "PageContext";

const PAGES = {
    TUTORIAL: "tutorial",
    GAME: "main",
    STATISTICS: "statistics",
};

function PageProvider({ value, children }) {
    return (
        <PAGE_CONTEXT.Provider value={value}>{children}</PAGE_CONTEXT.Provider>
    );
}

function usePage() {
    return useContext(PAGE_CONTEXT);
}

export { usePage, PageProvider, PAGES };
