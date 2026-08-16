import React from 'react';
import { MessageSquareText, Search, Cpu, SendHorizontal } from 'lucide-react';
import { PipelineStageId, StepStatus } from '../../types/inspector';
import { PipelineStep } from './PipelineStep';

interface PipelineProps {
  currentStage: PipelineStageId | 'idle' | 'completed';
  isIdle: boolean;
}

export const Pipeline: React.FC<PipelineProps> = ({ currentStage, isIdle }) => {
  const getStepStatus = (stepId: PipelineStageId, stepOrder: number): StepStatus => {
    if (isIdle) return 'idle';
    if (currentStage === 'completed') return 'completed';

    const stageOrderMap: Record<PipelineStageId, number> = {
      input_received: 1,
      intent_matching: 2,
      logic_execution: 3,
      response_delivery: 4,
    };

    const currentOrder = stageOrderMap[currentStage as PipelineStageId] || 0;

    if (currentOrder > stepOrder) return 'completed';
    if (currentOrder === stepOrder) return 'active';
    return 'idle';
  };

  const steps = [
    {
      id: 'input_received' as PipelineStageId,
      stepNumber: 1,
      name: 'Input Received',
      description: 'Captures and sanitizes message input for processing.',
      icon: MessageSquareText,
    },
    {
      id: 'intent_matching' as PipelineStageId,
      stepNumber: 2,
      name: 'Intent Matching',
      description: 'Scans rule library for regex and keyword matches.',
      icon: Search,
    },
    {
      id: 'logic_execution' as PipelineStageId,
      stepNumber: 3,
      name: 'Logic Execution',
      description: 'Deterministic intent response retrieved and parsed.',
      icon: Cpu,
    },
    {
      id: 'response_delivery' as PipelineStageId,
      stepNumber: 4,
      name: 'Response Delivery',
      description: 'Formatted payload dispatched to the client canvas.',
      icon: SendHorizontal,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Execution Pipeline
        </h4>
        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
          4-Stage Flow
        </span>
      </div>

      <div className="pt-1">
        {steps.map((step, idx) => (
          <PipelineStep
            key={step.id}
            stepNumber={step.stepNumber}
            name={step.name}
            description={step.description}
            status={getStepStatus(step.id, step.stepNumber)}
            icon={step.icon}
            isLast={idx === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
