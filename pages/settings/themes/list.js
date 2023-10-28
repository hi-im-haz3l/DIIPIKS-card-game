import NextLink from 'next/link'
import { useRouter } from 'next/router'
import DataTable from 'components/data-table'
import {
  Text,
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
  useToast,
  Divider,
  Heading,
  AspectRatio,
  Tooltip,
  Box
} from '@chakra-ui/react'
import { SearchIcon, SmallAddIcon } from '@chakra-ui/icons'
import axios from 'axios'
import { useState, useEffect, useMemo, useRef } from 'react'
import Layout from 'components/layouts/article'
import {
  BsThreeDotsVertical,
  BsFillPauseFill,
  BsFillPlayFill,
  BsEyedropper
} from 'react-icons/bs'
import { MdPublic } from 'react-icons/md'
import { BiSearchAlt2, BiSolidHide, BiPencil, BiLink } from 'react-icons/bi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { IoCloseCircle } from 'react-icons/io5'
import BackLink from 'components/back-link'
import ConfirmationDialog from 'components/confirm-dialog'
import LoadingTag from 'components/loading-tag'

const ColorsTable = ({ baseURL }) => {
  const toast = useToast()
  const router = useRouter()
  const [SuspensionState, setSuspensionState] = useState(null)

  const [colorsData, setColorsData] = useState([])
  const [isReady, setReady] = useState(false)
  const [isProcessing, setProcessing] = useState(false)
  const [isSearching, setSearching] = useState(false)

  const invisibleColumns = [
    'title',
    'publicity',
    'createdDateFormated',
    'updatedDateFormated',
    'cardDesigns',
    'colors'
  ]
  const [selectedRows, setSelectedRows] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectionIds, setSelectionIds] = useState([])

  const [alertColor, setAlertColor] = useState('red')
  const [alertText, setAlertText] = useState('')
  const [alertActionName, setAlertActionName] = useState('Proceed')
  const [alertActionHandle, setAlertActionHandle] = useState(undefined)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)

  const ColorPill = ({ colorCode, colorKey, themeTitle }) => (
    <Tooltip label={`${themeTitle}'s ${colorKey}`} hasArrow>
      <Box
        h={7}
        w={7}
        bg={colorCode}
        borderRadius="md"
        boxShadow="md"
        border="1px solid #00000024"
        position="relative"
        overflow="hidden"
        _hover={{ '&>div': { opacity: 1 } }}
        onClick={e => {
          e.stopPropagation()
          navigator.clipboard.writeText(colorCode)
          toast({
            title: 'Coppied!',
            status: 'success',
            duration: 5000,
            isClosable: true
          })
        }}
      >
        <Flex
          position="absolute"
          top={0}
          right={0}
          bottom={0}
          left={0}
          opacity={0}
          bg="#00000036"
          justifyContent="center"
          alignItems="center"
          color="#fff"
        >
          <BsEyedropper />
        </Flex>
      </Box>
    </Tooltip>
  )

  const CardFrame = ({ url, ...props }) => (
    <AspectRatio
      display="inline-flex"
      overflow="hidden"
      w="47%"
      ratio={18 / 25}
      boxShadow="#20202363 0 .3em .5em"
      {...props}
    >
      <img
        src={url}
        alt="card-design"
        width="100%"
        height="auto"
        loading="lazy"
      />
    </AspectRatio>
  )

  const dateFormater = unixTimestamp =>
    new Date(unixTimestamp).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

  const formatData = data =>
    (data ?? []).map(entry => ({
      ...entry,
      themeData: {
        title: entry.title,
        isPublic: entry.isPublic,
        themeId: entry._id
      },
      cardData: {
        cardDesigns: entry.cardDesigns,
        themeId: entry._id
      },
      colorData: {
        title: entry.title,
        colors: entry.colors,
        themeId: entry._id
      },
      action: {
        _id: entry._id,
        title: entry.title,
        isPublic: entry.isPublic
      },
      publicity: entry.isPublic ? 'Public' : 'Private',
      createdDateFormated: dateFormater(entry.createdDate),
      updatedDateFormated: dateFormater(entry.updatedDate)
    }))

  const fetchData = () => {
    setReady(false)

    axios
      .get('/api/admin/themes/fetch-themes')
      .then(response => {
        const formatedData = formatData(response.data)
        setColorsData(formatedData)
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
      .patch(`/api/admin/themes/${endpoint}`, options)
      .then(response => {
        setColorsData(colors => {
          if (isBulk) {
            ;(response.data ?? []).forEach(colorData => {
              const idx = colors.findIndex(color => color._id === colorData._id)
              colors[idx] = colorData
            })
          } else {
            const colorData = response.data
            const idx = colors.findIndex(color => color._id === colorData._id)
            colors[idx] = colorData
          }

          return formatData(colors)
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

  const handleState = (colorId, publicityState) => {
    handleUpdate('update-state-by-id', {
      _id: colorId,
      payload: { isPublic: publicityState }
    })
  }

  const handleStateBulk = (colorIds, publicityState) => {
    handleUpdate(
      'update-state-by-id-bulk',
      {
        _id: colorIds,
        payload: { isPublic: publicityState }
      },
      true
    )
    setProcessing(true)
  }

  const handleRemoveTheme = (endpoint, options, colorIds, isBulk = false) => {
    setProcessing(true)
    axios
      .delete(`/api/admin/themes/${endpoint}`, options)
      .then(() => {
        setColorsData(colors => {
          if (isBulk) {
            ;(colorIds ?? []).forEach(colorId => {
              const idx = colors.findIndex(color => color._id === colorId)
              colors.splice(idx, 1)
            })
          } else {
            const idx = colors.findIndex(color => color._id === colorIds)
            colors.splice(idx, 1)
          }

          return formatData(colors)
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

  const handleDelete = colorId => {
    handleRemoveTheme(
      'delete-by-id',
      {
        data: { _id: colorId }
      },
      colorId
    )
  }

  const handleDeleteBulk = colorIds => {
    handleRemoveTheme(
      'delete-by-id-bulk',
      {
        data: { _id: colorIds }
      },
      colorIds,
      true
    )
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Card designs',
        accessor: 'cardData',
        Cell: ({ value }) =>
          Object.keys(value.cardDesigns || {}).map((key, i, arr) => (
            <CardFrame
              key={`${key}-${value.themeId}`}
              mr={i + 1 < arr.length && '6%'}
              url={value.cardDesigns[key]}
            />
          ))
      },
      {
        Header: 'Title',
        accessor: 'themeData',
        Cell: ({ value }) => (
          <Flex alignItems="center" maxW={{ base: '200px', sm: '300px' }}>
            <Text
              maxW={100}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              mx={1}
            >
              {value.title}
            </Text>
            {value.isPublic ? (
              <Tooltip label="Variant's link" hasArrow>
                <HStack
                  p={1}
                  gap={1}
                  borderRadius="md"
                  onClick={e => {
                    e.stopPropagation()
                    navigator.clipboard.writeText(
                      `${baseURL}/variant/${value.themeId}`
                    )
                    toast({
                      title: 'Coppied!',
                      status: 'success',
                      duration: 5000,
                      isClosable: true
                    })
                  }}
                  _hover={{ backgroundColor: '#00000025' }}
                >
                  <MdPublic />
                  <BiLink fontSize={19} />
                </HStack>
              </Tooltip>
            ) : (
              <BiSolidHide color="#E53E3E" fontSize={20} />
            )}
            <Box className="table-row-hover-icon" opacity={0}>
              <BiPencil fontSize={20} />
            </Box>
          </Flex>
        )
      },
      {
        Header: 'Palates',
        accessor: 'colorData',
        Cell: ({ value }) => (
          <Flex gap={2} justifyContent="center" alignItems="center">
            {Object.keys(value.colors || {}).map(
              palateKey =>
                (palateKey === 'primary' || palateKey === 'secondary') && (
                  <ColorPill
                    key={`${value.themeId}-${palateKey}`}
                    colorKey={palateKey}
                    themeTitle={value.title}
                    colorCode={value.colors[palateKey]}
                  />
                )
            )}
          </Flex>
        )
      },
      {
        Header: 'Updated on',
        accessor: 'updatedDate',
        Cell: ({ value }) => (
          <Flex
            justifyContent="center"
            alignItems="center"
            gap={1}
            flexWrap="nowrap"
          >
            <Text>{dateFormater(value)}</Text>
          </Flex>
        )
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
              onClick={e => e.stopPropagation()}
            />
            <MenuList size="sm" fontSize={16} minW={28}>
              {value.isPublic ? (
                <>
                  <MenuItem
                    icon={<BiLink fontSize={20} />}
                    onClick={e => {
                      e.stopPropagation()
                      navigator.clipboard.writeText(
                        `${baseURL}/variant/${value.themeId}`
                      )
                      toast({
                        title: 'Coppied!',
                        status: 'success',
                        duration: 5000,
                        isClosable: true
                      })
                    }}
                  >
                    Share
                  </MenuItem>
                  <MenuItem
                    onClick={e => {
                      e.stopPropagation()
                      showPrompt(
                        'yellow',
                        'De-listed color?',
                        `Are you sure to suspend "${value.title}"?`,
                        'Suspend',
                        () => () => handleState(value._id, false)
                      )
                    }}
                    icon={<BsFillPauseFill fontSize={20} />}
                  >
                    Suspend
                  </MenuItem>
                </>
              ) : (
                <MenuItem
                  onClick={e => {
                    e.stopPropagation()
                    showPrompt(
                      'yellow',
                      'Make color public?',
                      `Are you sure to allow "${value.title}" to go public?`,
                      'Publish',
                      () => () => handleState(value._id, true)
                    )
                  }}
                  icon={<BsFillPlayFill fontSize={20} />}
                >
                  Publish
                </MenuItem>
              )}
              <NextLink
                href={`edit?themeId=${value._id}`}
                scroll={false}
                passHref
              >
                <MenuItem icon={<BiPencil fontSize={20} />}>Edit</MenuItem>
              </NextLink>
              <Divider borderWidth="1px" />
              <MenuItem
                onClick={e => {
                  e.stopPropagation()
                  showPrompt(
                    'red',
                    'Remove theme',
                    `Are you sure to remove "${value.title}"?`,
                    'Delete',
                    () => () => handleDelete(value._id)
                  )
                }}
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
        accessor: 'title',
        disableSortBy: true
      },
      {
        accessor: 'publicity',
        disableSortBy: true
      },
      {
        accessor: 'updatedDateFormated',
        disableSortBy: true
      },
      {
        accessor: 'createdDateFormated',
        disableSortBy: true
      }
    ],
    [isProcessing]
  )

  useEffect(() => {
    const selected = colorsData.filter((e, idx) => {
      return Object.keys(selectionIds).some(id => {
        return idx === Number(id)
      })
    })
    const selectedId = selected.map(row => row._id)
    setSelectedRows(selectedId)

    const suspendStatuses = (selected ?? []).map(row => row.isPublic)
    const willSuspend = suspendStatuses
      .sort(
        (a, b) =>
          suspendStatuses.filter(v => v === a).length -
          suspendStatuses.filter(v => v === b).length
      )
      .pop()

    setSuspensionState(willSuspend)
  }, [selectionIds])

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Layout title="ColorsTable">
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
                    <SearchIcon color={'gray.500'} />
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
                variant="transparent"
                display={{ base: isSearching ? 'none' : 'flex', sm: 'none' }}
                icon={<BiSearchAlt2 color="#2D3748" fontSize={22} />}
                onClick={() => setSearching(true)}
              />
              {!isSearching && (
                <NextLink
                  href="./create"
                  scroll={false}
                  style={{ margin: 'auto 0' }}
                  passHref
                >
                  <Button
                    display={{ base: 'none', md: 'flex' }}
                    leftIcon={<SmallAddIcon />}
                    alignItems="center"
                    colorScheme="gray"
                  >
                    New theme
                  </Button>
                  <IconButton
                    display={{
                      base: isSearching ? 'none' : 'flex',
                      md: 'none'
                    }}
                    icon={<SmallAddIcon />}
                  />
                </NextLink>
              )}
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
                Themes
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
                        onClick={() =>
                          handleStateBulk(selectedRows, !SuspensionState)
                        }
                      >
                        {SuspensionState ? 'Suspend' : 'Resume'}
                      </Button>
                      <Button
                        size="sm"
                        variant="transparent"
                        border="1px solid #fff"
                        onClick={() => handleDeleteBulk(selectedRows)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Flex>
                </Flex>
              )}
              <DataTable
                columns={columns}
                data={colorsData}
                hiddenColumns={invisibleColumns}
                globalFilter={globalFilter}
                defaultSortBy={[{ key: 'updateDate', order: 'desc' }]}
                onChangeSelectedRowsId={selectedIds => {
                  setSelectionIds(selectedIds)
                }}
                onRowClick={rowData =>
                  rowData?._id && router.push(`edit?themeId=${rowData._id}`)
                }
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

ColorsTable.auth = {
  authenticate: true,
  isAdmin: true
}

export default ColorsTable
