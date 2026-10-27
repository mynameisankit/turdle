import React from "react";
import { Text, Box, useApp } from "ink";
import BigText from "ink-big-text";
import Gradient from "ink-gradient";
import { PageProvider, PAGES } from "./context/PageContext.jsx";
import { CacheProvider } from "./context/CacheContext.jsx";
import {
    FeedbackMessage,
    FeedbackProvider,
    useFeedback,
} from "./context/FeedbackContext.jsx";
import { CACHE } from "./app/cache.js";
import useEscapeNavigation from "./app/useEscapeNavigation.js";
import useInitialPage from "./app/useInitialPage.js";
import Game from "./game/Game.jsx";
import Tutorial from "./screens/Tutorial.jsx";
import Statistics from "./screens/Statistics.jsx";

function AppContent() {
    const { exit } = useApp();
    const { page, setPage } = useInitialPage();
    useEscapeNavigation(page, setPage, exit);

    return (
        <CacheProvider value={CACHE}>
            <PageProvider value={{ page, setPage }}>
                <Box
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                >
                    <Gradient name="teen">
                        <BigText text="TURDLE" />
                    </Gradient>
                    <FeedbackMessage />
                    <React.Fragment>
                        {page === PAGES.GAME && <Game />}
                        {page === PAGES.TUTORIAL && <Tutorial />}
                        {page === PAGES.STATISTICS && <Statistics />}
                    </React.Fragment>
                    <Text bold>
                        You can press "Esc" to exit the{" "}
                        {page === "main" ? "app" : "current page"}
                    </Text>
                </Box>
            </PageProvider>
        </CacheProvider>
    );
}

function App() {
    return (
        <FeedbackProvider>
            <AppContent />
        </FeedbackProvider>
    );
}

export default App;
