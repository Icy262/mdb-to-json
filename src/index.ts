import e from 'express'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import MDBReader from 'mdb-reader'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Example API endpoint - JSON
app.post('/get-tables', (req, res) => {
	if (req.method == 'POST') {
		try {
			express.raw({ limit: '50mb' });
			const reader = new MDBReader(req.body);

			res.status(200).json({
				tables: reader?.getTableNames()
			});
		} catch (err: unknown) {
			res.status(400).json({
				message: `Failed to read .mdb file: ${err instanceof Error ? err.message : String(err)}`
			});
		}
	} else if (req.method == 'OPTIONS') {
		res.status(200);
	} else {
		res.status(405).json({
			message: 'POST required'
		});
	}

	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.header("Access-Control-Allow-Headers", "Content-Type");
});

export default app
