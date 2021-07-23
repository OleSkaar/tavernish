export interface ButtonProps {
  text: string
  onClick: () => void
  key?: string
}

export const Button = ({ text, onClick, key }: ButtonProps) => {
  return (
    <button key={key} className="p-4 bg-gray-300 border-b-8 border-green-900" onClick={onClick}>
      {text}
    </button>
  )
}
