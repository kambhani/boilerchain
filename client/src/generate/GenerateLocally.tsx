import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@chakra-ui/react";

export default function GenerateLocally({
	user,
	difficulty,
}: {
	user: string;
	difficulty: number;
}) {
	const { isPending, isError, data } = useQuery({
		queryKey: ["last_block"],
		queryFn: () =>
			fetch(`${import.meta.env.VITE_API_URL}/blocks/last`).then((res) => res.json()),
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
		<div className="grid grid-cols-2 gap-2">
			<div className="px-4 py-8 bg-slate-200 dark:bg-slate-950 whitespace-pre-wrap font-mono col-span-2 text-sm h-96 overflow-y-auto">
				<span className="whitespace-pre-wrap">
					{"# Python code to get the next block\nimport sha256\n\n"}
				</span>
				<span className="whitespace-pre-wrap">
					{
						"def get_hash(b) -> str:\n\ts = str(b.get(index)) + str(b.get(timestamp)) + str(b.get(previous_hash)) + str(b.get(nonce)) + b.get(author)\n\treturn sha256(s.encode()).hexdigest()\n\n"
					}
				</span>
				<span className="whitespace-pre-wrap">
					{`def is_valid_proof(b) -> bool:\n\tget_hash(b).startswith("0" * ${difficulty})\n\n`}
				</span>
				<span className="whitespace-pre-wrap">{`new_block = ${JSON.stringify(
					{
						index: parseInt(data.index) + 1,
						timestamp: Math.floor(new Date().getTime() / 1000),
						previous_hash: data.hash,
						nonce: 0,
						author: user,
						hash: "",
					},
					null,
					"\t "
				)}\n\n`}</span>
				<span className="whitespace-pre-wrap">
					{
						"while not is_valid_proof(new_block)\n\tnew_block.update({'nonce', new_block['nonce'] + 1})\n\tnew_block['hash'] = get_hash(new_block)\n\nreturn new_block"
					}
				</span>
			</div>
		</div>
	);
}
