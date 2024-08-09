import { TabPanels, TabPanel, Spinner } from "@chakra-ui/react";
import GenerateLocally from "./GenerateLocally";
import GenerateInBrowser from "./GenerateInBrowser";
import SubmitNextBlock from "./SubmitNextBlock";
import { useQuery } from "@tanstack/react-query";

export default function GenerateNextBlock({ user }: { user: string }) {
	const { isPending, isError, data } = useQuery({
		queryKey: ["blockchain_difficulty"],
		queryFn: () =>
			fetch(`${import.meta.env.VITE_API_URL}/blockchain/difficulty`).then((res) =>
				res.json()
			),
	});

	if (isPending) {
		return (
			<div className="flex w-full justify-center">
				<Spinner />
			</div>
		);
	}

	if (isError) {
		return <div className="">Could not load generation tools</div>;
	}

	return (
		<TabPanels>
			<TabPanel>
				<GenerateInBrowser user={user} difficulty={data.difficulty} />
			</TabPanel>
			<TabPanel>
				<GenerateLocally user={user} difficulty={data.difficulty} />
			</TabPanel>
			<TabPanel>
				<SubmitNextBlock />
			</TabPanel>
		</TabPanels>
	);
}
