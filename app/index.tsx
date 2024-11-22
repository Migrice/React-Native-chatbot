import { Stack } from "expo-router";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import * as zod from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Feather from "@expo/vector-icons/Feather";
import ChatMessage from "@/components/chat";
import axios from "axios";

const chatSchema = zod.object({
  message: zod.string(),
});

interface MessageInterface {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function Index() {
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" });
  const [userMessage, setUserMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageInterface[]>([]);

  const { control, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      message: "",
    },
  });
  const sendMessage = async(data: zod.infer<typeof chatSchema>) => {
    console.log(data);
    if (data.message.trim()) {
      const newMessage: MessageInterface = {
        id: messages.length + 1,
        text: data.message,
        sender: "user",
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      reset();

      try {
        const response = await axios.post(
          "http://192.168.100.37:3000/webhook",
          {
            message: data.message,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("response", response.data["response"]);
        setTimeout(() => {
          const botMessage: MessageInterface = {
            id: messages.length + 2,
            text: response.data["response"] ,
            sender: "bot",
          };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        });
      } catch (error) {
        console.log("error", error);
      }

      
    }
    
  };

  return (
    <View style={styles.container}>
    
    <View style={styles.header}>

	<View style={styles.headerContainer}>
          <View style={styles.back}>
            <FontAwesome6
              name="angle-left"
              size={15}
              color="white"
              style={{ padding: 10 }}
            />
          </View>

          <Text style={styles.title}>Chat with Migrice's BOT</Text>
          <View>
            <FontAwesome name="ellipsis-v" size={24} color="black" />
          </View>
        </View>
        <Text style={styles.date}>
          {today.charAt(0).toUpperCase() + today.slice(1)}
        </Text>
        </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ title: "Chatbot", headerShown: false }} />
        <StatusBar
          backgroundColor="#F5E5FE"
          barStyle="dark-content"
          networkActivityIndicatorVisible={false}
        />

        
        <View style={{ marginTop: 30 }}>
          {messages && (
            <FlatList
              data={messages}
              showsHorizontalScrollIndicator={true}
              renderItem={({ item }) => (
                <ChatMessage
                  messageContain={item.text}
                  sender={item.sender}
                  backgroundColor="white"
                  position="flex-start"
                />
              )}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.chatMessage}>
        <Controller
          control={control}
          name="message"
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <TextInput
              placeholder="Type your message"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholderTextColor="#aaa"
              style={styles.input}
              multiline={true}
              scrollEnabled={true}
            />
          )}
        />
        <TouchableOpacity
          onPress={handleSubmit(sendMessage)}
          disabled={formState.isSubmitting}
          style={styles.sendButton}
        >
          <Feather
            name="navigation"
            style={{ padding: 8 }}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5E5FE",
    paddingHorizontal: 15,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    alignItems: "center",
    
  },
  header:{
  borderBottomWidth: 1,
  borderBottomColor: "white"
  },
  back: {
    backgroundColor: "#C285D7",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
  },
  date: {
    textAlign: "center",
  },
  chatMessage: {
    marginTop: 20,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "85%",
  },
  sendButton: {
    backgroundColor: "#C285D7",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
});
