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

}

@ObjectType()
class PostCreate{
  @Field()
  post: Post

  @Field()
  userId : number

}

@Resolver()
export class PostResolver{

  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async getPosts(){
    const posts = await Post.find()
    return posts
  }

  @Mutation(() => PostCreate)
  @UseMiddleware(isAuth)
  async createPosts(
    @Arg("data", () => PostInput) data : PostInput,
    @Ctx() {payload} : MyContext
  ) : Promise<PostCreate> {
    const user = await User.findOne(payload.userId)
    if(user){
      if(!data.title || !data.content){
        throw new Error("please fill in all fields")
      }
      const post = await Post.create(data).save()
      return{
        post,
        userId: user.id
      }
    }
    throw new Error("User not exists")
  }

}