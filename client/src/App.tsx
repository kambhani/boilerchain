import { Amplify } from "aws-amplify";
import {
	Authenticator,
	ThemeProvider,
	defaultDarkModeOverride,
	useTheme,
	View,
	Image,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
// @ts-ignore
import awsExports from "./aws-exports";
import { useDarkMode } from "usehooks-ts";
import { Button, IconButton } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	useColorMode,
	LightMode,
	Stat,
	StatLabel,
	StatNumber,
	StatGroup,
	StatHelpText,
	StatArrow,
	Container,
	Box,
	Heading,
	Stack,
	StackDivider,
	Text,
	Tabs,
	Tab,
	TabList,
	TabPanels,
	TabPanel,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	FormControl,
	FormLabel,
	FormHelperText,
	Input,
	Code,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BlocksMined from "./BlocksMined";

Amplify.configure(awsExports);

const components = {
	Header() {
		const { tokens } = useTheme();

		return (
			<View textAlign="center" padding={tokens.space.large}>
				<Image className="w-48 h-auto" alt="Amplify logo" src="/penrose.svg" />

				<h1 className="text-4xl text-slate-950 dark:text-slate-50">
					Boilerchain
				</h1>
			</View>
		);
	},
};

function App() {
	// Color scheme
	const { isDarkMode, toggle } = useDarkMode();
	const { colorMode, toggleColorMode } = useColorMode();

	// Form field values
	const [receipient, setReceipient] = useState("");
	const [amount, setAmount] = useState(0);
	const [blockNumber, setBlockNumber] = useState(0);

	const switchTheme = () => {
		toggle();
		toggleColorMode();
	};

	const theme = {
		overrides: [defaultDarkModeOverride],
	};

	useEffect(() => {
		if (
			(isDarkMode && colorMode === "light") ||
			(!isDarkMode && colorMode === "dark")
		)
			toggleColorMode();
	}, [isDarkMode]);

	return (
		<div className={isDarkMode ? "dark" : ""}>
			<div className="flex w-[100vw] min-h-[100vh] justify-center items-center bg-slate-50 dark:bg-slate-950">
				<div className="">
					<ThemeProvider
						theme={theme}
						colorMode={isDarkMode ? "dark" : "light"}>
						<Authenticator className="m-8" components={components}>
							{({ signOut, user }) => (
								<main className="w-[100vw]">
									<div className="h-20 w-full items-center flex bg-sky-200 dark:bg-sky-900 sticky top-0 z-10 border-b border-slate-950 dark:border-slate-50">
										<div className="w-11/12 sm:w-3/4 mx-auto h-full flex items-center justify-between">
											<div className="inline-flex h-full items-center">
												<Image
													className="w-12 h-auto mr-2"
													alt="Amplify logo"
													src="/penrose.svg"
												/>
												<h2 className="text-2xl sm:text-3xl text-slate-950 dark:text-slate-50 font-semibold">
													Boilerchain
												</h2>
											</div>
											<div className="flex gap-4">
												<Button
													colorScheme={isDarkMode ? "whatsapp" : "green"}
													variant="solid"
													onClick={signOut}>
													Sign out
												</Button>
												<LightMode>
													<IconButton
														onClick={() => switchTheme()}
														aria-label="Change color theme"
														icon={isDarkMode ? <SunIcon /> : <MoonIcon />}
													/>
												</LightMode>
											</div>
										</div>
									</div>
									<div className="p-4">
										<div className="grid grid-cols-12 gap-4">
											<div className="col-span-12 bg-emerald-200 dark:bg-emerald-900 rounded-lg">
												<Container className="py-4 px-2 sm:px-4">
													<StatGroup>
														<Stat>
															<BlocksMined />
														</Stat>

														<Stat>
															<StatLabel>Your Blocks</StatLabel>
															<StatNumber>45</StatNumber>
															<StatHelpText>
																<StatArrow type="decrease" />
																9.05%
															</StatHelpText>
														</Stat>
														<Stat>
															<StatLabel>Your Balance</StatLabel>
															<StatNumber>2980</StatNumber>
															<StatHelpText>
																<StatArrow type="decrease" />
																11.05%
															</StatHelpText>
														</Stat>
													</StatGroup>
												</Container>
											</div>
											<Card
												size="md"
												className="col-span-12 sm:col-span-6 xl:col-span-3">
												<CardHeader>
													<h2 className="text-3xl">Top miners</h2>
												</CardHeader>
												<CardBody>
													<Stack divider={<StackDivider />} spacing="4">
														<Box>
															<Heading size="xs" textTransform="uppercase">
																Name 1
															</Heading>
															<Text pt="2" fontSize="sm">
																23 blocks mined
															</Text>
														</Box>
														<Box>
															<Heading size="xs" textTransform="uppercase">
																Name 2
															</Heading>
															<Text pt="2" fontSize="sm">
																20 blocks mined
															</Text>
														</Box>
														<Box>
															<Heading size="xs" textTransform="uppercase">
																Name 3
															</Heading>
															<Text pt="2" fontSize="sm">
																17 blocks mined
															</Text>
														</Box>
													</Stack>
												</CardBody>
											</Card>
											<Card className="col-span-12 sm:col-span-6 xl:col-span-3">
												<CardHeader className="!pb-2">
													<h2 className="text-3xl">Latest Block</h2>
												</CardHeader>
												<CardBody className="font-mono whitespace-pre-wrap">
													<div className="px-4 py-8 bg-slate-200 dark:bg-slate-950">
														{JSON.stringify(
															{ name: 1, index: 2, person: 3, user: 4 },
															null,
															" "
														)}
													</div>
												</CardBody>
											</Card>
											<Card className="col-span-12 xl:col-span-6">
												<CardHeader className="!pb-2">
													<h2 className="text-3xl">Generate Next Block</h2>
												</CardHeader>
												<CardBody>
													<Tabs
														variant={
															isDarkMode ? "solid-rounded" : "soft-rounded"
														}
														colorScheme="purple">
														<TabList className="flex w-full">
															<Tab className="grow">
																Generate in the browser
															</Tab>
															<Tab className="grow">Generate locally</Tab>
														</TabList>
														<TabPanels>
															<TabPanel>
																<p>one!</p>
															</TabPanel>
															<TabPanel>
																<p>two!</p>
															</TabPanel>
														</TabPanels>
													</Tabs>
												</CardBody>
											</Card>
											<Card className="col-span-12 xl:col-span-6">
												<CardHeader className="!pb-2">
													<h2 className="text-3xl">Send Boilercoin</h2>
												</CardHeader>
												<CardBody>
													<div>
														<FormControl className="mb-4">
															<FormLabel>Receipient</FormLabel>
															<Input
																value={receipient}
																onChange={(e) => setReceipient(e.target.value)}
															/>
															<FormHelperText>
																The wallet address of the receipient
															</FormHelperText>
														</FormControl>
														<FormControl>
															<FormLabel>Amount</FormLabel>
															<NumberInput
																value={amount}
																onChange={(newAmount) =>
																	setAmount(
																		newAmount === "" ? 0 : parseInt(newAmount)
																	)
																}
																min={0}
																max={20}>
																<NumberInputField />
																<NumberInputStepper>
																	<NumberIncrementStepper />
																	<NumberDecrementStepper />
																</NumberInputStepper>
															</NumberInput>
															<FormHelperText>
																The amount of Boilercoin to send
															</FormHelperText>
														</FormControl>
													</div>
												</CardBody>
												<CardFooter>
													<Button colorScheme="purple">Send</Button>
												</CardFooter>
											</Card>
											<Card className="col-span-12 sm:col-span-6 xl:col-span-3">
												<CardHeader className="!pb-2">
													<h2 className="text-3xl">Receive Boilercoin</h2>
												</CardHeader>
												<CardBody>
													<h3 className="font-semibold mb-3">
														Senders need your wallet address for you to receive
														Boilercoin. This value is unique to every person.
														Your wallet address is:
													</h3>
													<div className="flex justify-center">
														<Code colorScheme="purple">{user?.userId}</Code>
													</div>
												</CardBody>
											</Card>
											<Card className="col-span-12 sm:col-span-6 xl:col-span-3">
												<CardHeader className="!pb-2">
													<h2 className="text-3xl">View Block Info</h2>
												</CardHeader>
												<CardBody>
													<div className="grid grid-cols-4 mb-4 gap-2">
														<FormControl className="col-span-3">
															<FormLabel>Amount</FormLabel>
															<NumberInput
																value={blockNumber}
																onChange={(newBlockNumber) =>
																	setAmount(
																		newBlockNumber === ""
																			? 0
																			: parseInt(newBlockNumber)
																	)
																}
																min={0}
																max={20}>
																<NumberInputField />
																<NumberInputStepper>
																	<NumberIncrementStepper />
																	<NumberDecrementStepper />
																</NumberInputStepper>
															</NumberInput>
															<FormHelperText>
																The block number to retrieve
															</FormHelperText>
														</FormControl>
														<div className="flex flex-col justify-center">
															<Button colorScheme="purple">Query</Button>
														</div>
													</div>

													<div className="px-4 py-8 bg-slate-200 dark:bg-slate-950 font-mono whitespace-pre-wrap">
														{JSON.stringify(
															{ name: 1, index: 2, person: 3, user: 4 },
															null,
															" "
														)}
													</div>
												</CardBody>
											</Card>
										</div>
									</div>
									<div className="mt-20 p-4 sm:p-8 bg-slate-300 dark:bg-slate-800 grid grid-cols-12 gap-4">
										<Image
											className="col-span-3 md:col-span-2 h-auto mr-2"
											alt="Amplify logo"
											src="/penrose.svg"
										/>
										<div className="col-span-6 md:col-span-8 flex justify-center items-center">
											<div>
												<h2 className="text-xl sm:text-2xl md:text-4xl xl:text-6xl font-semibold text-center text-sky-700 dark:text-sky-400">
													Boilerchain
												</h2>
												<h3 className="text-sm sm:text-xl md:text-xl xl:text-4xl font-semibold text-center">
													Purdue's first open-source cryptocurrency
												</h3>
											</div>
										</div>
										<Image
											className="col-span-3 md:col-span-2 h-auto mr-2"
											alt="Amplify logo"
											src="/penrose.svg"
										/>
									</div>
								</main>
							)}
						</Authenticator>
					</ThemeProvider>
				</div>
			</div>
		</div>
	);
}

export default App;
