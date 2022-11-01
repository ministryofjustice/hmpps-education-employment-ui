import { Router } from 'express'
import addressLookup from '../routes/addressLookup'

// Add constants and utilities to locals
export default function setUpLocals(): Router {
  const router = Router({ mergeParams: true })

  router.use((req, res, next) => {
    res.locals.addressLookup = addressLookup

    next()
  })

  return router
}
