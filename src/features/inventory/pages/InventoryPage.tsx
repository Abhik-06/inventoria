import { useEffect, useState } from "react";
import { inventoryService } from "../../../services/inventoryService";
import { borrowServices } from "../../../services/borrowService";

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        loadItems();
    }, []);

    async function loadItems() {
        try {
            const data = await inventoryService.getAllComponents();
            console.log("items:", data);
            setItems(data);
        } catch (err) {
            console.error("failed loading", err);
        }
    }

    async function handleBorrow(id: string) {
        try {
            await borrowServices.checkoutItem(id, "d0f05595-daed-492f-8cad-301938ac8c09", 1);
            await loadItems();
        } catch (err) {
            console.error("borrow failed", err);
        }
    }

    return (
        <div>
            <h1>Inventory Page</h1>

            {items.map((item) => (
                <div key={item.id}>
                    <p>{item.name}</p>
                    <p>{item.availableQuantity}</p>

                    <button onClick={() => handleBorrow(item.id)}>
                        Borrow
                    </button>
                </div>
            ))}
        </div>
    );
}