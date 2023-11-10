"use client";
import {
  Button,
  Flex,
  Heading,
  Input,
  Spacer,
  Stack,
  useToast,
  Text,
  VStack,
  Card,
  Box,
  CardHeader,
  CardBody,
  StackDivider,
  Textarea,
  Grid,
  SimpleGrid,
  AccordionButton,
  Accordion,
} from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDoc,
  QuerySnapshot,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";
import { useRouter } from "next/navigation";
import UserList from "@/compoents/UserList";

export type User = {
  name: string;
  roomId: string;
  cosplay: string;
  youtube: string;
  id: string;
  introduction: string;
};

export default function Home() {
  const [me, setMe] = useState<User>({
    id: "",
    name: "",
    roomId: "",
    cosplay: "",
    introduction: "",
    youtube: "",
  });
  const [isDisplayYoutube, setIsDisplayYoutube] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const addItem = async () => {
    console.log("addItem");
    console.log(!me.name && !me.roomId, "me", me);
    if (!!me.name && !!me.roomId) {
      // setItems([...items, newItem]);
      console.log(db, "db");
      await addDoc(collection(db, "users"), {
        name: me.name.trim(),
        cosplay: me.cosplay.trim(),
        roomId: me.roomId.trim(),
        introduction: me.introduction.trim(),
        youtube: me.youtube.trim(),
      })
        .then((docRef) => {
          toast({
            title: "登録成功",
            description: "ありがとうございました！",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          router.refresh();
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          toast({
            title: "登録失敗",
            description: "もう一度やり直してください",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          console.error("Error adding document: ", error);
        });
    }
  };

  return (
    <main>
      <Stack p={8} gap={5}>
        <Heading>🌸🎃 </Heading>
        <Heading as="h2" size="md">
          こんばんは！
        </Heading>
        <Stack>
          {me.introduction}
          <Input
            placeholder="部屋番号 / Room Id"
            onChange={(event) => setMe({ ...me, roomId: event.target.value })}
          />
          <Input
            placeholder="名前 / Name"
            onChange={(e) => setMe({ ...me, name: e.target.value })}
          />
          <Input
            placeholder="コスプレ / Cosplay"
            onChange={(e) => setMe({ ...me, cosplay: e.target.value })}
          />
          <Textarea
            onChange={(e) => setMe({ ...me, introduction: e.target.value })}
            placeholder="一言 / One word"
            size="sm"
          />
          <Button
            colorScheme="red"
            onClick={() => setIsDisplayYoutube((prevState) => !prevState)}
          >
            {!isDisplayYoutube ? "I NEED BGM" : "I DON'T NEED BGM"}
          </Button>

          {isDisplayYoutube && (
            <>
              <Text mt={10} fontSize="sm" border="1px" rounded="10px" p="2">
                アピールタイムにもしBGMが必要であればここにYoutubeのLinkを入れてください。
                <br />
                If you need BGM during the appeal time, please insert a YouTube
                link here.
              </Text>
              <Input
                placeholder="非必須/Optional：Youtube Link"
                variant="filled"
                onChange={(e) => setMe({ ...me, youtube: e.target.value })}
              />
            </>
          )}
        </Stack>
        <Button onClick={addItem} colorScheme="whatsapp">
          書き終わった！
        </Button>
      </Stack>
      {/*  display users list by chakra UI 's card */}
      <UserList />
    </main>
  );
}
