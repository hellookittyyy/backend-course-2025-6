/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new inventory item
 *     description: Add a new item to the inventory with optional photo upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - inventory_name
 *             properties:
 *               inventory_name:
 *                 type: string
 *                 description: Name of the inventory item
 *               description:
 *                 type: string
 *                 description: Description of the inventory item
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Photo of the inventory item
 *     responses:
 *       201:
 *         description: Inventory item created
 *       400:
 *         description: Bad Request - inventory_name is required
 */

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for an inventory item by ID
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the inventory item to search for
 *       - in: query
 *         name: includePhoto
 *         schema:
 *           type: string
 *           enum: [on, off]
 *         description: Whether to include photo link in the response
 *     responses:
 *       200:
 *         description: Inventory item found
 *       404:
 *         description: Inventory item not found
 */

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Get all inventory items
 *     responses:
 *       200:
 *         description: List of inventory items
 */

/**
 * @swagger
 * /inventory/{id}:
 *   get:
 *     summary: Get details of an inventory item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the inventory item
 *     responses:
 *       200:
 *         description: Details of the inventory item
 *       404:
 *         description: Inventory item not found
 */

/**
 * @swagger
 * /inventory/{id}:
 *   put:
 *     summary: Update an inventory item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the inventory item
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inventory item updated
 *       404:
 *         description: Inventory item not found
 */

/**
 * @swagger
 * /inventory/{id}:
 *   delete:
 *     summary: Delete an inventory item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the inventory item
 *     responses:
 *       200:
 *         description: Inventory item deleted
 *       404:
 *         description: Inventory item not found
 */

/**
 * @swagger
 * /inventory/{id}/photo:
 *   get:
 *     summary: Get photo of an inventory item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the inventory item
 *     responses:
 *       200:
 *         description: Photo of the inventory item (image/jpeg)
 *       404:
 *         description: Inventory item or photo not found
 */

/**
 * @swagger
 * /inventory/{id}/photo:
 *   put:
 *     summary: Upload or update photo for an inventory item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the inventory item
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded/updated successfully
 *       400:
 *         description: No file uploaded
 */

