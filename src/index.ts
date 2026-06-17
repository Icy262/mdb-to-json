import e from 'express'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import MDBReader from 'mdb-reader'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type",
};

// Example API endpoint - JSON
app.post('/get-tables', (req, res) => {
	if (req.method == 'POST') {
			try {
				express.raw({ limit: '50mb' });
				const reader = new MDBReader(req.body);

				res.json({
					status: 200,
					headers: corsHeaders,
					tables: reader?.getTableNames()
				});
			} catch (err: unknown) {
				res.json({
					status: 400,
					headers: corsHeaders,
					message: `Failed to read .mdb file: ${err instanceof Error ? err.message : String(err)}`
				});
			}
		} else if (req.method == 'OPTIONS') {
			res.json({
				status: 200,
				headers: corsHeaders
			});
		} else {
			res.json({
				status: 405,
				headers: corsHeaders,
				message: 'POST required'
			});
		}
});

export default app
