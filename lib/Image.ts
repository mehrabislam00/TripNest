export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"]
export const MAX_AVATAR_MB = 5

/**
 * Turns a chosen image file into a small square JPEG data URL (default 256px,
 * roughly 20-40 KB), so it can be saved as a plain string in your database.
 * Runs in the browser only.
 */
export async function fileToAvatarDataUrl(file: File, size = 256): Promise<string> {
  if (!AVATAR_TYPES.includes(file.type)) {
    throw new Error("Please choose a JPG, PNG or WebP image.")
  }
  if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
    throw new Error(`Image must be smaller than ${MAX_AVATAR_MB} MB.`)
  }

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new Error("Couldn't read that image. Try a different file.")
  }

  // center-crop to a square
  const side = Math.min(bitmap.width, bitmap.height)
  const sx = (bitmap.width - side) / 2
  const sy = (bitmap.height - side) / 2

  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = size
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Your browser can't process images.")

  ctx.fillStyle = "#fff" // PNG transparency becomes white
  ctx.fillRect(0, 0, size, size)
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, size, size)
  bitmap.close()

  return canvas.toDataURL("image/jpeg", 0.85)
}