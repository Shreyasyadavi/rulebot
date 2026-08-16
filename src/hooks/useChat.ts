import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage } from '../types/chat';
import { InspectorData, PipelineStageId, MatchType } from '../types/inspector';
import { sendChatMessage, ApiError } from '../services/api';
import { recordMessageTurn } from '../services/storage';

const generateSessionId = () => `RB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

const INITIAL_INSPECTOR_STATE: InspectorData = {
  isIdle: true,
  currentIntent: 'idle',
  matchStatus: 'Standby',
  confidence: 0.0,
  sessionId: 'RB-INIT',
  responseSource: 'none',
  matchType: 'None',
  matchedPattern: '',
  currentStage: 'idle',
  executionTimeMs: 0,
};

function formatMatchType(raw?: string | null): MatchType {
  if (!raw) return 'None';
  const lower = raw.toLowerCase();
  if (lower === 'exact') return 'Exact';
  if (lower === 'pattern' || lower === 'regex' || lower === 'pattern/regex') return 'Pattern/Regex';
  if (lower === 'keyword') return 'Keyword';
  if (lower === 'fallback') return 'Fallback';
  return 'None';
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [sessionId, setSessionId] = useState<string>(generateSessionId);
  const [inspector, setInspector] = useState<InspectorData>(() => ({
    ...INITIAL_INSPECTOR_STATE,
    sessionId: generateSessionId(),
  }));

  const animationTimersRef = useRef<NodeJS.Timeout[]>([]);
  const startTimeRef = useRef<number>(0);

  const clearTimers = () => {
    animationTimersRef.current.forEach((t) => clearTimeout(t));
    animationTimersRef.current = [];
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, []);

  const sendMessage = useCallback(
    async (textToSend?: string) => {
      const rawText = textToSend !== undefined ? textToSend : inputText;
      const text = rawText.trim();

      // Prevent sending empty or whitespace-only messages or sending while thinking
      if (!text || isThinking) {
        return;
      }

      const timeStr = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        role: 'user',
        content: text,
        timestamp: timeStr,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputText('');
      setIsThinking(true);
      clearTimers();
      startTimeRef.current = Date.now();

      // Stage 1: Input Received (Immediate)
      setInspector({
        isIdle: false,
        currentIntent: 'evaluating...',
        matchStatus: 'Evaluating',
        confidence: 0.5,
        sessionId,
        responseSource: 'none',
        matchType: 'None',
        matchedPattern: text.slice(0, 32),
        currentStage: 'input_received',
        executionTimeMs: 8,
      });

      // Stage 2: Intent Matching (after 120ms)
      const t1 = setTimeout(() => {
        setInspector((prev) => ({
          ...prev,
          currentStage: 'intent_matching',
          executionTimeMs: Date.now() - startTimeRef.current,
        }));
      }, 120);

      // Stage 3: Logic Execution (after 280ms)
      const t2 = setTimeout(() => {
        setInspector((prev) => ({
          ...prev,
          currentStage: 'logic_execution',
          executionTimeMs: Date.now() - startTimeRef.current,
        }));
      }, 280);

      animationTimersRef.current = [t1, t2];

      try {
        const responseData = await sendChatMessage(text, sessionId);
        clearTimers();

        const elapsedMs = Date.now() - startTimeRef.current;
        const currentActiveSession = responseData.sessionId || sessionId;
        setSessionId(currentActiveSession);

        const mappedMatchType = formatMatchType(responseData.matchType);
        const isRule = responseData.responseType === 'rule';

        // Stage 4 & Completion
        setInspector({
          isIdle: false,
          currentIntent: isRule
            ? responseData.intent || 'rule_matched'
            : 'No predefined intent',
          matchStatus: isRule
            ? 'Matched'
            : 'No Rule Match',
          confidence: isRule ? responseData.confidence : 0,
          sessionId: currentActiveSession,
          responseSource: isRule ? 'rule' : 'fallback',
          matchType: isRule ? mappedMatchType : 'Fallback',
          matchedPattern: isRule
            ? responseData.intent || text.slice(0, 32)
            : 'none',
          currentStage: 'completed',
          executionTimeMs: elapsedMs,
        });

        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          role: 'assistant',
          content: responseData.response,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          responseType: responseData.responseType,
          intentName: responseData.intent || undefined,
          category: responseData.category || undefined,
          matchType: responseData.matchType,
          confidence: responseData.confidence,
          sessionId: currentActiveSession,
        };

        setMessages((prev) => [...prev, botMessage]);

        // Record turn in storage for History & Analytics
        try {
          recordMessageTurn(
            currentActiveSession,
            text,
            responseData.response,
            responseData.responseType,
            responseData.intent || undefined,
            responseData.confidence,
            responseData.matchType || undefined
          );
        } catch (e) {
          console.error('Failed to record message turn:', e);
        }
      } catch (err: unknown) {
        clearTimers();
        const elapsedMs = Date.now() - startTimeRef.current;

        const errorMsg =
          err instanceof ApiError
            ? err.message
            : 'Unable to connect to RuleBot right now.';

        setInspector({
          isIdle: false,
          currentIntent: 'No predefined intent',
          matchStatus: 'Fallback Error',
          confidence: 0.0,
          sessionId,
          responseSource: 'fallback',
          matchType: 'Fallback',
          matchedPattern: 'network_error',
          currentStage: 'completed',
          executionTimeMs: elapsedMs,
        });

        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          role: 'assistant',
          content: errorMsg,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isError: true,
          retryPayload: text,
        };

        setMessages((prev) => [...prev, errorMessage]);

        try {
          recordMessageTurn(sessionId, text, errorMsg, 'fallback', undefined, 0, 'network_error');
        } catch (e) {
          console.error('Failed to record error turn:', e);
        }
      } finally {
        setIsThinking(false);
      }
    },
    [inputText, isThinking, sessionId]
  );

  const retryMessage = useCallback(
    (originalText: string) => {
      sendMessage(originalText);
    },
    [sendMessage]
  );

  const clearChat = useCallback(() => {
    clearTimers();
    setMessages([]);
    setIsThinking(false);
    setShowClearDialog(false);
    setInputText('');
    const newSession = generateSessionId();
    setSessionId(newSession);
    setInspector({
      ...INITIAL_INSPECTOR_STATE,
      sessionId: newSession,
    });
  }, []);

  return {
    messages,
    inputText,
    setInputText,
    isThinking,
    showClearDialog,
    setShowClearDialog,
    inspector,
    sessionId,
    sendMessage,
    retryMessage,
    clearChat,
  };
}
