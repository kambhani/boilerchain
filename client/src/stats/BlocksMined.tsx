import { StatLabel, StatNumber, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

export default function BlocksMined() {
	const { isPending, isError, data } = useQuery({
		queryKey: ["blocks_count"],
		queryFn: () =>
			fetch("http://127.0.0.1:8000/blocks/count").then((res) => res.json()),
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
