import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useChat } from "@/lib/chat-context";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

export default function ChatScreen() {
  const { state, sendMessage, setError, clearMessages } = useChat();
  const [inputValue, setInputValue] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const colors = useColors();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (state.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [state.messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    setInputValue("");
    await sendMessage(message);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessage = ({ item }) => {
    const isUser = item.role === "user";
    return (
      <View
        className={cn(
          "px-4 py-2 mb-3",
          isUser ? "items-end" : "items-start"
        )}
      >
        <View
          className={cn(
            "max-w-xs rounded-lg px-3 py-2",
            isUser
              ? "bg-primary rounded-br-none"
              : "bg-surface rounded-bl-none"
          )}
        >
          <Text
            className={cn(
              "text-base leading-relaxed",
              isUser ? "text-background" : "text-foreground"
            )}
          >
            {item.content}
          </Text>
        </View>
        <Text className="text-xs text-muted mt-1">
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScreenContainer className="flex-1 justify-between" edges={["top", "left", "right"]}>
        {/* Header */}
        <View className="border-b border-border py-3 px-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold text-foreground">
              GLM-4 Assistant
            </Text>
            {state.messages.length > 0 && (
              <Pressable
                onPress={() => {
                  clearMessages();
                  setError(null);
                }}
                className="px-3 py-2 rounded-lg active:bg-surface"
              >
                <Text className="text-sm text-primary font-semibold">
                  Clear
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Messages List */}
        {state.messages.length === 0 ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-lg font-semibold text-foreground mb-2">
              Start a Conversation
            </Text>
            <Text className="text-center text-muted">
              Ask me anything. I'm powered by GLM-4 AI.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={state.messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 8 }}
            scrollEnabled={true}
          />
        )}

        {/* Error Message */}
        {state.error && (
          <View className="bg-error/10 border border-error rounded-lg mx-4 mb-3 p-3">
            <Text className="text-sm text-error">{state.error}</Text>
          </View>
        )}

        {/* Loading Indicator */}
        {state.isLoading && (
          <View className="items-center py-3">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}

        {/* Input Area */}
        <View className="border-t border-border bg-background px-4 py-3 gap-2">
          <View className="flex-row items-end gap-2">
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Type your message..."
              placeholderTextColor={colors.muted}
              multiline
              maxLength={500}
              editable={!state.isLoading}
              className="flex-1 bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
              style={{
                maxHeight: 100,
              }}
            />
            <Pressable
              onPress={handleSend}
              disabled={!inputValue.trim() || state.isLoading}
              className={cn(
                "w-10 h-10 rounded-lg items-center justify-center",
                inputValue.trim() && !state.isLoading
                  ? "bg-primary"
                  : "bg-muted/30"
              )}
              style={({ pressed }) => [
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text className="text-lg text-background font-bold">→</Text>
            </Pressable>
          </View>
          <Text className="text-xs text-muted text-right">
            {inputValue.length}/500
          </Text>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
