import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type BorrowPanelProps = {
    maxQuantity: number;
    onBorrow: (quantity: number) => void;
    onReturn: (quantity: number) => void;
};

type Mode = "borrow" | "return";

export function BorrowPanel({ maxQuantity, onBorrow, onReturn }: BorrowPanelProps) {

    const [quantity, setQuantity] = useState(1);
    const [mode, setMode] = useState<Mode>("borrow");

    function handleAction() {
        if (mode === "borrow") {
            onBorrow(quantity);
        } else {
            onReturn(quantity);
        }
    }

    return (
        <Card>
            <CardContent className="p-4 space-y-4">

                {/* Mode Toggle */}
                <div className="flex gap-2">
                    <Button
                        variant={mode === "borrow" ? "default" : "secondary"}
                        className="flex-1"
                        onClick={() => setMode("borrow")}
                    >
                        Borrow
                    </Button>

                    <Button
                        variant={mode === "return" ? "default" : "secondary"}
                        className="flex-1"
                        onClick={() => setMode("return")}
                    >
                        Return
                    </Button>
                </div>

                {/* Quantity Input */}
                <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">
                        Quantity
                    </label>

                    <Input
                        type="number"
                        min={1}
                        max={maxQuantity}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                </div>

            </CardContent>

            <CardFooter>
                <Button
                    className="w-full"
                    onClick={handleAction}
                >
                    {mode === "borrow" ? "Confirm Borrow" : "Confirm Return"}
                </Button>
            </CardFooter>
        </Card>
    );
}
