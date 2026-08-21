import { useState } from 'react'

export default function PasswordInput({ value, onChange, placeholder, className }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className || 'w-full text-xs p-3 pr-16 border border-slate-200 rounded-xl bg-slate-50 outline-none'}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-indigo-700"
      >
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}
