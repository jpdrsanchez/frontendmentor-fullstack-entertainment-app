export const isEmail = (value: string) => {
  const regex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)
  return regex.test(value)
}
