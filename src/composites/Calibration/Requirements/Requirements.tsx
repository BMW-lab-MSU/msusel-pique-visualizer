import {Grid, Box, Button, Flex, HoverCard, IconButton, Link, Separator, Table, Text, TextField} from "@radix-ui/themes";
import * as Label from '@radix-ui/react-label';
import '@radix-ui/themes/styles.css';
import {Cross2Icon, DownloadIcon, InfoCircledIcon, MagicWandIcon, ResetIcon} from "@radix-ui/react-icons";
import React, {useEffect, useMemo, useState} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import ProfileSelectionLogic
    from "../../ConfigurationContainer/ImportanceAdjustment/ProfileSelection/ProfileSelectionLogic.tsx";
import {
    AdjustmentTableLogic
} from "../../ConfigurationContainer/ImportanceAdjustment/AdjustmentTable/AdjustmentTableLogic.tsx";
import {State} from "../../../state.ts";
import * as Slider from "@radix-ui/react-slider";
import {Profile} from "../../../types.ts";
import * as schema from "../../../data/schema.ts";
import {useAtomValue} from "jotai/index";
// import {base} from "../../../data/schema.ts";
import {base} from "../../../data/definitionSchema.ts";

import {LlmExtractor, sendPresetMessage} from "../LLM/LlmExtractor.tsx";
import {SliderMode} from "../../ConfigurationContainer/ImportanceAdjustment/AdjustmentTable/AdjustmentTableUI.tsx";
import {values} from "ramda";


interface Names{
    [key:string]: string;
}

interface Weights {
    [key: string]: number;
}

interface TQIEntry {
    weights: Weights;
}

interface ISOEntry {
    primary: number;
    secondaryContent: number;
    secondaryMaintainer: number;
    indirect: number;
    maxVal: number;
    notes: string;
}

interface ISOEntries {
    [key: string]: ISOEntry;
}

const getInitialNames = (
    definition : schema.base.Schema,
): { [key: string]: string } => {
    let names : Names= {};
    // console.log(definition)
    Object.entries(definition.factors.tqi).forEach(([_, tqiEntry]) => {
        const entry = tqiEntry as TQIEntry;
        Object.entries(entry.weights).forEach(([aspect, _]) => {
            names[aspect] = aspect;
        });
    });

    return names;
};

const setInitialValues =(names:Names):{
    [key: string]: number } => {
    let values : Weights= {};
    Object.keys(names).map(key=> {values[key] = 0;});
    return values;
};

const setInitialISOValues = (names: Names): {
    [key: string]: ISOEntry} => {
    let entries : ISOEntries = {};
    Object.keys(names).map(key=> {
        let entry: ISOEntry = {
            indirect: 0,
            maxVal: 0,
            notes: "",
            primary: 0,
            secondaryContent: 0,
            secondaryMaintainer: 0
        };
        entries[key] = entry;
    });
    return entries;
};

function MaxValueFinder({ numbers }) {
    const maxValue = Math.max(...numbers);

    return (
        <div>
            <p>{maxValue}</p>
        </div>
    );
    // return maxValue;
}

function MaxValue(numbers){
    return Math.max(...numbers);
}




