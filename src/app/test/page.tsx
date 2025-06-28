'use client'

import { useState } from 'react'

export default function TestLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || 'Login gagal')
      } else {
        setMessage(`✅ Login berhasil: ${data.user.nama}`)
        console.log('Token:', data.token)
        console.log('User:', data.user)
      }
    } catch (err) {
      setMessage('⚠️ Terjadi kesalahan')
    }

    setLoading(false)
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test Login</h1>
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        {loading ? 'Loading...' : 'Login'}
      </button>
      {message && (
        <div className="mt-4 p-2 bg-gray-100 border rounded text-sm">{message}</div>
      )}
    </div>
  )
}
