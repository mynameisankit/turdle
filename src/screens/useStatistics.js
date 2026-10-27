import { useEffect, useState } from "react";
import { useCache } from "../context/CacheContext.jsx";
import { useFeedback } from "../context/FeedbackContext.jsx";
import {
    captureResult,
    loadStatistics as loadSavedStatistics,
} from "../data/cache.js";
import { createEmptyStatistics } from "../game/statistics.js";

function useStatistics() {
    const cache = useCache();
    const { notify, clear } = useFeedback();
    const [statistics, setStatistics] = useState(createEmptyStatistics);

    useEffect(() => {
        const load = async () => {
            const result = await captureResult(() =>
                loadSavedStatistics(cache, createEmptyStatistics()),
            );
            if (!result.ok) {
                setStatistics(createEmptyStatistics());
                notify("Statistics could not be loaded from saved data.");
                return;
            }

            setStatistics(result.value);
            clear();
        };

        load();
    }, [cache, clear, notify]);

    return statistics;
}

export default useStatistics;
