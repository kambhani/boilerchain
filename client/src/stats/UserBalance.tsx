import { StatLabel, StatNumber, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

export default function UserBalance({ user }: { user: string }) {
	const { isPending, isError, data } = useQuery({
		queryKey: ["user_blockchain_data"],
		queryFn: () =>
			fetch(`${import.meta.env.VITE_API_URL}/user/${user}`).then((res) => res.json()),
	});

	if (isPending) {
		return (
			<>
				<StatLabel>Your Balance</StatLabel>
				<StatNumber>
					<Spinner />
				</StatNumber>
			</>
		);
	}
	if (isError) {
		return (
			<>
				<StatLabel>Your Balance</StatLabel>
				<StatNumber>???</StatNumber>
			</>
		);
	}

	return (
		<>
			<StatLabel>Your Balance</StatLabel>
			<StatNumber>{data.balance}</StatNumber>
		</>
	);
}
