"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/IULdrkkrJw5
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { AvatarImage, AvatarFallback, Avatar } from "../@/components/ui/avatar"
import { Textarea } from "../@/components/ui/textarea"
import { useEffect, useState } from "react";
import { z } from "zod";

export default function SinglePost({ post, username }: { post: Content, username: string }) {
    const [submitting, setIsSubmitting] = useState<boolean>(false);
    const form = useForm<z.infer<typeof createReplySchema>>({
        resolver: zodResolver(createReplySchema),
        defaultValues: {
            reply: "",
        },
    });
    const [likeCount, setLikeCount] = useState<number>(post._count.Upvotes);
    const [dislikeCount, setDislikeCount] = useState<number>(post._count.Downvotes);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isDisLikedPost, setIsDislikedPost] = useState<boolean>(false);
    const [replies, setReplies] = useState<Reply[]>(post.Replies);
    useEffect(() => {
        // TODO:: check if post is liked or not
        async function getter() {
            const likedPost = await axios.get(`/api/user-liked-post/${post.id}`);
            if (likedPost.status !== 200) {
                setIsLiked(false);
            } else {
                const liked = likedPost.data.data.liked;
                setIsLiked(liked);
            }
            if (!isLiked) {
                const dislikedPost = await axios.get(`/api/user-disliked-post/${post.id}`);
                if (dislikedPost.status !== 200) {
                    setIsDislikedPost(false);
                } else {
                    const disliked = dislikedPost.data.data.disliked;
                    setIsDislikedPost(disliked);
                }
            }
        }
        if (post.id)
            getter();
    }, [post.id]);
    const { toast } = useToast();
    async function onSubmit(values: z.infer<typeof createReplySchema>) {
        try {
            setIsSubmitting(true);
            const response = await axios.post(`/api/create-comment`, { content: values.reply, postId: post.id });
            if (response.status === 200) {
                toast({
                    "title": "Created reply sucessfully",
                });
                const reply: Reply = {
                    content: response.data.data.content,
                    id: response.data.data.id,
                    createdAt: response.data.data.createdAt,
                    creator: {
                        college: {
                            name: post.creator.college.name
                        }
                    }
                } as Reply;
                setReplies((prev) => [...prev, reply])
            } else {
                toast({
                    "title": "There was an error creating the comment",
                    "variant": "destructive"
                })
            }
        } catch (err) {
            toast({
                "title": "Unexpected error submitting the reply",
                "variant": "destructive"
            })
        } finally {
            form.reset()
            setIsSubmitting(false);
        }
    }
    async function likePost() {
        try {
            const response = await axios.post("/api/upvote-post", { postId: post.id })
            if (response.status == 200) {
                if (response.data.message === "Upvoted the post") {
                    setIsLiked(true)
                    setLikeCount((prev) => prev + 1)
                } else if (response.data.message === "Upvote removed") {
                    setIsLiked(false)
                    setLikeCount((prev) => prev - 1)
                }
            }
        } catch (err) {
            console.log(`There was an error`, err)
        }
    }
    async function dislikePost() {
        try {
            const response = await axios.post("/api/downvote-post", { postId: post.id })
            if (response.status == 200) {
                if (response.data.message === "Downvoted the post") {
                    setIsDislikedPost(true)
                    setDislikeCount((prev) => prev + 1)
                } else if (response.data.message === "Downvote removed") {
                    setIsDislikedPost(false)
                    setDislikeCount((prev) => prev - 1)
                }
            }
        } catch (err) {
            console.log(`There was an error`, err)
        }
    }


    return (
        <main className="flex flex-col min-h-[100dvh]">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold">
                            {post.subject}
                        </h1>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400" onClick={likePost}>
                            <ThumbsUpIcon className="w-5 h-5"
                                isLikedPost={isLiked}
                            />
                            <span>{likeCount}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400" onClick={dislikePost}>
                            <ThumbsDownIcon className="w-5 h-5" isDisLikedPost={isDisLikedPost} />
                            <span>{dislikeCount}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                            <CalendarIcon className="w-5 h-5" />
                            <span>{post.updatedAt.substring(0, 10)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                            <UserIcon className="w-5 h-5" />
                            <span>Anonymous Person from {post.creator.college.name}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Delete"
                            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ml-[-12px] sm:ml-0"
                        >
                            <Trash2Icon className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="mt-8">
                        <p className="text-gray-700 dark:text-gray-300">
                            {post.content}
                        </p>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Replies</h2>
                        {
                            replies.map((reply) => (
                                <div className="space-y-4 mt-4" key={reply.id}>
                                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
                                                <AvatarFallback>{reply.creator.college.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold mr-8">Someone from {reply.creator.college.name}</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm">{reply.createdAt.substring(0, 10)}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {reply.content}
                                        </p>
                                    </div>
                                </div>

                            ))
                        }
                    </div>
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">Create a new reply</h2>
                        <div className="flex items-start space-x-2 mb-4">
                            <Avatar className="w-8 h-8">
                                <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
                                <AvatarFallback>{username.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-8"
                                    >
                                        <FormField
                                            control={form.control}
                                            name="reply"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea
                                                            rows={3}
                                                            placeholder="Enter your reply here...."
                                                            {...field}
                                                            className="w-full bg-transparent border-2 focus:ring-0 resize-none"
                                                        />

                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" disabled={submitting}>
                                            Submit
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
import { Button } from "../@/components/ui/button"
import { Content, Reply } from "../interfaces/interface"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../@/components/ui/form";
import { useForm } from "react-hook-form";
import { createReplySchema } from "@repo/zod/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "../@/components/ui/use-toast";
import axios from "axios";

function CalendarIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
        </svg>
    )
}


function ThumbsDownIcon({ isDisLikedPost = false, className = "", props }: { isDisLikedPost: boolean, className: string, props?: any }) {
    return (
        <svg
            {...props}
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={isDisLikedPost ? "fill" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17 14V2" />
            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
        </svg>
    )
}


function ThumbsUpIcon({ isLikedPost = false, className = "", props }: { isLikedPost: boolean, className: string, props?: any }) {
    return (
        <svg
            {...props}
            className={className}
            fill={isLikedPost ? "fill" : "none"}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
        </svg>
    )
}

function Trash2Icon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
    )
}

function UserIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    )
}
