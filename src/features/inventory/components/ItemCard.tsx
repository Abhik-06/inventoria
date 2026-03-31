import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useState, useEffect } from "react";
import QuantitySelector from "@/components/QuantitySelector";
import { useNavigate } from "react-router-dom";

type Props = {
    item: any;
    onBorrow: (id: string, quantity: number) => void;
    loading: boolean;
}

export default function ItemCard({item, onBorrow, loading}: Props) {
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate()

    useEffect(() => {
        if (quantity > item.available_quantity) {
            setQuantity(item.available_quantity || 1);
        }
    }, [item.available_quantity])

    return (
        <Card className="relative w-full pt-0">
            <div onClick={() => navigate(`${item.id}`)} className="absolute inset-0 z-30 aspect-video bg-black/35 cursor-pointer" />
            <img
                src={ item.image_url || "https://avatar.vercel.sh/shadcn1" }
                alt={ item.name}
                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />   
            <CardHeader>
                <CardTitle 
                    onClick={() => navigate(`${item.id}`)} 
                    className="text-lg cursor-pointer hover:underline"
                >
                    {item.name}
                </CardTitle>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <CardDescription className="text-lg whitespace-nowrap">
                        {item.available_quantity} / {item.total_quantity}
                    </CardDescription>
                    <QuantitySelector 
                        value={quantity}
                        onChange={setQuantity}
                        min={1}
                        max={item.available_quantity}
                    />
                </div>
            </CardHeader>
            <CardFooter>
                <Button     
                    onClick={() => onBorrow(item.id, quantity)}
                    disabled={loading || item.available_quantity === 0 || quantity > item.available_quantity}
                    className="w-full h-10 text-lg"
                >
                    { loading ? (
                        <>
                            <Spinner data-icon="inline-start" />
                            Borrowing
                        </>
                    ) : item.available_quantity === 0 ? (
                        "Out of stock"
                    ) : (
                        "Borrow"
                    )}
                </Button>
            </CardFooter>
            
        </Card>
    )
}