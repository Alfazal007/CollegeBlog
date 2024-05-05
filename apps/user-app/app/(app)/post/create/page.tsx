"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createPostSchema, signinSchema } from "@repo/zod/schema";
import { useToast } from "../../../../@/components/ui/use-toast";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../../@/components/ui/form";
import { Input } from "../../../../@/components/ui/input";
import { Button } from "../../../../@/components/ui/button";
import axios, { AxiosError } from "axios";
import { Textarea } from "../../../../@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { Skeleton } from "../../../../@/components/ui/skeleton";

export default function () {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router = useRouter();
    const { data: session, status } = useSession();

    // zod implementation
    const form = useForm<z.infer<typeof createPostSchema>>({
        resolver: zodResolver(createPostSchema),
    });

    // function to send submit request and redirect based on that
    async function onSubmit(values: z.infer<typeof createPostSchema>) {
        // TODO:: Send a post request to create a post
        try {
            setIsSubmitting(true);
            const response = await axios.post(`/api/post/create`, values);
            if (response.data.statusCode == 201) {
                toast({
                    title: "Post successful",
                });
                router.replace(`/post/getpost/${response.data.data.postId}`);
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Try again later with valid credentials",
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            toast({
                variant: "destructive",
                title: "Error",
                description:
                    (axiosError?.response?.data as { data?: string })?.data ||
                    "Unexpected data",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-screen-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                </div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push("/sign-in");
    } else {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-screen-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            Post a question
                        </h1>
                        <p className="mb-4">
                            Post a question anonymously and get an anonymous
                            response
                        </p>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="subject"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={10}
                                                placeholder="content"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSubmitting}>
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        );
    }
}
