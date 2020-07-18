import { MiddlewareFn } from 'type-graphql'
import { MyContext } from '../myContext'

// JWT
import jwt from 'jsonwebtoken'

interface Decode{
  userId: number;
}

export const isAuth : MiddlewareFn<MyContext> = ({context}, next ) => {
  const {authorization} = context.req.headers

  if(!authorization){
    throw new Error("Please, insert JWT token")
  }

  const [ bearer , token ] = authorization.split(" ")
  
  if(!bearer || !token){
    throw new Error("Your token don't have Bearer or token, please verify this")
  }

  const payload = jwt.verify(token, process.env.SECRET_TOKEN) as Decode
  context.payload = payload as Decode
  return next()
}

