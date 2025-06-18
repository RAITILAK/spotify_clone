import { Router } from "express";
import { protectedRoute, requireAdmin } from "../middleware/auth.middleware.js";
import {
  checkAdmin,
  createAlbum,
  createSong,
  deleteAlbum,
  deleteSong,
} from "../controller/admin.controller.js";

const router = Router();

/**
 * Apply protectedRoute and requireAdmin middleware to all routes in this router.
 *
 * These middlewares were previously applied individually to each route.
 * To avoid repetition and improve readability/maintainability,
 * we now apply them globally using `router.use()` below.
 *
 * If you're wondering why individual routes don't explicitly include
 * `protectedRoute` and `requireAdmin`, it's because this handles it for all routes.
 */
router.use(protectedRoute, requireAdmin);

/*
  // Previous version with repeated middleware on each route:
  router.get("/check", protectedRoute, requireAdmin, checkAdmin);
  router.post("/songs", protectedRoute, requireAdmin, createSong);
  router.delete("/songs/:id", protectedRoute, requireAdmin, deleteSong);
  router.post("/albums", protectedRoute, requireAdmin, createAlbum);
  router.delete("/albums/:id", protectedRoute, requireAdmin, deleteAlbum);
*/

// These routes are already protected via router.use above
router.get("/check", checkAdmin);
router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);
router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteAlbum);

export default router;
