import {Box, Button, Flex, HoverCard, IconButton, Link, Separator, Table, Text} from "@radix-ui/themes";
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



export function ButtonRequirement(){
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

                            <Requirements/>

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
                                ISO 25010 Table 1
                            </Dialog.Title>
                            <Dialog.Description className="DialogDescription">
                                {/* Dialog description content */}
                                Quality from different stakeholder perspectives.
                            </Dialog.Description>

                            <Separator my="3" size="4" />

                            <Requirements/>

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




export function Requirements() {

    const definition = useAtomValue(State.definition);

    // console.log(definition);

    const names = getInitialNames(definition);
    // console.log(names)

    const [isoImportance, setIsoImportance] = useState(Object.keys(names).map(key=> names[key]));
    // useMemo(() => {
    //     setImportance(Object.keys(names).map(key=> 0);
    // }, [names]);

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

                      {Object.keys(names).map(idx => {
                          return(
                          <SingleRequirementRow nameAspect= {idx} />
                          );
                      })}
                  </Table.Body>
              </Table.Root>
          </Box>
      </Flex>
    );
}

export function SingleRequirementRow({nameAspect}){

    let [primary, setPrimary] = useState(0);
    let [secondaryContent, setSecondaryContent] = useState(0);
    let [secondaryMaintainer, setSecondaryMaintainer] = useState(0);
    let [indirect, setIndirect] = useState(0);
    return(
        <Table.Row>
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