import React from 'react'

import structure from "../markdown/structure.json"

import {
    Link,
    useLocation
} from 'react-router-dom'
import {
    Box,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    List,
    ListItem,
    Text
} from '@chakra-ui/react'

function parse_structure_json(structure,currPath, prevPath=""){
  return structure.map((item, index) => {
    const itemPath = `${prevPath}/${item.link}`;
    const isActive = currPath === itemPath;
    
    return (
      <ListItem key={index}>
        <Box bg={isActive ? "gray.100" : "transparent"} py={1}>
          <Link to={itemPath}>
            <Text fontWeight={isActive ? "bold" : "medium"}>
              {item.id + ". " + item.title}
            </Text>
          </Link>
        </Box>

        {item.subpages && item.subpages.length > 0 && (
          <List pl={2}>
            {parse_structure_json(item.subpages, currPath, itemPath)}
          </List>
        )}
      </ListItem>
    );
  });
}

function NavBar() {
  const currPath = useLocation().pathname;
  return (
    <>
      {/* Always want this drawer to be open */}
      <Drawer isOpen={true} placement="left" zIndex={10}>
        {/* TODO: styling of border */}
        <DrawerContent borderRight="2px solid #E5EBF3">
          <Link to="/">
            <DrawerHeader>SRC Handbook</DrawerHeader>
          </Link>

          <DrawerBody>
            <List>{parse_structure_json(structure, currPath)}</List>
            {/* TODO: Background: make it more extensible (a function to automatically set background) + Styling */}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default NavBar