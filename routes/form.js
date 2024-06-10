import express from 'express';
import { submitform } from '../controllers/form.js';
import { getmyform } from '../controllers/form.js';
import { getallform } from '../controllers/form.js';
const router = express.Router();

router.post("/submitform",submitform);
router.get('/mysubmission', getmyform);
router.get('/submission', getallform);

export default router;