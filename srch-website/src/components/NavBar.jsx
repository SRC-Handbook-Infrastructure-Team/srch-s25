import React from 'react'

import {
    Link,
    useLocation
} from 'react-router-dom'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    List,
    ListItem
} from '@chakra-ui/react'

function NavBar() {
    const currLocation = useLocation()
    // TODO: Maybe cut the front of this to just get the current path
    const currPath = location.pathname
    // cuts the first '/srch-s25'
    const currPathPruned = currPath.slice(9)
    
    console.log(currPathPruned);
  return (
    <>
      {/* Always want this drawer to be open */}
      <Drawer isOpen={true} placement="left">
        {/* TODO: styling of border */}
        <DrawerContent borderRight="2px solid black">
          <Link to="/">
            <DrawerHeader>SRC Handbook</DrawerHeader>
          </Link>

          <DrawerBody>
            {/* TODO: Probably want this to parse MD somehow to get the file structure */}
            {/* TODO: Background: make it more extensible (a function to automatically set background) + Styling */}
            <List>
              <ListItem bg={currPathPruned == "/" ? "gray.100" : "transparent"}>
                <Link to="/">Home</Link>
              </ListItem>
              <ListItem
                bg={currPathPruned == "/ai" ? "gray.100" : "transparent"}
              >
                <Link to="/ai">1. Fairness and Justice</Link>
                {/* TODO: Styling of sublist */}
                <List pl={4}>
                  <ListItem>
                    <Link>1.c.i Subitem 1</Link>
                  </ListItem>
                  <ListItem>
                    <Link>1.c.ii Subitem 2</Link>
                  </ListItem>
                </List>
              </ListItem>
            </List>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default NavBar