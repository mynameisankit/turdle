import { useInput } from "ink";
import { PAGES } from "../context/PageContext.jsx";

function useEscapeNavigation(page, setPage, exit) {
    useInput((_, key) => {
        if (!key.escape) return;

        if (page !== PAGES.GAME) {
            setPage(PAGES.GAME);
            return;
        }

        exit();
    });
}

export default useEscapeNavigation;
