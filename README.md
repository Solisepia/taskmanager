# Task-Notes Manage System

## Overview

This program is a task and notes management system that integrates task management, note management, calendar view, and a simple chat feature. Users can add, edit, delete, and filter tasks and notes, and view tasks in a calendar. They can also interact with an API (such as OpenAI's GPT) through a simple chat interface.

## Features Description

### 1. Task Management

- **Add Task**: Users can click the "+ Add" button to open a modal window, enter the task title, tags, priority, due date, and description, and then save the task.
- **Edit Task**: Click on a row in the task list to open a modal window for editing the task.
- **Delete Task**: In the task list, click the "Delete" button to remove the corresponding task.
- **Task Filtering**: Click the "Filter" button to filter tasks by priority, date range, and tags.
- **Task Sorting**: Click the task table header to sort tasks by title, tags, priority, date, and description.

### 2. Notes Management

- **Add Note**: Users can click the "+ Add" button in the notes view, enter the note title, tags, and content, and then save the note.
- **Edit Note**: Click on a row in the note list to open a modal window for editing the note.
- **Delete Note**: In the note list, click the "Delete" button to remove the corresponding note.
- **Note Filtering**: Click the "Filter" button to filter notes by tags.

### 3. Calendar View

- **View Calendar**: Click the "Calendar" button to view the calendar for the current month, displaying task dates.
- **Switch Month**: Users can view the previous or next month's calendar using the "Last Month" and "Next Month" buttons.

### 4. Chat Feature

- **Send Message**: Users can enter a message in the chat input box and press enter to send it, with the message displayed in the chat box.
- **Get Reply**: The program uses a stored API Key to call the API and display the bot's reply.
- **Clear Chat**: Click the "Clear Chat" button to clear the chat history.
- **Save API Key**: Users can enter and save an API Key to interact with the API.

## Instructions

1. **Initialization**: When the program is first opened, it loads tasks and notes from local storage and displays the current time and date.
2. **Switch Views**: Use the buttons in the left navigation bar to switch between task, note, and calendar views.
3. **Manage Tasks and Notes**: Use the buttons and features in the respective views to manage tasks and notes.
4. **Interact with Chatbot**: Enter messages in the chat input box to interact with the chatbot.

## Technical Details

- **Frontend Framework**: Built using HTML, CSS, and JavaScript.
- **Local Storage**: Task and note data are stored in the browser's LocalStorage.
- **API Integration**: Communicates with OpenAI's GPT via the fetch API (requires a valid API Key).

## Notes

- Ensure a valid API Key is entered and saved before using the chat feature.
- The program runs on modern browsers; it is recommended to use the latest version for the best experience.