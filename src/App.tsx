import { useState } from "react";
import { FileUploader } from "./composites/FileUploader";
import { useAtom, useAtomValue } from "jotai";
import { State } from "./state";
import * as R from "ramda";
import { Wrapper } from "./Wrapper";
import { DefinitionWrapper} from "./DefinitionWrapper.tsx";
import { Box } from "@radix-ui/themes";
import { TreeDisplayProto } from "./composites/TreeDisplayProto/TreeDisplayProto";
import { ReactFlowProvider } from "reactflow";

import {DefinitionUploader} from "./composites/Calibration/DefinitionUploader/DefinitionUploader.tsx";

function App() {
  const dataset = useAtomValue(State.dataset);
  const definition =useAtomValue(State.definition);

  return (
    <div
      style={{
        width: "100vw",
        height: "90vh",
      }}
    >
        {R.isNil(definition) ? <DefinitionUploader /> : <DefinitionWrapper />}
        {R.isNil(dataset) ? <FileUploader /> : <Wrapper />}
      {/* <ReactFlowProvider> */}
        {/* <TreeDisplayProto />
      </ReactFlowProvider> */}
    </div>
  );
}

export default App;
