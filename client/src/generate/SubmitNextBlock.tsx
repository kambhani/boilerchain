import {
	Textarea,
	Text,
	Button,
	Alert,
	AlertIcon,
	Spinner,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

export default function SubmitNextBlock() {
	const queryClient = useQueryClient();
	const [block, setBlock] = useState("");

	const { isPending, isError, isSuccess, mutateAsync } = useMutation({
		mutationFn: async () => {
			const authorization = (await fetchAuthSession()).tokens ?? {
				accessToken: "",
				idToken: "",
			};
			const res = await fetch(`${import.meta.env.VITE_API_URL}/block/add`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...JSON.parse(block),
					auth: authorization.accessToken.toString(),
				}),
			});
			const json = await res.json();
			if (res.status !== 200) {
				throw new Error(JSON.stringify(json));
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["blocks_count"] });
			queryClient.invalidateQueries({ queryKey: ["user_blockchain_data"] });
			queryClient.invalidateQueries({ queryKey: ["last_block"] });
			queryClient.invalidateQueries({ queryKey: ["users_top"] });
		},
	});

	return (
		<div>
			<Text className="font-semibold mb-2">Block JSON</Text>
			{isError && (
				<Alert className="mb-4" status="error">
					<AlertIcon />
					Your block could not be added to Boilerchain
				</Alert>
			)}
			{isPending && (
				<Alert className="mb-4" status="info">
					<AlertIcon />
					Adding to blockchain...
				</Alert>
			)}
			{isSuccess && (
				<Alert className="mb-4" status="success">
					<AlertIcon />
					Your block has been added to Boilerchain.
				</Alert>
			)}
			<Textarea
				className="mb-4 !h-60 font-mono"
				value={block}
				onChange={(e) => setBlock(e.target.value)}
				placeholder="Enter the next block here"
				resize="none"
			/>
			<Button colorScheme="blue" onClick={() => mutateAsync()}>
				{isPending ? <Spinner /> : <span>Submit Block</span>}
			</Button>
		</div>
	);
}
