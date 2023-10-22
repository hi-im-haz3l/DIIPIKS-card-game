import { useEffect, forwardRef, useRef } from 'react'
import {
  useTable,
  usePagination,
  useSortBy,
  useRowSelect,
  useGlobalFilter,
  useMountedLayoutEffect
} from 'react-table'
import {
  Flex,
  Table as ChakraTable,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  IconButton,
  ButtonGroup,
  FormControl,
  Checkbox
} from '@chakra-ui/react'
import {
  BsChevronBarLeft,
  BsChevronLeft,
  BsChevronRight,
  BsChevronBarRight,
  BsArrowDown,
  BsArrowUp,
  BsArrowDownUp
} from 'react-icons/bs'
import ReactSelect from 'react-select'

const EmptyRow = ({ colSpan, text }) => {
  return (
    <Tr bgColor="gray.100">
      <Td colSpan={colSpan}>
        <Flex w="full" justify="center" py="100px">
          <Text fontSize="sm">{text}</Text>
        </Flex>
      </Td>
    </Tr>
  )
}

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef()
  const resolvedRef = ref || defaultRef

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return (
    <Checkbox
      key={Math.random()}
      isChecked={rest.checked}
      isIndeterminate={indeterminate}
      ref={resolvedRef}
      {...rest}
    />
  )
})

const colourStyles = {
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected && '#3182ce'
  }),
  control: base => ({
    ...base,
    borderRadius: '.375em',
    borderColor: '#e2e8f0'
  })
}

const DataTable = ({
  columns,
  data,
  pageSizes = [10, 40, 100],
  size = 'sm',
  variant = 'simple',
  hiddenColumns,
  defaultSortBy,
  onChangeSelectedRowsId,
  globalFilter,
  ...rest
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, selectedRowIds }
  } = useTable(
    {
      data,
      columns,
      initialState: {
        pageIndex: 0,
        hiddenColumns: hiddenColumns,
        sortBy: defaultSortBy.map(({ key, order }) => ({
          id: key,
          [order]: true
        }))
      }
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        {
          id: 'selection',
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          )
        },
        ...columns
      ])
    }
  )

  useMountedLayoutEffect(() => {
    onChangeSelectedRowsId && onChangeSelectedRowsId(selectedRowIds)
  }, [selectedRowIds])

  useEffect(() => {
    setGlobalFilter(globalFilter)
  }, [globalFilter])

  const countCols = () => {
    const hgLen = headerGroups.length
    if (hgLen > 0) {
      return headerGroups[hgLen - 1].headers.length
    }
    return 0
  }

  const pageSelectOption = pageOptions.map(pageNumber => {
    return { value: pageNumber, label: pageNumber + 1 }
  })

  const displaySelectOption = pageSizes.map(pageSize => {
    return { value: pageSize, label: `Display ${pageSize} items` }
  })

  return (
    <Flex w="full" direction="column" overflowY="hidden">
      <Flex overflow="auto">
        <ChakraTable
          {...getTableProps()}
          size={size}
          variant={variant}
          {...rest}
        >
          <Thead
            style={{
              borderBottom: '2px solid #ddd'
            }}
          >
            {headerGroups.map((headerGroup, i) => (
              <Tr
                key={`headerGroup-${i}`}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column, idx) => (
                  <Th
                    key={`column-${idx}-${i}`}
                    px={{ base: 1, md: 2, lg: 3 }}
                    {...column.getHeaderProps(
                      column.getSortByToggleProps(
                        column.canSort && { title: `Sort by ${column.Header}` }
                      )
                    )}
                  >
                    <Flex
                      justifyContent="center"
                      gap={2}
                      alignItems="center"
                      mb={2}
                    >
                      {column.render('Header')}
                      {column.canSort &&
                        (column.isSorted ? (
                          column.isSortedDesc ? (
                            <BsArrowDown />
                          ) : (
                            <BsArrowUp />
                          )
                        ) : (
                          <BsArrowDownUp />
                        ))}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page?.map((row, i) => {
              prepareRow(row)
              return (
                <Tr
                  key={`row-${i}`}
                  {...row.getRowProps()}
                  _hover={variant === 'simple' && { bgColor: 'blue.50' }}
                >
                  {row.cells.map((cell, idx) => {
                    return (
                      <Td
                        key={`cell-${idx}-${i}`}
                        px={{ base: 1, md: 2, lg: 3 }}
                        textAlign="center"
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
            {page?.length === 0 && (
              <EmptyRow colSpan={countCols()} text="No data" />
            )}
          </Tbody>
        </ChakraTable>
      </Flex>
      <Flex
        flexWrap={{ base: 'wrap', md: 'nowrap' }}
        justifyContent={{ base: 'space-evenly', md: 'space-between' }}
        columnGap={4}
        mt={3}
      >
        <Flex mt={3} order={0}>
          <ReactSelect
            value={{ value: pageSize, label: `Display ${pageSize} items` }}
            onChange={e => {
              if (e) setPageSize(e.value)
              else setPageSize(pageSizes[0])
            }}
            options={displaySelectOption}
            styles={colourStyles}
          />
        </Flex>
        <ButtonGroup mt={3} order={{ base: 2, md: 1 }} isAttached>
          <IconButton
            icon={<BsChevronBarLeft />}
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          />
          <IconButton
            icon={<BsChevronLeft />}
            onClick={previousPage}
            disabled={!canPreviousPage}
          />
          <Flex align="center" mx={3}>
            <Text as="strong" ml={2} fontSize={15} whiteSpace="nowrap">
              {pageIndex * 10 + (page.length && 1)} -{' '}
              {pageIndex * 10 + page.length} of {pageOptions?.length}
            </Text>
          </Flex>
          <IconButton
            icon={<BsChevronRight />}
            onClick={nextPage}
            disabled={!canNextPage}
          />
          <IconButton
            icon={<BsChevronBarRight />}
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          />
        </ButtonGroup>
        <Flex
          as={FormControl}
          mt={3}
          w="unset"
          order={{ base: 1, md: 2 }}
          gap={2}
          fontSize={15}
        >
          <Text display="flex" alignItems="center" justifyContent="flex-end">
            Go to
          </Text>
          <ReactSelect
            value={{ value: pageIndex, label: pageIndex + 1 }}
            onChange={e => {
              if (e) gotoPage(e.value)
              else gotoPage(pageOptions[0])
            }}
            options={pageSelectOption}
            styles={colourStyles}
          />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default DataTable
