import { useEffect, useState } from "react";
import { PAGES } from "../context/PageContext.jsx";
import { useFeedback } from "../context/FeedbackContext.jsx";
import { captureResult, loadInitialStatistics } from "../data/cache.js";
import { CACHE } from "./cache.js";

function getInitialPage(statistics) {
    if (statistics.played === undefined || statistics.played === 0) {
        return PAGES.TUTORIAL;
    }

    return PAGES.GAME;
}

function useInitialPage() {
    const { notify } = useFeedback();
    const [page, setPage] = useState("");

    useEffect(() => {
        const loadInitialPage = async () => {
            const result = await captureResult(() =>
                loadInitialStatistics(CACHE),
            );
            if (!result.ok) {
                notify(
                    "Saved data could not be read. Starting with the tutorial.",
                );
                setPage(PAGES.TUTORIAL);
                return;
            }

            setPage(getInitialPage(result.value));
        };

        loadInitialPage();
    }, [notify]);

    return { page, setPage };
}

export default useInitialPage;
