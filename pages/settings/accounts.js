import DataTable from 'components/data-table'
import { signOut } from 'next-auth/react'
import {
  Heading,
  Text,
  Badge,
  HStack,
  Flex,
  Center,
  Input,
  InputLeftElement,
  InputRightElement,
  InputGroup,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Spinner,
  useToast
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import axios from 'axios'
import { useState, useEffect, useMemo, useRef } from 'react'
import Layout from 'layouts/article'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { BiSearchAlt2 } from 'react-icons/bi'
import { IoCloseCircle } from 'react-icons/io5'
import { RiDeleteBinLine } from 'react-icons/ri'
import { FaRegThumbsUp, FaRegThumbsDown, FaUserAlt } from 'react-icons/fa'
import BackLink from 'components/back-link'
import ConfirmationDialog from 'components/confirm-dialog'
import LoadingTag from 'components/loading-tag'

const UsersTable = ({ authData }) => {
  const toast = useToast()

  const [AdminState, setAdminState] = useState(null)

  const [usersData, setUsersData] = useState([])
  const [isReady, setReady] = useState(false)
  const [isProcessing, setProcessing] = useState(false)
  const [isSearching, setSearching] = useState(false)

  const invisibleColumns = ['email', 'role', 'latestSessionFormated']
  const [selectedRows, setSelectedRows] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [forceSelectionIdxs, setForceSelectionIdxs] = useState([])

  const [alertColor, setAlertColor] = useState('red')
  const [alertText, setAlertText] = useState('')
  const [alertActionName, setAlertActionName] = useState('Proceed')
  const [alertActionHandle, setAlertActionHandle] = useState(undefined)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)

  const selectedSelf = selectedRows.includes(authData.user.id)

  const formatData = data => {
    return (data ?? []).map(user => ({
      ...user,
      user: {
        email: user.email,
        isAdmin: user.isAdmin,
        isSelf: user._id === authData.user.id
      },
      action: {
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        isSelf: user._id === authData.user.id
      },
      role: user.isAdmin ? 'Admin' : 'User',
      latestSessionFormated: user.latestSession
    }))
  }

  const fetchData = () => {
    setReady(false)

    axios
      .get('/api/admin/users/fetch-users')
      .then(response => {
        setUsersData(formatData(response.data))
        setProcessing(false)
        setReady(true)
      })
      .catch(error => {
        toast({
          title: error.message,
          status: 'error',
          position: 'top',
          isClosable: true
        })
      })
  }

  const showPrompt = (color, header, body, actionName, actionHandle) => {
    onOpen()
    setAlertColor(color)
    setAlertText({ header: header, body: body })
    setAlertActionName(actionName)
    setAlertActionHandle(actionHandle)
  }

  const handleUpdate = (endpoint, options, isBulk = false) => {
    setProcessing(true)
    axios
      .patch(`/api/admin/users/${endpoint}`, options)
      .then(response => {
        setUsersData(users => {
          if (isBulk) {
            ;(response.data ?? []).forEach(userData => {
              const idx = users.findIndex(user => user._id === userData._id)
              users[idx] = userData
            })
          } else {
            const userData = response.data
            const idx = users.findIndex(user => user._id === userData._id)
            users[idx] = userData
          }

          return formatData(users)
        })
      })
      .catch(error => {
        toast({
          title: error.message,
          status: 'error',
          position: 'top',
          isClosable: true
        })
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  const handleRole = (userId, adminState) => {
    handleUpdate('update-role-by-id', { _id: userId, isAdmin: adminState })
  }

  const handleRoleBulk = (userId, adminState) => {
    handleUpdate(
      'update-role-by-id-bulk',
      { _id: userId, isAdmin: adminState },
      true
    )
  }

  const handleRemoveUser = (endpoint, options, userIds, isBulk = false) => {
    setProcessing(true)
    axios
      .delete(`/api/admin/users/${endpoint}`, options)
      .then(() => {
        if (selectedSelf || userIds === authData.user.id) return signOut()

        setUsersData(users => {
          if (isBulk) {
            ;(userIds ?? []).forEach(userId => {
              const idx = users.findIndex(user => user._id === userId)
              users.splice(idx, 1)
            })
          } else {
            const idx = users.findIndex(user => user._id === userIds)
            users.splice(idx, 1)
          }

          return formatData(users)
        })
      })
      .catch(error => {
        toast({
          title: error.message,
          status: 'error',
          position: 'top',
          isClosable: true
        })
      })
      .finally(() => {
        setProcessing(false)
      })
  }

  const handleDelete = userId => {
    handleRemoveUser(
      'delete-by-id',
      {
        data: { _id: userId }
      },
      userId
    )
  }

  const handleDeleteBulk = userIds => {
    handleRemoveUser(
      'delete-by-id-bulk',
      {
        data: { _id: userIds }
      },
      userIds,
      true
    )
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Email',
        accessor: 'user',
        Cell: ({ value }) => (
          <Flex gap={2} flexWrap="wrap" maxW={{ base: '200px', sm: '300px' }}>
            <Text
              maxW={100}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {value.email}
            </Text>
            {value.isSelf && <FaUserAlt />}
            {value.isAdmin && (
              <Badge
                maxW={70}
                overflow="hidden"
                textOverflow="ellipsis"
                colorScheme="purple"
              >
                Admin
              </Badge>
            )}
          </Flex>
        )
      },
      {
        Header: 'Last active',
        accessor: 'latestSession',
        Cell: ({ value }) => value
      },
      {
        Header: isProcessing && <Spinner />,
        accessor: 'action',
        disableSortBy: true,
        Cell: ({ value }) => (
          <Menu>
            <MenuButton
              as={IconButton}
              variant="transparent_rounded"
              icon={<BsThreeDotsVertical />}
              size="sm"
              m={{ base: -2, sm: -1 }}
              transform="translateX(-.5em)"
            />
            <MenuList size="sm" fontSize={16} minW={28}>
              {value.isSelf ||
                (value.isAdmin ? (
                  <MenuItem
                    onClick={() =>
                      showPrompt(
                        'purple',
                        'Remove permission',
                        `Are you sure to demote "${value.email}"?`,
                        'Demote',
                        () => () => handleRole(value._id, false)
                      )
                    }
                    icon={<FaRegThumbsDown fontSize={20} />}
                  >
                    Demote
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() =>
                      showPrompt(
                        'purple',
                        'Grand permission',
                        `Are you sure to promote "${value.email}"?`,
                        'Promote',
                        () => () => handleRole(value._id, true)
                      )
                    }
                    icon={<FaRegThumbsUp fontSize={20} />}
                  >
                    Promote
                  </MenuItem>
                ))}
              <MenuItem
                onClick={() =>
                  showPrompt(
                    'red',
                    'Delete account',
                    `Are you sure to delete "${value.email}"?`,
                    'Delete',
                    () => () => handleDelete(value._id)
                  )
                }
                color="red"
                icon={<RiDeleteBinLine fontSize={20} />}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        )
      },
      {
        accessor: 'email',
        disableSortBy: true
      },
      {
        accessor: 'role',
        disableSortBy: true
      },
      {
        accessor: 'latestSessionFormated',
        disableSortBy: true
      }
    ],
    [isProcessing]
  )

  useEffect(() => {
    const selected = usersData.filter((e, idx) => {
      return Object.keys(forceSelectionIdxs).some(id => {
        return idx === Number(id)
      })
    })
    const selectedId = selected.map(row => row._id)
    setSelectedRows(selectedId)

    const adminStatuses = (selected ?? []).map(row => row.isAdmin)
    const willAdmin = adminStatuses
      .sort(
        (a, b) =>
          adminStatuses.filter(v => v === a).length -
          adminStatuses.filter(v => v === b).length
      )
      .pop()

    setAdminState(willAdmin)
  }, [forceSelectionIdxs])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Layout title="UsersTable">
      {isReady ? (
        <>
          <Flex
            h="55px"
            bg="#fff"
            m="0 -1rem .75rem -1rem"
            justifyContent="center"
            border="1px solid #888"
          >
            <Flex h="100%" w="100%" mx={4} maxW="50em" gap={2}>
              {isSearching || <BackLink href="/settings" title="Settings" />}
              <Flex
                gap={3}
                w={{ base: isSearching && '100%', sm: 'unset' }}
                display={{ base: isSearching ? 'flex' : 'none', sm: 'flex' }}
                alignItems="center"
                ml="auto"
              >
                <InputGroup w={{ base: '100%', sm: 'auto' }} h="fit-content">
                  <InputLeftElement zIndex={0}>
                    <SearchIcon color="#718096" fontSize={22} />
                  </InputLeftElement>
                  <Input
                    w={{ base: '100%', sm: '40vw' }}
                    maxW={{ base: 'unset', sm: '240' }}
                    value={globalFilter ?? ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                    borderColor="#999"
                  />
                  {globalFilter && (
                    <InputRightElement w={10}>
                      <Button
                        variant="unstyled"
                        display="flex"
                        color="#777"
                        size="md"
                        onClick={() => setGlobalFilter('')}
                      >
                        <IoCloseCircle />
                      </Button>
                    </InputRightElement>
                  )}
                </InputGroup>
                {isSearching && (
                  <button
                    style={{ fontWeight: '500' }}
                    onClick={() => setSearching(false)}
                  >
                    Cancel
                  </button>
                )}
              </Flex>
              <IconButton
                my="auto"
                ml="auto"
                display={{ base: isSearching ? 'none' : 'flex', sm: 'none' }}
                icon={<BiSearchAlt2 color="#2D3748" fontSize={22} />}
                onClick={() => setSearching(true)}
              />
            </Flex>
          </Flex>
          <Flex position="relative" flexGrow={1} mb={3}>
            <Flex
              left="50%"
              transform="translateX(-50%)"
              position="absolute"
              maxH="100%"
              w="100%"
              p={4}
              maxW="50em"
              bg="#fff"
              borderRadius="xl"
              overflow="hidden"
              m="0 auto"
              boxShadow="lg"
              flexDirection="column"
            >
              <Heading mb={3} ml={2} fontSize={24}>
                Accounts
              </Heading>
              {!!selectedRows.length && (
                <Flex justifyContent="center" mb={3}>
                  <Flex
                    w="100%"
                    bg="blue.500"
                    borderRadius="md"
                    py={3}
                    px={{ base: 5, md: 8 }}
                    mx={3}
                    justifyContent="space-between"
                    color="#fff"
                    maxW="50em"
                  >
                    <Flex alignItems="center" gap={4}>
                      <Text fontWeight="semibold">
                        {selectedRows.length} selected
                      </Text>
                    </Flex>
                    <HStack>
                      <Button
                        size="sm"
                        variant="white"
                        color="blue.500"
                        onClick={
                          selectedSelf
                            ? () => handleDeleteBulk(selectedRows)
                            : () => handleRoleBulk(selectedRows, !AdminState)
                        }
                      >
                        {selectedSelf
                          ? 'Delete'
                          : AdminState
                          ? 'Demote'
                          : 'Promote'}
                      </Button>
                      {selectedSelf || (
                        <Button
                          size="sm"
                          variant="transparent"
                          border="1px solid #fff"
                          onClick={() => handleDeleteBulk(selectedRows)}
                        >
                          Delete
                        </Button>
                      )}
                    </HStack>
                  </Flex>
                </Flex>
              )}
              <DataTable
                columns={columns}
                data={usersData}
                hiddenColumns={invisibleColumns}
                globalFilter={globalFilter}
                defaultSortBy={[
                  { key: 'role', order: 'asc' },
                  { key: 'latestSession', order: 'desc' }
                ]}
                onChangeSelectedRowsId={selectedIds => {
                  setForceSelectionIdxs(selectedIds)
                }}
              />
            </Flex>
          </Flex>
          <ConfirmationDialog
            onClose={onClose}
            isOpen={isOpen}
            alertText={alertText}
            alertColor={alertColor}
            alertActionName={alertActionName}
            alertActionHandle={alertActionHandle}
            setProcessing={setProcessing}
            ref={cancelRef}
          />
        </>
      ) : (
        <Center w="100%" h="100%">
          <LoadingTag m="auto" />
        </Center>
      )}
    </Layout>
  )
}

UsersTable.auth = {
  authenticate: true,
  isAdmin: true
}

export default UsersTable
