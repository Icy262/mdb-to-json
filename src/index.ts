import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import MDBReader from 'mdb-reader'
import multer from 'multer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

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
	upload.single('mdb_file'),
	(req, res) => {
		try {
			const reader = new MDBReader(req.file!.buffer);

			res.status(200).json({
				tables: reader.getTableNames()
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
	upload.single('mdb_file'),
	(req, res) => {
		try {
			const reader = new MDBReader(req.file!.buffer);

			res.status(200).json({
				records: reader.getTable(req.body.table_name)
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

export default app
