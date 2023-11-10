"use client";
import React, { useEffect, useState } from "react";
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
  VStack,
} from "@chakra-ui/react";
import UserPicker from "@/compoents/UserPicker";
import { User } from "@/app/page";

export type Question = {
  id: number;
  en: string;
  jp: string;
};
const questionList: Question[] = [
  {
    id: 1,
    jp: "一番結婚したい人？",
    en: "Who do you want to marry?",
  },
];

const VotePage = () => {
  const [answerList, setAnswerList] = useState<User[]>([]);

  return (
    <Stack p={8}>
      <Heading size="xl">最高なコスプレに祝福を！</Heading>
      <Button>ASD</Button>
      {questionList.map((question) => {
        return (
          <VStack key={question.id}>
            <VStack>
              <Heading size="sm">{question.jp}</Heading>
              <Heading size="sm">{question.en}</Heading>
            </VStack>
            <UserPicker
              key={question.en}
              buttonText={answerList[question.id]?.name || "決める"}
              question={question}
              onDecide={(user, questionId) =>
                setAnswerList({ ...answerList, [questionId]: user })
              }
            />
          </VStack>
        );
      })}
    </Stack>
  );
};

export default VotePage;