export function ButtonRequirement(mode:string) {

    const [reqImportance, setReqImportance] = useState<Weights>();

    const handleImportanceApply = (() =>{
        setReqImportance(undefined);
    });


    return (
        <Flex>
            <Box position={"relative"} left={"auto"} top={"auto"}>
                <Dialog.Root>
                    <Dialog.Trigger asChild>
                        <Button size="2" className="Button violet">
                            {" "}
                            ISO Requirements{" "}
                        </Button>
                    </Dialog.Trigger>

                    <Dialog.Portal>
                        <Dialog.Overlay className="DialogOverlay" />
                        <Dialog.Content className="DialogContent">
                            <Dialog.Title className="DialogTitle">
                                ISO 25010 Table 1
                            </Dialog.Title>
                            <Dialog.Description className="DialogDescription">
                                {/* Dialog description content */}
                                Quality from different stakeholder perspectives.
                            </Dialog.Description>

                            <Separator my="3" size="4" />

                            {IsoRequirements(mode)}
                            <Separator my="3" size="4" />


                            <Separator my="3" size="4" />

                            {/* Move the close and download button here */}

                            {/* Position the close button absolutely within the Dialog.Content */}
                            <Dialog.Close asChild>
                                <IconButton className="IconButton" aria-label="Close">
                                    <Cross2Icon />
                                </IconButton>
                            </Dialog.Close>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>

                <Separator />

                <Dialog.Root>
                    <Dialog.Trigger asChild>
                        <Button size="2" className="Button violet">
                            {" "}
                            CWRAF requirements{" "}
                        </Button>
                    </Dialog.Trigger>

                    <Dialog.Portal>
                        <Dialog.Overlay className="DialogOverlay" />
                        <Dialog.Content className="DialogContent">
                            <Dialog.Title className="DialogTitle">
                                CWRAF Vignette
                            </Dialog.Title>
                            <Dialog.Description className="DialogDescription">
                                {/* Dialog description content */}
                                Quality from different software layers
                            </Dialog.Description>

                            <Separator my="3" size="4" />


                            {CwrfRequirements(mode)}

                            <Separator my="3" size="4" />

                            {/* Move the close and download button here */}

                            {/* Position the close button absolutely within the Dialog.Content */}
                            <Dialog.Close asChild>
                                <IconButton className="IconButton" aria-label="Close">
                                    <Cross2Icon />
                                </IconButton>
                            </Dialog.Close>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>

                <Separator />

                <Dialog.Root>
                    <Dialog.Trigger asChild>
                        <Button size="2" className="Button violet">
                            {" "}
                            LLM Training{" "}
                        </Button>
                    </Dialog.Trigger>

                    <Dialog.Portal>
                        <Dialog.Overlay className="DialogOverlay" />
                        <Dialog.Content className="DialogContent">
                            <Dialog.Title className="DialogTitle">
                                LLM training
                            </Dialog.Title>
                            <Dialog.Description className="DialogDescription">
                                {/* Dialog description content */}
                                Quality from different stakeholder requirements.
                            </Dialog.Description>

                            <Separator my="3" size="4" />

                            {LlmRequirements(mode)}

                            <Separator my="3" size="4" />

                            {/* Move the close and download button here */}

                            {/* Position the close button absolutely within the Dialog.Content */}
                            <Dialog.Close asChild>
                                <IconButton className="IconButton" aria-label="Close">
                                    <Cross2Icon />
                                </IconButton>
                            </Dialog.Close>
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </Box>
        </Flex>
    )
}




