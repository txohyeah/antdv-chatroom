-- This lua file is for the web to send and refresh message.
-- You can run this file manually, also you can run it with the Button "Register & Loading Lua"

Colors = {
    red = "\27[31m",
    green = "\27[32m",
    blue = "\27[34m",
    reset = "\27[0m",
    gray = "\27[90m"
}

BoxMaxLength = 100
ChatMessageBox = ChatMessageBox or {}

Getting_Started = "6I1JBBc9SOMtqFxlX7OoYgsMh7QeZk2fFwUCHTUqshg"

ao.send({ Target = Getting_Started, Action = "Register", Nickname = ao.id })

local function insertInbox(msg)
    table.insert(ChatMessageBox, msg)
    if #ChatMessageBox > BoxMaxLength then
      local overflow = #ChatMessageBox - BoxMaxLength 
      for i = 1,overflow do
        table.remove(ChatMessageBox, 1)
      end
    end 
end


Handlers.add(
    "UI_CHAT_SAY",
    Handlers.utils.hasMatchingTag("Action", "SAY"),
    function (msg)
        ao.send({ Target = Getting_Started, Action = "Broadcast", Data = msg.Data })
        print("You Broadcast " .. Colors.blue .. msg.Data .. Colors.reset .. " to Getting_Started Chatroom")
    end
)

-- This handler will override the handler which load from blueprint.
-- If you want to use the blueprint handler, you can reload blueprint.
Handlers.add(
    "DevChat-Broadcasted",
    function (msg)
        return msg.Action == "Broadcasted" and msg.From == Getting_Started
    end,
    function (msg)
        local broadcastedMessage = {}
        broadcastedMessage["content"] = msg.Data
        broadcastedMessage["sender"] = msg.Broadcaster

        local type = "outgoing"
        if msg.Broadcaster == ao.id 
        then 
            type = "outgoing"
        else 
            type = "incoming"
        end
        broadcastedMessage["type"] = type
        insertInbox(broadcastedMessage)

        print(
            Colors.gray .. "[Received confirmation of your broadcast in "
            .. Colors.blue .. "Getting-Started" .. Colors.gray .. ".]"
            .. Colors.reset)
    end
)

Handlers.add(
    "GetChatMessage",
    function (msg)
        return msg.Action == "GetChatMessage"
    end,
    function (msg)
        local json = require("json")
        local ChatMessages = json.encode({
            ChatMessageBox = ChatMessageBox,
        })
        ao.send({
            Target = msg.From,
            Action = "ChatMessage",
            Data = ChatMessages
        })
    end
)