import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";
import { Min } from 'class-validator'

import { User } from './User';

@ObjectType()
@Entity()
export class Post extends BaseEntity{

  @Field(() => Int, {nullable: true})
  @Min(0)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({nullable: true})
  @Column()
  title: string;

  @Field({nullable: true})
  @Column()
  content: string;

  @Field(() => User, {nullable: true})
  @ManyToOne(type => User, user => user.post)
  @JoinColumn()
  user: User

}
