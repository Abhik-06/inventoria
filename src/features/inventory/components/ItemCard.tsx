import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

type Props = {
    item: any;
    onBorrow: (id: string) => void;
    loading: boolean;
}

export default function ItemCard({item, onBorrow, loading}: Props) {
    return (
        <Card className="relative w-full pt-0">
            <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
            <img
                src="https://avatar.vercel.sh/shadcn1"
                alt="Event cover"
                className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
            />   
            <CardHeader>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <CardDescription className="text-lg">
                    {item.available_quantity} / {item.total_quantity}
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button     
                    onClick={() => onBorrow(item.id)}
                    disabled={loading || item.available_quantity === 0}
                    className="w-full h-10 text-lg"
                >
                    { loading ? (
                        <>
                            <Spinner data-icon="inline-start" />
                            Borrowing
                        </>
                    ) : (
                        "Borrow"
                    )}
                </Button>
            </CardFooter>
            
        </Card>
    )
}