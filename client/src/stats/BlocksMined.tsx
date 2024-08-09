import { StatLabel, StatNumber, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

export default function BlocksMined() {
	const { isPending, isError, data } = useQuery({
		queryKey: ["blocks_count"],
		queryFn: () =>
			fetch(`${import.meta.env.VITE_API_URL}/blocks/count`).then((res) => res.json()),
	});

	if (isPending) {
		return (
			<>
				<StatLabel>Blockchain Length</StatLabel>
				<StatNumber>
					<Spinner />
				</StatNumber>
			</>
		);
	}
	if (isError) {
		return (
			<>
				<StatLabel>Blockchain Length</StatLabel>
				<StatNumber>???</StatNumber>
			</>
		);
	}

	return (
		<>
			<StatLabel>Blockchain Length</StatLabel>
			<StatNumber>{data.count}</StatNumber>
		</>
	);
}
