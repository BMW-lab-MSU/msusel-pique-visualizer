import { useSetAtom } from "jotai";
import { State } from "../../state";
import { Flex, Button } from "@radix-ui/themes";
import { ResetIcon } from "@radix-ui/react-icons";

export const ResetButton = () => {
    // Get the setter functions for each state
    const setSortingState = useSetAtom(State.sortingState);
    const setFilteringState = useSetAtom(State.filteringState);
    const setHideZeroWeightEdgeState = useSetAtom(State.hideZeroWeightEdgeState);
    const setFilteringByRiskLevelCheckboxStates = useSetAtom(State.filteringByRiskLevelCheckboxStates);

    // Define a function to handle the reset action
    const handleReset = () => {
        setSortingState("no-sort");
        setFilteringState("no-filter");
        setHideZeroWeightEdgeState("not-hidding");
        setFilteringByRiskLevelCheckboxStates({
            Insignificant: true,
            Low: true,
            Medium: true,
            High: true,
            Severe: true,
        });
    };

    return (
        <Flex gap="3" align="center">
            <Button size="2" variant="soft" highContrast onClick={handleReset}>
                <ResetIcon width="18" height="18" /> Reset
            </Button>
        </Flex>
    );
};
