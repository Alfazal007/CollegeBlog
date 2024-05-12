/**
 * v0 by Vercel.
 * @see https://v0.dev/t/IULdrkkrJw5
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { AvatarImage, AvatarFallback, Avatar } from "../@/components/ui/avatar"
import { Textarea } from "../@/components/ui/textarea"

export default function SinglePost({ post, username }: { post: Content, username: string }) {
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
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <ThumbsUpIcon className="w-5 h-5" />
              <span>{post._count.Upvotes}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <ThumbsDownIcon className="w-5 h-5" />
              <span>{post._count.Downvotes}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <CalendarIcon className="w-5 h-5" />
              <span>{post.updatedAt.substring(0, 10)}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <UserIcon className="w-5 h-5" />
              <span>Anonymous Person from {post.creator.college.name}</span>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-gray-700 dark:text-gray-300">
              {post.content}
            </p>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Replies</h2>
            {
              post.Replies.map((reply) => (

                <div className="space-y-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
                        <AvatarFallback>{reply.creator.college.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">Someone from {reply.creator.college.name}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{reply.createdAt.substring(0, 10)}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {reply.content}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                        <ThumbsUpIcon className="w-5 h-5" />
                        <span>{reply._count.UpvotesReply}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                        <ThumbsDownIcon className="w-5 h-5" />
                        <span>{reply._count.DownvotesReply}</span>
                      </div>
                    </div>
                  </div>
                </div>

              ))
            }
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Create a new reply</h2>
            <form className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-start space-x-2 mb-4">
                <Avatar className="w-8 h-8">
                  <AvatarImage alt="@shadcn" src="/placeholder-user.jpg" />
                  <AvatarFallback>{username.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    className="w-full bg-transparent border-none focus:ring-0 resize-none"
                    placeholder="Write your reply..."
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
import { Button } from "../@/components/ui/button"
import { Content } from "../interfaces/interface"

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


function ThumbsDownIcon(props: any) {
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
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  )
}


function ThumbsUpIcon(props: any) {
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
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
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
