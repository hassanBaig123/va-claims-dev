import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import mime from 'mime-types'
import { createClient } from '@/utils/supabase/server'
import crypto from 'crypto'

// Function to log unauthorized attempts
function logUnauthorizedAttempt(message: string, details: any) {
  const logDir = path.join(process.cwd(), 'app/api/downloads')
  const logFile = path.join(logDir, 'unauthorized_attempts.log')

  const logEntry = `[${new Date().toISOString()}] ${message}\nDetails: ${JSON.stringify(
    details,
  )}\n\n`

  fs.appendFileSync(logFile, logEntry)
}

// Function to generate an obfuscated filename
function generateUniqueFilename(originalFilename: string): string {
  const randomDigits = crypto.randomBytes(4).toString('hex');
  const timestamp = Date.now().toString();
  return `${path.basename(originalFilename, path.extname(originalFilename))}_${randomDigits}_${timestamp}${path.extname(originalFilename)}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const fileId = searchParams.get('fileId')

  if (!fileId) {
    logUnauthorizedAttempt('Attempt to access file without fileId', {
      ip: request.ip,
    })
    return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
  }

  // Create a Supabase client
  const supabase = await createClient()

  // Check if the user is authenticated
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession()

  if (authError || !session) {
    logUnauthorizedAttempt('Unauthorized access attempt', {
      ip: request.ip,
      fileId,
      error: authError ? authError.message : 'No active session',
    })
    return NextResponse.json(
      { error: 'Unauthorized. Please log in.' },
      { status: 401 },
    )
  }

  // If we reach here, the user is authenticated. Now we can proceed with the user's ID.
  const userId = session.user.id

  // Map fileId to actual file path
  const downloadsDir = path.join(process.cwd(), 'downloadables')

  // Find the file with the correct id, regardless of extension
  const files = fs.readdirSync(downloadsDir)
  const file = files.find((f) =>
    f.toLowerCase().startsWith(fileId.toLowerCase()),
  )

  if (!file) {
    logUnauthorizedAttempt('Attempt to access non-existent file', {
      userId,
      fileId,
    })
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  const filePath = path.join(downloadsDir, file)

  // Get file stats
  const stats = fs.statSync(filePath)

  // Determine MIME type
  let mimeType = mime.lookup(filePath)
  if (!mimeType) {
    // If mime.lookup fails, check for specific extensions
    const ext = path.extname(filePath).toLowerCase()
    if (ext === '.docx') {
      mimeType =
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    } else if (ext === '.xlsx') {
      mimeType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    } else if (ext === '.pptx') {
      mimeType =
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    } else {
      // Default to octet-stream if we can't determine the MIME type
      mimeType = 'application/octet-stream'
    }
  }

  // Read file
  const fileBuffer = fs.readFileSync(filePath)

  // Generate obfuscated filename
  const uniqueFilename = generateUniqueFilename(file)

  // Set appropriate headers
  const headers = new Headers()
  headers.set(
    'Content-Disposition',
    `attachment; filename=${uniqueFilename}`,
  )
  headers.set('Content-Type', mimeType)
  headers.set('Content-Length', stats.size.toString())

  // Return file
  return new NextResponse(fileBuffer, {
    status: 200,
    headers,
  })
}
