<template>
  <div id="app">
    <a-layout>
      <a-layout-header>
        <ChatReg />
      </a-layout-header>
      <a-layout-content style="padding: 24px;">
        <ChatRoom />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import ChatRoom from './components/ChatRoom.vue';
import ChatReg from './components/ChatReg.vue';

export default {
  components: {
    ChatRoom,
    ChatReg,
  },
};
</script>