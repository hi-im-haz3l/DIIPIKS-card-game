import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage
} from '@chakra-ui/react'

const FormInputWrapper = ({
  value,
  label,
  fieldKey,
  isRequired = true,
  onClick,
  onChange,
  children
}) => (
  <FormControl isInvalid={!value} onClick={onClick} isRequired={isRequired}>
    {label && (
      <FormLabel htmlFor={fieldKey} fontWeight="400">
        {label}
      </FormLabel>
    )}
    {children || (
      <Input id={fieldKey} type="text" value={value} onChange={onChange} />
    )}
    {!value && label && (
      <FormErrorMessage>&quot;{label}&quot; is required!</FormErrorMessage>
    )}
  </FormControl>
)

export default FormInputWrapper
