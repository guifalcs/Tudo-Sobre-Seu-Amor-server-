import express from 'express'
import userRoutes from './routes/userRoutes'
import specialDateRouter from './routes/specialDatesRoutes'
import timelineRoutes from './routes/timelineRoutes'
import wishlistRouter from './routes/wishlistRoutes'
import lovemapRoutes from './routes/lovemapRoutes'
import relationshipRoutes from './routes/relationshipRoutes'
import subscriptionRouter from './routes/subscriptionRoutes'

const router = express.Router()

router.use('/api/users', userRoutes)
router.use('/api/specialDate', specialDateRouter)
router.use('/api/timeline', timelineRoutes)
router.use('/api/wishlist', wishlistRouter)
router.use('/api/lovemap', lovemapRoutes)
router.use('/api/relationship', relationshipRoutes)
router.use('/api/subscription', subscriptionRouter)


export default router