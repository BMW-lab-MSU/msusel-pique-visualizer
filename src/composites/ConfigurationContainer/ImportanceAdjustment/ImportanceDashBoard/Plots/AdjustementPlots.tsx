//AdjustmentPlots.tsx
import React from 'react';
import Plot from 'react-plotly.js';
import '../plotStyle.css';
// import * as ScrollArea from '@radix-ui/react-scroll-area';
// import { Box, Flex } from "@radix-ui/themes";
import { atom, useAtom } from 'jotai'



/**
 * Renders a Pie chart according to the contributions
 *
 * @param {array} names String array of names
 * @param {array} contributions number array of values.
 */
export function PieContribution({names, contributions}) {
    return (
        <Plot
            data={[{
                name: 'Contribution',
                values: contributions,
                labels: names,
                type: 'pie',
                textinfo: 'label+percent',
                textposition: 'outside',
                sort: false
            }]}
            layout={{
                title: 'Contributions',
                height: 350,
                width: 350,
                showlegend: false,
            }}
        />
    );
}

/**
 * Plots sensitivity of each characteristic
 *
 * @param {Array} names  String array of child node names
 * @param {Array} values Number array of child node values
 * @param {number} score Node score
 * @param {Array} impacts Number array of impacts of each child node
 * @param {Array} x_tick X axis tick position array for plotting.
 * @param {number} threshold Threshold value to be achieved
*/
export function SensitivityChart({names, values, score,  sensitivity, x_ticks, threshold}){
    const n_nodes = names.length
    const node_idx = Array.apply(null, {length: n_nodes}).map(Number.call, Number)

    let traceData = [];
    let valData =[]

    for (let idx in node_idx){
        let trace = {
            name: names[idx],
            y: sensitivity[0].at(idx),
            x: x_ticks,
            type: 'scatter',
            mode: 'lines'
        };

        let val_point ={
            name: names[idx]+' value',
            y: [score],
            x: [values[idx]],
            type: 'scatter',
            mode: 'markers',
            showlegend: false,
            marker: {color: 'black', size: 8 }
        };

        traceData.push(trace);
        valData.push(val_point);

    }

    let scoreTrace ={
        name: "score",
        x: [0, 1],
        y: [score, score],
        type: 'scatter',
        mode: 'lines',
        marker:{color: 'black'},
        line: {dash: 'dot'},
    }

    let thresholdTrace={
        name: "Threshold",
        x: [0, 1],
        y: [threshold, threshold],
        type: 'scatter',
        mode: 'lines',
        marker: {color: 'red'},
        line: {dash: 'dashdot'},
    }

    traceData = traceData.concat(valData, [scoreTrace], [thresholdTrace])

    return(
        <Plot
            data={traceData}
            layout={{
                title: 'Sensitivity',
                height: 500,
                width: 450,
                yaxis: {title: "Score", range:[0,1.1]},
                xaxis: {title: "values", range:[0,1.1]}
            }}
        />
    );
}
