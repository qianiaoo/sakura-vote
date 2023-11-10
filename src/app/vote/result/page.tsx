"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/app/firebase";
import { User } from "@/app/page";
import { Flex, Heading, ListItem, OrderedList } from "@chakra-ui/react";
import { AiFillHeart } from "react-icons/ai";
import { GiMuscleUp, GiQueenCrown } from "react-icons/gi";
import { RiKnifeBloodLine } from "react-icons/ri";
import { FaFaceLaughSquint, FaUserGroup } from "react-icons/fa6";
import { Question } from "@/app/vote/page";

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
type Vote = {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
};

// 假设这是从Firebase获取的用户数据
type UserData = {
  name: string;
  id: string;
  voteCount: number; // 新增字段以存储票数
};

const ResultPage = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  // 更新 topVoters 的类型以包含票数信息
  const [topVoters, setTopVoters] = useState<Record<number, UserData[]>>({});

  // 处理投票数据，找出每个问题的前三名用户及他们的票数
  const processVotes = (votes: Vote[], users: User[]) => {
    const voteCounts: Record<string, Record<string, number>> = {};

    // 计算每个用户在每个问题上的票数
    votes.forEach((vote) => {
      Object.entries(vote).forEach(([question, userId]) => {
        if (!voteCounts[question]) {
          voteCounts[question] = {};
        }
        if (!voteCounts[question][userId]) {
          voteCounts[question][userId] = 0;
        }
        voteCounts[question][userId]++;
      });
    });

    // 找出每个问题的前三名用户及票数
    const topVoters: Record<number, UserData[]> = {};
    Object.keys(voteCounts).forEach((question) => {
      const sortedUsers = Object.entries(voteCounts[question])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([userId, voteCount]) => {
          const user = users.find((user) => user.id === userId);
          return user ? { ...user, voteCount } : null;
        })
        .filter(Boolean) as UserData[];
      topVoters[parseInt(question)] = sortedUsers;
    });

    return topVoters;
  };

  // 读取投票数据
  useEffect(() => {
    const q = query(collection(db, "votes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let voteArr: Vote[] = [];

      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        voteArr.push(doc.data() as Vote);
      });

      setVotes(voteArr);
    });

    return () => unsubscribe();
  }, []);

  // 读取用户数据
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
      setTopVoters(processVotes(votes, userArr));
    });

    return () => unsubscribe();
  }, [votes]);

  // 展示每个问题的前三名用户
  return (
    <div>
      {Object.entries(topVoters).map(([question, users]) => (
        <div key={question}>
          <Flex
            direction="column"
            p={5}
            border="1px"
            rounded={"10px"}
            key={question}
          >
            <Flex direction="column">
              <Heading size="xs">問題{parseInt(question) + 1}</Heading>
              <Heading size="sm">{questionList[parseInt(question)].jp}</Heading>
              <Heading size="sm">{questionList[parseInt(question)].en}</Heading>
            </Flex>
            <OrderedList>
              {users.map((user) => (
                <ListItem key={user.id}>
                  {user.name} - 票数: {user.voteCount}
                </ListItem>
              ))}
            </OrderedList>
          </Flex>
        </div>
      ))}
    </div>
  );
};

export default ResultPage;
