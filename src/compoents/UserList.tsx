"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { User } from "@/app/page";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/app/firebase";

const UserList = ({
  filter = "",
  onDecide = (user: User) => {},
}: {
  filter?: string;
  onDecide?: (user: User) => void;
}) => {
  const [users, setUsers] = useState<User[]>([]);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const filtedUsers = users.filter((u) => {
    if (filter === "") return true;
    return (
      u.name?.includes(filter) ||
      u.cosplay?.includes(filter) ||
      u.roomId?.includes(filter.toUpperCase())
    );
  });
  console.log(filtedUsers, "filtedUsers");

  // Read users from database
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
    <Box>
      <Heading size="xs" p={2}>
        今受付人数: {users.length}人
      </Heading>
      <SimpleGrid columns={2} p={0} m={2} gap={2}>
        {filtedUsers.map((user) => (
          <Card
            key={user.id}
            onClick={() => {
              setSelectedUser(user);
              onDecide(user);
            }}
            bg={user.id === selectedUser?.id ? "gray.100" : "white"}
          >
            <CardHeader p={3}>
              <Heading size="md">{user.cosplay}</Heading>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    {user.name} - {user.roomId}
                  </Heading>
                  <Text pt="2" fontSize="sm">
                    {user.introduction}
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default UserList;
