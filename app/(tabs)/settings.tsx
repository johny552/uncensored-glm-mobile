import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useChat } from "@/lib/chat-context";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";

export default function SettingsScreen() {
  const { state, setApiKey, setApiEndpoint, clearMessages } = useChat();
  const [localApiKey, setLocalApiKey] = useState(state.apiKey);
  const [localEndpoint, setLocalEndpoint] = useState(state.apiEndpoint);
  const [isSaving, setIsSaving] = useState(false);
  const colors = useColors();

  useEffect(() => {
    setLocalApiKey(state.apiKey);
    setLocalEndpoint(state.apiEndpoint);
  }, [state.apiKey, state.apiEndpoint]);

  const handleSaveSettings = async () => {
    if (!localApiKey.trim()) {
      Alert.alert("Error", "API key cannot be empty");
      return;
    }

    if (!localEndpoint.trim()) {
      Alert.alert("Error", "API endpoint cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      setApiKey(localApiKey.trim());
      setApiEndpoint(localEndpoint.trim());
      Alert.alert("Success", "Settings saved successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear Chat History",
      "Are you sure you want to delete all messages? This cannot be undone.",
      [
        { text: "Cancel", onPress: () => {}, style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            clearMessages();
            Alert.alert("Success", "Chat history cleared");
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ScreenContainer className="flex-1" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="border-b border-border py-3 px-4">
        <Text className="text-xl font-bold text-foreground">Settings</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ gap: 24 }}>
        {/* API Configuration Section */}
        <View className="gap-4">
          <Text className="text-lg font-semibold text-foreground">
            API Configuration
          </Text>

          {/* API Key Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">
              GLM-4 API Key
            </Text>
            <TextInput
              value={localApiKey}
              onChangeText={setLocalApiKey}
              placeholder="Enter your API key"
              placeholderTextColor={colors.muted}
              secureTextEntry
              editable={!isSaving}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
            />
            <Text className="text-xs text-muted">
              Get your API key from{" "}
              <Text className="text-primary font-semibold">
                open.bigmodel.cn
              </Text>
            </Text>
          </View>

          {/* Endpoint Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">
              API Endpoint
            </Text>
            <TextInput
              value={localEndpoint}
              onChangeText={setLocalEndpoint}
              placeholder="https://open.bigmodel.cn/api/paas/v4/chat/completions"
              placeholderTextColor={colors.muted}
              editable={!isSaving}
              className="bg-surface border border-border rounded-lg px-3 py-2 text-foreground"
            />
          </View>

          {/* Save Button */}
          <Pressable
            onPress={handleSaveSettings}
            disabled={isSaving}
            className={cn(
              "rounded-lg py-3 items-center justify-center",
              isSaving ? "bg-muted/30" : "bg-primary"
            )}
            style={({ pressed }) => [
              pressed && !isSaving && { opacity: 0.9 },
            ]}
          >
            {isSaving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-semibold text-background">
                Save Settings
              </Text>
            )}
          </Pressable>
        </View>

        {/* Data Management Section */}
        <View className="gap-4">
          <Text className="text-lg font-semibold text-foreground">
            Data Management
          </Text>

          {/* Clear History Button */}
          <Pressable
            onPress={handleClearHistory}
            className="rounded-lg py-3 items-center justify-center bg-error/10 border border-error"
            style={({ pressed }) => [pressed && { opacity: 0.8 }]}
          >
            <Text className="text-base font-semibold text-error">
              Clear Chat History
            </Text>
          </Pressable>
        </View>

        {/* Info Section */}
        <View className="gap-4">
          <Text className="text-lg font-semibold text-foreground">
            About
          </Text>

          <View className="bg-surface rounded-lg p-4 gap-3">
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">App Version</Text>
              <Text className="text-sm font-semibold text-foreground">
                1.0.0
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Model</Text>
              <Text className="text-sm font-semibold text-foreground">
                GLM-4
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Provider</Text>
              <Text className="text-sm font-semibold text-foreground">
                Zhipu AI
              </Text>
            </View>
          </View>

          <Text className="text-xs text-muted text-center">
            This app connects to GLM-4 API for AI responses.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
