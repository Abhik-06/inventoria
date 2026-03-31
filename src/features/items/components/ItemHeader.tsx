import { Card, CardContent } from "@/components/ui/card";

type ItemHeaderProps = {
    name: string;
    imageUrl?: string;
};

export function ItemHeader({ name, imageUrl }: ItemHeaderProps) {
    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                    {imageUrl ? (
                        <img
                            src={imageUrl || "https://avatar.vercel.sh/shadcn1"}
                            alt={name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                            No image
                        </div>
                    )}
                </div>

                <h1 className="text-2xl font-semibold">{name}</h1>
            </CardContent>
        </Card>
    );
}
