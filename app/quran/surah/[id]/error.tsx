"use client"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-red-600 text-xl mb-4">কিছু একটা ভুল হয়েছে!</h2>
      <p className="mb-4">{error.message}</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => reset()}
      >
        আবার চেষ্টা করুন
      </button>
    </div>
  )
} 