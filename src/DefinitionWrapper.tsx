import { useAtomValue } from "jotai";
import React, { useState } from "react";
import { State } from "./state";
import { Box, IconButton, Tabs, Flex, Heading } from "@radix-ui/themes";
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

import {CalibrationOverview} from "./composites/Calibration/Overview/CalibrationOverview.tsx";

import { ConfigurationContainer } from "./composites/ConfigurationContainer/ConfigurationContainer";

import { ImportanceAdjustment} from "./composites/ConfigurationContainer/ImportanceAdjustment.tsx";

export const DefinitionWrapper = () => {
    const definition = useAtomValue(State.definition);
    const dataset = useAtomValue(State.dataset);

    // const processedData = useProcessedData();
    // if (!processedData) return null;
    // const processedData = useProcessedDefinitionData();
    // if (!processedData) return null;

    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

    const leftSidebarWidthExpanded = "25vw"; // 20% of the viewport width
    const rightSidebarWidthExpanded = "30vw"; // 20% of the viewport width
    const sidebarWidthCollapsed = "50px";

    const leftWidth = isLeftSidebarOpen
        ? leftSidebarWidthExpanded
        : sidebarWidthCollapsed;
    const rightWidth = isRightSidebarOpen
        ? rightSidebarWidthExpanded
        : sidebarWidthCollapsed;
    // const middleWidth = `calc(100vw - (${leftWidth} + ${rightWidth}))`;
    const middleWidth = `calc(100vw - (${leftWidth})`;

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

                <Heading>PIQUE Calibration</Heading>
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
                <Flex
                    direction="column"
                    style={{
                        width: isLeftSidebarOpen ? leftWidth : "50px",
                        transition: "width 0.3s ease-in-out",
                        position: "relative",
                        flexShrink: 0,
                        overflow: "hidden",
                        height: "100%",
                    }}
                >
                    {/* Toggle Button for Sidebar, PinLeftIcon for open, PinRightIcon for close */}
                    <IconButton
                        size="3"
                        variant="soft"
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: isLeftSidebarOpen ? "10px" : "0px",
                            zIndex: 2,
                            transition: "right 0.3s ease-in-out",
                        }}
                        onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                    >
                        {isLeftSidebarOpen ? <PinLeftIcon /> : <PinRightIcon />}
                    </IconButton>

                    {/* Sidebar Content */}
                    {isLeftSidebarOpen && (
                        <Flex
                            style={{
                                flexDirection: "column",
                                padding: "10px",
                                height: "100%",
                                overflowY: "auto",
                                paddingRight: "50px",
                            }}
                        >

                            {/*<ButtonContainer />*/}
                        </Flex>
                    )}
                </Flex>

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

                    <Tabs.Root defaultValue="overview">
                        <Tabs.List>
                            <Tabs.Trigger value="overview">Adjustments</Tabs.Trigger>
                            <Tabs.Trigger value="tree">Tree</Tabs.Trigger>
                            <Tabs.Trigger value="list">List</Tabs.Trigger>
                        </Tabs.List>

                        {/* Tab Content with Overflow Handling */}
                        <Box
                            style={{
                                height: "100%", // Ensures the tab content takes full height of its container
                                overflow: "auto", // Allows scrolling within the tab content if it exceeds the container's height
                            }}
                        >
                            <Tabs.Content value="Adjustments">
                                <Box width="100%">
                                    {/*<CalibrationOverview />*/}
                                    {/*<ImportanceAdjustment />*/}
                                </Box>
                            </Tabs.Content>

                            <Tabs.Content value="tree">
                                {/*<TreeDisplay fileData={processedData} />*/}
                            </Tabs.Content>

                            <Tabs.Content value="list">
                                {/*<ListDisplay />*/}
                            </Tabs.Content>
                        </Box>
                    </Tabs.Root>
                </Flex>

                {/* Right Configuration Bar */}
                <Flex
                    direction="column"
                    style={{
                        width: isRightSidebarOpen ? rightWidth : "50px",
                        height: "100vh", // instead of 100%
                        position: "fixed", //relative
                        top: "0",
                        right: "0",
                        transition: "width 0.3s ease-in-out",
                        zIndex: 1050,
                        // flexShrink: 0,
                        overflow: "hidden",
                    }}
                >
                    {/* GearIcon to toggle the sidebar */}
                    {/* Position to the left when sidebar is open, and keep on the right when closed */}
                    <IconButton
                        size="3"
                        variant="soft"
                        style={{
                            position: "absolute",
                            top: "10px",
                            left: isRightSidebarOpen ? "10px" : "0px",
                            // right: isRightSidebarOpen ? 'calc(100% - 40px)' : '10px',
                            zIndex: 1050,
                            transition: "right 0.3s ease-in-out", //left
                        }}
                        onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
                    >
                        <GearIcon />
                    </IconButton>

                    {/* Right Sidebar Content */}
                    {isRightSidebarOpen && (
                        <Flex
                            style={{
                                flexDirection: "column",
                                padding: "10px",
                                height: "100%",
                                overflowY: "auto",
                                paddingLeft: "50px",
                                zIndex: 1040,
                            }}
                        >
                            <ConfigurationContainer />
                        </Flex>
                    )}
                </Flex>
            </div>
        </div>
    );
};
