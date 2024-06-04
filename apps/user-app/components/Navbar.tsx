import { Sheet, SheetTrigger, SheetContent, SheetClose } from "../@/components/ui/sheet"
import { Button } from "../@/components/ui/button"
import Link from "next/link"

export default function Navbar({ signout }: { signout: any }) {
    return (
        <header className="flex h-16 w-full items-center px-4 md:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="lg:hidden">
                        <MenuIcon className="h-6 w-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold" prefetch={false}>
                        <MountainIcon className="h-6 w-6" />
                        <span className="sr-only">Mystery Messages</span>
                    </Link>
                    <div className="grid gap-2 py-6">
                        <SheetClose asChild>
                            <Link href="/dashboard" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
                                Home
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link href="/college" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
                                Interested Colleges
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <Link href="/post/create" className="flex w-full items-center py-2 text-lg font-semibold" prefetch={false}>
                                Posts
                            </Link>
                        </SheetClose>
                        <SheetClose asChild>
                            <div onClick={signout}>
                                <Button size="sm" variant={"destructive"}>
                                    Sign out
                                </Button>
                            </div>
                        </SheetClose>

                    </div>
                </SheetContent>
            </Sheet>
            <div className="flex-1 flex justify-center hidden lg:flex">
                <nav className="flex items-center gap-4 md:gap-6">
                    <Link
                        href="/dashboard"
                        className="text-sm font-medium transition-colors hover:text-gray-900 data-[active]:font-semibold data-[active]:text-gray-900 dark:hover:text-gray-50 dark:data-[active]:text-gray-50"
                        prefetch={false}
                    >
                        Home
                    </Link>
                    <Link
                        href="/college"
                        className="text-sm font-medium transition-colors hover:text-gray-900 data-[active]:font-semibold data-[active]:text-gray-900 dark:hover:text-gray-50 dark:data-[active]:text-gray-50"
                        prefetch={false}
                    >
                        Interested Colleges
                    </Link>
                    <Link
                        href="/post/create"
                        className="text-sm font-medium transition-colors hover:text-gray-900 data-[active]:font-semibold data-[active]:text-gray-900 dark:hover:text-gray-50 dark:data-[active]:text-gray-50"
                        prefetch={false}
                    >
                        Posts
                    </Link>
                    <div onClick={signout}>
                        <Button size="sm" variant={"destructive"}>
                            Sign out
                        </Button>
                    </div>
                </nav>
            </div>
        </header>
    )
}

function MenuIcon(props: any) {
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
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    )
}


function MountainIcon(props: any) {
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
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    )
}
