import { MyContext } from './../../myContext';
import { User } from '../../entity/User';
import { Resolver, Query, Arg, Mutation, InputType, Field, Int, ObjectType, UseMiddleware, Ctx } from 'type-graphql';
import bcrypt from 'bcryptjs'

// JWT
import {generateToken} from '../utils/createToken'

// Middlewares
import {isAuth} from '../../middlewares/isAuth'

// Input
@InputType()
class UserInput{
  @Field({nullable: true})
  name: string;

  @Field({nullable: true})
  email: string;

  @Field({nullable: true})
  password: string;

}

@ObjectType()
class LoginType{
  @Field()
  user: User

  @Field()
  token: string
}

@Resolver()
export class UserResolver{

  @Query(() => User)
  async getUsers(
    @Arg("id", () => Int) id : number
  ){
    const user = await User.findOne({where: {id}})
    return user
  }

  @Mutation(() => User)
  async addUser(
    @Arg("data", () => UserInput) data : UserInput
    ){
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await User.create({
      ...data,
      password: hashedPassword
    }).save()
    return user
  }

  @Mutation(() => LoginType)
  async loginUser(
    @Arg("data", () => UserInput) data : UserInput
    ) : Promise<LoginType>{
    const user = await User.findOne({where: {
      email: data.email
    }})

    if(user){
      const comparePassword = await bcrypt.compare(data.password, user.password)
      const token = generateToken({userId: user.id})
      if(comparePassword){
        return {
          user,
          token
        }
      }

      throw new Error("Invalid password")
    }

    throw new Error("User not exists")
  
  }

}