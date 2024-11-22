import { View, Text, StyleSheet } from "react-native";

export type Message = {
  messageContain: string;
  backgroundColor: string;
  position: string;
  sender: "user" | "bot";
};

const ChatMessage = (message: Message) => {
  return (
    <View
      style={[
        { backgroundColor: message.sender==="bot"?"white": "#C285D7", alignSelf: message.sender ==="bot" ? "flex-start":"flex-end"}, 
        message.sender=="bot"? styles.messageContainer: styles.botMessageContainer
        
      ]}
    >
      <Text style={styles.messageBody}>{message.messageContain}</Text>
      <View style={message.sender === "user"? styles.triangle_bot: styles.triangle_user}></View>
    </View>
  );
};

export default ChatMessage;

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "70%",
    flexDirection: "row",
    marginVertical: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    position: "relative",
    marginHorizontal: 10,
  },
  botMessageContainer:{
    maxWidth: "70%",
    flexDirection: "row",
    marginVertical: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    position: "relative",
    marginHorizontal: 10,
  },
  messageBody: {
    flexDirection: "row",
    padding: 10,
    color:"#606060"
  },
  triangle_user: {
    position: "absolute",
    bottom: 0,
    left: -10,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: "transparent",
    borderRightWidth: 10,
    borderRightColor: "white",
  },

  triangle_bot:{ 
    position: "absolute",
    bottom: 0,
    right:-10,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: "transparent",
    borderLeftWidth: 10,
    borderLeftColor: "#C285D7",
  }
});
