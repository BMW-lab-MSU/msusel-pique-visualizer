//AdjustmentPlots.tsx
import React from 'react';
import Plot from 'react-plotly.js';
import '../plotStyle.css';
// import * as ScrollArea from '@radix-ui/react-scroll-area';
// import { Box, Flex } from "@radix-ui/themes";
import { atom, useAtom } from 'jotai'



/***
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