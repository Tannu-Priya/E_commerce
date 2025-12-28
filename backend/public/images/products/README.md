# Product Images

This folder stores dynamically uploaded product images.

## Automatic Upload

Images are automatically uploaded here when you:
1. Login as admin
2. Go to Admin Dashboard → Products
3. Add/Edit a product
4. Select an image file

The system handles everything automatically - no manual file management needed!

## Technical Details

- Images uploaded via: `POST /api/upload`
- Served at: `http://localhost:5000/images/products/[filename]`
- Max size: 5MB
- Allowed formats: JPG, PNG, GIF, WEBP
- Naming: `originalname-timestamp-random.ext`

See `DYNAMIC_IMAGE_UPLOAD_GUIDE.md` for complete documentation.
