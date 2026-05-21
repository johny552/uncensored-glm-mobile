# GLM-4 AI Assistant Mobile App - Design Plan

## Overview
A minimalist Android mobile app that provides quick access to a GLM-4 AI assistant via a hardware trigger (triple-press volume down button). The app focuses on a clean chat interface with minimal friction between user and AI.

## Screen List

1. **Chat Screen** (Primary)
   - Main conversation interface
   - Message list with user/AI messages
   - Text input field with send button
   - Loading indicators during API calls
   - Option to clear conversation history

2. **Settings Screen** (Secondary)
   - API Key configuration (GLM-4)
   - API endpoint URL configuration
   - Clear chat history option
   - About / version info
   - Enable/disable volume button trigger

## Primary Content and Functionality

### Chat Screen
- **Message Display**: Scrollable list of messages with distinct styling for user (right-aligned, blue) and AI (left-aligned, gray)
- **Input Field**: Text input with send button, character limit display
- **Loading State**: Spinner or skeleton while waiting for AI response
- **Error Handling**: Display error messages if API call fails
- **Quick Actions**: Buttons for common actions (new chat, copy response, share)

### Settings Screen
- **API Configuration**: Text inputs for GLM-4 API key and endpoint
- **Preferences**: Toggle for volume button trigger, theme selection
- **Data Management**: Button to clear all chat history
- **Info**: App version and build info

## Key User Flows

### Primary Flow: Ask AI a Question
1. User triple-presses volume down → App opens from background
2. Chat screen appears with keyboard focused on input field
3. User types question and taps send
4. Message appears in chat with timestamp
5. Loading indicator shows while AI processes
6. AI response appears in chat
7. User can continue conversation or press volume button again to minimize

### Secondary Flow: Configure API
1. User opens Settings (from chat screen menu)
2. User enters GLM-4 API key and endpoint
3. User saves configuration
4. Settings screen closes, returns to chat
5. Chat now uses configured API for requests

### Tertiary Flow: Clear Chat History
1. User opens Settings
2. User taps "Clear History"
3. Confirmation dialog appears
4. User confirms deletion
5. Chat history is cleared, returns to empty chat screen

## Color Choices

| Element | Color | Usage |
|---------|-------|-------|
| **Primary** | `#0a7ea4` (Teal) | Send button, links, highlights |
| **Background** | `#ffffff` (Light) / `#151718` (Dark) | Screen background |
| **Surface** | `#f5f5f5` (Light) / `#1e2022` (Dark) | Message bubbles, cards |
| **Foreground** | `#11181C` (Light) / `#ECEDEE` (Dark) | Primary text |
| **Muted** | `#687076` (Light) / `#9BA1A6` (Dark) | Secondary text, timestamps |
| **User Message** | `#0a7ea4` (Teal) | User message bubble background |
| **AI Message** | `#e8e8e8` (Light) / `#2a2a2a` (Dark) | AI message bubble background |
| **Error** | `#EF4444` | Error messages, warnings |

## Hardware Integration

### Volume Button Triple-Press Trigger
- Requires Android Accessibility Service or native module integration
- When triggered, app launches or brings to foreground
- Chat screen opens with keyboard ready for input
- If app is already open, volume button press is ignored (normal volume control)

## Technical Considerations

- **API Integration**: Direct HTTP calls to GLM-4 API with user-provided credentials
- **State Management**: React Context for chat history and settings
- **Local Storage**: AsyncStorage for API key (encrypted), chat history, user preferences
- **Error Handling**: Graceful fallbacks for network errors, invalid API keys, rate limiting
- **Performance**: Lazy load chat history, optimize message rendering for large conversations
