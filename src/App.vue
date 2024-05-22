<template>
  <div id="app">
    <a-layout>
      <a-layout-content style="padding: 24px;">
        <ChatRoom />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import ChatRoom from './components/ChatRoom.vue';

export default {
  components: {
    ChatRoom,
  },
};
</script>