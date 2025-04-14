import React from "react";
import { MdEmail } from "react-icons/md";
import {
  Text,
  Heading,
  SimpleGrid,
  Link,
  Flex,
  Box,
  Image,
} from "@chakra-ui/react";
import team from "../team.json"


function TeamGrid({ filteredTeam }) {
  return (
    // TODO: fix this for mobile, honestly fix everything for mobile
    // TODO: add a past members section
    <SimpleGrid columns={4} spacing={4}>
      {/* Map through photo cards */}
      {filteredTeam.map((member) => (
        <Box
          key={member.id}
          display="flex"
          flexDirection="column"
          p={4}
          boxShadow="sm"
          bg="gray.100"
        >
          {/* TODO: Photos */}
          <Image src="/srch-s25/member-photos/temp-photo.jpg" alt={member.photo}/>
          <Flex align="center" gap={2} mb={2}>
            <Link href={member.linkedin} isExternal fontWeight="bold">
              {member.name}
            </Link>
            <Link href={`mailto:${member.email}`} isExternal>
              <MdEmail />
            </Link>
          </Flex>
          <Text fontStyle="italic" fontSize="sm">
            {member.position}
          </Text>
          <Text fontSize="sm">{member.pronouns}</Text>
          {/* TODO: recommend that this should just be Ph.D. */}
          <Text fontSize="sm">
            {member.degree}, {member.gradYear}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}

function About() {
    const onlyLeaders = team.filter((member) => member.team == "N/A")
  // TODO: need to add Michelle and them here
//   TODO: external link for website, linkedin icon for linkedin
  return (
    <div style={{ padding: "20px", marginLeft: "250px" }}>
      <Heading as="h1" size="xl" mt={5} mb={3}>About us</Heading>
      <Text>
        TODO: This page will be Acknowledgements
      </Text>
      <Text>And thank you to our our wonderful project coordinators!</Text>
      <TeamGrid filteredTeam={onlyLeaders}/>
    </div>
  );
}

function AboutTeam({ teamName }){
    console.log(team)
    const filteredTeam = team.filter((member) => member.team === teamName);
    const isActive = filteredTeam.filter((member) => member.isActive == "true")

    const nameToTitleMap = {
        "ai" : "AI",
        "privacy" : "Privacy",
        "accessibility" : "Accessibility",
        "product" : "Product"
    }
    return (
      <div style={{ padding: "20px", marginLeft: "250px" }}>
        <Heading as="h1" size="xl" mt={5} mb={3}>
          Meet the {nameToTitleMap[teamName]} team!
        </Heading>
        <TeamGrid filteredTeam={filteredTeam}/>
      </div>
    );
}

export {About, AboutTeam};
