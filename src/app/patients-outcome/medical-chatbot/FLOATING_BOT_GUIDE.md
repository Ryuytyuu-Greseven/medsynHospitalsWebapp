# Floating Medical AI Bot - User Guide

## 🤖 Overview

The Medical AI Bot is now a **floating assistant** that stays at the bottom-right corner of the patient detail page. Doctors can click the robot icon to open the chat window and minimize it when done - similar to modern chat widgets!

---

## 🎯 How It Works

### **Minimized State (Default)**
When you first visit a patient page, you'll see:

```
┌─────────────────┐
│                 │
│     Bottom      │
│     Right ──►   │  [🤖]  ← Small floating robot
│                 │         "Ask AI"
└─────────────────┘
```

- **Small robot icon** (70px circle) with "Ask AI" label
- **Floating animation** - gently bobs up and down
- **Pulsing ring** effect around the icon
- **Red badge** appears when there are unread messages

---

### **Maximized State (When Clicked)**
Click the robot to open the chat window:

```
┌─────────────────────────────────────┐
│ 🤖 AI Medical Assistant        [-][×]│
│ Patient Name • Online               │
├─────────────────────────────────────┤
│ [📅 History] [💊 Meds] [⚠️ Risks]   │
├─────────────────────────────────────┤
│                                     │
│  🤖 Hello! How can I help?         │
│                                     │
│                    What meds? 👤   │
│                                     │
│  🤖 Current Medications:            │
│     1. Metformin 500mg...          │
│                                     │
├─────────────────────────────────────┤
│ [📎] [Type your message...    ] [🚀]│
└─────────────────────────────────────┘
```

- **420px wide × 600px tall** chat window
- Slides up from bottom with smooth animation
- All chat features available

---

## 📍 Location

