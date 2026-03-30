import { RiAddLine, RiSubtractLine } from "@remixicon/react";
import { Button } from "./ui/button";
import { ButtonGroup, ButtonGroupText } from "./ui/button-group";

type Props = {
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
}

export default function QuantitySelector({value, onChange, min = 1, max = 999}: Props) {
    return (
        <ButtonGroup>    
            <Button
                size="sm"
                variant="outline"
                onClick={() => onChange(Math.max(min, value - 1))}
                disabled={value <= min}
            >
                <RiSubtractLine />
            </Button>

            <ButtonGroupText className="min-w-10 justify-center">
                {value}
            </ButtonGroupText>

            <Button
                size="sm"
                variant="outline"
                onClick={() => onChange(Math.min(max, value + 1))}
                disabled={value >= max}
            >
                <RiAddLine />
            </Button>
        </ButtonGroup>
    )
}