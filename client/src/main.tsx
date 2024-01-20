import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import {
	ChakraProvider,
	ColorModeScript,
	extendTheme,
	type ThemeConfig,
} from "@chakra-ui/react";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const config: ThemeConfig = {
	initialColorMode: "system",
	useSystemColorMode: true,
};

const queryClient = new QueryClient();

const theme = extendTheme({ config });

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<ChakraProvider theme={theme} cssVarsRoot="body">
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				<App />
			</ChakraProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</React.StrictMode>
);
