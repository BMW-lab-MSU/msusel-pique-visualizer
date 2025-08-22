import { useAtomValue } from "jotai";
import React, {useEffect, useState} from "react";
import { State } from "./state";
import {Box, IconButton, Tabs, Flex, Heading, Text, Button, Separator} from "@radix-ui/themes";
import {
    GearIcon,
    PinLeftIcon,
    PinRightIcon,
    HamburgerMenuIcon,
} from "@radix-ui/react-icons";
import { useProcessedData } from "./data/useProcessedData";
import { useProcessedDefinitionData} from "./data/useProcessedDefinition.tsx";

import { ButtonContainer } from "./composites/FeaturesContainer/ButtonContainer";

import { OverviewTab } from "./composites/Overview/OverviewTab";
import { LegendContainer } from "./composites/LegendContainer/Legend";
import { TreeDisplay } from "./composites/TreeDisplay/TreeDisplay";
import { ListDisplay } from "./composites/ListDisplay/ListDisplay";
import { ListSelect} from "./composites/Calibration/ListSelect/ListSelect.tsx";
import { EnhancedImportanceAdjustment } from "./composites/ConfigurationContainer/EnhancedImportanceAdjustment.tsx";

import {CalibrationOverview} from "./composites/Calibration/Overview/CalibrationOverview.tsx";

import { ConfigurationContainer } from "./composites/ConfigurationContainer/ConfigurationContainer";

import { ImportanceAdjustment} from "./composites/ConfigurationContainer/ImportanceAdjustment.tsx";
import {AdjustmentTableLogic
} from "./composites/ConfigurationContainer/ImportanceAdjustment/AdjustmentTable/AdjustmentTableLogic.tsx";
import ProfileSelectionLogic
    from "./composites/ConfigurationContainer/ImportanceAdjustment/ProfileSelection/ProfileSelectionLogic.tsx";
import {Profile} from "./types.ts";

import {Requirements, ButtonRequirement} from "./composites/Calibration/Requirements/Requirements.tsx";
import {Tab} from "@chakra-ui/react";
import {WeightMatrix} from "./composites/Calibration/WeightMatrix/WeightMatrix.tsx";
import {ChartData, TabWindow} from "./composites/ConfigurationContainer/ImportanceAdjustment/PlotPanel/PlotPanel.tsx";
import * as Dialog from "@radix-ui/react-dialog";

