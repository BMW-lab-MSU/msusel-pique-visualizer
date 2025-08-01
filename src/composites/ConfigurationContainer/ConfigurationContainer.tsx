import { useAtomValue } from "jotai";
import { State } from "../../state";
import { Flex, Text, Box, Strong } from "@radix-ui/themes";
import * as Tabs from "@radix-ui/react-tabs";
import { ConfigurationSummary } from "./Summary";
import { NodeValueAdjustment } from "./NodeValueAdjustment";
import { EnhancedImportanceAdjustment } from "./EnhancedImportanceAdjustment";
import { useColorMode } from '../../color-mode';
import "../Style/Separator.css";
import "../Style/ConfigTab.css";

export const ConfigurationContainer = () => {
  const { isColorBlind, toggleColorMode } = useColorMode();
  
  return (
    // Change Flex direction to 'column' for vertical layout
    <Flex direction={"column"} gap={"3"} align={"start"}>
      <Flex>
        <Tabs.Root className="ConfigTab--TabsRoot" defaultValue="summary">
          <Tabs.List className="ConfigTab--TabsList">
            <Tabs.Trigger className="ConfigTab--TabsTrigger" value="summary">
              Summary
            </Tabs.Trigger>
            <Tabs.Trigger className="ConfigTab--TabsTrigger" value="enhancedimportance">
              Importance Adjustment
            </Tabs.Trigger>
            <Tabs.Trigger className="ConfigTab--TabsTrigger" value="settings">
              Settings
            </Tabs.Trigger>
            {/* <Tabs.Trigger className="ConfigTab--TabsTrigger" value="value">
              <Strong>(In Progress)</Strong> Value Adjustment
            </Tabs.Trigger> */}
          </Tabs.List>

          <Flex>
            {/* Current Configuration Summary */}
            <Tabs.Content className="ConfigTab--TabsContent" value="summary">
              <Box width="100%">
                <ConfigurationSummary />
              </Box>
            </Tabs.Content>

            {/* dynamic importance adjustment */}
            <Tabs.Content className="ConfigTab--TabsContent" value="enhancedimportance">
              <Box width="100%">
                <EnhancedImportanceAdjustment />
              </Box>
            </Tabs.Content>

            {/* Settings tab */}
            <Tabs.Content className="ConfigTab--TabsContent" value="settings">
              <Box width="100%" style={{ padding: '15px' }}>
                <Text size="3" weight="bold" style={{ marginBottom: '15px', display: 'block' }}>Display Settings</Text>
                
                <Box style={{ marginBottom: '15px' }}>
                  <Text size="2" weight="medium" style={{ marginBottom: '8px', display: 'block' }}>Color Mode</Text>
                  <button 
                    className="toggle-button" 
                    onClick={toggleColorMode}
                    style={{
                      padding: '10px 15px',
                      border: '1px solid #ccc',
                      borderRadius: '6px',
                      backgroundColor: isColorBlind ? '#e8f4fd' : '#fff',
                      cursor: 'pointer',
                      fontSize: '13px',
                      width: '100%',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    {isColorBlind ? '🔵 Color-Blind Mode Active' : '🎨 Switch to Color-Blind Mode'}
                  </button>
                  <Text size="1" style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                    {isColorBlind ? 'Using colorblind-friendly palette' : 'Using standard color palette'}
                  </Text>
                </Box>
              </Box>
            </Tabs.Content>

            {/* dynamic value adjustment */}
            <Tabs.Content className="ConfigTab--TabsContent" value="value">
              <Box width="100%">
                <NodeValueAdjustment />
              </Box>
            </Tabs.Content>
          </Flex>
        </Tabs.Root>
      </Flex>
    </Flex>
  );
};
