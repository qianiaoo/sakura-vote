"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/app/firebase";
import { User } from "@/app/page";
import {
  Button,
  Input,
  NumberInput,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  VStack,
} from "@chakra-ui/react";

const ShufflePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [number, setNumber] = useState(5);

  useEffect(() => {
    const q = query(collection(db, "users"));
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
    <Stack p={6} gap={4}>
      <Button colorScheme="whatsapp">Shuffle</Button>
      <Slider aria-label="slider-ex-1" defaultValue={5} max={10}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Stack>
  );
};

export default ShufflePage;