**Fixed Position:**
- Bottom: 24px from bottom edge
- Right: 24px from right edge
- Always visible (doesn't scroll with page)

**On Mobile:**
- Bottom: 16px
- Right: 16px
- Expands to nearly full screen

---

## 🎨 Visual Features

### **Minimized Robot Button**

**Design:**
- Circular teal gradient button
- White robot AI icon
- "Ask AI" label below
- Pulsing animation ring
- Floating up/down motion

**States:**
- **Normal**: Gentle float animation
- **Hover**: Lifts up slightly, shadow increases
- **With Unread**: Red badge with pulse in top-right

**Colors:**
- Background: Teal to dark teal gradient (#14B8A6 to #0D9488)
- Icon: White
- Shadow: Teal with transparency
- Badge: Red (#EF4444)

### **Expanded Chat Window**

**Header:**
- Teal gradient background
- Robot icon in green square
- Patient name and online status
- Action buttons: Download, Clear, Minimize

**Quick Actions:**
- 4 pill-shaped buttons
- Icons with labels
- Teal border, white background
- Hover: Inverts to teal background

**Messages:**
- Bot messages: White bubbles, left side
- User messages: Teal bubbles, right side
- Avatars for both (robot and doctor)
- Timestamps below each message

**Input Area:**
- Rounded input box
- Attach button (📎)
- Send button with gradient
- File preview area above

---

## 🚀 Using the Bot

### **Step 1: Open the Chat**
```
Click the floating robot icon at bottom-right
↓
Chat window slides up smoothly
```

### **Step 2: Ask Questions**

**Quick Actions (Fastest):**
Click any quick action button:
- 📅 **History** - Medical timeline
- 💊 **Meds** - Current medications  
- ⚠️ **Risks** - Risk assessment
- 💡 **Actions** - Recommendations

**Type Your Question:**
1. Click in the input box
2. Type your question
3. Press Enter or click send button

**Upload Files:**
1. Click 📎 (paperclip) icon
2. Select files from your computer
3. Add a message (optional)
4. Click send

### **Step 3: Read Responses**
- Bot replies appear instantly
- Auto-scrolls to latest message
- Can scroll up to see history

### **Step 4: Minimize When Done**
Click the ⌄ (down arrow) in header to minimize
- Chat history is preserved
- Can reopen anytime
- Unread badge shows if bot responded while minimized

---

## 💡 Features

### ✅ **Always Accessible**
- Present on every patient detail page
- No need to navigate to a tab
- Quick access from any section

### ✅ **Persistent Chat**
- Messages stay even when minimized
- Session-based history
- Scroll through previous conversation

### ✅ **Unread Notifications**
- Red badge appears when minimized
- Shows when bot has new messages
- Badge disappears when reopened

### ✅ **Smart Positioning**
- Doesn't block main content
- Fixed position (doesn't scroll)
- Responsive on all devices

### ✅ **Quick Actions**
- Pre-configured queries
- One-click information
- Faster than typing

### ✅ **File Support**
- Upload medical documents
- Progress indicators
- Preview before sending

### ✅ **Chat Management**
- Download transcript
- Clear conversation
- Minimize/maximize

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Send message |
| `Shift + Enter` | New line |
| `Esc` | Minimize chat (when input focused) |

---

## 📱 Mobile Experience

### **Phone/Tablet:**
- Robot button: 60px (slightly smaller)
- Chat window: Full width minus margins
- Height: Nearly full screen
- Touch-friendly buttons
- Swipe-scroll messages

### **Responsive Breakpoint:**
- Desktop: 420px × 600px
- Mobile (<768px): Full width × full height

---

## 🎯 Use Cases

### **During Patient Review:**
```
Doctor viewing patient timeline
↓
Quick question about medications
↓
Click robot → Ask "What medications?"
↓
Get instant answer
↓
Minimize and continue reviewing
```

### **While Writing Notes:**
```
Doctor writing consultation notes
↓
Need to check lab results
↓
Click robot → Ask "Latest lab results?"
↓
Copy information to notes
↓
Minimize bot
```

### **Quick Reference:**
```
Doctor needs risk assessment
↓
Click robot
↓
Click "⚠️ Risks" quick action
↓
Get instant AI risk analysis
↓
Minimize
```

---

## 🔄 State Management

### **Minimized:**
- Small robot visible
- Chat window hidden
- Floating animation active
- Badge visible if unread

### **Maximized:**
- Full chat window visible
- Robot button hidden
- All features accessible
- Badge cleared

### **Session Persistence:**
- Messages preserved during session
- Cleared on page refresh
- Can be manually cleared

---

## 🎨 Animation Details

### **Robot Button:**
- Float: 3 second loop, 8px vertical movement
- Pulse ring: 2 second expand and fade
- Hover lift: 4px up, 5% scale increase

### **Chat Window:**
- Slide up: 0.3s cubic-bezier easing
- 20px upward movement
- Opacity fade from 0 to 1

### **Messages:**
- Slide in: 0.2s ease-out
- 8px upward movement
- Staggered appearance

### **Badge:**
- Pulse: 2 second scale animation
- Expanding ring effect
- Smooth scale 1.0 to 1.1

---

## 💻 Technical Specs

### **Z-Index:**
- Container: 1000
- Always on top of page content
- Below modals (if any)

### **Performance:**
- Hardware-accelerated animations
- 60fps smooth scrolling
- Debounced typing indicators
- Efficient message rendering

### **Accessibility:**
- Keyboard navigation
- ARIA labels
- Focus management
- Screen reader compatible

---

## 🆘 Troubleshooting

### **Bot not visible?**
- Scroll to any part of the patient page
- Look at bottom-right corner
- Check if browser window is too small

### **Can't click the robot?**
- Make sure no modal is open
- Check if another element is overlapping
- Try refreshing the page

### **Chat window too small on mobile?**
- Rotate to portrait mode
- Close browser toolbars
- Try zooming out

### **Messages not sending?**
- Check input is not empty
- Wait for bot to finish responding
- Try refreshing if stuck

---

## 🌟 Tips & Tricks

### **1. Use Quick Actions First**
Fastest way to get common information - just one click!

### **2. Keep Chat Open While Reviewing**
Position your browser so chat doesn't block important info

### **3. Download Important Conversations**
Use download button to save medical discussion transcripts

### **4. Ask Follow-up Questions**
Bot remembers context during the session

### **5. Use for Quick References**
Perfect for checking meds, labs, or risks without leaving the page

---

## 📊 Comparison: Tab vs Floating

| Feature | Tab (Old) | Floating Bot (New) |
|---------|-----------|-------------------|
| Access | Navigate to tab | Click robot anytime |
| Visibility | Only in tab | Always accessible |
| Navigation | Switches page view | Overlays content |
| Workflow | Disruptive | Non-disruptive |
| Mobile UX | Good | Excellent |
| Discoverability | Hidden in tabs | Always visible |

---

## 🎉 Benefits

✅ **Non-Disruptive** - Doesn't require leaving current section
✅ **Quick Access** - Always one click away
✅ **Contextual** - Ask questions while viewing data
✅ **Familiar UX** - Works like popular chat widgets
✅ **Space Efficient** - Small when not needed, full-featured when needed
✅ **Always There** - No need to remember which tab it's in

---

**The floating bot brings AI assistance directly to your workflow, making patient data exploration faster and more intuitive!** 🚀

