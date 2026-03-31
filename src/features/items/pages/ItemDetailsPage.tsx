import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { inventoryService } from "../../../services/inventoryService";
import { ItemHeader } from "../components/ItemHeader";
import { ItemStats } from "../components/ItemStats";
import { BorrowPanel } from "../components/BorrowPanel";

type Item = {
    id: string;
    name: string;
    total_quantity: number;
    available_quantity: number;
    category?: string;
    description?: string;
    image_url?: string;
};

export default function ItemDetailsPage() {

    const { id } = useParams();

    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadItem() {
            if (!id) return;

            const data = await inventoryService.getComponentById(id);
            setItem(data);
            setLoading(false);
        }

        loadItem();
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
                <div className="aspect-video w-full bg-muted animate-pulse rounded-lg" />
                <div className="h-6 w-1/2 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
            </div>
        );
    }

    if (!item) {
        return <div className="p-6 text-muted-foreground">Item not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">

            <ItemHeader
                name={item.name}
                imageUrl={item.image_url}
            />

            <ItemStats
                availableQuantity={item.available_quantity}
                totalQuantity={item.total_quantity}
                category={item.category}
                description={item.description}
            />

            <BorrowPanel
                maxQuantity={item.available_quantity}
                onBorrow={(qty) => {
                    console.log("Borrow quantity:", qty);
                }}
                onReturn={(qty) => {
                    console.log("Return quantity:", qty);
                }}
            />

        </div>
    );
}
