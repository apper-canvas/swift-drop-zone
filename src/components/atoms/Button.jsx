import React from 'react'
import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg focus:ring-primary/50',
    secondary: 'bg-surface-700 text-surface-200 hover:bg-surface-600 focus:ring-surface-500',
    ghost: 'text-surface-400 hover:text-surface-200 hover:bg-surface-800 focus:ring-surface-500',
    danger: 'bg-error text-white hover:bg-error/90 focus:ring-error/50'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  }`

  const buttonHover = { scale: disabled ? 1 : 1.05 }
  const buttonTap = { scale: disabled ? 1 : 0.95 }

  return (
    <motion.button
      className={classes}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      whileHover={buttonHover}
      whileTap={buttonTap}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button