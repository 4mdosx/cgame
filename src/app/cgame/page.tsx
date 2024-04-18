'use client'
import {
  Heading,
  Grid,
  Box,
  Code,
  Badge,
  Flex,
  Separator,
  Button,
  Card,
  Text,
  ScrollArea,
} from '@radix-ui/themes'
import DroneIcon from '@/components/icons/drone'

export default function App() {
  return (
    <div>
      <Grid columns="4" gap="4" width="auto">
        <Box
          gridColumnStart="1"
          gridColumnEnd="3"
          className="bg-white rounded-lg p-2"
        >
          <ScrollArea type="auto" scrollbars="horizontal">
            <Card className='w-1/3 border-cyan-500 border-2'>
              <Flex gap="3" align="center">
                <i className="bi-globe-asia-australia text-xl"></i>
                <Box>
                  <Text as="div" size="2" weight="bold">
                    Empty World
                  </Text>
                  <Text as="div" size="2" color="gray">
                    Earthly
                  </Text>
                </Box>
              </Flex>
            </Card>
          </ScrollArea>
        </Box>
        <Box>
          <div className='bg-white rounded-lg p-2 text-right'>
            <div style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.6' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '6px', height: '68px', width: '100%' }}></div>
          </div>
        </Box>
        <Box>
          <div className='bg-black rounded-lg p-2 text-right'>
            <i className="bi-hexagon-fill mr-1 text-emerald-500"></i>
            <span className='text-emerald-500'>100</span>
          </div>
        </Box>
        <Box gridColumnStart="1" gridColumnEnd="3">
          <Planet />
        </Box>
        <Box>
          <Ark />
        </Box>
      </Grid>
    </div>
  )
}

function Planet() {
  return (
    <div className="bg-white rounded-2xl p-2">
      <Heading size="5" mb="1">
        <i className="bi-buildings-fill text-xl mr-2"></i>
        Camp
      </Heading>
      <Flex gap="1" wrap="wrap">
        <Code>00:256:256:256:1024</Code>
        <Badge color="blue">
          <DroneIcon></DroneIcon>
          0/0
        </Badge>
        <Badge color="blue">
          <i className="bi-lightning-charge-fill"></i>
          0/0
        </Badge>
        <Badge color="blue">
          <i className="bi-columns-gap"></i>
          0/0
        </Badge>
      </Flex>
      <Box pb="4"></Box>
      <Buildings></Buildings>
    </div>
  )
}

function Buildings() {
  return (
    <div className="buildings-list">
      <Flex align="center" justify="between">
        <Flex>
          <i className="bi-share-fill mr-4 mt-4"></i>
          <div>
            <Heading size="4" mb="1" weight="medium">
              Supply Depot
            </Heading>
            <Flex gap="4">
              <div>
                <i className="bi-hexagon mr-1 text-orange-700"></i>
                <span className="text-orange-700">1</span>
              </div>
              <div>
                <i className="bi-alarm mr-1 text-orange-700"></i>
                <span className="text-orange-700">00:05:00</span>
              </div>
            </Flex>
          </div>
        </Flex>
        <Flex align="center">
          <Flex direction="column" gap="1">
            <Badge color="green" className="mr-2 text-lg">
              <DroneIcon height="1.5rem" width="1.5rem"></DroneIcon> +1
            </Badge>
          </Flex>
          <Button size="2">
            <i className="bi-hammer"></i>
          </Button>
        </Flex>
      </Flex>
      <Separator my="3" size="4" />
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
