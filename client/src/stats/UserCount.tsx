import { StatLabel, StatNumber, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

export default function UserCount() {
	const { isPending, isError, data } = useQuery({
		queryKey: ["user_count"],
		queryFn: () =>
			fetch("http://127.0.0.1:8000/users/count").then((res) => res.json()),
	});

	if (isPending) {
		return (
			<>
				<StatLabel>Total Users</StatLabel>
				<StatNumber>
					<Spinner />
				</StatNumber>
			</>
		);
	}
	if (isError) {
		return (
			<>
				<StatLabel>Total Users</StatLabel>
				<StatNumber>???</StatNumber>
			</>
		);
	}

	return (
		<>
			<StatLabel>Total Users</StatLabel>
			<StatNumber>{data.count}</StatNumber>
		</>
	);
}
