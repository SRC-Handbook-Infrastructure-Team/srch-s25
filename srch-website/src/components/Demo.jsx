import { Button } from "@chakra-ui/react";
import {
  DrawerActionTrigger,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@chakra-ui/react";

const Demo = () => {
  const handleClose = () => {}; 
  return (
    <DrawerRoot contained={true} variant="permanent">
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          Open Drawer
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerActionTrigger asChild>
            <Button variant="outline">x</Button>
          </DrawerActionTrigger>
          <DrawerTitle>Drawer Title</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p>Testing</p>
        </DrawerBody>
        <DrawerFooter></DrawerFooter>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
};

export default Demo;
