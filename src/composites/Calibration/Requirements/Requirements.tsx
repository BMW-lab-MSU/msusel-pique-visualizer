import {Grid, Box, Button, Flex, HoverCard, IconButton, Link, Separator, Table, Text, TextField} from "@radix-ui/themes";
// import * as TextField from '@radix-ui/themes';
import {Cross2Icon, InfoCircledIcon} from "@radix-ui/react-icons";
import React, {useMemo, useState} from "react";
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


interface Names{
    [key:string]: string;
}

interface Weights {
    [key: string]: number;
}

interface TQIEntry {
    weights: Weights;
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

function MaxValueFinder({ numbers }) {
    const maxValue = Math.max(...numbers);

    return (
        <div>
            <p>{maxValue}</p>
        </div>
    );
}



export function ButtonRequirement(mode:string){
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
                              <Text>Primary Users </Text>
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
                              <Text>Secondary Users </Text>
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
                              <Text>Secondary Users </Text>
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
                              <Text>Indirect Users </Text>
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
                      <Table.Row align={"center"}>
                          <Table.ColumnHeaderCell justify={"center"} >
                              <Text>Sub users</Text>
                          </Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell justify={"center"} >
                              <Text>-</Text>
                          </Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell justify={"center"} >
                              <Text>Content Provider </Text>
                              <HoverCard.Root>
                                  <HoverCard.Trigger>
                                      <Link href="#">
                                          <InfoCircledIcon />
                                      </Link>
                                  </HoverCard.Trigger>
                                  <HoverCard.Content>
                                      <Text as="div" style={{ maxWidth: 325 }}>
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
                                          <InfoCircledIcon />
                                      </Link>
                                  </HoverCard.Trigger>
                                  <HoverCard.Content>
                                      <Text as="div" style={{ maxWidth: 325 }}>
                                          Maintainer, analyzer, porter, installer.
                                      </Text>
                                  </HoverCard.Content>
                              </HoverCard.Root>
                          </Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell justify={"center"} >
                              <Text>-</Text>
                          </Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell justify={"center"} >
                              <Text>Max value </Text>
                              <HoverCard.Root>
                                  <HoverCard.Trigger>
                                      <Link href="#">
                                          <InfoCircledIcon />
                                      </Link>
                                  </HoverCard.Trigger>
                                  <HoverCard.Content>
                                      <Text as="div" style={{ maxWidth: 325 }}>
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
                                    <IsoSingleRequirementRow key={idx} nameAspect= {idx} />
                      ))}
                  </Table.Body>
              </Table.Root>
          </Box>
      </Flex>
    );
}

export function IsoSingleRequirementRow({nameAspect}){

    let [primary, setPrimary] = useState(0);
    let [secondaryContent, setSecondaryContent] = useState(0);
    let [secondaryMaintainer, setSecondaryMaintainer] = useState(0);
    let [indirect, setIndirect] = useState(0);
    return(
        <Table.Row key={nameAspect}>
            <Table.RowHeaderCell>
                {nameAspect}
            </Table.RowHeaderCell>
            <Table.Cell>
                <Box style={{ position: 'relative', padding: '20px' }}>
                    <Slider.Root
                        value={[primary]}
                        onValueChange={(value) => {setPrimary(value[0])}}
                        min={0}
                        max={1}
                        step={0.01}
                        className="SliderRoot">
                        <Slider.Track className="SliderTrack">
                            <Slider.Range className="SliderRange" />
                        </Slider.Track>
                        <Slider.Thumb className="SliderThumb" />
                    </Slider.Root>
                    <div style={{ position: 'absolute', top: '-2px', left: `${primary * 100}%`, transform: 'translateX(-50%)' }}>
                        {primary.toFixed(2)}
                    </div>
                </Box>
            </Table.Cell>
            <Table.Cell>
                <Box style={{ position: 'relative', padding: '20px' }}>
                    <Slider.Root
                        value={[secondaryContent]}
                        onValueChange={(value) => {setSecondaryContent(value[0])}}
                        min={0}
                        max={1}
                        step={0.01}
                        className="SliderRoot">
                        <Slider.Track className="SliderTrack">
                            <Slider.Range className="SliderRange" />
                        </Slider.Track>
                        <Slider.Thumb className="SliderThumb" />
                    </Slider.Root>
                    <div style={{ position: 'absolute', top: '-2px', left: `${secondaryContent* 100}%`, transform: 'translateX(-50%)' }}>
                        {secondaryContent.toFixed(2)}
                    </div>
                </Box>
            </Table.Cell>
            <Table.Cell>
                <Box style={{ position: 'relative', padding: '20px' }}>
                    <Slider.Root
                        value={[secondaryMaintainer]}
                        onValueChange={(value) => {setSecondaryMaintainer(value[0])}}
                        min={0}
                        max={1}
                        step={0.01}
                        className="SliderRoot">
                        <Slider.Track className="SliderTrack">
                            <Slider.Range className="SliderRange" />
                        </Slider.Track>
                        <Slider.Thumb className="SliderThumb" />
                    </Slider.Root>
                    <div style={{ position: 'absolute', top: '-2px', left: `${secondaryMaintainer* 100}%`, transform: 'translateX(-50%)' }}>
                        {secondaryMaintainer.toFixed(2)}
                    </div>
                </Box>
            </Table.Cell>
            <Table.Cell>
                <Box style={{ position: 'relative', padding: '20px' }}>
                    <Slider.Root
                        value={[indirect]}
                        onValueChange={(value) => {setIndirect(value[0])}}
                        min={0}
                        max={1}
                        step={0.01}
                        className="SliderRoot">
                        <Slider.Track className="SliderTrack">
                            <Slider.Range className="SliderRange" />
                        </Slider.Track>
                        <Slider.Thumb className="SliderThumb" />
                    </Slider.Root>
                    <div style={{ position: 'absolute', top: '-2px', left: `${indirect * 100}%`, transform: 'translateX(-50%)' }}>
                        {indirect.toFixed(2)}
                    </div>
                </Box>
            </Table.Cell>
            <Table.Cell>
                <MaxValueFinder numbers={[primary, secondaryContent, secondaryMaintainer, indirect]} />
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
                                <Text>SNetwork </Text>
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
        <Grid columns={"3"} gap="3" width={"auto"}>
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
