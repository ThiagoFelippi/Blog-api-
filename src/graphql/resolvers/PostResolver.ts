import { Resolver, Query, UseMiddleware, Ctx, Mutation, Arg, InputType, Field, ObjectType } from 'type-graphql'
import { isAuth } from '../../middlewares/isAuth'
import { MyContext } from './../../myContext';

import {Post} from '../../entity/Post'
import {User} from '../../entity/User'

@InputType()
class PostInput{

  @Field()
  title: string

  @Field()
  content: string

  @Field({nullable: true})
  userId: number
}

@Resolver()
export class PostResolver{

  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async getPosts(){
    const posts = await Post.find({relations: ["user"]})
    return posts
  }

  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async getPostsByUserId(
    @Ctx() {payload} : MyContext
  ){
    const { userId } = payload
    const user = await User.findOne(userId)
    if(user){
      const posts = await Post.findOne({
        where: {
          userId
        }
      })
      return posts
    }
    throw new Error(`Error on find user with id equal ${userId} `)
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPosts(
    @Arg("data", () => PostInput) data : PostInput,
    @Ctx() {payload} : MyContext
  ) : Promise<Post> {
    const { userId } = payload
    const user = await User.findOne(userId)
    
    if(user){
      if(!data.title || !data.content){
        throw new Error("please fill in all fields")
      }

      const post = await Post.create({
        title: data.title,
        content: data.content,
        user: {
          id: userId
        }
      }).save()
      return post

    }

    throw new Error("User not exists")
  }

}