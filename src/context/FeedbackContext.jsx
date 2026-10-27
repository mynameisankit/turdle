import React, { useCallback, useContext, useState } from "react";
import { Text } from "ink";

const FEEDBACK_CONTEXT = React.createContext({
    notify: () => {},
    clear: () => {},
});

function FeedbackProvider({ children }) {
    const [message, setMessage] = useState("");
    const clear = useCallback(() => setMessage(""), []);
    const feedback = {
        message,
        notify: setMessage,
        clear,
    };

    return (
        <FEEDBACK_CONTEXT.Provider value={feedback}>
            {children}
        </FEEDBACK_CONTEXT.Provider>
    );
}

function useFeedback() {
    return useContext(FEEDBACK_CONTEXT);
}

function FeedbackMessage() {
    const { message } = useContext(FEEDBACK_CONTEXT);
    return <Text color="yellow">{message}</Text>;
}

export { FeedbackMessage, FeedbackProvider, useFeedback };
