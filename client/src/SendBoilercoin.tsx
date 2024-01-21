import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	FormControl,
	FormLabel,
	FormHelperText,
	Input,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberIncrementStepper,
	NumberDecrementStepper,
	Button,
	Alert,
	AlertIcon,
	Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAuthSession } from "aws-amplify/auth";

export default function SendBoilercoin({ user }: { user: string }) {
	const queryClient = useQueryClient();
	const [recipient, setRecipient] = useState("");
	const [amount, setAmount] = useState(0);

	const { isPending, isError, isSuccess, mutateAsync } = useMutation({
		mutationFn: async () => {
			const authorization = (await fetchAuthSession()).tokens ?? {
				accessToken: "",
				idToken: "",
			};
			const transaction = {
				sender: user,
				recipient: recipient.toLocaleLowerCase(),
				amount: amount,
				auth: authorization.accessToken.toString(),
			};
			const res = await fetch("http://127.0.0.1:8000/transfer", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(transaction),
			});
			const json = await res.json();
			if (res.status !== 200) {
				throw new Error(JSON.stringify(json));
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user_blockchain_data"] });
			queryClient.invalidateQueries({ queryKey: ["users_top"] });
		},
	});

	return (
		<Card className="col-span-12 xl:col-span-6">
			<CardHeader className="!pb-2">
				<h2 className="text-3xl">Send Boilercoin</h2>
			</CardHeader>
			<CardBody>
				{isError && (
					<Alert className="mb-4" status="error">
						<AlertIcon />
						Your Boilercoin could not be transferred.
					</Alert>
				)}
				{isPending && (
					<Alert className="mb-4" status="info">
						<AlertIcon />
						Transferring money...
					</Alert>
				)}
				{isSuccess && (
					<Alert className="mb-4" status="success">
						<AlertIcon />
						Your money was successfully transferred!
					</Alert>
				)}
				<div>
					<FormControl className="mb-4">
						<FormLabel>Recipient</FormLabel>
						<Input
							value={recipient}
							onChange={(e) => setRecipient(e.target.value)}
						/>
						<FormHelperText>The wallet address of the recipient</FormHelperText>
					</FormControl>
					<FormControl>
						<FormLabel>Amount</FormLabel>
						<NumberInput
							value={amount}
							onChange={(newAmount) =>
								setAmount(newAmount === "" ? 0 : parseInt(newAmount))
							}
							min={0}>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
						<FormHelperText>The amount of Boilercoin to send</FormHelperText>
					</FormControl>
				</div>
			</CardBody>
			<CardFooter>
				<Button colorScheme="blue" onClick={() => mutateAsync()}>
					{isPending ? <Spinner /> : <span>Send</span>}
				</Button>
			</CardFooter>
		</Card>
	);
}
