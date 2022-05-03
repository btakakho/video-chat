import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useClipboard,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { IconContext } from 'react-icons'
import { BsRecordCircleFill } from 'react-icons/bs'
import { FaMicrophoneAlt } from 'react-icons/fa'
import { IoMdCall, IoMdReverseCamera } from 'react-icons/io'
import { MdCameraAlt } from 'react-icons/md'
import io, { Socket } from 'socket.io-client'

const ENDPOINT = 'http://localhost:4001'

function App() {
  const [socketIo, setSocketIo] = useState<Socket>()
  const [socketId, setSocketId] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [localStream, setLocalStream] = useState()
  const [remoteStream, setRemoteStream] = useState()
  const [screenSharingStream, setscreenSharingStream] = useState()
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isStrangersCanChat, setStrangersCanChat] = useState(false)
  const { hasCopied, onCopy } = useClipboard(socketId)
  const personalIdInput = useRef<HTMLInputElement>(null)

  const wss = {
    sendChatOffer(data: any) {
      if (!socketIo) return
      socketIo.emit('chat-offer', data)
    },
  }

  const webRTC = {
    handleChatOffer({ userId, chatType }: any) {
      onOpen()
    },
  }

  function sendChatOffer(userId: any, chatType: any) {
    const data = {
      userId,
      chatType,
    }

    console.log(data)
    wss.sendChatOffer(data)
  }

  function chatByPersonalCode() {
    if (personalIdInput.current) {
      sendChatOffer(personalIdInput.current.value, 'CHAT')
    }
  }
  function VideoChatByPersonalCode() {
    if (personalIdInput.current) {
      sendChatOffer(personalIdInput.current.value, 'VIDEO_CHAT')
    }
  }

  useEffect(() => {
    const socket = io(ENDPOINT, { path: '/signalling-server/' })

    socket.on('connect', () => {
      setSocketIo(socket)
      setSocketId(socket.id)
    })

    socket.on('chat-offer', ({ userId, chatType }) => {
      console.log('chat-offer', userId)

      webRTC.handleChatOffer({ userId, chatType })
    })
  }, [])

  return (
    <>
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
                ref={personalIdInput}
                required
              />
              <HStack mt={2}>
                <Button
                  onClick={chatByPersonalCode}
                  isFullWidth
                >
                  Chat
                </Button>
                <Button
                  onClick={VideoChatByPersonalCode}
                  isFullWidth
                >
                  Video Chat
                </Button>
              </HStack>
            </FormControl>

            <FormControl mt={8}>
              <FormLabel mb={0}>Find stranger</FormLabel>
              <FormHelperText mt={0}>
                Start chat with random user
              </FormHelperText>
              <HStack mt={2}>
                <Button isFullWidth>Chat</Button>
                <Button isFullWidth>Video Chat</Button>
              </HStack>
            </FormControl>

            <FormControl mt={'auto'}>
              <FormLabel mb={0}>Your personal ID</FormLabel>
              <FormHelperText mt={0}>
                With this ID another user can start chat with you
              </FormHelperText>
              <Flex mt={2}>
                <Input
                  value={socketId}
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
          <VStack
            borderRadius={8}
            p={4}
            h={'full'}
            bg={'blackAlpha.200'}
          >
            <VStack
              flexGrow={1}
              w={'full'}
              overflowY="scroll"
            >
              <Box
                display={'inline-block'}
                bg={'blue.100'}
                p={2}
                alignSelf={'start'}
              >
                Message
              </Box>
              <Box
                display={'inline-block'}
                bg={'blue.100'}
                p={2}
                alignSelf={'end'}
              >
                MessageMessageMessage
              </Box>
            </VStack>
            <HStack mt={4}>
              <Input
                bg={'white'}
                placeholder="Message..."
              />
              <Button colorScheme={'green'}>Send</Button>
            </HStack>
          </VStack>
        </GridItem>
      </Grid>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        closeOnOverlayClick={false}
      >
        <ModalOverlay backdropFilter="blur(15px)" />
        <ModalContent>
          <ModalHeader textAlign={'center'}>Incoming chat offer</ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
            praesentium, officia unde debitis magnam similique laudantium
            expedita ducimus dolorem eaque. Sit dicta minima asperiores
            consequatur pariatur voluptatibus saepe! Nesciunt, ratione.
          </ModalBody>

          <ModalFooter>
            <Center width={'full'}>
              <Button
                colorScheme="green"
                mr={3}
                onClick={onClose}
              >
                Accept
              </Button>
              <Button
                colorScheme={'red'}
                onClick={onClose}
              >
                Decline
              </Button>
            </Center>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export { App }
