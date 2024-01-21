import {
	Stack,
	StackDivider,
	Heading,
	Text,
	Box,
	Spinner,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

export default function ListTopUsers() {
	const { isPending, isError, data } = useQuery({
		queryKey: ["users_top"],
		queryFn: () =>
			fetch("http://127.0.0.1:8000/users/top").then((res) => res.json()),
	});

	if (isPending) {
		return (
			<div>
				<Spinner />
			</div>
		);
	}
	if (isError) {
		return <div>Could not retrieve top users</div>;
	}

	return (
		<Stack divider={<StackDivider />} spacing="4">
			{data.map((user: string[]) => (
				<Box key={user[0]}>
					<Heading size="xs" textTransform="uppercase">
						{user[0]}
					</Heading>
					<Text pt="2" fontSize="sm">
						{user[1]} Boilercoin
					</Text>
				</Box>
			))}
		</Stack>
	);
}
