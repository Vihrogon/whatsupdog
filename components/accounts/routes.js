import express from 'express'
import { createAccount } from './controllers.js'

const router = express.Router()

router.post('/account', createAccount)

export default router
