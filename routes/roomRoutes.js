import express from "express"
const router=express.Router()
import { getRooms,createRooms, getRoom, updateRoom,deleteRoom} from "../controllers/roomController.js"
import auth from "../middleware/authMiddleware.js"
import { checkRole } from "../middleware/checkRole.js"

router.post('/create',auth, checkRole('admin'), createRooms);
router.put('/:id',auth, checkRole('admin'), updateRoom);
router.delete('/:id',auth, checkRole('admin'), deleteRoom);
router.get('/',auth, getRooms); 
router.get('/:id',auth, getRoom); 

export default router
