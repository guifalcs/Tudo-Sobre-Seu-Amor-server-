import express from 'express'
import userRoutes from './routes/userRoutes'
import specialDateRouter from './routes/specialDatesRoutes'
import timelineRoutes from './routes/timelineRoutes'
import wishlistRouter from './routes/wishlistRoutes'
import lovemapRoutes from './routes/lovemapRoutes'

const router = express.Router()

router.use('/api/users', userRoutes)
router.use('/api/specialDate', specialDateRouter)
router.use('/api/timeline', timelineRoutes)
router.use('/api/wishlist', wishlistRouter)
router.use('/api/lovemap', lovemapRoutes)




export default router