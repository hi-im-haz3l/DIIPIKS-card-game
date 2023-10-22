import { useState } from 'react'
import ReactGPicker from 'react-gcolor-picker'
import {
  Box,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputGroup,
  InputLeftAddon
} from '@chakra-ui/react'

const ColorInput = ({ value, label, palateKey, onChange, isRequired }) => {
  const [isShowPicker, setShowPicker] = useState(false)

  return (
    <Box position="relative">
      {isShowPicker && (
        <>
          <Box
            zIndex={2}
            position="absolute"
            left="50%"
            transform="translate(-50%, -100%)"
          >
            <ReactGPicker
              value={value}
              showAlpha={false}
              debounceMS={20}
              onChange={value => onChange(palateKey, value)}
              style={{ zIndex: 1 }}
              format="hex"
            />
          </Box>
          <Box
            position="fixed"
            top={0}
            right={0}
            bottom={0}
            left={0}
            zIndex={1}
            bg="#00000033"
            backdropFilter="blur(1px)"
            onClick={() => setShowPicker(false)}
          />
        </>
      )}
      <FormControl
        isInvalid={!value}
        onClick={() => setShowPicker(true)}
        isRequired={isRequired}
      >
        <FormLabel htmlFor={`palate.${palateKey}`}>{label}</FormLabel>
        <InputGroup>
          <InputLeftAddon bg={value} />
          <Input
            id={`palate.${palateKey}`}
            type="text"
            value={value}
            isDisabled={isShowPicker}
            readOnly
          />
        </InputGroup>
        {!value && (
          <FormErrorMessage>&quot;{label}&quot; is required!</FormErrorMessage>
        )}
      </FormControl>
    </Box>
  )
}

export default ColorInput
