"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/app/firebase";
import { User } from "@/app/page";
import {
  Box,
  Button,
  Center,
  Heading,
  Link,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
} from "@chakra-ui/react";

const ShowPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [cursor, setCursor] = useState(0);

  function getRandomColorPair(): [string, string] {
    // 生成随机的色相值
    const hue = Math.floor(Math.random() * 360);

    // 为背景和文本选择不同的亮度值以确保对比度
    // 背景亮度
    const backgroundLightness = Math.floor(Math.random() * 50 + 25); // 25% 到 75%
    // 文本亮度，确保与背景形成对比
    const textLightness = backgroundLightness > 50 ? 20 : 80;

    // 返回 HSL 格式的颜色
    const backgroundColor = `hsl(${hue}, 60%, ${backgroundLightness}%)`;
    const textColor = `hsl(${hue}, 60%, ${textLightness}%)`;

    return [backgroundColor, textColor];
  }

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let userArr: User[] = [];

      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        userArr.push({
          name: doc.data().name || "",
          roomId: doc.data().roomId || "",
          cosplay: doc.data().cosplay || "",
          youtube: doc.data().youtube,
          introduction: doc.data().introduction,
          id: doc.id,
        } as User);
      });
      setUsers(userArr);

      return () => unsubscribe();
    });
  }, []);

  return (
    <Center
      h="100%"
      bgImage="bg.png"
      backgroundPosition="center"
      bgRepeat="repeat"
      bgSize="contain"
    >
      <VStack bg="white" p={20} boxShadow="inner" shadow="10px" rounded="md">
        <Box>
          {users.length > 0 && users[cursor] !== undefined && (
            <VStack>
              <Heading size="4xl">{users[cursor].cosplay}</Heading>
              <Heading size="2xl">{users[cursor].name}</Heading>
              <Heading size="xl">{users[cursor].roomId}</Heading>
              <Heading size="md" maxW="300px">
                {users[cursor].introduction}
              </Heading>
              {users[cursor].youtube && (
                <Link href={users[cursor].youtube} isExternal>
                  BGM
                </Link>
              )}
              <Button
                onClick={() => setCursor((prevState) => prevState + 1)}
                as="button"
              >
                NEXT
              </Button>
              <Heading size="xs">{cursor + 1}人目</Heading>
            </VStack>
          )}
          {users.length > 0 && users[cursor] === undefined && (
            <Box>
              <Heading size="4xl">おわり!🎃</Heading>
            </Box>
          )}
        </Box>

        <Slider
          aria-label="slider-ex-1"
          max={users.length}
          colorScheme="orange"
          value={cursor}
          onChange={(e) => setCursor(e)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </VStack>
    </Center>
  );
};

export default ShowPage;
