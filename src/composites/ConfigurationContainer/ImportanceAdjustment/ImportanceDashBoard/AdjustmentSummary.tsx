//AdjustmentSummary.tsx
import React, {useMemo, useState, useId, useEffect} from "react";
import {State} from "../../../../state";
import {Profile} from "../../../../types";
import * as schema from "../../../../data/schema";
import * as Tabs from "@radix-ui/react-tabs";
import {divide, matrix, multiply} from "mathjs";
import {stackOffsetWiggle} from "d3";


// import "./plotStyle.css"
import {PieContribution, SensitivityChart} from "./Plots/AdjustementPlots.tsx";
import {Box, Flex, Text} from "@radix-ui/themes";
import * as Slider from "@radix-ui/react-slider";


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

function calcImpacts(values, importance, normCoefficient, fcnName, strategy){
    const n_nodes = values.length
    let impact_val = values
    let impact_idx = Array.apply(null, {length: n_nodes}).map(Number.call, Number)

    switch (strategy){
        case "Lowest":{
            impact_val = values

            break;
        }
        case "Fastest":{
            impact_val = importance
            break;
        }
        case "LowestEffort":{
            impact_val = multVectors(subConst2Vec(1, values), importance)
            break;
        }
        default:{

        }
    }
    return impact_val
}

function calcImpactIdx(impact_val, strategy){
    let decor = (v, i) => [v, i];          // set index to value
    let undecor = a => a[1];               // leave only index
    let argsort = arr => arr.map(decor).sort().map(undecor);


    let impact_idx =  argsort(impact_val).reverse()

    switch (strategy) {
        case "Lowest":{
            impact_idx =  argsort(impact_val)
            break;
        }
        default:{
            impact_idx =  argsort(impact_val).reverse()
            break;

        }
    }
    return impact_idx
}

/***
 * Returns the sensitivity of a child node for given set of values.
 *
 * @param {array} values The current child node values.
 * @param {array} importance The current importance of the child nodes.
 * @param {number} idx The child node index to be evaluated.
 * @param {number} normCoefficient The normalization factor.
 * @param {string} fcnName The function name to be used for evaluation.
 * @param {array} x_tick The set of node values to be evaluated
 *
 * @returns {array} The set of values for the given x_tick
 */
function calcSensitivityNode(values, importance, idx, normCoefficient, fcnName, x_tick){

    let y_ticks =[];
    const n_x_tick = x_tick.length;
    let x_array = Array(n_x_tick).fill(values.slice())

    for (let i =0; i<n_x_tick; i=i+1){
        x_array[i][idx]= x_tick[i];
        y_ticks.push(calcScore(x_array[i], importance, normCoefficient, fcnName))
    }
    return y_ticks
}

/***
 * Returns the sensitivity of for all child nodes for given set of values
 *
 * @param {array} values The current child node values.
 * @param {array} importance The current importance of the child nodes.
 * @param {number} normCoefficient The scaling factor for normalization
 * @param {string} fcnName The function name to be used for evaluation.
 * @param {array} x_tick The set of node values to be evaluated
 *
 * @returns {array} The array of arrays for the given x_tick
 */
function calcSensitivity(values, importance, normCoefficient,fcnName, x_tick){
    let y_sensitivity = [];
    const n_nodes = values.length;
    const node_idx = Array.apply(null, {length: n_nodes}).map(Number.call, Number)

    y_sensitivity.push(node_idx.map(idx=>
        (calcSensitivityNode(values, importance, idx, normCoefficient,fcnName, x_tick)))
    )
    return y_sensitivity
}


/***

 */

function StrategySelect({ID, selectValue, handleChange}){
    return(
        <label htmlFor={ID}>
            <p className="Text">Strategy</p>
            <select
                name="selecStartegy"
                value={selectValue}
                onChange={e => handleChange(e.target.value)}
            >
                <option value="Lowest">Lowest</option>
                <option value="Fastest">Fastest</option>
                <option value="LowestEffort">Lowest Effort</option>
                <option value="Custom">Custom 1</option>
            </select>
        </label>
    );
}


interface AdjustmentSummaryProps {
    dataset: schema.base.Schema;
    values: { [key: string]: number };
    recalculatedWeights: { [key: string]: number };
    childNodeValues: { [key: string]: number };
}

