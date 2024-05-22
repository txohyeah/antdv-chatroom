<template>
    <div class="chat-room">
      <div class="message-list" ref="messageList">
        <div 
          v-for="(msg, index) in messages" 
          :key="index" 
          :class="`message ${msg.type}`"
        >
          <div v-if="msg.type === 'outgoing'" class="outgoing-message">
            <span class="sender">{{ msg.sender }}:</span>
            <p class="content">{{ msg.content }}</p>
          </div>
          <div v-else class="incoming-message">
            <span class="sender">{{ msg.sender }}:</span>
            <p class="content">{{ msg.content }}</p>
          </div>
        </div>
      </div>
      <a-input v-model:value="inputValue" placeholder="Please input message..." />
      <div class="send-button-container">
        <a-button class="a-button" type="primary" @click="sendMessage">Send</a-button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        sender: 'txohyeah',
        inputValue: '',
        messages: [
            { sender: "txohyeah", content: "Hi, Tony.", type: "outgoing" },
            { sender: "Tony", content: "Hi, txohyeah. Nice to meet you.", type: "incoming" }
        ]
      };
    },
    methods: {
      sendMessage() {
        if (this.inputValue.trim()) {
          this.messages.push({ content: this.inputValue, type: 'outgoing', sender: this.sender });
          this.inputValue = '';
        } else {
            alert("Please input something.")
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .message-list {
    height: 500px;
    overflow-y: auto;
  }
  
  .message {
    margin-bottom: 10px;
    display: flex;
  }
  
  .sender {
    font-weight: bold;
    display: block;
  }
  
  .outgoing-message {
    align-self: flex-end;
    background-color: #DCF8C6;
    border-radius: 5px;
    padding: 10px;
    margin-left: auto;
  }
  
  .incoming-message {
    align-self: flex-start;
    background-color: #E0E0E0;
    border-radius: 5px;
    padding: 10px;
  }
  
  .outgoing-message .sender,
  .incoming-message .sender {
    margin-bottom: 5px;
  }
  
  .content {
    white-space: pre-wrap;
  }

  .a-button {
    width: 220px;
  }

  .send-button-container {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
  }
  </style>