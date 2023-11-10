"use client";
import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import UserPicker from "@/compoents/UserPicker";
import { User } from "@/app/page";
import { AiFillHeart } from "react-icons/ai";
import { GiMuscleUp, GiQueenCrown } from "react-icons/gi";
import { RiKnifeBloodLine } from "react-icons/ri";
import { FaFaceLaughSquint, FaUserGroup } from "react-icons/fa6";
import { GrGroup } from "react-icons/gr";
import { db } from "@/app/firebase";
import { addDoc, collection } from "firebase/firestore";

export type Question = {
  id: number;
  en: string;
  jp: string;
  icon: ReactElement;
  color: string;
};
const questionList: Question[] = [
  {
    id: 0,
    jp: "一番結婚したい人？",
    en: "Who do you want to marry?",
    // eslint-disable-next-line react/jsx-no-undef
    icon: <AiFillHeart />,
    color: "red",
  },
  {
    id: 1,
    jp: "地球滅亡しても生き残っていそうな人？",
    en: "Who is most likely to survive the end of the world?",
    icon: <GiMuscleUp />,
    color: "green",
  },
  {
    id: 2,
    jp: "一人で絶対に夜中に会いたくない人？",
    en: "Who do you not want to meet alone at night?",
    icon: <RiKnifeBloodLine />,
    color: "facebook",
  },
  {
    id: 3,
    jp: "爆笑賞",
    en: "Who is the funniest?",
    icon: <FaFaceLaughSquint />,
    color: "yellow",
  },
  {
    id: 4,
    jp: "NO1チーム賞",
    en: "Who is the best team?",
    icon: <FaUserGroup />,
    color: "blue",
  },
  {
    id: 5,
    jp: "至高最高至極絶対無敵賞",
    en: "Who is the best?",
    icon: <GiQueenCrown />,
    color: "purple",
  },
];

const VotePage = () => {
  const [answerList, setAnswerList] = useState<(User | null)[]>(
    Array(6).fill(null)
  );
  const [isDone, setIsDone] = useState(false);
  const toast = useToast();
  console.log(answerList, "answerList");
  const doVote = async () => {
    setIsDone(true);
    console.log("addItem");
    if (answerList.length > 5) {
      // setItems([...items, newItem]);
      console.log(db, "db");
      await addDoc(collection(db, "votes"), {
        0: answerList[0]?.id,
        1: answerList[1]?.id,
        2: answerList[2]?.id,
        3: answerList[3]?.id,
        4: answerList[4]?.id,
        5: answerList[5]?.id,
      })
        .then((docRef) => {
          toast({
            title: "投票成功",
            description: "ありがとうございました！",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          setIsDone(false);
          toast({
            title: "投票失敗",
            description: "もう一度やり直してください",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          console.error("Error adding document: ", error);
        });
    }
  };

  const isFullAnswerList = answerList.some((answer) => answer === null);

  return (
    <Stack p={4}>
      <Heading size="xl">最高なコスプレに祝福を！</Heading>
      {questionList.map((question) => {
        return (
          <Flex
            direction="column"
            p={5}
            border="1px"
            rounded={"10px"}
            key={question.id}
          >
            <Flex direction="column">
              <Heading size="xs">問題{question.id + 1}</Heading>
              <Heading size="sm">{question.jp}</Heading>
              <Heading size="sm">{question.en}</Heading>
            </Flex>
            <UserPicker
              key={question.en}
              buttonText={answerList[question.id]?.name || "決める"}
              question={question}
              onDecide={(user, questionId) =>
                setAnswerList((prev) => {
                  const newList = [...prev];
                  newList[questionId] = user;
                  return newList;
                })
              }
            />
          </Flex>
        );
      })}
      <Button
        mt={10}
        colorScheme="whatsapp"
        onClick={doVote}
        isDisabled={isFullAnswerList || isDone}
      >
        {isFullAnswerList ? "全部答えてください" : "投票する"}
      </Button>
    </Stack>
  );
};

export default VotePage;
