import Plot from 'react-plotly.js';
import * as Tabs from '@radix-ui/react-tabs';
import './style.css';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Box, Flex } from "@radix-ui/themes";
import { atom, useAtom } from 'jotai'
import { useAtom, useAtomValue } from "jotai";
import React, { ChangeEvent, useState } from "react";
import { State } from "../../state";
import { Profile } from ".../../types";
import * as schema from "../../../../../data/schema.ts";

export const getInitialWeights = (
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

export const PieContribution: React.FC<FiguresProps>  = () => {
    const dataset = useAtomValue(State.dataset);
    if (!dataset) return null;

    const names = Object.entries(dataset.factors.tqi.weights).map()
    const contributions = useState()

    return(
        <Plot
            data={[{
                name: 'Contribution',
                values: {contributions},
                labels: {names},
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
};
