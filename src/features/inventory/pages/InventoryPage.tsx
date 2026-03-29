import { useEffect, useState } from "react";
import { inventoryService } from "../../../services/inventoryService";
import { borrowServices } from "../../../services/borrowService";
import ItemCard from "../components/ItemCard";
import SkeletonCard from "../components/SkeletonCard";

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [borrowingID, setBorrowingID] = useState<string | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadItems();
    }, []);

    async function loadItems() {
        setLoading(true)
        try {
            const data = await inventoryService.getAllComponents();
            console.log("items:", data);
            setItems(data);
        } catch (err) {
            console.error("failed loading", err);
        }
        setLoading(false)
    }

    async function handleBorrow(id: string) {
        try {
            setBorrowingID(id);

            await borrowServices.checkoutItem(id, "d0f05595-daed-492f-8cad-301938ac8c09", 1);

            setItems( prev =>
                prev.map( item => 
                    item.id === id
                    ? {
                        ...item,
                        available_quantity: item.available_quantity - 1
                    }
                    : item
                )
            );
        } catch (err) {
            console.error("Borrow failed", err);
        } finally {
            setBorrowingID(null);
        }
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-semibold mb-4">Inventory Page</h1>

            { loading ? (
                <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(220px,300px))] justify-center">
            {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
            </div>
            ) : (
                <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(220px,300px))] justify-center">
                    {items.map((item) => (
                        <ItemCard key={item.id} item={item} onBorrow={handleBorrow} loading={borrowingID === item.id} />
                    ))}
                </div>
            )}
        </div>
    );
}