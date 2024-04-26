'use client'
import {
  Heading,
  Grid,
  Box,
  Badge,
  Flex,
  Separator,
  Button,
} from '@radix-ui/themes'
import APlist from '@/components/ap_list'
import APPanel from '@/components/ap_panel'
import Credit from '@/components/credit'

export default function App() {
  return (
    <div>
      <Grid columns="4" gap="4" width="auto">
        <APlist></APlist>
        <Box>
          <div className="bg-white rounded-lg p-2 text-right">
            <div
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.6' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '6px',
                height: '68px',
                width: '100%',
              }}
            ></div>
          </div>
        </Box>
        <Box>
          <Credit></Credit>
        </Box>
        <APPanel></APPanel>
      </Grid>
    </div>
  )
}

function Ark() {
  return (
    <div className="bg-white rounded-2xl p-2">
      <Heading size="5" mb="1">
        <i className="bi-safe2 text-xl mr-2"></i>
        Production
      </Heading>
      <Flex gap="1" wrap="wrap">
        <Badge color="blue">
          <i className="bi-hammer"></i>
          20
        </Badge>
        <Badge color="blue">
          <i className="bi-gear-wide-connected"></i>
          20
        </Badge>
        <Badge color="blue">
          <i className="bi-postage-fill"></i>0
        </Badge>
      </Flex>
      <Box pb="4"></Box>
      <Heading size="4" mb="1" weight="medium">
        Supply Depot
      </Heading>
      <Flex justify="between">
        <div>
          <i className="bi-alarm mr-1 text-orange-700"></i>
          <span className="text-orange-700">00:05:00</span>
        </div>
        <Button color="crimson" variant="soft" size="1">
          <i className="bi-x-lg"></i>
        </Button>
      </Flex>
      <Separator my="3" size="4" />
    </div>
  )
}
