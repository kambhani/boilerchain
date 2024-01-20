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

Amplify.configure(awsExports);

const components = {
	Header() {
		const { tokens } = useTheme();

		return (
			<View textAlign="center" padding={tokens.space.large}>
				<Image
					alt="Amplify logo"
					src="https://docs.amplify.aws/assets/logo-dark.svg"
				/>
				<h1 className="text-4xl text-slate-950 dark:text-slate-50">
					Boilerchain
				</h1>
			</View>
		);
	},
};

function App() {
	const { isDarkMode, toggle } = useDarkMode();
	const theme = {
		overrides: [defaultDarkModeOverride],
	};

	return (
		<div className={isDarkMode ? "dark" : ""}>
			<div className="flex w-[100vw] h-[100vh] justify-center items-center bg-slate-50 dark:bg-slate-950">
				<div className="">
					<ThemeProvider
						theme={theme}
						colorMode={isDarkMode ? "dark" : "light"}>
						<Authenticator className="m-1" components={components}>
							{({ signOut, user }) => (
								<main className="w-[100vw] h-[100vh]">
									<div className="h-16 w-full items-center flex bg-sky-400 dark:bg-sky-800 sticky">
										<div className="w-11/12 sm:w-2/3 mx-auto h-full flex items-center justify-between">
											<h2 className="text-2xl sm:text-3xl text-slate-950 dark:text-slate-50">
												Boilerchain
											</h2>
											<div className="flex gap-4">
												<Button
													colorScheme={isDarkMode ? "whatsapp" : "green"}
													variant="solid"
													onClick={signOut}>
													Sign out
												</Button>
												<IconButton
													onClick={toggle}
													aria-label="Change color theme"
													icon={isDarkMode ? <SunIcon /> : <MoonIcon />}
												/>
											</div>
										</div>
									</div>

									<h1>Hello {user?.username ?? "user"}!</h1>
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
