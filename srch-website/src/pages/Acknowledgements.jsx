import { MdEmail } from "react-icons/md";
import { FaLinkedin, FaExternalLinkAlt } from "react-icons/fa";
import {
  Text,
  Heading,
  SimpleGrid,
  Link,
  Flex,
  Box,
  Image,
  Divider,
  useMediaQuery,
} from "@chakra-ui/react";
import team from "../team.json";

function TeamGrid({ filteredTeam }) {
  // Sort alphabetically
  const sortedTeam = [...filteredTeam].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
      {/* Map through photo cards */}
      {sortedTeam.map((member) => (
        <Box
          key={member.id}
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          p={2}
        >
          <Image
            src={
              member.photo
                ? `/srch-s25/assets/member-photos/${member.photo}`
                : `/srch-s25/assets/member-photos/temp-photo.jpg`
            }
            alt={member.photo || "Default photo"}
            boxSize="250px" // Sets a fixed size for the image
            objectFit="cover" // Ensures the image is cropped proportionally
            borderRadius="lg"
            mb={4}
          />
          <Flex align="center" gap={2} mb={2}>
            <Text fontWeight="bold">{member.name}</Text>
            <Link href={`mailto:${member.email}`} isExternal>
              <MdEmail />
            </Link>
            {member.linkedin && (
              <Link href={member.linkedin} isExternal>
                <FaLinkedin />
              </Link>
            )}
            {member.website && (
              <Link href={member.website} isExternal>
                <FaExternalLinkAlt />
              </Link>
            )}
          </Flex>
          <Text fontSize="sm">
            {member.position} | {member.pronouns}
          </Text>
          <Text fontSize="sm">
            {member.degree && `${member.degree}, `}
            {member.gradYear}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  );
}

function Acknowledgements() {
  const onlyLeaders = team.filter((member) => member.team == "N/A");
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  return (
    <div style={{ padding: "20px", marginLeft: isMobile ? "0" : "250px" }}>
      <Heading as="h1" size="xl" mt={5} mb={3}>
        Acknowledgements
      </Heading>
    </div>
  );
}

function Team({ teamName }) {
  console.log(team);
  const filteredTeam = team.filter((member) => member.team === teamName);
  const isActive = filteredTeam.filter((member) => member.active == "true");
  const notActive = filteredTeam.filter((member) => member.active == "false");
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const nameToTitleMap = {
    leadership: "Leadership",
    ai: "AI",
    privacy: "Privacy",
    accessibility: "Accessibility",
    product: "Product",
  };
  return (
    <div style={{ padding: "20px", marginLeft: isMobile ? "0" : "250px" }}>
      <Heading as="h1" size="xl" mt={5} mb={3}>
        {nameToTitleMap[teamName]} Team
      </Heading>
      <Divider my={4} borderColor="gray.300" />{" "}
      <Heading as="h2" size="lg" fontWeight="normal">
        {/* Current Team */}
      </Heading>
      <TeamGrid filteredTeam={isActive} />
      {notActive.length > 0 && (
        <>
          <Heading as="h2" size="lg" fontWeight="normal" paddingTop={5}>
            Past Team Members
          </Heading>
          <TeamGrid filteredTeam={notActive} />
        </>
      )}
    </div>
  );
}

function AdditionalContributors() {
  const contributors = team
    .filter((member) => member.team == "additional")
    .sort((a, b) => a.name.localeCompare(b.name));
  const facultyContributors = team
    .filter((member) => member.team == "additional_faculty")
    .sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div style={{ padding: "20px", marginLeft: "250px" }}>
      <Heading>Additional Contributors</Heading>
      <Divider my={4} borderColor="gray.300" />{" "}
      <Heading as="h2" size="lg" fontWeight="normal" my={4}>
        User Study Participants
      </Heading>
      <Text my={4}>
        Thank you to all the Socially Responsible Computing Teaching Assistants (STAs) who participated in our user studies. Your
        feedback has been immensely valuable as we work towards improving our
        content and design. Below is a list of all the user study participants who consented to be attributed in our website:
      </Text>
      {contributors.map((member) => (
        <Text key={member.id}>
          {member.name}, <i>{member.position}</i>
        </Text>
      ))}
      <Heading as="h2" size="lg" fontWeight="normal" my={4}>
        Research Advisors
      </Heading>
      <Text my={4}>
        Thank you to all the faculty and Ph.D. students who advised our research teams:
      </Text>
      {facultyContributors.map((member) => (
        <Text key={member.id}>
          {member.name}, <i>{member.position}</i>
        </Text>
      ))}
    </div>
  );
}

export { Acknowledgements, Team, AdditionalContributors };
