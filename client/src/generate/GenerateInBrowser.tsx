import { useQuery } from "@tanstack/react-query";
import { Spinner, Button } from "@chakra-ui/react";
import { useState } from "react";
import { sha256 } from "js-sha256";

export default function GenerateInBrowser({
	user,
	difficulty,
}: {
	user: string;
	difficulty: number;
}) {
	const [block, setBlock] = useState("Block will be generated here");
	const { isPending, isError, data } = useQuery({
		queryKey: ["last_block"],
		queryFn: () =>
			fetch(`${import.meta.env.VITE_API_URL}/blocks/last`).then((res) => res.json()),
	});

	const compute_hash = (block: {
		index: number;
		timestamp: number;
		previous_hash: string;
		nonce: number;
		author: string;
		hash: string;
	}) => {
		const block_string =
			String(block.index) +
			String(block.timestamp) +
			String(block.previous_hash) +
			String(block.nonce) +
			String(block.author);
		return sha256(block_string);
	};

	const generateBlock = () => {
		let start = {
			index: parseInt(data.index) + 1,
			timestamp: Math.floor(new Date().getTime() / 1000),
			previous_hash: data.hash as string,
			nonce: 0,
			author: user,
			hash: "",
		};
		start.hash = compute_hash(start);

		while (!start.hash.startsWith("0".repeat(difficulty))) {
			start.nonce += 1;
			start.hash = compute_hash(start);
		}

		setBlock(JSON.stringify(start, null, " "));
	};

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
		<div className="">
			<div className="flex w-full justify-center mb-4">
				<Button
					className="text-center"
					colorScheme="blue"
					onClick={() => generateBlock()}>
					Generate Next Block
				</Button>
			</div>
			<div className="px-4 py-8 bg-slate-200 dark:bg-slate-950 font-mono whitespace-pre-wrap">
				{block}
			</div>
		</div>
	);
}
