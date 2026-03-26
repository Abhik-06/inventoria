type Props = {
    item: any;
    onBorrow: (id: string) => void;
}

export default function ItemCard({item, onBorrow}: Props ) {
    return (
        <div>
            <p>{item.name}</p>
            <p>{item.availableQuantity}</p>

            <button onClick={() => onBorrow(item.id)}>
                Borrow
            </button>
        </div>
    )
}