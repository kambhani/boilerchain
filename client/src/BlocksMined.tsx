import {
	StatLabel,
	StatNumber,
	StatHelpText,
	StatArrow,
	Spinner,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

export default function BlocksMined() {
	const { isPending, isError, data } = useQuery({
		queryKey: ["block_count"],
		queryFn: () =>
			fetch("http://127.0.0.1:8000/user/system").then((res) => res.json()),
	});

	if (isPending) {
		return (
			<>
				<StatLabel>Blocks Mined</StatLabel>
				<StatNumber>
					<Spinner />
				</StatNumber>
			</>
		);
	}
	if (isError) {
		return (
			<>
				<StatLabel>Blocks Mined</StatLabel>
				<StatNumber>???</StatNumber>
			</>
		);
	}

	return (
		<>
			<StatLabel>Blocks Mined</StatLabel>
			<StatNumber>{data.count}</StatNumber>
			<StatHelpText>
				<StatArrow type="increase" />
				23.36%
			</StatHelpText>
		</>
	);
}
