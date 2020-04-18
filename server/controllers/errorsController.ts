declare interface IHandleError{
    type: number
    message: string
}

export async function handleError (error: IHandleError) {
  const { type, message } = error

  if (!type || !message) return null

  return error
}
