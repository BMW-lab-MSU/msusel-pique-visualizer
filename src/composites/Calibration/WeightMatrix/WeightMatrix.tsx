import React, { useMemo } from "react";
import { useAtomValue } from "jotai";

import * as Schema from "../../../data/definitionSchema";
import { State } from "../../../state";
import {
    Flex,
    Text,
    Box,
    Avatar,
    Separator,
    Strong,
    Card,
    Table,
} from "@radix-ui/themes";

import "@radix-ui/colors/mauve.css";
import {Tab} from "@chakra-ui/react";

export  const WeightMatrix =() =>{
    const definition: Schema.base.Schema = useAtomValue(
        State.definition
    ) as Schema.base.Schema;

    return(
        <Flex direction={"column"} align={"center"}>
            <Box width={"auto"}>
                <Table.Root variant="surface" >
                    <Table.Header>
                        <TableHeader Data={definition.factors.quality_aspects} />
                    </Table.Header>
                    <Table.Body>
                        {Object.entries(definition.measures).map(([key, val]) => {
                            return(
                                <SingleRow RowData={key} ColumnData={definition.factors.quality_aspects}/>
                            );
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
    // console.log(Data)
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

const SingleRow =(
    RowData:  {[key: string]: any},
    ColumnData: {[key: string]: any },
    ) =>{
    // console.log(RowData)
    return(
        <Table.Row key={RowData}>
            <Table.RowHeaderCell>
                {RowData.RowData}
            </Table.RowHeaderCell>
            <Table.Cell>
                gg
            </Table.Cell>
        </Table.Row>
    );
}
