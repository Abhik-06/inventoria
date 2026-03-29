import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
    return (
        <div className="rounded-lg border overflow-hidden">
            <Skeleton className="aspect-video w-full" />

            <div className="px-6 pt-4 pb-2 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
            </div>

            <div className="px-6 pb-4">
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    )
}