export const DefinitionWrapper = () => {
    // const definition = useAtomValue(State.definition);
    // const dataset = useAtomValue(State.dataset);


    const [selectedProfile, setSelectedProfile] = useState<
        Profile | Profile[] | null
    >(null);

    const [recalculatedWeights, setRecalculatedWeights] = useState<{ [key: string]: number }>({});
    const [updatedValues, setUpdatedValues] = useState<{ [key: string]: number }>({}); // characteristic value
    const [updatedImportance, setUpdatedImportance] = useState<{ [key: string]: number }>({}); // importance value


    /**
     * Returns an array of numbers that graph a linear function
     *
     * @param {number} slope the slope of the function
     * @param {number} step the value to increment each point by
     * @param {number} x the x coord of a point on the line
     * @param {number} y the y coord of a point on the line
     *
     * @returns {array} An array of y values on the line for every step.
     */
    const calculateGraphedImpacts = (slope : number, step : number,  x : number, y : number) => {

        // y = mx + b
        // b = y - mx
        let y_int : number = y - (slope * x);

        let y_coords : number[] = [];
        for (let i : number = 0; i <= 1; i += step) {
            y_coords.push(slope * i + y_int);
        }

        return y_coords;
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
    function arrayRange(start: number, stop : number, step : number){
        let foo =[];
        for(let i =start; i <= stop; i=i+step){
            let next = start+ i;
            foo.push(Number.parseFloat(next.toPrecision(2)));
        }
        return foo
    }

    const x_tick_amt : number = 0.1;
    const x_tick : number[] = arrayRange(0,1,x_tick_amt);

    // Handler that updates the selectedProfile state
    const handleProfileApply = (profile: Profile[] | null) => {
        setSelectedProfile(profile);
    };

    const isProfileApplied = selectedProfile !== null;

    const handleReset = () => {
        setSelectedProfile(null); // Reset the selected profile when the user clicks reset
    };

    // const processedData = useProcessedData();
    // if (!processedData) return null;
    // const processedData = useProcessedDefinitionData();
    // if (!processedData) return null;

    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
    // const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

    const leftSidebarWidthExpanded = "25vw"; // 20% of the viewport width
    // const rightSidebarWidthExpanded = "30vw"; // 20% of the viewport width
    const sidebarWidthCollapsed = "50px";

    const leftWidth = isLeftSidebarOpen
        ? leftSidebarWidthExpanded
        : sidebarWidthCollapsed;
    // const rightWidth = isRightSidebarOpen
    //     ? rightSidebarWidthExpanded
    //     : sidebarWidthCollapsed;
    // const middleWidth = `calc(100vw - (${leftWidth} + ${rightWidth}))`;
    const middleWidth = `calc(100vw - (${leftWidth})`;


    const updatedTQIRaw : number =
        recalculatedWeights &&
        Object.entries(recalculatedWeights).reduce(
            (total, [name, weight]) =>
                total + (updatedValues[name] || 0) * weight,
            0
        );

    const pieData = Object.entries(recalculatedWeights).map(([name, value]) => ({
        name,
        value: value * updatedValues[name] / updatedTQIRaw, // value * importance / total score
    }));

    const chartData : ChartData[] = Object.entries(recalculatedWeights).map(([name, _value]) => ({
        name: name,
        value: updatedValues[name],
        importance: _value,
        impacts: calculateGraphedImpacts(_value, x_tick_amt, updatedValues[name], updatedTQIRaw)
    }));

    // the numbers that appear in the strategies/impact lists
    const [strategyValues, setStrategyValues] = useState<{ [key: string]: number }>({});
    const [strategy, setStrategy] = useState("Lowest");

    useEffect(() => {
        handleStrategyChanged();
    }, [strategy, updatedImportance, updatedValues, recalculatedWeights]);

    const handleStrategyChanged = () => {

        if (strategy == 'Lowest'){ // by characteristic value, highest to lowest

            let sortedValues = Object.fromEntries(
                Object.entries(updatedValues).sort(([, a], [, b]) => a - b)
            );
            setStrategyValues(sortedValues);
        }
        else if (strategy == 'Fastest'){ // by importance value, highest to lowest

            let sortedValues = Object.fromEntries(
                Object.entries(updatedImportance).sort(([, a], [, b]) => b - a)
            );
            setStrategyValues(sortedValues);
        }
        else if (strategy === 'LowestEffort'){ // by (1 - importance) * char value, highest to lowest

            const lowestEffortArray = Object.entries(updatedImportance).map(([name, value]) => ({
                name,
                value: (1 - updatedValues[name]) * value,
            }));

            lowestEffortArray.sort((a, b) => b.value - a.value);

            const lowestEffort = Object.fromEntries(
                lowestEffortArray.map(item => [item.name, item.value])
            );
            setStrategyValues(lowestEffort);
        }
        else { // by characteristic value, lowest to highest

            let sortedValues = Object.fromEntries(
                Object.entries(updatedValues).sort(([, a], [, b]) => b - a)
            );
            setStrategyValues(sortedValues);
        }
    };



    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                width: "100vw",
                overflowX: "hidden",
            }}
        >
            {/* Title and Icon Centered */}
            <div
                style={{
                    display: "flex",
                    flexGrow: 1,
                    backgroundColor: "#f9f9f9",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "10px",
                    overflowY: "hidden",
                    overflowX: "hidden",
                }}
            >
                <img
                    src="https://www.dhs.gov/sites/default/files/2023-03/ST_RGB_Hor_Blue_at20.svg"
                    alt="Science and Technology Directorate"
                    width="100"
                    height="100"
                    style={{ marginRight: "20px" }}
                />

                <Heading>PIQUE Tuner</Heading>
                <img
                    src="https://raw.githubusercontent.com/MSUSEL/msusel-pique-visualizer/refactorZiyi/src/assets/PIQUE_svg.svg"
                    alt="PIQUE Logo"
                    width="100"
                    height="100"
                    style={{ marginLeft: "20px" }}
                />
            </div>

             {/*Main Content*/}
            <div
                style={{
                    display: "flex",
                    flexGrow: 1,
                    overflowY: "auto",
                    height: "100%",
                    overflowX: "hidden",
                }}
            >
                {/* Left Side Panel */}
                {/*<Flex*/}
                {/*    direction="column"*/}
                {/*    style={{*/}
                {/*        width: isLeftSidebarOpen ? leftWidth : "50px",*/}
                {/*        transition: "width 0.3s ease-in-out",*/}
                {/*        position: "relative",*/}
                {/*        flexShrink: 0,*/}
                {/*        overflow: "hidden",*/}
                {/*        height: "100%",*/}
                {/*    }}*/}
                {/*>*/}
                {/*    /!* Toggle Button for Sidebar, PinLeftIcon for open, PinRightIcon for close *!/*/}
                {/*    <IconButton*/}
                {/*        size="3"*/}
                {/*        variant="soft"*/}
                {/*        style={{*/}
                {/*            position: "absolute",*/}
                {/*            top: "10px",*/}
                {/*            right: isLeftSidebarOpen ? "10px" : "0px",*/}
                {/*            zIndex: 2,*/}
                {/*            transition: "right 0.3s ease-in-out",*/}
                {/*        }}*/}
                {/*        onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}*/}
                {/*    >*/}
                {/*        {isLeftSidebarOpen ? <PinLeftIcon /> : <PinRightIcon />}*/}
                {/*    </IconButton>*/}

                {/*    /!* Sidebar Content *!/*/}
                {/*    {isLeftSidebarOpen && (*/}
                {/*        <Flex*/}
                {/*            style={{*/}
                {/*                flexDirection: "column",*/}
                {/*                padding: "10px",*/}
                {/*                height: "100%",*/}
                {/*                overflowY: "auto",*/}
                {/*                paddingRight: "50px",*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            /!*<ButtonRequirement />*!/*/}
                {/*            /!*<ButtonContainer />*!/*/}
                {/*        </Flex>*/}
                {/*    )}*/}
                {/*</Flex>*/}

                {/* Middle Majority Content */}
                <Flex
                    direction={"column"}
                    align={"stretch"}
                    justify={"start"}
                    style={{
                        width: middleWidth,
                        height: "90vh",
                    }}
                >
                    {/* Legend - Risk Level: Occupying 10% of the Middle Sub-Block Height */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {/*<LegendContainer />*/}

                        <CalibrationOverview />

                    </div>

                    {/* Layout Tabs: Occupying the remaining 90% of the Middle Sub-Block Height */}

                    <Tabs.Root defaultValue="Adjustments">
                        <Tabs.List>
                            <Tabs.Trigger value="Adjustments">Adjustments</Tabs.Trigger>
                            <Tabs.Trigger value="tree">Tree</Tabs.Trigger>
                            <Tabs.Trigger value="list">List</Tabs.Trigger>
                            <Tabs.Trigger value="weight">Weight Matrix</Tabs.Trigger>
                            <Tabs.Trigger value="size">LLM</Tabs.Trigger>
                        </Tabs.List>

                        {/* Tab Content with Overflow Handling */}
                        <Box
                            style={{
                                height: "100%", // Ensures the tab content takes full height of its container
                                overflow: "auto", // Allows scrolling within the tab content if it exceeds the container's height
                            }}
                        >
                            <Tabs.Content value="Adjustments">

                                {/*<Separator my="3" size="4" style={{ gridColumn: "span 2" }} />*/}

                                {/* Middle-left block: ProfileSelectionLogic and AdjustmentTableLogic */}
                                <Box >
                                    <ProfileSelectionLogic
                                        onProfileChange={handleProfileApply}
                                        selectedProfile={selectedProfile}
                                    />
                                    <Separator my="3" size="4" />
                                    <Box>
                                        <Text color='brown'>
                                            {" Requirement Standards"}
                                        </Text>
                                        {ButtonRequirement("Derive")}
                                    </Box>
                                </Box>
                                <Separator my="3" size="4" style={{ gridColumn: "span 2" }} />
                                <Flex>
                                    <Box style={{ gridRow: "2", gridColumn: "1" }}>
                                        <AdjustmentTableLogic
                                            selectedProfile={
                                                Array.isArray(selectedProfile) ? selectedProfile : undefined
                                            }
                                            isProfileApplied={isProfileApplied}
                                            updatedTQIRaw={updatedTQIRaw}
                                            onResetApplied={handleReset}
                                            onWeightsChange={setRecalculatedWeights}
                                            onImportanceChange={setUpdatedImportance}
                                            onValuesChange={setUpdatedValues}
                                            mode= "Derive"
                                        />
                                    </Box>

                                    <Box style={{ gridRow: "2", gridColumn: "2" }}>
                                        {TabWindow(pieData, chartData, updatedTQIRaw, x_tick, 1.0, strategy, setStrategy, strategyValues)}
                                    </Box>
                                </Flex>
                            </Tabs.Content>

                            <Tabs.Content value="tree">
                                {/*<TreeDisplay fileData={processedData} />*/}
                            </Tabs.Content>

                            <Tabs.Content value="list">
                                <ListSelect />
                            </Tabs.Content>

                            <Tabs.Content value="weight">
                                <WeightMatrix />
                            </Tabs.Content>
                            <Tabs.Content value="size">
                                LLM Training
                            </Tabs.Content>
                        </Box>
                    </Tabs.Root>
                </Flex>

                {/* Right Configuration Bar */}
                {/*<Flex*/}
                {/*    direction="column"*/}
                {/*    style={{*/}
                {/*        width: isRightSidebarOpen ? rightWidth : "50px",*/}
                {/*        height: "100vh", // instead of 100%*/}
                {/*        position: "fixed", //relative*/}
                {/*        top: "0",*/}
                {/*        right: "0",*/}
                {/*        transition: "width 0.3s ease-in-out",*/}
                {/*        zIndex: 1050,*/}
                {/*        // flexShrink: 0,*/}
                {/*        overflow: "hidden",*/}
                {/*    }}*/}
                {/*>*/}
                {/*    /!* GearIcon to toggle the sidebar *!/*/}
                {/*    /!* Position to the left when sidebar is open, and keep on the right when closed *!/*/}
                {/*    <IconButton*/}
                {/*        size="3"*/}
                {/*        variant="soft"*/}
                {/*        style={{*/}
                {/*            position: "absolute",*/}
                {/*            top: "10px",*/}
                {/*            left: isRightSidebarOpen ? "10px" : "0px",*/}
                {/*            // right: isRightSidebarOpen ? 'calc(100% - 40px)' : '10px',*/}
                {/*            zIndex: 1050,*/}
                {/*            transition: "right 0.3s ease-in-out", //left*/}
                {/*        }}*/}
                {/*        onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}*/}
                {/*    >*/}
                {/*        <GearIcon />*/}
                {/*    </IconButton>*/}

                {/*    /!* Right Sidebar Content *!/*/}
                {/*    {isRightSidebarOpen && (*/}
                {/*        <Flex*/}
                {/*            style={{*/}
                {/*                flexDirection: "column",*/}
                {/*                padding: "10px",*/}
                {/*                height: "100%",*/}
                {/*                overflowY: "auto",*/}
                {/*                paddingLeft: "50px",*/}
                {/*                zIndex: 1040,*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            <ConfigurationContainer />*/}
                {/*        </Flex>*/}
                {/*    )}*/}
                {/*</Flex>*/}
            </div>
        </div>
    );
};