export function IsoRequirements(mode:string) {

    const definition = (() => {
        if (mode == "Evaluate") {
            return useAtomValue(State.dataset);
        } else if (mode == "Derive") {
            return useAtomValue(State.definition);
        } else {
            return null;
        }
    }) ();
    // const definition = useAtomValue(State.definition);

    // console.log(definition);

    const names : Names = getInitialNames(definition);
    // console.log(names)

    // const [isoImportance, setIsoImportance] = useState<Weights>(setInitialValues(names));
    // useMemo(() => {
    //     setImportance(Object.keys(names).map(key=> 0);
    // }, [names]);

    // const handleIsoImportanceChange =(name: string, newImportance) => {
    //     setIsoImportance((prev) => ({ ...prev, [name]: newImportance }));
    // };

    const [isoImportance, setIsoImportance] = useState<ISOEntries>(setInitialISOValues(names));


    const handleIsoImportanceChange = (name: string, updatedEntry : ISOEntry)=>{
        const numbers = [updatedEntry.primary,
            updatedEntry.secondaryContent,
            updatedEntry.secondaryMaintainer,
            updatedEntry.indirect];

        let newValues : ISOEntry = updatedEntry;
        newValues.maxVal=   (MaxValue(numbers));
        setIsoImportance((prev) => ({ ...prev, [name]: newValues }));

        console.log(isoImportance);
    };



    const [profileName, setProfileName] = useState<string>("Sample Name");

    const handleProfileNameChange =(newName: string) => {
        setProfileName(newName);
    };

    const onResetHandle = ()=>{
        setProfileName("Sample Name");
        setIsoImportance(setInitialISOValues(names));
    };

    // const onApplyHandle = ()=>{
    //
    // }

    // Function to handle the download action
    const handleDownload = () => {
        const dataToDownload = isoImportance;

        const json = JSON.stringify(dataToDownload, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download =  profileName+ " Profile.json"; // todo: implement naming formats to indicate what are changed.
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };



    // TODO: Pass the selected importance to main panel

    return(
        <Flex direction={"column"} align={"center"}>
            <div
                style={{
                    display: "flex",
                    padding: "0 20px",
                    flexWrap: "wrap",
                    gap: 15,
                    alignItems: "center",
                }}
            >
                <Text size="2" color={"brown"}> Requirements Profile Name:</Text>
                <input
                    className="Input"
                    type="text"
                    id="profileName"
                    value = {profileName}
                    // defaultValue="Sample Name"
                    onChange={e => handleProfileNameChange(e.target.value)}
                />
            </div>

            <Separator my="3" size="4"/>

            <Box width={"auto"}>
                <Table.Root variant="surface">
                    <Table.Header>
                        <Table.Row align={"center"}>
                            <Table.ColumnHeaderCell justify={"center"} width={"auto"}>
                                <Text>Users </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon/>
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{maxWidth: 325}}>
                                            Stakeholders which the needs are considered.
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"} width={"auto"}>
                                <Text>Primary Users </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon/>
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{maxWidth: 325}}>
                                            Person who interacts with the system to achieve the primary goals.
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"} width={"auto"}>
                                <Text>Secondary Users </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon/>
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{maxWidth: 325}}>
                                            Users who provide support.
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"} width={"auto"}>
                                <Text>Secondary Users </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon/>
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{maxWidth: 325}}>
                                            Users who provide support.
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"} width={"auto"}>
                                <Text>Indirect Users </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon/>
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{maxWidth: 325}}>
                                            Person who receives output, but not interact with the system.
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"} width={"auto"}>
                                <Text>Importance </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon/>
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{maxWidth: 325}}>
                                            Absolute importance of each characteristic
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                        </Table.Row>
                        <Table.Row align={"center"}>
                            <Table.ColumnHeaderCell justify={"center"}>
                                <Text>Sub users</Text>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"}>
                                <Text>-</Text>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"}>
                                <Text>Content Provider </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon/>
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{maxWidth: 325}}>
                                            Content Provider, system manager/administrator, security manager.
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"}>
                                <Text>Maintainer </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon/>
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{maxWidth: 325}}>
                                            Maintainer, analyzer, porter, installer.
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"}>
                                <Text>-</Text>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"}>
                                <Text>Max value </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon/>
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{maxWidth: 325}}>
                                            Maximum value of each row.
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                        </Table.Row>
                        <Table.Row align={"center"}>
                            <Table.ColumnHeaderCell>
                                <Text>Needs</Text>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>
                                <Text>Interacting</Text>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>
                                <Text>Interacting</Text>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>
                                <Text>Maintaining or porting</Text>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>
                                <Text>Using Output</Text>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell>
                                <Text>max()</Text>
                            </Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {Object.keys(names).map(idx => (
                            <IsoSingleRequirementRow key={idx} name={idx} values={isoImportance[idx]} handleChange={handleIsoImportanceChange}/>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
            <Separator/>
            <Flex
                direction={"row"}
                align={"center"}
                justify="center"
                style={{width: "100%"}}
            >
                <Box style={{flexBasis: "25%"}}>
                    <Button
                        variant="outline"
                        // onClick={handleApply}
                        style={{width: "100%", height: "30px"}}
                        color="gray"
                    >
                        <MagicWandIcon width="16" height="16"/>
                        Apply
                    </Button>
                </Box>
                <Box style={{flexBasis: "25%"}}>
                    <Button
                        variant="surface"
                        onClick={onResetHandle}
                        style={{width: "100%", height: "30px"}}
                        color="gray"
                    >
                        <ResetIcon width="16" height="16"/>
                        Reset
                    </Button>
                </Box>
                <Box style={{flexBasis: "25%"}}>
                    <Button
                        variant={"surface"}
                        onClick={handleDownload}
                        style={{width: "100%", height: "30px"}}
                        color="gray"
                    >
                        <DownloadIcon width="16" height="16"/>
                        Download
                    </Button>
                </Box>
            </Flex>

        </Flex>
    );
}

interface SliderParaProp {
    paraName: string;
    paraValue: number;
    onChange: (name: string, newValue: number) => void;
}


const SliderPara : React.FC<SliderParaProp>= ({paraName , paraValue , onChange}) => {
    return(
        <Box style={{ position: 'relative', padding: '20px' }}>
            <Slider.Root
                value={[paraValue]}
                onValueChange={(val) => {onChange(paraName, val[0])}}
                min={0}
                max={1}
                step={0.01}
                className="SliderRoot">
                <Slider.Track className="SliderTrack">
                    <Slider.Range className="SliderRange" />
                </Slider.Track>
                <Slider.Thumb className="SliderThumb" />
            </Slider.Root>
            <div style={{ position: 'absolute', top: '-2px', left: `${paraValue * 100}%`, transform: 'translateX(-50%)' }}>
                {paraValue.toFixed(2)}
            </div>
        </Box>
    );
}


interface SingleRowProp {
    name: string;
    values: ISOEntry;
    handleChange: (name: string, newImportance: ISOEntry) => void;
}

const IsoSingleRequirementRow: React.FC<SingleRowProp> = ({name, values, handleChange}) => {

    const onSliderChange = (paraName: string, value: number ) =>{
        let newValues : ISOEntry = values;
        // newValues[paraName as keyof ISOEntry] = value;

        (newValues as any)[paraName] = value;
        handleChange(name, newValues);
    };

    return(
        <Table.Row key={name}>
            <Table.RowHeaderCell>
                {name}
            </Table.RowHeaderCell>
            <Table.Cell>
                <SliderPara
                    paraName={"primary"}
                    paraValue={values.primary}
                    onChange = {onSliderChange}
                />
            </Table.Cell>
            <Table.Cell>
                <SliderPara
                    paraName={"secondaryContent"}
                    paraValue={values.secondaryContent}
                    onChange = {onSliderChange}
                />
            </Table.Cell>
            <Table.Cell>
                <SliderPara
                    paraName={"secondaryMaintainer"}
                    paraValue={values.secondaryMaintainer}
                    onChange = {onSliderChange}
                />
            </Table.Cell>
            <Table.Cell>
                <SliderPara
                    paraName={"indirect"}
                    paraValue={values.indirect}
                    onChange = {onSliderChange}
                />
            </Table.Cell>
            <Table.Cell>
                {values.maxVal}
            </Table.Cell>
        </Table.Row>
    );
}

export function CwrfRequirements(mode:string) {

    const definition = (() => {
        if (mode == "Evaluate") {
            return useAtomValue(State.dataset);
        } else if (mode == "Derive") {
            return useAtomValue(State.definition);
        } else {
            return null;
        }
    }) ();
    // const definition = useAtomValue(State.definition);

    // console.log(definition);

    const names = getInitialNames(definition);
    // console.log(names)

    const [isoImportance, setIsoImportance] = useState(Object.keys(names).map(key=> names[key]));
    // useMemo(() => {
    //     setImportance(Object.keys(names).map(key=> 0);
    // }, [names]);

    // TODO: Pass the selected importance to main panel

    return(
        <Flex direction={"column"} align={"center"}>
            <Box width={"auto"}>
                <Table.Root variant="surface" >
                    <Table.Header>
                        <Table.Row align={"center"}>
                            <Table.ColumnHeaderCell justify={"center"} width={"auto"}>
                                <Text>Users </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon />
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{ maxWidth: 325 }}>
                                            Stakeholders which the needs are considered.
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"} width={"auto"}>
                                <Text>System </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon />
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{ maxWidth: 325 }}>
                                            Person who interacts with the system to achieve the primary goals.
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"} width={"auto"}>
                                <Text>Application </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon />
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{ maxWidth: 325 }}>
                                            Users who provide support.
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"} width={"auto"}>
                                <Text>Network </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon />
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{ maxWidth: 325 }}>
                                            Users who provide support.
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"} width={"auto"}>
                                <Text>Enterprise </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon />
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{ maxWidth: 325 }}>
                                            Person who receives output, but not interact with the system.
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"} width={"auto"}>
                                <Text>Importance </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon />
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{ maxWidth: 325 }}>
                                            Absolute importance of each characteristic
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                        </Table.Row>


                    </Table.Header>
                    <Table.Body>
                        {Object.keys(names).map(idx => (
                            <CwrfSingleRequirementRow key={idx} nameAspect= {idx} />
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
        </Flex>
    );
}

export function CwrfSingleRequirementRow({nameAspect}){

    let [systemL, setSystemL] = useState(0);
    let [applicationL, setApplicationL] = useState(0);
    let [networkL, setNetworkL] = useState(0);
    let [enterpriseL, setEnterpriseL] = useState(0);
    return(
        <Table.Row>
            <Table.RowHeaderCell>
                {nameAspect}
            </Table.RowHeaderCell>
            <Table.Cell>
                <Box style={{ position: 'relative', padding: '20px' }}>
                    <Slider.Root
                        value={[systemL]}
                        onValueChange={(value) => {setSystemL(value[0])}}
                        min={0}
                        max={1}
                        step={0.01}
                        className="SliderRoot">
                        <Slider.Track className="SliderTrack">
                            <Slider.Range className="SliderRange" />
                        </Slider.Track>
                        <Slider.Thumb className="SliderThumb" />
                    </Slider.Root>
                    <div style={{ position: 'absolute', top: '-2px', left: `${systemL * 100}%`, transform: 'translateX(-50%)' }}>
                        {systemL.toFixed(2)}
                    </div>
                </Box>
            </Table.Cell>
            <Table.Cell>
                <Box style={{ position: 'relative', padding: '20px' }}>
                    <Slider.Root
                        value={[applicationL]}
                        onValueChange={(value) => {setApplicationL(value[0])}}
                        min={0}
                        max={1}
                        step={0.01}
                        className="SliderRoot">
                        <Slider.Track className="SliderTrack">
                            <Slider.Range className="SliderRange" />
                        </Slider.Track>
                        <Slider.Thumb className="SliderThumb" />
                    </Slider.Root>
                    <div style={{ position: 'absolute', top: '-2px', left: `${applicationL* 100}%`, transform: 'translateX(-50%)' }}>
                        {applicationL.toFixed(2)}
                    </div>
                </Box>
            </Table.Cell>
            <Table.Cell>
                <Box style={{ position: 'relative', padding: '20px' }}>
                    <Slider.Root
                        value={[networkL]}
                        onValueChange={(value) => {setNetworkL(value[0])}}
                        min={0}
                        max={1}
                        step={0.01}
                        className="SliderRoot">
                        <Slider.Track className="SliderTrack">
                            <Slider.Range className="SliderRange" />
                        </Slider.Track>
                        <Slider.Thumb className="SliderThumb" />
                    </Slider.Root>
                    <div style={{ position: 'absolute', top: '-2px', left: `${networkL* 100}%`, transform: 'translateX(-50%)' }}>
                        {networkL.toFixed(2)}
                    </div>
                </Box>
            </Table.Cell>
            <Table.Cell>
                <Box style={{ position: 'relative', padding: '20px' }}>
                    <Slider.Root
                        value={[enterpriseL]}
                        onValueChange={(value) => {setEnterpriseL(value[0])}}
                        min={0}
                        max={1}
                        step={0.01}
                        className="SliderRoot">
                        <Slider.Track className="SliderTrack">
                            <Slider.Range className="SliderRange" />
                        </Slider.Track>
                        <Slider.Thumb className="SliderThumb" />
                    </Slider.Root>
                    <div style={{ position: 'absolute', top: '-2px', left: `${enterpriseL * 100}%`, transform: 'translateX(-50%)' }}>
                        {enterpriseL.toFixed(2)}
                    </div>
                </Box>
            </Table.Cell>
            <Table.Cell>
                <MaxValueFinder numbers={[systemL, applicationL, networkL, enterpriseL]} />
            </Table.Cell>
        </Table.Row>
    );
}

export function LlmRequirements(mode:string) {

    const definition = (() => {
        if (mode == "Evaluate") {
            return useAtomValue(State.dataset);
        } else if (mode == "Derive") {
            return useAtomValue(State.definition);
        } else {
            return null;
        }
    }) ();
    // const definition = useAtomValue(State.definition);

    // console.log(definition);

    const names = getInitialNames(definition);
    // console.log(names)

    // Extract keys and initialize with zeros
    // Initialize llmImportance as an object with keys from 'names' and values set to 0
    const initialLlmImportance = Object.fromEntries(
        Object.keys(names).map(key => [key, 0])
    );
    const [llmImportance, setLlmImportance] = useState<{ [key: string]: number }>(initialLlmImportance);

    // Initialize llmRequirements with all keys having an empty string value
    const initialLlmRequirements = Object.fromEntries(
        Object.keys(names).map(key => [key, ''])
    );
    const [llmRequirements, setLlmRequirements] = useState<{ [key: string]: string }>(initialLlmRequirements);


    const handleRequirementChange = (name: string, newValue: string) => {
        setLlmRequirements((prev) => ({ ...prev, [name]: newValue }));
    }

    const [message, setMessage] = useState<string>("");
    const [response, setResponse] = useState<string>("");

    const handleLlmButtonClick = () => {
        const preamble = 'Given the following requirements for each of the quality characteristics for a software product, give a relative score between 1 and 10 for each characteristic. ';
        const userEntries = Object.entries(llmRequirements)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
        const concatenatedResults = preamble + userEntries;
        setMessage(concatenatedResults);
        console.log( concatenatedResults);

        sendPresetMessage(concatenatedResults, setResponse);

        console.log(response);
    };


    // TODO: Pass the selected importance to main panel

    return(
        <Grid columns={"2"} gap="3" width={"auto"}>
            <Box width={"auto"}>
                <Table.Root variant="surface" >
                    <Table.Header>
                        <Table.Row align={"center"}>
                            <Table.ColumnHeaderCell justify={"center"} width={"auto"}>
                                <Text>Aspects </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon />
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{ maxWidth: 325 }}>
                                            Stakeholders which the needs are considered.
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell justify={"center"} width={"auto"}>
                                <Text>Requirements </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon />
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{ maxWidth: 325 }}>
                                            Person who interacts with the system to achieve the primary goals.
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>

                            <Table.ColumnHeaderCell justify={"center"} width={"auto"}>
                                <Text>Importance </Text>
                                <HoverCard.Root>
                                    <HoverCard.Trigger>
                                        <Link href="#">
                                            <InfoCircledIcon />
                                        </Link>
                                    </HoverCard.Trigger>
                                    <HoverCard.Content>
                                        <Text as="div" style={{ maxWidth: 325 }}>
                                            Absolute importance of each characteristic
                                        </Text>
                                    </HoverCard.Content>
                                </HoverCard.Root>
                            </Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {Object.keys(names).map(idx => (
                            <LlmSingleRequirementRow
                                key={idx}
                                name= {idx}
                                message={llmRequirements[idx]}
                                onMessageChange={handleRequirementChange}
                                llmImportance={llmImportance[idx]}
                            />
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
            <Box width={"auto"}>
                <Button size="2" onClick={handleLlmButtonClick} color={"indigo"}> LLM Training </Button>
                {/*<LlmExtractor/>*/}
            </Box>
        </Grid>
    );
}

export function LlmSingleRequirementRow({name , message  , onMessageChange, llmImportance}){

    return(
        <Table.Row>
            <Table.RowHeaderCell>
                {name}
            </Table.RowHeaderCell>
            <Table.Cell>
                    <Flex direction="column" gap="3">
                        <Box >
                            {/*<TextField.Root>*/}
                            {/*    <TextField.Input*/}
                            {/*        value={message}*/}
                            {/*        onChange={(e) => onMessageChange(name,  e.target.value)}*/}
                            {/*        placeholder="Requirement Description"*/}
                            {/*    />*/}
                            {/*</TextField.Root>*/}
                            <textarea name={"message"}
                                      rows={4}
                                      cols={40}
                                      value={message}
                                      onChange={(e) => onMessageChange(name,  e.target.value)}
                                      placeholder="Requirement Description"
                                      // defaultValue={"Not Applicable"}
                                      id = {name}
                            />
                        </Box>
                    </Flex>
            </Table.Cell>
            <Table.Cell>
                {llmImportance}
            </Table.Cell>
        </Table.Row>
    );
}
