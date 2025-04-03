import React from 'react'

import {
  Link as RouterLink,
  useLocation
} from 'react-router-dom'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  List,
  ListItem,
  Link,
  Text
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
        {/* Styling of border */}
        <DrawerContent borderRight="1px solid #E2E8F0" maxW="260px">
          <RouterLink to="/">
            <DrawerHeader fontSize="lg" fontWeight="bold" color="gray.800" fontFamily="heading" pt={6} pb={4}>
              SRC Handbook
            </DrawerHeader>
          </RouterLink>

          <DrawerBody>
            {/* TODO: Probably want this to parse MD somehow to get the file structure */}
            {/* TODO: Background: make it more extensible (a function to automatically set background) + Styling */}
            <List spacing={1}>
              <ListItem bg={currPathPruned === "/" ? "gray.100" : "transparent"} p={1.5} borderRadius="md">
                <Link as={RouterLink} to="/" display="block" _hover={{ textDecoration: 'none', color: 'inherit' }}>
                  <Text fontSize="sm" fontWeight="normal" color="gray.700" fontFamily="body">
                    Home
                  </Text>
                </Link>
              </ListItem>
              <ListItem bg={currPathPruned === "/ai" ? "gray.100" : "transparent"} p={1.5} borderRadius="md">
                <Link as={RouterLink} to="/ai" display="block" _hover={{ textDecoration: 'none', color: 'inherit' }}>
                  <Text fontSize="sm" fontWeight="normal" color="gray.700" fontFamily="body">
                    1. Fairness and Justice
                  </Text>
                </Link>
              </ListItem>
              {/* Styling of sublist */}
              <List pl={4} mt="1">
                <ListItem bg={currPathPruned === "/1ci" ? "gray.100" : "transparent"} p={1.5} borderRadius="md">
                  <Link as={RouterLink} to="/1ci" display="block" _hover={{ textDecoration: 'none', color: 'inherit' }}>
                    <Text fontSize="sm" color="gray.600" fontFamily="body">
                      1.c.i Subitem 1
                    </Text>
                  </Link>
                </ListItem>
                <ListItem bg={currPathPruned === "/1cii" ? "gray.100" : "transparent"} p={1.5} borderRadius="md">
                  <Link as={RouterLink} to="/1cii" display="block" _hover={{ textDecoration: 'none', color: 'inherit' }}>
                    <Text fontSize="sm" color="gray.600" fontFamily="body">
                      1.c.ii Subitem 2
                    </Text>
                  </Link>
                </ListItem>
              </List>
            </List>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default NavBar
