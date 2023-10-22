import {
  Flex,
  VStack,
  Input,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage
} from '@chakra-ui/react'
import ColorInput from 'components/color-input'

const ThemeBuilder = ({ themeData, handleInputChange }) => {
  const handleColorChange = (palateRange, palateValue) =>
    handleInputChange('colors', {
      ...themeData['colors'],
      [palateRange]: palateValue
    })

  return (
    <Flex justifyContent="space-evenly" m="0 auto" gap={3}>
      <VStack alignItems="left" gap={2} px={4}>
        <Heading fontSize={24} mt={4}>
          Theme settings
        </Heading>
        <FormControl isInvalid={!themeData['title']} isRequired>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input
            id="title"
            type="text"
            value={themeData['title']}
            onChange={e => handleInputChange('title', e.target.value)}
          />
          {!themeData['title'] && (
            <FormErrorMessage>Title is required!</FormErrorMessage>
          )}
        </FormControl>

        <Heading fontSize={20} mt={4}>
          Card designs
        </Heading>
        <FormControl isInvalid={!themeData['cardDesigns']['front']} isRequired>
          <FormLabel htmlFor="cardDesigns.front">Card front</FormLabel>
          <Input
            id="cardDesigns.front"
            type="text"
            value={themeData['cardDesigns']['front']}
            onChange={e =>
              handleInputChange('cardDesigns', {
                ...themeData['cardDesigns'],
                front: e.target.value
              })
            }
          />
          {!themeData['cardDesigns']['front'] && (
            <FormErrorMessage>
              &quot;Card front&quot; is required!
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!themeData['cardDesigns']['rear']} isRequired>
          <FormLabel htmlFor="cardDesigns.rear">Card rear</FormLabel>
          <Input
            id="cardDesigns.rear"
            type="text"
            value={themeData['cardDesigns']['rear']}
            onChange={e =>
              handleInputChange('cardDesigns', {
                ...themeData['cardDesigns'],
                rear: e.target.value
              })
            }
          />
          {!themeData['cardDesigns']['rear'] && (
            <FormErrorMessage>
              &quot;Card rear&quot; is required!
            </FormErrorMessage>
          )}
        </FormControl>

        <Heading fontSize={20} mt={4}>
          Color palate
        </Heading>
        <Flex justifyContent="space-between">
          <Flex flexDirection="column" w="48%">
            <ColorInput
              palateKey="50"
              label="Palate 50"
              value={themeData['colors']['50']}
              onChange={handleColorChange}
              isRequired
            />
            <ColorInput
              palateKey="100"
              label="Palate 100"
              value={themeData['colors']['100']}
              onChange={handleColorChange}
              isRequired
            />
            <ColorInput
              palateKey="200"
              label="Palate 200"
              value={themeData['colors']['200']}
              onChange={handleColorChange}
              isRequired
            />
            <ColorInput
              palateKey="300"
              label="Palate 300"
              value={themeData['colors']['300']}
              onChange={handleColorChange}
              isRequired
            />
            <ColorInput
              palateKey="400"
              label="Palate 400"
              value={themeData['colors']['400']}
              onChange={handleColorChange}
              isRequired
            />
          </Flex>

          <Flex flexDirection="column" w="48%">
            <ColorInput
              palateKey="500"
              label="Palate 500"
              value={themeData['colors']['500']}
              onChange={handleColorChange}
              isRequired
            />
            <ColorInput
              palateKey="600"
              label="Palate 600"
              value={themeData['colors']['600']}
              onChange={handleColorChange}
              isRequired
            />
            <ColorInput
              palateKey="700"
              label="Palate 700"
              value={themeData['colors']['700']}
              onChange={handleColorChange}
              isRequired
            />
            <ColorInput
              palateKey="800"
              label="Palate 800"
              value={themeData['colors']['800']}
              onChange={handleColorChange}
              isRequired
            />
            <ColorInput
              palateKey="900"
              label="Palate 900"
              value={themeData['colors']['900']}
              onChange={handleColorChange}
              isRequired
            />
          </Flex>
        </Flex>
      </VStack>
    </Flex>
  )
}

export default ThemeBuilder
