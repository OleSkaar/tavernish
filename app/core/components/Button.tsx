export interface ButtonProps {
  text: string
  onClick: () => void
  key?: string | number
  color: "green" | "orange" | "grey"
}

const setColor = (color: string) => {
  switch (color) {
    case "green":
      return "olivedrab"
    case "orange":
      return "darkorange"
    case "grey":
      return "darkgray"
  }
}

export const Button = ({ text, onClick, key, color }: ButtonProps) => {
  return (
    <button
      key={key}
      className={`p-4 bg-${setColor(color)} border-b-8 border-${setColor(color)}-dark`}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
