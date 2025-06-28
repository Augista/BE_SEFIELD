import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await db.from('user').select('*').limit(1)
    if (error) throw error

    return NextResponse.json({
      success: true,
      message: '✅ Supabase connected successfully!',
      preview: data,
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: '❌ Supabase connection failed.',
      error: err.message,
    }, { status: 500 })
  }
}