export const TabsPanel: React.FC<AdjustmentSummaryProps> = ({
       dataset,
       values,
       recalculatedWeights,
    childNodeValues,
   }) =>{

    const getInitialChildNodeValues = (dataset: schema.base.Schema): { [key: string]: number } => {
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

    // const childNodeValues = useMemo(() => {
    //     return getInitialChildNodeValues(dataset);
    // }, [ dataset]);

    const [nodeValues, setNodeValues] = useState(Object.keys(childNodeValues).map(key=> childNodeValues[key]));
    useMemo(() => {
        setNodeValues(Object.keys(childNodeValues).map(key=> childNodeValues[key]));
    }, [childNodeValues]);
   
    const [fcnName, setFcnName] = useState("defaults");

    const [normCoefficient, setNormCoefficient] = useState(
        normalizer_calc(importance, fcnName)
    );
    useMemo(() => {
        setNormCoefficient(normalizer_calc(importance, fcnName))
    }, [importance, fcnName]);


    // //Number of x grid points for plotting
    const x_tick = arrayRange(0,1,0.1);
    const [threshold, setThreshold] = useState(1.0);


    const [contribution, setContribution]= useState(
        calcContribution(nodeValues, importance, normCoefficient, fcnName)
    )
    useMemo(() =>{
        setContribution(calcContribution(nodeValues, importance, normCoefficient, fcnName))
    }, [nodeValues, importance, normCoefficient, fcnName])

    const [nodeScore, setNodeScore] =useState(
        calcScore(nodeValues, importance, normCoefficient, fcnName)
    )
    useMemo(() => {
        setNodeScore(calcScore(nodeValues, importance, normCoefficient, fcnName))
    }, [nodeValues, importance, normCoefficient, fcnName]);

    const [scoreSensitivity, setScoreSensitivity] = useState(
        calcSensitivity(nodeValues, importance, normCoefficient,fcnName, x_tick)
    );
    useMemo(() => {
        setScoreSensitivity(calcSensitivity(nodeValues, importance, normCoefficient,fcnName, x_tick))
    }, [nodeValues, importance, normCoefficient,fcnName]);


    const strategySelectID =useId();
    const [strategy, setStrategy] = useState("Lowest");

    const [scoreImpact, setScoreImpact] = useState(Array(n_child).fill(0));
    const [scoreImpactIdx, setScoreImpactIdx] = useState(Array(n_child).fill(0));
    useMemo(() => {
        setScoreImpact(calcImpacts(nodeValues, importance, normCoefficient, fcnName, strategy));
    },[nodeValues, importance, normCoefficient, fcnName, strategy]);
    useMemo(() =>{
        setScoreImpactIdx(calcImpactIdx(scoreImpact, strategy));
    },[scoreImpact, strategy]);


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
                    Recommendations
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content className="TabsContent" value="tab1">
                <p className="Text">Provides Information about Contributions</p>
                <PieContribution
                    names={nodeNames}
                    contributions={contribution}
                />
            </Tabs.Content>
            <Tabs.Content className="TabsContent" value="tab2">
                <div>
                <p className="Text">Provides Information about sensitivity</p>
                <SensitivityChart
                    names={nodeNames}
                    values={nodeValues}
                    score={nodeScore}
                    sensitivity={scoreSensitivity}
                    x_ticks={x_tick}
                    threshold={threshold}
                    /></div>
                <div>
                Threshold
                <Box style={{ position: 'relative', padding: '20px' }}>
                    <Slider.Root
                        value= {[threshold]}
                        onValueChange={(value) => setThreshold(value[0])}
                        min={0}
                        max={1}
                        step={0.01}
                        className="SliderRoot">
                        <Slider.Track className="SliderTrack">
                            <Slider.Range className="SliderRange" />
                        </Slider.Track>
                        <Slider.Thumb className="SliderThumb" />
                    </Slider.Root>
                    <div style={{ position: 'absolute', top: '-2px', left: `${threshold * 100}%`, transform: 'translateX(-50%)' }}>
                        {threshold.toFixed(2)}
                    </div>
                </Box>
                </div>
            </Tabs.Content>
            <Tabs.Content className="TabsContent" value="tab3">
                <p className="Text">Provides Information about Recommendations</p>
                <StrategySelect
                    ID={strategySelectID}
                    selectValue={strategy}
                    handleChange={setStrategy}
                />
                <div className="Text">
                    <p>Recommendation priority list</p>
                    <ol>
                        {scoreImpactIdx.map((idx) =>
                            <li>
                                {nodeNames[idx]} : {scoreImpact[idx].toFixed(3)}
                            </li>
                        )}
                    </ol>
                </div>
            </Tabs.Content>
        </Tabs.Root>
    );
}
