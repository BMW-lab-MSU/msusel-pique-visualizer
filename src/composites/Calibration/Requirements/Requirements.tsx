import {Box, Button, Flex, HoverCard, IconButton, Link, Separator, Table, Text} from "@radix-ui/themes";
import {Cross2Icon, InfoCircledIcon} from "@radix-ui/react-icons";
import React from "react";
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
    console.log(definition)
    Object.entries(definition.factors.tqi).forEach(([_, tqiEntry]) => {
        const entry = tqiEntry as TQIEntry;
        Object.entries(entry.weights).forEach(([aspect, _]) => {
            names[aspect] = aspect;
        });
    });

    return names;
};


export function ButtonRequirments(){
    return (
        <Flex>
            <Box position={"relative"} left={"50%"} top={"50%"}>
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
            </Box>
        </Flex>
    )
}


export function Requirements() {

    const definition = useAtomValue(State.definition);

    // console.log(definition);

    // const names = getInitialNames(definition);
    // // console.log(definition)

    return(
      <Flex direction={"column"} align={"center"}>
          <Box>
              <Table.Root variant="surface" style={{ width: "100%" }}>
                  <Table.Header>
                      <Table.Row align={"center"}>
                          <Table.ColumnHeaderCell justify={"center"} width={"25%"}>
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
                          <Table.ColumnHeaderCell justify={"center"} width={"25%"}>
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
                          <Table.ColumnHeaderCell justify={"center"} width={"25%"}>
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
                          <Table.ColumnHeaderCell justify={"center"} width={"25%"}>
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
                          <Table.ColumnHeaderCell justify={"center"} width={"25%"}>
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
                      </Table.Row>
                          <Table.ColumnHeaderCell justify={"center"} width={"25%"}>
                              <Text>Sub users</Text>
                          </Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell justify={"center"} width={"25%"}>

                          </Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell justify={"center"} width={"25%"}>
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
                          <Table.ColumnHeaderCell justify={"center"} width={"25%"}>
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
                          <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
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
                      </Table.Row>
                  </Table.Header>
                  <Table.Body>
                      {/*{Object.entries(names).map(([_,name]) => {*/}
                      {/*    return(*/}
                      {/*    <SingleRequirementRow name={name} />*/}
                      {/*    );*/}
                      {/*})}*/}
                  </Table.Body>
              </Table.Root>
          </Box>
      </Flex>
    );
}

export function SingleRequirementRow(name){

    let primary = 0;
    let secondary_content = 0;
    let secondary_maintainer = 0;
    let indirect = 0;
    return(
        <Table.Row>
            <Table.RowHeaderCell>
                {name}
            </Table.RowHeaderCell>
            <Table.Cell>
                <Box style={{ position: 'relative', padding: '20px' }}>
                    <Slider.Root
                        value={[primary]}
                        onValueChange={(value) => {primary = value[0]}}
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
                        value={[secondary_content]}
                        onValueChange={(value) => {secondary_content = value[0]}}
                        min={0}
                        max={1}
                        step={0.01}
                        className="SliderRoot">
                        <Slider.Track className="SliderTrack">
                            <Slider.Range className="SliderRange" />
                        </Slider.Track>
                        <Slider.Thumb className="SliderThumb" />
                    </Slider.Root>
                    <div style={{ position: 'absolute', top: '-2px', left: `${secondary_content* 100}%`, transform: 'translateX(-50%)' }}>
                        {secondary_content.toFixed(2)}
                    </div>
                </Box>
            </Table.Cell>
            <Table.Cell>
                <Box style={{ position: 'relative', padding: '20px' }}>
                    <Slider.Root
                        value={[secondary_maintainer]}
                        onValueChange={(value) => {secondary_maintainer = value[0]}}
                        min={0}
                        max={1}
                        step={0.01}
                        className="SliderRoot">
                        <Slider.Track className="SliderTrack">
                            <Slider.Range className="SliderRange" />
                        </Slider.Track>
                        <Slider.Thumb className="SliderThumb" />
                    </Slider.Root>
                    <div style={{ position: 'absolute', top: '-2px', left: `${secondary_maintainer* 100}%`, transform: 'translateX(-50%)' }}>
                        {secondary_maintainer.toFixed(2)}
                    </div>
                </Box>
            </Table.Cell>
            <Table.Cell>
                <Box style={{ position: 'relative', padding: '20px' }}>
                    <Slider.Root
                        value={[indirect]}
                        onValueChange={(value) => {indirect = value[0]}}
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
        </Table.Row>
    );
}