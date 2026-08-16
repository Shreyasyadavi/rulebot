export type PipelineStageId = 'input_received' | 'intent_matching' | 'logic_execution' | 'response_delivery';

export type StepStatus = 'idle' | 'active' | 'completed' | 'failed';

export type MatchStatus = 'Matched' | 'Evaluating' | 'No Rule Match' | 'Gemini Fallback' | 'Fallback' | 'Fallback Error' | 'Standby';

export type MatchType = 'Exact' | 'Pattern/Regex' | 'Keyword' | 'Fallback' | 'None';

export type InspectorResponseType = 'rule' | 'gemini' | 'fallback' | 'none';

export interface PipelineStepData {
  id: PipelineStageId;
  name: string;
  description: string;
  status: StepStatus;
}

export interface InspectorData {
  isIdle: boolean;
  currentIntent: string;
  matchStatus: MatchStatus;
  confidence: number;
  sessionId: string;
  responseSource: InspectorResponseType;
  matchType: MatchType;
  matchedPattern: string;
  currentStage: PipelineStageId | 'idle' | 'completed';
  executionTimeMs?: number;
}
