import { useMemo } from "react";
import { useAtomValue } from "jotai";
import { State } from "../state";

import { sort } from "../composites/Sorting/Sorting";
import { filterByRiskLevels } from "../composites/Filtering/FilterByRiskLevel";
import { filterByWeightRange } from "../composites/Filtering/FilterByWeightRange";
import { filterByValueRange } from "../composites/Filtering/FilterByValueRange";
import { hideZeroWeightEdges } from "../composites/Filtering/HideZeroWeightEdges";
import {base} from "./definitionSchema.ts";


export const useProcessedDefinitionData = () => {
    // Retrieve state values
    const dataset = useAtomValue(State.dataset);
    const definition = useAtomValue(State.definition);
    const adjustedImportance = useAtomValue(State.adjustedImportance);
    const tqiValue = useAtomValue(State.tqiValue);
    const sortState = useAtomValue(State.sortingState);
    const filterState = useAtomValue(State.filteringState);
    const checkboxStates = useAtomValue(State.filteringByRiskLevelCheckboxStates);
    const hideZeroWeightEdgeState = useAtomValue(State.hideZeroWeightEdgeState);
    const hideOneValueNodeState = useAtomValue(State.hideOneValueNodeState);
    const minValueState = useAtomValue(State.minValueState);
    const maxValueState = useAtomValue(State.maxValueState);
    const minWeightState = useAtomValue(State.minWeightState);
    const maxWeightState = useAtomValue(State.maxWeightState);

    return useMemo(() => {
        if (!definition) return null;

        if (definition.factors.tqi && adjustedImportance) {
            const firstTqiKey = Object.keys(definition.factors.tqi)[0];
            if (firstTqiKey && definition.factors.tqi[firstTqiKey]) {
                definition.factors.tqi[firstTqiKey].weights = adjustedImportance;
                if (tqiValue) {
                    definition.factors.tqi[firstTqiKey].value = tqiValue;
                }
            }
        }

        let data = sort(sortState, definition);

        // const isEdgeHiding = hideZeroWeightEdgeState === "hidding";
        // data = hideZeroWeightEdges(data, isEdgeHiding);
        //
        // const isNodeHiding = hideZeroWeightEdgeState === "hidding";
        // //data = hideZeroWeightEdges(data, isEdgeHiding);
        //
        // data = filterByRiskLevels(data, checkboxStates);
        //
        // data = filterByValueRange(data, minValueState, maxValueState);
        //
        // data = filterByWeightRange(data, minWeightState, maxWeightState);

        // Add any other processing steps here

        return data;
    }, [
        dataset,
        adjustedImportance,
        tqiValue,
        sortState,
        filterState,
        checkboxStates,
        hideZeroWeightEdgeState,
        minValueState,
        maxValueState,
        minWeightState,
        maxWeightState,
    ]);
};
