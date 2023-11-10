import React, { useState } from "react";
import {
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { Question } from "@/app/vote/page";
import { User } from "@/app/page";
import UserList from "@/compoents/UserList";
import { AiFillHeart } from "react-icons/ai";

type UserPickerProps = {
  question: Question;
  onDecide: (user: User, questionId: number) => void;
  buttonText: string;
};

const UserPicker = ({ question, onDecide, buttonText }: UserPickerProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef(null);
  const [selectUser, setSelectUser] = useState<User | null>(null);
  const [filter, setFilter] = useState("");

  const onDecideUser = () => {
    if (selectUser) {
      onDecide(selectUser, question.id);
    }
    onClose();
  };
  const onClickedUser = (user: User) => {
    setSelectUser(user);
  };

  return (
    <Flex direction="row-reverse">
      <Button
        ref={btnRef}
        colorScheme={question.color}
        leftIcon={question.icon}
        onClick={onOpen}
      >
        {buttonText}
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Flex direction="column">
              {question.jp}
              <br />
              {question.en}
            </Flex>
          </DrawerHeader>

          <DrawerBody>
            <Input
              placeholder="検索 / filter"
              onChange={(e) => setFilter(e.target.value)}
            />
            <UserList filter={filter} onDecide={onClickedUser} />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Later
            </Button>
            <Button
              colorScheme="blue"
              onClick={onDecideUser}
              isDisabled={selectUser === null}
            >
              {selectUser && `${selectUser?.name}に`}決めた！
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default UserPicker;
