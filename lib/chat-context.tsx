import React, { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  apiKey: string;
  apiEndpoint: string;
}

type ChatAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_API_KEY"; payload: string }
  | { type: "SET_API_ENDPOINT"; payload: string }
  | { type: "CLEAR_MESSAGES" }
  | { type: "LOAD_STATE"; payload: Partial<ChatState> };

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  apiKey: "",
  apiEndpoint: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_API_KEY":
      return {
        ...state,
        apiKey: action.payload,
      };
    case "SET_API_ENDPOINT":
      return {
        ...state,
        apiEndpoint: action.payload,
      };
    case "CLEAR_MESSAGES":
      return {
        ...state,
        messages: [],
      };
    case "LOAD_STATE":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

interface ChatContextType {
  state: ChatState;
  addMessage: (message: Omit<Message, "id">) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setApiKey: (key: string) => void;
  setApiEndpoint: (endpoint: string) => void;
  clearMessages: () => void;
  sendMessage: (content: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // Load saved state on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem("chatState");
        if (savedState) {
          const parsed = JSON.parse(savedState);
          dispatch({ type: "LOAD_STATE", payload: parsed });
        }
      } catch (error) {
        console.error("Failed to load chat state:", error);
      }
    };
    loadState();
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem("chatState", JSON.stringify(state));
      } catch (error) {
        console.error("Failed to save chat state:", error);
      }
    };
    saveState();
  }, [state]);

  const addMessage = useCallback((message: Omit<Message, "id">) => {
    const id = Date.now().toString();
    dispatch({
      type: "ADD_MESSAGE",
      payload: { ...message, id },
    });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const setApiKey = useCallback((key: string) => {
    dispatch({ type: "SET_API_KEY", payload: key });
  }, []);

  const setApiEndpoint = useCallback((endpoint: string) => {
    dispatch({ type: "SET_API_ENDPOINT", payload: endpoint });
  }, []);

  const clearMessages = useCallback(() => {
    dispatch({ type: "CLEAR_MESSAGES" });
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!state.apiKey) {
        setError("API key not configured. Please set it in settings.");
        return;
      }

      // Add user message
      addMessage({
        role: "user",
        content,
        timestamp: Date.now(),
      });

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(state.apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.apiKey}`,
          },
          body: JSON.stringify({
            model: "glm-4",
            messages: state.messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: 2048,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "API request failed");
        }

        const data = await response.json();
        const assistantMessage = data.choices?.[0]?.message?.content;

        if (assistantMessage) {
          addMessage({
            role: "assistant",
            content: assistantMessage,
            timestamp: Date.now(),
          });
        } else {
          throw new Error("No response from AI");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("Chat error:", error);
      } finally {
        setLoading(false);
      }
    },
    [state.apiKey, state.apiEndpoint, state.messages, addMessage, setLoading, setError]
  );

  return (
    <ChatContext.Provider
      value={{
        state,
        addMessage,
        setLoading,
        setError,
        setApiKey,
        setApiEndpoint,
        clearMessages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
}
