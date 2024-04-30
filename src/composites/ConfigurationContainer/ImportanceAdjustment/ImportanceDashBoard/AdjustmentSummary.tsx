import { useAtomValue } from "jotai";
import React, { useMemo, useState } from "react";
import { State } from "../../../../state";
import { Profile } from "../../../../types";
import * as schema from "../../../../data/schema";
import * as Tabs from "@radix-ui/react-tabs";
import {divide, im, matrix, multiply} from "mathjs";

interface Weights {
    [key: string]: number;
}

interface ChildNodeValues {
    [key: string]: number;
}

interface TQIEntry {
    weights: Weights;
}

interface AdjustmentTableProps {
    selectedProfile?: Profile[];
    isProfileApplied: boolean;
    onResetApplied: () => void;
}

/**
 * Returns an array of numbers between start and stop with step interval
 *
 * @param {number} start starting position.
 * @param {number} stop stopping position.
 * @param {number} step interval.
 *
 * @returns {array} An array of [start:step:stop].
 */
function arrayRange(start, stop, step){
    let foo =[];
    for(let i =start; i <= stop; i=i+step){
        let next = start+ i;
        foo.push(Number.parseFloat(next.toPrecision(2)));
    }
    return foo
}

function addVector(a,b){
    return a.map((e,i) => e + b[i]);
}

function addConst(a,b){
    return a.map((e,i) => e + b);
}

function subConst2Vec(a,b){
    return b.map((e,i) => a - e);
}

function multVectors(a,b){
    return a.map((e,i) => e * b[i]);
}


/***
 * Calculate the score according to the evaluator function
 *
 * @param {array} values Values of the child nodes or an array of values.
 * @param {array} importance Weights of the child nodes.
 * @param {number} normCoefficient Normalization parameters.
 * @param {string} fcnName Name of the evaluator function.
 *
 * @return {*[]} The score or array of scores
 */
function calcScore(values, importance, normCoefficient,fcnName){
    let score = null
    let score_norm = null
    if (fcnName === "defaults"){
        score = calcDefaults(values, importance);
        score_norm = divide(score, normCoefficient);
    }
    return score_norm
}


function calcDefaults(values, importance){
    const val_mat = matrix(values);
    const w_mat = matrix(importance);
    return multiply(val_mat, w_mat)
}

/***
 *  Calculate the scaling factor for normalization by assuming all values are 1.
 *
 *  @param {array} importance Array of nodes of the child nodes.
 *  @param {string} fcnName String of the function name to be evaluated.
 *
 *  @returns {number} normalization coefficient.
 */
function normalizer_calc(importance, fcnName){
    const n_importance = importance.length;
    let normCoefficient = 1;

    let value_max = Array(n_importance).fill(1)

    if (fcnName === "defaults"){
        normCoefficient = calcDefaults(value_max, importance)
    }

    return normCoefficient
}


function calcContribution(values, importance, normCoefficient, fcnName){

    const valuesTemp = values.slice()
    let nodeContribution =[];
    const n_nodes = importance.length;
    const min_array = new Array(n_nodes)

    for (let i =0; i<n_nodes; i=i+1){
        min_array[i] =new  Array(n_nodes).fill(0)
        min_array[i][i]= valuesTemp.at(i);

        nodeContribution.push(calcScore(min_array[i], importance, normCoefficient, fcnName));
    }

    return nodeContribution
}

export const TabsPanel : React.FC<AdjustmentTableProps> = ({
       selectedProfile,
       isProfileApplied,
       onResetApplied,
   }) =>{

    const dataset = useAtomValue(State.dataset);
    if (!dataset) return null;

    const getInitialWeights = (
        selectedProfile: Profile[] | undefined,
        dataset: schema.base.Schema,
        useDataset: boolean
    ): { [key: string]: number } => {
        let weights: Weights = {};
        if (selectedProfile && selectedProfile.length > 0 && !useDataset) {
            const profileWeights = selectedProfile[0].importance;
            weights = { ...profileWeights };
        } else {
            Object.entries(dataset.factors.tqi).forEach(([_, tqiEntry]) => {
                const entry = tqiEntry as TQIEntry;
                Object.entries(entry.weights).forEach(([aspect, importance]) => {
                    weights[aspect] = importance;
                });
            });
        }
        return weights;
    };

    const getInitialNodeValues = (
        selectedProfile: Profile[] | undefined,
        dataset: schema.base.Schema,
        useDataset: boolean
    ): { [key: string]: number } => {
        let values: ChildNodeValues={};

        if (selectedProfile && selectedProfile.length > 0 && !useDataset) {

            //TODO : Find the values parameter for Selected profile

            // const profileWeights = selectedProfile[0].importance;
            // values = { ...profileWeights };

            Object.entries(dataset.factors.tqi).forEach(([_, tqiEntry]) => {
                const entry = tqiEntry as TQIEntry;
                Object.entries(entry.weights).forEach(([aspect, _]) => {
                    values[aspect] = dataset.factors.quality_aspects[aspect]?.value || 0;
                });
            });
        } else {
            Object.entries(dataset.factors.tqi).forEach(([_, tqiEntry]) => {
                const entry = tqiEntry as TQIEntry;
                Object.entries(entry.weights).forEach(([aspect, _]) => {
                    values[aspect] = dataset.factors.quality_aspects[aspect]?.value || 0;
                });
            });
        }
        return values;
    };

    const sliderValues = useMemo(() => {
        const useDataset = !isProfileApplied;
        return getInitialWeights(selectedProfile, dataset, useDataset);
    }, [selectedProfile, dataset, isProfileApplied]);

    const [values, setValues] = useState<{ [key: string]: number }>(sliderValues);
    useMemo(() => {
        setValues(sliderValues);
    }, [sliderValues]);

    const nodeValues = useMemo(() => {
        const useDataset = !isProfileApplied;
        return getInitialNodeValues(selectedProfile, dataset, useDataset);
    }, [selectedProfile, dataset, isProfileApplied]);

    const [aspectValues, setAspectValues] = useState<{[key: string]: number}>(nodeValues);
    useMemo(() => {
        setAspectValues(nodeValues);
    }, [nodeValues]);

    const resetAllAdjustments = () => {
        const resetValues = getInitialWeights(selectedProfile, dataset, true);
        setValues(resetValues);
        onResetApplied();
    };


    return(
        <Tabs.Root className="TabsRoot" defaultValue="tab1">
            <Tabs.List className="TabsList" aria-label="Addditional details">
                <Tabs.Trigger className="TabsTrigger" value="tab1">
                    Contributions
                </Tabs.Trigger>
                <Tabs.Trigger className="TabsTrigger" value="tab2">
                    Sensitivity
                </Tabs.Trigger>
                <Tabs.Trigger className="TabsTrigger" value="tab3">
                    Impacts
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content className="TabsContent" value="tab1">
                <p className="Text">Provides Information about Contributions</p>
                {/*<PieContribution/>*/}
            </Tabs.Content>
            <Tabs.Content className="TabsTrigger" value="tab2">
                <p className="Text">Provides Information about sensitivity</p>
            </Tabs.Content>
            <Tabs.Content className="TabsTrigger" value="tab3">
                <p className="Text">Provides Information about Impacts</p>
            </Tabs.Content>
        </Tabs.Root>
    );
}
