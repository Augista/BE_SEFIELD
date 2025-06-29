import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { withCORS } from "@/lib/cors"
import { Field } from "@/domain/entities/Field"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
)

export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 204 })
  return withCORS(response, req)
}

export async function GET(req: NextRequest) {
  const { data: fields, error } = await db
    .from("field")
    .select("*")
    .eq("is_active", true)

  if (error) {
    console.error("[GET FIELDS]", error)
    return NextResponse.json({ error: "Gagal mengambil data field" }, { status: 500 })
  }

  return withCORS(NextResponse.json(fields as Field[]), req)
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()

  const name = formData.get("name")?.toString()
  const type = formData.get("type")?.toString()
  const price = Number(formData.get("price"))
  const operational_start = formData.get("operational_start")?.toString()
  const operational_end = formData.get("operational_end")?.toString()
  const description = formData.get("description")?.toString() || null
  const is_active = formData.get("is_active") === "false" ? false : true
  const file = formData.get("image") as File | null

  if (!name || !type || isNaN(price) || !operational_start || !operational_end) {
    return NextResponse.json(
      { error: "Field wajib (name, type, price, operational_start, operational_end) harus diisi" },
      { status: 400 }
    )
  }

  let imageUrl: string | null = null

  if (file && file.name) {
    const upload = await uploadFieldImage(file)
    if (!upload.success) {
      return NextResponse.json({ error: upload.error }, { status: 500 })
    }
    imageUrl = upload.url ?? null
  }

  const { data: field, error } = await db
    .from("field")
    .insert([{
      name,
      type,
      price,
      operational_start,
      operational_end,
      image: imageUrl,
      description,
      is_active
    }])
    .select("*")
    .single()

  if (error) {
    console.error("[POST FIELD]", error)
    return NextResponse.json({ error: "Gagal menambahkan field" }, { status: 500 })
  }

  return withCORS(NextResponse.json(field as Field, { status: 201 }), req)
}

// Upload helper
async function uploadFieldImage(file: File): Promise<{ success: boolean, url?: string, error?: string }> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)
  const filePath = `fields/${Date.now()}-${file.name}`

  const { error: uploadError } = await supabase.storage
    .from("fields")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false
    })

  if (uploadError) {
    console.error("[UPLOAD IMAGE ERROR]", uploadError)
    return { success: false, error: "Gagal mengupload gambar ke storage" }
  }

  const { data } = supabase.storage.from("fields").getPublicUrl(filePath)

  return { success: true, url: data.publicUrl }
}

