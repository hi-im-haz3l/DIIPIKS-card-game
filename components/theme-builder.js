import {
  Box,
  Flex,
  Text,
  VStack,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
  Input,
  useNumberInput,
  HStack
} from '@chakra-ui/react'
import { BiPencil } from 'react-icons/bi'
import { useState } from 'react'
import ColorInput from 'components/color-input'
import DataTable from 'components/data-table'

import FormInputWrapper from 'components/form-control-wrapper'

const ThemeBuilder = ({ themeData, handleInputChange }) => {
  const cardContents = themeData['cardContents'] || []
  const endCard = themeData['endCard'] || {
    placement: 'End',
    category: 'Thanks for playing!',
    question:
      'You have reached the end of the deck. Wanna give it another swing?'
  }

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      min: 0,
      value: cardContents.length,
      onChange: valueString => {
        const lengthDifference =
          parseInt(valueString) - cardContents.length || 0
        handleInputChange(
          'cardContents',
          lengthDifference < 0
            ? cardContents.slice(0, lengthDifference)
            : [
                ...cardContents,
                ...Array.from({ length: lengthDifference }, (_, index) => ({
                  placement: cardContents.length + index + 1,
                  category: '',
                  question: ''
                }))
              ]
        )
      }
    })

  const [currentlyEditing, setCurrentlyEditing] = useState(null)
  const [editingValues, setEditingValues] = useState({})

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()

  const handleColorChange = (palateRange, palateValue) =>
    handleInputChange('colors', {
      ...themeData['colors'],
      [palateRange]: palateValue
    })

  const handleCardContent = (index, newValue) => {
    if (index === endCard['placement']) {
      return handleInputChange('endCard', { ...endCard, ...newValue })
    }

    handleInputChange(
      'cardContents',
      cardContents.map(cardContent =>
        cardContent.placement === index + 1
          ? { ...cardContent, ...newValue }
          : cardContent
      )
    )
  }

  const columns = [
    {
      Header: '#',
      accessor: 'placement',
      Cell: ({ value }) => (
        <Flex justifyContent="center" alignItems="center">
          <Text>{value}</Text>
          <Box
            className="table-row-hover-icon"
            opacity={0}
            position="absolute"
            right="5px"
            top="50%"
            transform="translateY(-50%)"
          >
            <BiPencil fontSize={20} />
          </Box>
        </Flex>
      )
    },
    {
      Header: 'Category',
      accessor: 'category',
      Cell: ({ value }) => (
        <Flex justifyContent="center" alignItems="center">
          <Text>{value}</Text>
        </Flex>
      )
    },
    {
      Header: 'Card content',
      accessor: 'question',
      Cell: ({ value }) => (
        <Flex justifyContent="center" alignItems="center">
          <Text mr={4}>{value}</Text>
        </Flex>
      )
    }
  ]

  return (
    <Flex justifyContent="space-evenly" m="0 auto" gap={3}>
      <VStack alignItems="left" gap={2} px={4}>
        <Heading fontSize={24} mt={4}>
          Theme settings
        </Heading>
        <FormInputWrapper
          value={themeData['title']}
          label="Title"
          fieldKey="title"
          onChange={e => handleInputChange('title', e.target.value)}
        />

        <Heading fontSize={20} mt={4}>
          Card designs
        </Heading>
        <FormInputWrapper
          value={themeData['cardDesigns']['front']}
          label="Card front"
          fieldKey="cardDesigns.front"
          onChange={e =>
            handleInputChange('cardDesigns', {
              ...themeData['cardDesigns'],
              front: e.target.value
            })
          }
        />

        <FormInputWrapper
          value={themeData['cardDesigns']['rear']}
          label="Card rear"
          fieldKey="cardDesigns.rear"
          onChange={e =>
            handleInputChange('cardDesigns', {
              ...themeData['cardDesigns'],
              rear: e.target.value
            })
          }
        />

        <Heading fontSize={20} mt={4}>
          Color palate
        </Heading>
        <Flex justifyContent="space-between">
          <Flex flexDirection="column" w="48%">
            <ColorInput
              palateKey="primary"
              label="Backdrop color"
              value={themeData['colors']['primary']}
              onChange={handleColorChange}
              isRequired
            />
          </Flex>

          <Flex flexDirection="column" w="48%">
            <ColorInput
              palateKey="secondary"
              label="Accent color"
              value={themeData['colors']['secondary']}
              onChange={handleColorChange}
              isRequired
            />
          </Flex>
        </Flex>

        <Heading fontSize={20} mt={4}>
          Card contents
        </Heading>
        <Text fontWeight="400">Number of cards</Text>

        <HStack maxW="200px">
          <Button {...inc}>+</Button>
          <Input {...input} />
          <Button {...dec}>-</Button>
        </HStack>

        <DataTable
          columns={columns}
          data={!!cardContents.length ? [...cardContents, endCard] : []}
          onRowClick={rowData => {
            if (rowData?.placement) {
              setCurrentlyEditing(
                rowData.index !== cardContents.length
                  ? rowData.index
                  : endCard['placement']
              )
              setEditingValues(rowData)
              onOpen()
            }
          }}
          hasHoverIcon
        />
      </VStack>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {currentlyEditing !== endCard['placement']
                ? `Card #${editingValues['placement']}`
                : `${editingValues['placement']} card`}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontWeight="400">Category</Text>
              <Input
                value={editingValues['category']}
                onChange={e =>
                  setEditingValues(prevValues => ({
                    ...prevValues,
                    category: e.target.value
                  }))
                }
              />
              <Text fontWeight="400" mt={2}>
                Question
              </Text>
              <Textarea
                value={editingValues['question']}
                onChange={e =>
                  setEditingValues(prevValues => ({
                    ...prevValues,
                    question: e.target.value
                  }))
                }
                resize="vertical"
                minH={150}
              />
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => {
                  handleCardContent(currentlyEditing, editingValues)
                  onClose()
                }}
              >
                Done
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  )
}

export default ThemeBuilder
