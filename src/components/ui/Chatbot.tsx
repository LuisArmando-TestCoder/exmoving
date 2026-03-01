"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useChatbotStore } from "@/store/useChatbotStore";
import { ChatBrain } from "@/lib/ChatBrain";
import { IntelligenceUnit } from "@/lib/IntelligenceUnit";
import { sendEmail } from "@/app/actions";
import { getEmailTemplate } from "@/utils/emailTemplates";
import styles from "./Chatbot.module.scss";
import { ChatbotMessages } from "./ChatbotMessages";
import { ChatbotInput } from "./ChatbotInput";

interface Message {
  role: "model" | "user";
  text: string;
  timestamp: string;
}

interface ChatbotProps {
  apiKey: string;
  modelId?: string;
  userContext?: any;
}

export const Chatbot = ({
  apiKey,
  modelId = "gemini-flash-latest",
  userContext = {},
}: ChatbotProps) => {
  const { 
    messages, 
    setMessages, 
    isErratic, 
    setIsErratic, 
    behaviorNotes,
    setBehaviorNotes,
    showEmailBtn, 
    setShowEmailBtn, 
    summaryText, 
    setSummaryText,
    closeChatbot,
    openNewsletter
  } = useChatbotStore();

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "success" | "error">("idle");
  const [isListening, setIsListening] = useState(true);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lastSubmittedInputRef = useRef("");
  const recognitionRef = useRef<any>(null);

  const brain = useMemo(() => {
    if (!apiKey) return null;
    return new ChatBrain({
      apiKey,
      modelId,
      systemInstruction: `Act as a concise automation consultant. 
        CONSULTATION FLOW:
        1. GATHER initial info: Company, Industry.
        2. DEFINE OBJECTIVE: Ask what the primary business goal is.
        3. IDENTIFY PROBLEM: Once the objective is set, ask for the main roadblock/problem.
        4. ROOT CAUSE ANALYSIS: Use the "5 Whys" technique to drill down into the stated problem to find its source.
        5. RECOMMENDATION: Briefly state how automation addresses the root cause.
        
        RULES:
        - BE EXTREMELY CONCISE. One sentence max per response.
        - Ask ONLY 1 question at a time.
        - Professional tone.
        - Keep track of the "5 Whys" chain internally.
        - When complete, provide a 3-bullet point summary and tell them their inquiry has been sent to the research team.
        
        USER CONTEXT: ${JSON.stringify(userContext)}`
    });
  }, [apiKey, modelId, userContext]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [userInput]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const text = event.results[i][0].transcript;
              setUserInput(prev => {
                const base = prev.trim();
                return base ? `${base} ${text.trim()}` : text.trim();
              });
            } else {
              currentTranscript += event.results[i][0].transcript;
            }
          }
          
          if (currentTranscript) {
            setUserInput(prev => {
              // We want to avoid double-appending if the same interim result comes back multiple times
              // But simpler: just append the interim to the current state
              // However, the interim changes constantly.
              // A better way for interim is to keep track of the "stable" user input separately.
              return prev; 
            });
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          if (event.error === "network") {
            console.warn("Speech recognition network error - disabling auto-restart");
            setIsListening(false);
            return;
          }
          console.error("Speech recognition error:", event.error);
          if (event.error !== "not-allowed" && isListening) {
            setTimeout(() => {
              try { recognitionRef.current.start(); } catch(e) {}
            }, 1000); // Increased timeout for retry
          }
        };

        recognitionRef.current.onend = () => {
          if (isListening) {
            setTimeout(() => {
              try { recognitionRef.current.start(); } catch(e) {}
            }, 100);
          }
        };

        if (isListening) {
           try { recognitionRef.current.start(); } catch(e) {}
        }
      }
    }

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      try { recognitionRef.current?.start(); } catch(e) {}
    } else {
      recognitionRef.current?.stop();
    }
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(prev => !prev);
  };

  const handleSendEmail = async () => {
    if (isSendingEmail || emailStatus === "success") return;
    setIsSendingEmail(true);
    try {
      await sendEmail({
        to: "oriens@aiexecutions.com",
        ...getEmailTemplate(summaryText, false)
      });
      setEmailStatus("success");
    } catch (error) {
      console.error("Failed to send chatbot summary email:", error);
      setEmailStatus("error");
      setTimeout(() => setEmailStatus("idle"), 3000);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!userInput.trim() || loading || isErratic) return;

    const userText = userInput;
    setUserInput("");

    const userMsg: Message = {
      role: "user",
      text: userText,
      timestamp: formatTimestamp(),
    };
    
    const updatedMessages: Message[] = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      if (!brain) {
        throw new Error("AI not initialized");
      }

      // Start background observation asynchronously
      const observationPromise = brain.observeBehavior(userText, messages).then(note => {
        if (note && note !== "Observation unavailable") {
          const lastModelMsg = messages.length > 0 ? messages[messages.length - 1].text : "";
          setBehaviorNotes(`[${formatTimestamp()}] User said: "${userText}" | Chatbot previously said: "${lastModelMsg}" | Observation: ${note}`);
        }
        return useChatbotStore.getState().behaviorNotes;
      }).then(updatedNotes => {
        // Relax checks for the first 3 user messages (messages includes the initial model message, so messages.length < 7 means <= 3 user turns)
        if (updatedMessages.length < 7) {
          return false;
        }
        return brain.analyzeBehaviorPatterns(updatedNotes);
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "",
          timestamp: formatTimestamp(),
        },
      ]);

      let fullText = "";
      const stream = brain.sendMessageStream(userText, updatedMessages);

      for await (const chunk of stream) {
        fullText += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            text: fullText,
          };
          return newMessages;
        });
      }

      // Check if background observation flagged the user
      const erraticDetected = await observationPromise;

      if (erraticDetected && !isErratic) {
        setIsErratic(true);
        setIsListening(false);
        const erraticText = "This chat has been closed. We only provide consultations to serious inquiries. If you believe this is a mistake, please contact us at [oriens@aiexecutions.com](mailto:oriens@aiexecutions.com).";
        setMessages((prev: Message[]) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: "model",
            text: erraticText,
            timestamp: formatTimestamp(),
          };
          return newMessages;
        });
        
        // Log to history
        useChatbotStore.getState().addInteractionRecord({
          date: new Date().toLocaleDateString(),
          status: 'erratic'
        });
        
        // Auto-send minuta on erratic close
        const finalSummary = [...updatedMessages, { role: "model", text: erraticText, timestamp: formatTimestamp() }]
          .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
          .join("\n\n");
        
        const currentBehaviorNotes = useChatbotStore.getState().behaviorNotes;
        const fullReportText = `[ERRATIC BEHAVIOR DETECTED]\n\nCHAT HISTORY:\n${finalSummary}\n\nBEHAVIORAL OBSERVATIONS:\n${currentBehaviorNotes}`;
        
        setSummaryText(fullReportText);

        // Auto-send report on erratic detection
        try {
          const currentState = useChatbotStore.getState();
          const patternSummary = await brain.getBehaviorPatternSummary(currentState.behaviorNotes);
          
          const totals = {
            totalInputTokens: currentState.totalTokensIn,
            totalOutputTokens: currentState.totalTokensOut,
            totalCost: currentState.totalCost,
            modelsUsed: new Set(currentState.modelsUsed)
          };

          const resourceDossier = IntelligenceUnit.generateResourceDossierHTML(totals);
          IntelligenceUnit.logSessionSummary(totals);
          
          await sendEmail({
            to: "oriens@aiexecutions.com",
            ...getEmailTemplate(fullReportText, true, false, currentState.interactionHistory, currentState.userContext, currentState.behaviorNotes, patternSummary, resourceDossier)
          });
        } catch (e) {
          console.error("Failed to auto-send erratic report:", e);
        }

        setShowEmailBtn(true);
        setLoading(false);
        return;
      }

      if (fullText) {
        if (fullText.toLowerCase().includes("summar") || 
            fullText.toLowerCase().includes("whatsapp") || 
            fullText.toLowerCase().includes("button below") || 
            fullText.toLowerCase().includes("request button") ||
            fullText.toLowerCase().includes("research team")) {
          const finalSummary = [...updatedMessages, { role: "model", text: fullText, timestamp: formatTimestamp() }]
            .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
            .join("\n\n");
            
          const currentBehaviorNotes = useChatbotStore.getState().behaviorNotes;
          const finalSummaryText = `CHAT HISTORY:\n${finalSummary}\n\nBEHAVIORAL OBSERVATIONS:\n${currentBehaviorNotes}`;
          
          setSummaryText(finalSummaryText);
          setIsListening(false);
          
          // Log to history
          useChatbotStore.getState().addInteractionRecord({
            date: new Date().toLocaleDateString(),
            status: 'success'
          });
          
          // Auto send email
          try {
            const currentState = useChatbotStore.getState();
            const patternSummary = await brain.getBehaviorPatternSummary(currentState.behaviorNotes);
            
            const totals = {
              totalInputTokens: currentState.totalTokensIn,
              totalOutputTokens: currentState.totalTokensOut,
              totalCost: currentState.totalCost,
              modelsUsed: new Set(currentState.modelsUsed)
            };

            const resourceDossier = IntelligenceUnit.generateResourceDossierHTML(totals);
            IntelligenceUnit.logSessionSummary(totals);

            await sendEmail({
              to: "oriens@aiexecutions.com",
              ...getEmailTemplate(finalSummaryText, true, false, currentState.interactionHistory, currentState.userContext, currentState.behaviorNotes, patternSummary, resourceDossier)
            });
            console.log("Email automatically sent to stakeholder.");
          } catch (error) {
            console.error("Failed to auto-send chatbot summary email:", error);
          }
          
          // Switch to newsletter modal
          setTimeout(() => {
            closeChatbot();
            openNewsletter();
          }, 3500); // Increased delay to 3.5s to allow reading/hearing the final message
        }
      }
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `I'm sorry, I encountered an error: ${error.message || "Unknown error"}`,
          timestamp: formatTimestamp(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeydown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles["glass-card"]}>
      <ChatbotMessages
        messages={messages}
        loading={loading}
        chatContainerRef={chatContainerRef}
      />

      <ChatbotInput
        userInput={userInput}
        setUserInput={setUserInput}
        loading={loading}
        isErratic={isErratic}
        showEmailBtn={showEmailBtn}
        isListening={isListening}
        toggleListening={toggleListening}
        handleSubmit={() => handleSubmit()}
        handleKeydown={handleKeydown}
        textareaRef={textareaRef}
      />
    </div>
  );
};
