import e from 'express'
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
	express.raw({ limit: '50mb' }),
	(req, res) => {
		try {
			const reader = new MDBReader(req.body);

			res.status(200).json({
				tables: reader?.getTableNames()
			});
		} catch (err: unknown) {
			res.status(400).json({
				message: `Failed to read .mdb file: ${err instanceof Error ? err.message : String(err)}`
			});
		}
	}
);

export default app
