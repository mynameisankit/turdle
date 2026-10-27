import React from "react";
import { Box, Text } from "ink";

function LetterTile({ value, color, bold = false }) {
    return (
        <Box
            height={3}
            width={6}
            borderStyle="single"
            borderColor={color}
            alignItems="center"
            justifyContent="center"
        >
            <Text bold={bold} color={color}>
                {value}
            </Text>
        </Box>
    );
}

export default LetterTile;
