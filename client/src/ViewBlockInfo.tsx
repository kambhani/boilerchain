import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@chakra-ui/react";

export default function ViewBlockInfo({
	blockNumber,
}: {
	blockNumber: number;
}) {
	const { isPending, isError, data } = useQuery({
		queryKey: ["block", blockNumber],
		queryFn: () =>
			fetch(`http://127.0.0.1:8000/block/${blockNumber}`).then((res) =>
				res.json()
			),
	});

	if (isPending) {
		return (
			<div className="px-4 py-8 bg-slate-200 dark:bg-slate-950 font-mono whitespace-pre-wrap">
				<Spinner />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="px-4 py-8 bg-slate-200 dark:bg-slate-950 font-mono whitespace-pre-wrap">
				Could not load last block
			</div>
		);
	}

	return (
		<div className="px-4 py-8 bg-slate-200 dark:bg-slate-950 font-mono whitespace-pre-wrap">
			{JSON.stringify(data, null, " ")}
		</div>
	);
}
