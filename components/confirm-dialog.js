import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton
} from '@chakra-ui/react'
import { forwardRef } from 'react'

const ConfirmationDialog = forwardRef(
  (
    {
      onClose,
      isOpen,
      alertText,
      alertColor,
      alertActionName,
      alertActionHandle,
      setProcessing,
      children
    },
    ref
  ) => (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={ref}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>{alertText.header}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{alertText.body}</AlertDialogBody>

        {children}

        <AlertDialogFooter>
          <Button ref={ref} onClick={onClose}>
            Cancel
          </Button>

          <Button
            colorScheme={alertColor}
            onClick={() => {
              setProcessing(true)
              alertActionHandle()
              onClose()
            }}
            ml={3}
          >
            {alertActionName}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
)

export default ConfirmationDialog
