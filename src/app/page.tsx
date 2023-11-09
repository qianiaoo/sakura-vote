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
  Card, Box, CardHeader, CardBody, StackDivider,
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

type User = {
  name: string;
  roomId: string;
  cosplay: string;
  youtube: string;
  id: string;
};

export default function Home() {
  const [me, setMe] = useState<User>({
    id: "",
    name: "",
    roomId: "",
    cosplay: "",
    youtube: "",
  });
  const [users, setUsers] = useState<User[]>([]);
  const [isDisplayYoutube, setIsDisplayYoutube] = useState(false);
  const toast = useToast();

  const addItem = async () => {
    console.log("addItem");
    if (!me.name && !me.roomId) {
      // setItems([...items, newItem]);
      console.log(db, "db");
      await addDoc(collection(db, "users"), {
        name: me.name.trim(),
        price: me.roomId.trim(),
        cosplay: me.cosplay.trim(),
        request: me.youtube.trim(),
      })
        .then((docRef) => {
          toast({
            title: "登録成功",
            description: "ありがとうございました！",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
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

  // Read users from database
  useEffect(() => {
    const q = query(collection(db, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let userArr: User[] = [];

      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        userArr.push({
          ...doc.data(),
          id: doc.id,
        } as User);
      });
      setUsers(userArr);

      return () => unsubscribe();
    });
  }, []);

  return (
    <main>
      <Stack p={8} gap={5}>
        <Heading>🌸🎃 </Heading>
        <Heading as="h2" size="md">
          こんばんは！
        </Heading>
        <Stack>
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
          <Text mt={10} fontSize="sm">
            アピールタイムにもしBGMが必要であればここにYoutubeのLinkを入れてください。
            <br />
            If you need BGM during the appeal time, please insert a YouTube link
            here.
          </Text>
          <Button
            colorScheme="red"
            onClick={() => setIsDisplayYoutube(!isDisplayYoutube)}
          >
            {!isDisplayYoutube ? "I NEED BGM" : "I DON'T NEED BGM"}
          </Button>
          {isDisplayYoutube && (
            <Input
              placeholder="非必須/Optional：Youtube Link"
              variant="flushed"
              onChange={(e) => setMe({ ...me, cosplay: e.target.value })}
            />
          )}
        </Stack>
        <Button onClick={addItem} colorScheme="whatsapp">
          書き終わった！
        </Button>
      </Stack>
      {/*  display users list by chakra UI 's card */}
      <Stack p={8} gap={5}>
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <Heading size="md">Client Report</Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Summary
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    View a summary of all your clients over the last month.
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Overview
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    Check out the overview of your clients.
                  </Text>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Analysis
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    See a detailed analysis of all your business clients.
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </main>
  );
}
