import { NextResponse } from 'next/server'
import { extractProductCodesFromCaption } from '@/lib/utils'
import { v4 as uuidv4 } from 'uuid'

// ── Instagram Export JSON Types ─────────────────────────────────────────────
interface InstagramPost {
  media?: {
    uri?: string
    creation_timestamp?: number
    title?: string
    media_metadata?: unknown
  }[]
  title?: string
  creation_timestamp?: number
}

interface ParsedProduct {
  id: string
  suggestedCode: string
  name: string
  description: string
  price?: number
  fabric?: string
  instagramUrl?: string
  instagramPostId?: string
  captionRaw: string
  mediaUrls: string[]
  detectedProductCode?: string
  date: string
  approved: boolean
}

// ── Price extraction ─────────────────────────────────────────────────────────
function extractPrice(text: string): number | undefined {
  // Matches: ₹1,299 | ₹1299 | Rs. 1299 | Rs 1299 | 1,299/- | 1299/-
  const patterns = [
    /₹\s*(\d[\d,]+)/,
    /Rs\.?\s*(\d[\d,]+)/i,
    /(\d[\d,]+)\s*\/-/,
  ]
  for (const p of patterns) {
    const m = text.match(p)
    if (m) return parseFloat(m[1].replace(/,/g, ''))
  }
  return undefined
}

// ── Product name extraction ──────────────────────────────────────────────────
function extractName(caption: string): string {
  // Take the first meaningful line (skip hashtags and blank lines)
  const lines = caption.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  // Skip very short lines or lines that look like hashtag dumps
  for (const line of lines) {
    if (line.length > 5 && !line.includes('₹') && !line.startsWith('Rs') && line.length < 120) {
      return line.replace(/[*_•·]/g, '').trim()
    }
  }
  return lines[0]?.slice(0, 60) || 'Imported Product'
}

// ── Fabric extraction ────────────────────────────────────────────────────────
function extractFabric(text: string): string | undefined {
  const fabrics = ['cotton', 'silk', 'linen', 'chiffon', 'georgette', 'crepe', 'satin', 'net', 'polyester']
  const lower = text.toLowerCase()
  for (const f of fabrics) {
    if (lower.includes(f)) return f.charAt(0).toUpperCase() + f.slice(1)
  }
  return undefined
}

// ── Category detection ───────────────────────────────────────────────────────
function detectCategory(caption: string): string {
  const lower = caption.toLowerCase()
  if (lower.includes('saree') || lower.includes('sari') || lower.includes('sungudi') || lower.includes('kasavu'))
    return 'SAR'
  if (lower.includes('kurti') || lower.includes('kurta')) return 'KUR'
  if (lower.includes('salwar') || lower.includes('churidar')) return 'SLW'
  if (lower.includes('dupatta')) return 'DUP'
  if (lower.includes('blouse')) return 'BLO'
  return 'PRD' // generic product
}

// ── Instagram Text Decoder ──────────────────────────────────────────────────
// Instagram JSON exports encode UTF-8 characters as Latin-1 strings (Mojibake).
function decodeIgText(text: string): string {
  if (!text) return ''
  try {
    return Buffer.from(text, 'binary').toString('utf8')
  } catch {
    return text
  }
}

// ── Main API handler ─────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data } = body

    if (!data) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 })
    }

    let posts: InstagramPost[] = []

    // Handle different Instagram export JSON formats
    if (Array.isArray(data)) {
      posts = data
    } else if (data.media && Array.isArray(data.media)) {
      posts = data.media
    } else if (typeof data === 'object') {
      // Try to find any array of posts in the top-level object
      for (const key of Object.keys(data)) {
        if (Array.isArray(data[key]) && data[key].length > 0) {
          posts = data[key]
          break
        }
      }
    }

    if (posts.length === 0) {
      return NextResponse.json({
        error: 'Could not find posts in the provided JSON. Make sure you upload posts_1.json from your Instagram export.',
      }, { status: 400 })
    }

    const products: ParsedProduct[] = []
    const categoryCounters: Record<string, number> = {}

    for (const post of posts.slice(0, 500)) { // cap at 500 posts
      // Get caption text
      let caption: string =
        (post.title || post.media?.[0]?.title || '') as string
      caption = decodeIgText(caption)
      if (!caption || caption.trim().length < 10) continue

      // Extract timestamp
      const ts = post.creation_timestamp || post.media?.[0]?.creation_timestamp
      const date = ts ? new Date(ts * 1000).toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
      }) : 'Unknown date'

      // Extract media URIs
      const mediaUrls = (post.media || [])
        .map(m => m.uri || '')
        .filter(Boolean)
        .slice(0, 4) as string[]

      // Detect category and generate a code
      const category = detectCategory(caption)
      categoryCounters[category] = (categoryCounters[category] || 0) + 1
      const counter = categoryCounters[category]

      // Check if caption already has a product code
      const existingCodes = extractProductCodesFromCaption(caption)
      const detectedProductCode = existingCodes[0]
      const suggestedCode = detectedProductCode || `RER-${category}-${String(counter).padStart(3, '0')}`

      const name = extractName(caption)
      const price = extractPrice(caption)
      const fabric = extractFabric(caption)

      // Build description from caption, cleaned up
      const description = caption
        .replace(/Product Code:.*$/gim, '')
        .replace(/#\S+/g, '')
        .replace(/₹\s*[\d,]+/g, '')
        .replace(/Rs\.?\s*[\d,]+/g, '')
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 2)
        .slice(0, 8)
        .join('\n')
        .trim()

      products.push({
        id: uuidv4(),
        suggestedCode,
        name,
        description,
        price,
        fabric,
        captionRaw: caption,
        mediaUrls,
        detectedProductCode,
        date,
        approved: true,
      })
    }

    return NextResponse.json({
      success: true,
      totalPosts: posts.length,
      products,
    })

  } catch (error) {
    console.error('Instagram parse error:', error)
    return NextResponse.json({ error: 'Failed to parse Instagram data' }, { status: 500 })
  }
}
