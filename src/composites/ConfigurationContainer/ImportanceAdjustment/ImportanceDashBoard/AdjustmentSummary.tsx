//AdjustmentSummar.tsx


import React, {useMemo, useState} from "react";
import {State} from "../../../../state";
import {Profile} from "../../../../types";
import * as schema from "../../../../data/schema";
import * as Tabs from "@radix-ui/react-tabs";
import {divide, matrix, multiply} from "mathjs";
import {stackOffsetWiggle} from "d3";

import "./plotStyle.css"
import {PieContribution} from "./Plots/AdjustementPlots.tsx";


interface Weights {
    [key: string]: number;
}

interface ChildchildNodeValues {
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

/**
 * Returns an array in order of sorted reference array
 * https://stackoverflow.com/questions/46622486/what-is-the-javascript-equivalent-of-numpy-argsort
 */
function sortByArrayRefOrder (data, orderRefArr){
    let orderedArr = [], i=0;
    orderRefArr.map( o => { orderedArr[o-1] = data[i++]});
    return orderedArr.reverse();
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
function normalizer_calc(importance: any[], fcnName: string){
    const n_importance = importance.length;

    let value_max = Array(n_importance).fill(1)

    if (fcnName === "defaults"){
        return calcDefaults(value_max, importance)
    }else {
        return 1
    }
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





interface AdjustmentSummaryProps {
    dataset: schema.base.Schema;
    values: { [key: string]: number };
    recalculatedWeights: { [key: string]: number };
}

export const TabsPanel: React.FC<AdjustmentSummaryProps> = ({
       dataset,
       values,
       recalculatedWeights,
   }) =>{

    const getInitialchildNodeValues = (dataset: schema.base.Schema): { [key: string]: number } => {
        let values: ChildchildNodeValues={};

        //TODO : Make it generalize to work with each layer in pique

        Object.entries(dataset.factors.tqi).forEach(([_, tqiEntry]) => {
            const entry = tqiEntry as TQIEntry;
            Object.entries(entry.weights).forEach(([aspect, _]) => {
                values[aspect] = dataset.factors.quality_aspects[aspect]?.value || 0;
            });
        });

        return values;
    };




    //
    const n_child = Object.keys(values).length;

    const nodeNames = Object.keys(values);
    //
    const [weigths, setWeights] = useState(Object.keys(recalculatedWeights).map(key=> recalculatedWeights[key]));
    useMemo(() => {
        setWeights(Object.keys(recalculatedWeights).map(key=> recalculatedWeights[key]));
    }, [recalculatedWeights]);

    const [importance, setImportance] = useState(Object.keys(values).map(key=> values[key]));
    useMemo(() => {
        setImportance(Object.keys(values).map(key=> values[key]));
    }, [values]);

    const childNodeValues = useMemo(() => {
        return getInitialchildNodeValues(dataset);
    }, [ dataset]);

    const [nodeValues, setNodeValues] = useState(Object.keys(childNodeValues).map(key=> childNodeValues[key]));
    useMemo(() => {
        setNodeValues(Object.keys(childNodeValues).map(key=> childNodeValues[key]));
    }, [childNodeValues]);
   
    const [fcnName, setFcnName] = useState("defaults");

    const [normCoefficient, setNormCoefficient] = useState(
        normalizer_calc(importance, fcnName)
    );


    // //Number of x grid points for plotting
    const x_tick = arrayRange(0,1,0.1);
    const [contribution, setContribution]= useState(
        calcContribution(nodeValues, importance, normCoefficient, fcnName)
    )
    useMemo(() =>{
        setContribution(calcContribution(nodeValues, importance, normCoefficient, fcnName))
    }, [nodeValues, importance, normCoefficient, fcnName])

    // console.log("Node Contribution")
    // console.log(contribution)

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
                <PieContribution
                    names={nodeNames}
                    contributions={contribution}
                />
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
