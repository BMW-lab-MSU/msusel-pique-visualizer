// define all common types here

//for configuration - importance adjustment - profile selection 
export interface Profile {
  type: string;
  // added to differentiate importance and weights
  importanceSum: number;
  importance: {
    [qualityAspect: string]: number;
  };
  weights: {
    [qualityAspect: string]: number;
  };
  // added for characteristic slider
  characteristic: {
    [qualityAspect: string]: number;
  }
}

  