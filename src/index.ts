import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import MDBReader from 'mdb-reader'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}

	next();
});

app.post(
	'/get-tables',
	express.json(),
	async (req, res) => {
		try {
			const mdb_response = await fetch(req.body.mdb_url);
			const mdb_buffer = await mdb_response.arrayBuffer();
			const mdb_reader = new MDBReader(Buffer.from(mdb_buffer));

			res.status(200).json({
				tables: mdb_reader.getTableNames()
			});
		} catch (err: unknown) {
			res.status(400).json({
				message: `Failed to read .mdb file: ${err instanceof Error ? err.message : String(err)}`
			});
		}
	}
);

app.post(
	'/get-from',
	express.json(),
	async (req, res) => {
		try {
			const mdb_response = await fetch(req.body.mdb_url);
			const mdb_buffer = await mdb_response.arrayBuffer();
			const mdb_reader = new MDBReader(Buffer.from(mdb_buffer));

			res.status(200).json({
				records: mdb_reader.getTable(req.body.table_name)
					.getData()
					.map(row => row[req.body.column_name])
			});
		} catch (err: unknown) {
			res.status(400).json({
				message: `Failed to read .mdb file: ${err instanceof Error ? err.message : String(err)}`
			});
		}
	}
);

app.post(
	'/batch/get-tables',
	express.json(),
	async (req, res) => {
		try {
			console.log(req.body);
			const data = await Promise.all(
				req.body.mdb_urls.map(async (mdb_url) => {
					try {
						const mdb_response = await fetch(mdb_url);
						const mdb_buffer = await mdb_response.arrayBuffer();
						const mdb_reader = new MDBReader(Buffer.from(mdb_buffer));

						return {
							url: mdb_url,
							tables: mdb_reader.getTableNames()
						}
					} catch (err: unknown) {
						return {
							url: mdb_url,
							tables: null
						};
					}
				})
			);

			res.status(400).json(data);
		} catch (err: unknown) {
			res.status(400).json({
				message: `Request format invalid: ${err instanceof Error ? err.message : String(err)}`
			});
		}
	}
);

export default app
