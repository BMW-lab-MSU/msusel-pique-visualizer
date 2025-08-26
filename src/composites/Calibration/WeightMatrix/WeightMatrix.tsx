import React, { useMemo } from "react";
import { useAtomValue } from "jotai";

import * as Schema from "../../../data/definitionSchema";
import { State } from "../../../state";
import {
    Flex,
    Box,
    Table,
} from "@radix-ui/themes";

import "@radix-ui/colors/mauve.css";
// import {Tab} from "@chakra-ui/react";

export  const WeightMatrix =() =>{
    const definition: Schema.base.Schema = useAtomValue(
        State.definition
    ) as Schema.base.Schema;
    // console.log(definition)

    return(
        <Flex direction={"column"} align={"center"}>
            <Box width={"auto"}>
                <Table.Root variant="surface" >
                    <Table.Header>
                        <TableHeader Data={definition.factors.quality_aspects} />
                    </Table.Header>
                    <Table.Body>
                        {Object.keys(definition.measures).map(key => {
                            return(
                           <SingleRow key={key} rowName={key} columnData={definition.factors.quality_aspects}/>);
                        })}
                    </Table.Body>
                </Table.Root>
            </Box>
        </Flex>
    );
}

const TableHeader = (
    Data: { [key: string]: any },
    ) => {
    return(
        <Table.Row align={"center"}>
            <Table.ColumnHeaderCell>
                ...
            </Table.ColumnHeaderCell>
            {Object.entries(Data.Data).map(([key, value]) => {
                // Use the key as a fallback if the name property is missing
                const valueName = value.name ?? key;

                return(
                    <Table.ColumnHeaderCell align={"center"} key={key}>
                        {valueName}
                    </Table.ColumnHeaderCell>
                );
            })}
        </Table.Row>
    );
}

interface SingleRowProps {
  rowName : string;
  columnData: {[key: string]: any };
}

const SingleRow: React.FC<SingleRowProps>= ({rowName, columnData }) =>{
    // console.log(rowName);
    return(
        <Table.Row key={rowName} >
            <Table.RowHeaderCell>
                {rowName}
            </Table.RowHeaderCell>
            <Table.Cell>
                gg
            </Table.Cell>
        </Table.Row>
    );
}
