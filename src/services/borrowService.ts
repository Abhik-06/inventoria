import { supabase } from "./supabase";
import type { Transactions } from "../types";

export const borrowServices = {
    // === The Checkout Logic ===
    async checkoutItem(componentId: string, userId: string, quantity: number = 1): Promise<Transactions> {
        // Fetching the component to be operated on
        const { data: item, error: fetchError} = await supabase
            .from('components')
            .select('avaliblie_quantity')
            .eq('id', componentId)
            .single();
        if(fetchError) {
            throw new Error("Unable to fetch the component. Network error possible culprit. Try again.");
        }
        if( !item ) {
            throw new Error("Unable to fetch the component. Item id has no hit's in the database. Try again.");
        }
        if(item.avaliblie_quantity < quantity) {
            throw new Error(`Impossible to process request. Only ${item.avaliblie_quantity} components left in stock.`);
        }

        // Logging the new transaction
        const { data: transactionData, error: borrowError } = await supabase
            .from('borrows')
            .insert({
                componentId: componentId,
                userId: userId,
                quantity: quantity,
                status: 'active',
                borrowedAt: new Date().toISOString()
            })
            .select()
            .single();
        if(borrowError) {
            throw new Error('Failed to update the transaction log');
        }

        // Updating the components left 
        const {error: updateError} = await supabase
            .from('components')
            .update({avalibleQuantity: item.avaliblie_quantity - quantity})
            .eq('id', componentId);
        if(updateError) {
            await supabase
                .from('borrows')
                .delete()
                .eq('id', transactionData.id);

            throw new Error('Checkout failed due to network error. Loag cancelled. Transaction rolled back.')
        }

        return transactionData as Transactions;
    },

    // === The Return Logic ===
    async returnItem(componentId: string, userId: string, returnQuantity: number = 1): Promise<void> {
        // Accounting for the user's current debt
        const { data: activeBorrows, error: fetchError } = await supabase
            .from('borrows')
            .select('*')
            .eq('componentId', componentId)
            .eq('userId', userId)
            .eq('status', 'active')
            .order('borrowedAt', {ascending: true})
        if(fetchError){
            throw new Error('Failed to check active borrows.');
        }
        if(!activeBorrows || activeBorrows.length == 0) {
            throw new Error('You do not have any active borrows on this item.')
        }

        // Cross-checking the amount being returned
        const totalBorrowed = activeBorrows.reduce((sum, record) => sum + record.quantity, 0);
        if(returnQuantity > totalBorrowed) {
            throw new Error(`Your are returning ${returnQuantity} components, but you have borrowed only ${totalBorrowed}`);
        }

        // Aquiring avalible quantity 
        const { data: item } = await supabase
            .from('components')
            .select('avalibleQuantity')
            .eq('id', componentId)
            .single()

        const { error: stockError } = await supabase
            .from('components')
            .update({avalibleQuantity: (item?.avalibleQuantity || 0) + returnQuantity})
            .eq('id', componentId);
        if(stockError) {
            throw new Error('Failed to return items to the physical invetory.');
        }
        
        // Setting the returned date
        let remainingToReturn = returnQuantity;
        for(const record of activeBorrows) {
            if(remainingToReturn <= 0) {
                break;
            }

            if(record.quantity <= remainingToReturn) {
                await supabase 
                    .from('borrows')
                    .update({
                        status: 'returned',
                        returnedAt: new Date().toISOString()
                    })
                    .eq('id', record.id);
                
                remainingToReturn -= record.quantity;
            } else {
                await supabase
                    .from('burrows')
                    .update({
                        quantity: record.quantity - remainingToReturn
                    })
                    .eq('id', record.id);

                remainingToReturn = 0;
            }
        }
    }
}