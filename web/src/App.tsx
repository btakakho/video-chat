import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Input,
  useClipboard,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { IconContext } from 'react-icons'
import { BsRecordCircleFill } from 'react-icons/bs'
import { FaMicrophoneAlt } from 'react-icons/fa'
import { IoMdCall, IoMdReverseCamera } from 'react-icons/io'
import { MdCameraAlt } from 'react-icons/md'
import io from 'socket.io-client'

const ENDPOINT = 'http://localhost:4001'

function App() {
  const [response, setResponse] = useState('')
  const [value, setValue] = useState('')
  const { hasCopied, onCopy } = useClipboard(value)

  useEffect(() => {
    const socket = io(ENDPOINT, { path: '/signalling-server/' })

    socket.on('connect', () => {
      console.log('connected', socket.id)
      setResponse(socket.id)
      setValue(socket.id)
    })
  }, [])

  return (
    <Grid
      templateColumns="minmax(260px, 320px) minmax(480px, 2fr) minmax(260px, 340px)"
      h="100vh"
    >
      <GridItem>
        <Flex
          padding={4}
          flexDirection={'column'}
          h="100%"
        >
          <FormControl mt={8}>
            <FormLabel mb={0}>Direct chat</FormLabel>
            <FormHelperText mt={0}>
              Place another user's ID to start direct chat
            </FormHelperText>
            <Input
              mt={2}
              placeholder="User ID"
            />
            <HStack mt={2}>
              <Button isFullWidth>Chat</Button>
              <Button isFullWidth>Video Call</Button>
            </HStack>
          </FormControl>

          <FormControl mt={8}>
            <FormLabel mb={0}>Find stranger</FormLabel>
            <FormHelperText mt={0}>Start chat with random user</FormHelperText>
            <HStack mt={2}>
              <Button isFullWidth>Chat</Button>
              <Button isFullWidth>Video Call</Button>
            </HStack>
          </FormControl>

          <FormControl mt={'auto'}>
            <FormLabel mb={0}>Your personal ID</FormLabel>
            <FormHelperText mt={0}>
              With this ID another user can start chat with you
            </FormHelperText>
            <Flex mt={2}>
              <Input
                value={response}
                isReadOnly
                placeholder="Loading..."
              />
              <Button
                onClick={onCopy}
                ml={2}
              >
                {hasCopied ? 'Copied' : 'Copy'}
              </Button>
            </Flex>
          </FormControl>
          <Box mt={8}>
            <Checkbox>Strangers can start chat with me</Checkbox>
          </Box>
        </Flex>
      </GridItem>

      <GridItem>
        <Box
          h={'100%'}
          p={4}
          position="relative"
        >
          <Center
            position="relative"
            background={'purple.300'}
            height="100%"
            borderRadius={8}
            overflow="hidden"
          >
            <Box
              position="absolute"
              bg="purple.500"
              border={3}
              borderStyle={'solid'}
              borderRadius={8}
              overflow="hidden"
              top={0}
              left={0}
            >
              <video
                muted
                autoPlay
              >
                Video is not working. Try another browser.
              </video>
            </Box>
            <Box
              bg={'purple.500'}
              width="100%"
            >
              <video
                width="100%"
                autoPlay
              >
                Video is not working. Try another browser.
              </video>
            </Box>
          </Center>

          <HStack
            align="center"
            justifyContent="center"
            position="absolute"
            w="full"
            left={0}
            bottom={10}
          >
            <IconContext.Provider
              value={{ size: '24', style: { opacity: 0.6 } }}
            >
              <IconButton
                aria-label="toggle microphone"
                bg={'blackAlpha.300'}
                padding={2}
                isRound
              >
                <FaMicrophoneAlt />
                {/* <FaMicrophoneAltSlash /> */}
              </IconButton>

              <IconButton
                aria-label="off camera"
                bg={'blackAlpha.300'}
                isRound
              >
                <MdCameraAlt />
              </IconButton>
              <IconButton
                aria-label="make call"
                bg={'blackAlpha.300'}
                isRound
                size={'lg'}
              >
                <IoMdCall size={32} />
                {/* <MdCallEnd /> */}
              </IconButton>
              <IconButton
                aria-label="share screen"
                bg={'blackAlpha.300'}
                isRound
              >
                <IoMdReverseCamera />
              </IconButton>
              <IconButton
                aria-label="record video"
                bg={'blackAlpha.300'}
                isRound
              >
                <BsRecordCircleFill />
              </IconButton>
            </IconContext.Provider>
          </HStack>
        </Box>
      </GridItem>
      <GridItem p={4}>
        <Box
          borderRadius={8}
          p={4}
          h={'full'}
          bg={'blackAlpha.200'}
        >
          chat
        </Box>
      </GridItem>
    </Grid>
  )
}

export { App }
