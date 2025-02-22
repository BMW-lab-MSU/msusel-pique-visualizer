// AdjustmentTableLogic.tsx
import { useAtomValue } from "jotai";
import React, { useMemo, useState } from "react";
import { State } from "../../../../state";
import { Profile } from "../../../../types";
import * as schema from "../../../../data/schema";
import { AdjustmentTableUI } from "./AdjustmentTableUI";

import "./FigureContainer/Figure.css"
import {TabsPanel} from "../ImportanceDashBoard/AdjustmentSummary.tsx";

interface Weights {
  [key: string]: number;
}

interface TQIEntry {
  weights: Weights;
}

interface ChildchildNodeValues {
  [key: string]: number;
}

interface AdjustmentTableProps {
  selectedProfile?: Profile[];
  isProfileApplied: boolean;
  onResetApplied: () => void;
  mode: string;
}

export const AdjustmentTableLogic: React.FC<AdjustmentTableProps> = ({
  selectedProfile,
  isProfileApplied,
  onResetApplied, mode,
}) => {


  const dataset = (() => {
    if (mode == "Evaluate") {
      return useAtomValue(State.dataset);
    } else if (mode == "Derive") {
      return useAtomValue(State.definition);
    } else {
      return null;
    }
  }) ();

  if (!dataset) return null;



  const getInitialWeights = (
    selectedProfile: Profile[] | undefined,
    dataset: schema.base.Schema,
    useDataset: boolean
  ): { [key: string]: number } => {
    let weights: Weights = {};
    if (selectedProfile && selectedProfile.length > 0 && !useDataset) {
      const profileWeights = selectedProfile[0].importance;
      weights = { ...profileWeights };
    } else {
      Object.entries(dataset.factors.tqi).forEach(([_, tqiEntry]) => {
        const entry = tqiEntry as TQIEntry;
        Object.entries(entry.weights).forEach(([aspect, importance]) => {
          weights[aspect] = importance;
        });
      });
    }
    return weights;
  };


  const getInitialChildNodeValues = (dataset: schema.base.Schema): { [key: string]: number } => {
    let values: ChildchildNodeValues={};

    //TODO : Make it generalize to work with each layer in pique

    Object.entries(dataset.factors.tqi).forEach(([_, tqiEntry]) => {
      const entry = tqiEntry as TQIEntry;
      Object.entries(entry.weights).forEach(([aspect, _]) => {
        values[aspect] = dataset.factors.quality_aspects[aspect]?.value || 0;
      });
    });

    return values;
  };

  const sliderValues = useMemo(() => {
    const useDataset = !isProfileApplied;
    return getInitialWeights(selectedProfile, dataset, useDataset);
  }, [selectedProfile, dataset, isProfileApplied]);

  const [values, setValues] = useState<{ [key: string]: number }>(sliderValues);
  useMemo(() => {
    setValues(sliderValues);
  }, [sliderValues]);

  // const n_nodes = Object.keys(values).length;
  const childNodeValues = useMemo(() => {
    return getInitialChildNodeValues(dataset);
  }, [ dataset]);

  const [nodeValues, setNodeValues] = useState<{[key: string]: number}>(childNodeValues);
  useMemo(() => {
    setNodeValues(getInitialChildNodeValues(dataset));
  }, [childNodeValues]);


  const resetAllAdjustments = () => {
    const resetValues = getInitialWeights(selectedProfile, dataset, true);
    setValues(resetValues);
    setNodeValues(getInitialChildNodeValues(dataset));
    onResetApplied();
  };

  const recalculatedWeights = useMemo(() => {
    const newWeights: Weights = {};
    Object.keys(values).forEach((name) => {
      const totalImportance = Object.values(values).reduce(
        (sum, importance) => sum + importance,
        0
      );
      newWeights[name] = values[name] / totalImportance;
    });
    return newWeights;
  }, [values]);




  const handleSliderChange = (name: string, newImportance: number) => {
    setValues((prev) => ({ ...prev, [name]: newImportance }));
  };

  const handleNodeValueChange = (name: string, newImportance: number) => {
    setNodeValues((prev) => ({ ...prev, [name]: newImportance }));
  }

  const handleDownload = () => {
    // Define the initial weights
    let weights: Weights = {};
    Object.entries(dataset.factors.tqi).forEach(([_, tqiEntry]) => {
      const entry = tqiEntry as TQIEntry;
      Object.entries(entry.weights).forEach(([aspect, importance]) => {
        weights[aspect] = importance;
      });
    });

    // Create a list of aspects that have changed
    let changedAspects: any = [];
    Object.entries(values).forEach(
      ([aspect, recalculatedImportance]) => {
        if (recalculatedImportance !== weights[aspect]) {
          changedAspects.push(aspect);
        }
      }
    );

    // Generate the filename based on the changed aspects
    let filename =
      changedAspects.length > 0
        ? `Custom_Profile_Changed_${changedAspects.join("_")}.json`
        : `Custom_Profile_Unchanged.json`;

    // Create a Profile object to download
    let profileToDownload: Profile = {
      type: "Custom Profile",
      importance: recalculatedWeights,
    };

    const json = JSON.stringify(profileToDownload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename; // Use the generated filename
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="Panels" style={{display:"grid", gridTemplateColumns: "repeat(2, 1fr)", gridGap:10}}>
      <div className="Table">
        <AdjustmentTableUI
          dataset={dataset}
          values={values}
          nodeValues={nodeValues}
          recalculatedWeights={recalculatedWeights}
          handleSliderChange={handleSliderChange}
          resetAllAdjustments={resetAllAdjustments}
          handleDownload={handleDownload}
          handleNodeValueChange={handleNodeValueChange}
          mode={mode}
        />
      </div>
      <div className="Visual">
        <TabsPanel
          dataset={dataset}
          values={values}
          recalculatedWeights={recalculatedWeights}
          childNodeValues={nodeValues}
        />
      </div>
    </div>
  );
};
