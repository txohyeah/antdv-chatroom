<template>
  <a-spin :spinning="spinning">
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
        <a-space wrap>
          <a-button class="a-button" type="primary" @click="sendMessage">Send</a-button>
          <a-button class="a-button" @click="clickRefresh">Refresh</a-button>
        </a-space>
      </div>
    </div>
  </a-spin>
</template>
  
  <script>
  import { WELCOME  } from '@/utils/constants';
  import { send, dryrunSafe } from '@/utils/utils';
  import { message } from 'ant-design-vue';

  export default {
    data() {
      return {
        inputValue: '',
        messages: [
            { sender: "Welcome", content: WELCOME, type: "incoming" },
        ],
        spinning: false
      };
    },
    computed: {
      getSelectedProcessId() {
        return this.$store.getters.processId
      }
    },
    mounted() {
      this.startPolling();
    },
    beforeUnmount() {
      this.stopPolling();
    },
    methods: {
      startPolling() {
        this.pollingInterval = setInterval(this.refreshMessage, 10000);
      },
      stopPolling() {
        clearInterval(this.pollingInterval);
      },
      async sendMessage() {
        if (this.inputValue.trim()) {
          send(
            this.getSelectedProcessId,
            {
              Action: "SAY",
            },
            this.inputValue
          ) 
          this.messages.push({ sender: this.getSelectedProcessId, content: this.inputValue, type: "outgoing" })
          this.inputValue = '';
        } else {
            alert("Please input something.")
        }
      },
      clickRefresh() {
        message.success('Refreshing...');
        this.refreshMessage()
      },
      async refreshMessage() {
        let results = await dryrunSafe(
          this.getSelectedProcessId, 
          { Action: "GetChatMessage" }
        );

        if (!results) {
          this.spinning = false;
          alert("Send message failed. Please try again few minutes later.")
          return;
        }

        if (results.error) {
          alert(results.error)
          return
        }
        
        let data = results.Messages[0].Data
        let dataObj = JSON.parse(data);
        
        this.messages = [
            { sender: "Welcome", content: WELCOME, type: "incoming" },
        ]
        this.messages.push(...dataObj.ChatMessageBox)
      }
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