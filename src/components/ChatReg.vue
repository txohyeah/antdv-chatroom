<template>
    <div>
        <a-row type="flex" justify="end">
            <a-col :span="1">
                <a href="https://github.com/txohyeah/antdv-chatroom" target="_blank">
                    <img style="background-color: white;" src="@/assets/github.png" />
                </a>
            </a-col>
            <a-col :span="3">
                <a-button v-if="!loginId" class="a-button" type="primary" @click="arconnect">ArConnect</a-button>
                <a-tooltip placement="topLeft" title="Disconnect from wallet">
                    <a-button v-if="loginId" class="a-button" @click="disconnect">{{ loginIdShow }}</a-button>
                </a-tooltip>
            </a-col>
            <a-col v-if="loginId" :span="3">
                <a-button class="a-button" @click="regChatroom">Join Getting-Started Room</a-button>
            </a-col>
        </a-row>
    </div>
    <a-modal v-model:open="open" title="Join Getting-Started Room">
        <template #footer>
            <a-button key="registerBtn" type="primary" :loading="loading" @click="register">Register & Loading Lua</a-button>
        </template>
        <h2>Choose process to join the Chat room:</h2>
        <a-select
            v-model:value="selectedProcess"
            style="width: 220px"
            :options="processOptions"
            @change="changeProcess"
            >
        </a-select>
    </a-modal>
</template>

<script>
import { LUA_CHAT_SAY } from '@/utils/constants';
import { getShortId, getProcessList, evaluate } from "../utils/utils"

export default {
    data() {
        return {
            open: false,
            processOptions: [],
            selectedProcess: '',
            loading: false
        }
    },
    computed: {
        isLoggedIn() {
            return this.$store.getters.isLoggedIn;
        },
        loginId() {
            return this.$store.getters.loginId;
        },
        loginIdShow() {
            return getShortId(this.loginId);
        }
    },
    methods: {
        arconnect() {
            this.$store.dispatch('login').then(async () => {
                let processList = await getProcessList(this.loginId)
                this.processOptions = processList.map(id => ({ label: getShortId(id), value: id }))
            });
        },
        disconnect() {
            this.$store.dispatch('logout');
        },
        async regChatroom() {
            if(!this.isLoggedIn) {
                alert("Please connect to arconnect first.")
                return
            }
            
            if (!this.processOptions.length) {
                let processList = await getProcessList(this.loginId)
                this.processOptions = processList.map(id => ({ label: getShortId(id), value: id }))
            }
            this.open = true
        },
        changeProcess(value) {
            this.selectedProcess = value
            this.$store.dispatch('switchProcess', value)
        },
        async register() {
            this.loading = true
            let msgId = await evaluate(this.selectedProcess, LUA_CHAT_SAY)
            if(msgId) {
                this.open = false
            } else {
                alert("Failed to register. Please try again few minutes later.")
            }
            this.loading = false
        }
    }
}


</script>