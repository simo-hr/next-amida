import { FC } from 'react'

type ButtonProps = {
  children: React.ReactNode
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  disabled?: boolean
}

const Button: FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <button className="button" {...rest}>
      {children}
    </button>
  )
}

export default Button
