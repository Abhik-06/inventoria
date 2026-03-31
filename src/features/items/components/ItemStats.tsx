import { Card, CardContent } from "@/components/ui/card";

type ItemStatsProps = {
    availableQuantity: number;
    totalQuantity: number;
    category?: string;
    description?: string;
};

export function ItemStats({
    availableQuantity,
    totalQuantity,
    category,
    description,
}: ItemStatsProps) {
    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available</span>
                    <span className="font-medium">
                        {availableQuantity} / {totalQuantity}
                    </span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{category ?? "—"}</span>
                </div>

                <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Description</p>
                    <p className="text-sm">{description ?? "No description provided."}</p>
                </div>
            </CardContent>
        </Card>
    );
}
