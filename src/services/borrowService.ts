import { supabase } from "./supabase";
import type { Transactions } from "../types";
import { keysToCamel, keysToSnake } from "../utils/caseConverter"; 

export const borrowServices = {
    // === The Checkout Logic ===
    async checkoutItem(componentId: string, userId: string, quantity: number = 1): Promise<Transactions> {
        
        // 1. Fetching the component
        const { data: rawItem, error: fetchError} = await supabase 
            .from('components')
            .select('available_quantity') 
            .eq('id', componentId)
            .single();
            
        if(fetchError || !rawItem) {
            throw new Error("Unable to fetch the component. Try again.");
        }

        // Translate incoming DB data
        const item = keysToCamel(rawItem); 

        if(item.availableQuantity < quantity) { 
            throw new Error(`Only ${item.availableQuantity} components left.`);
        }

        // 2. Logging the new transaction
        const newTransaction = {
            componentId: componentId,
            userId: userId,
            quantity: quantity,
            status: 'active',
            borrowedAt: new Date().toISOString()
        };

        const { data: rawTxData, error: borrowError } = await supabase
            .from('borrows')
            .insert(keysToSnake(newTransaction)) 
            .select()
            .single();
            
        if(borrowError) {
            throw new Error('Failed to update the transaction log');
        }

        // 3. Updating physical inventory
        const stockUpdate = { availableQuantity: item.availableQuantity - quantity }; 

        const { error: updateError } = await supabase
            .from('components')
            .update(keysToSnake(stockUpdate))
            .eq('id', componentId);
            
        if(updateError) {
            await supabase.from('borrows').delete().eq('id', rawTxData.id);
            throw new Error('Checkout failed. Transaction rolled back.');
        }

        // Translate the final output for the UI
        return keysToCamel(rawTxData) as Transactions; 
    },

    // === The Return Logic ===
    async returnItem(componentId: string, userId: string, returnQuantity: number = 1): Promise<void> {
        
        // 1. Accounting for the user's current debt
        const { data: rawBorrows, error: fetchError } = await supabase 
            .from('borrows')
            .select('*')
            .eq('component_id', componentId) 
            .eq('user_id', userId)
            .eq('status', 'active')
            .order('borrowed_at', { ascending: true });
            
        if(fetchError || !rawBorrows || rawBorrows.length === 0){
            throw new Error('You do not have any active borrows on this item.');
        }

        // Translate the entire array of borrows
        const activeBorrows = keysToCamel(rawBorrows); 

        const totalBorrowed = activeBorrows.reduce((sum: number, record: any) => sum + record.quantity, 0);
        if(returnQuantity > totalBorrowed) {
            throw new Error(`You are returning ${returnQuantity}, but only borrowed ${totalBorrowed}`);
        }

        // 2. Acquiring available quantity 
        const { data: rawItem, error: stockFetchError } = await supabase 
            .from('components')
            .select('available_quantity')
            .eq('id', componentId)
            .single();
            
        if(stockFetchError || !rawItem) {
            throw new Error('Failed to verify current physical inventory.');
        }

        const item = keysToCamel(rawItem); // Translate incoming data

        const stockUpdate = { availableQuantity: item.availableQuantity + returnQuantity }; 

        const { error: stockError } = await supabase
            .from('components')
            .update(keysToSnake(stockUpdate)) // Translate update payload
            .eq('id', componentId);
            
        if(stockError) {
            throw new Error('Failed to return items to the physical inventory.');
        }
        
        // 3. Setting the returned date
        let remainingToReturn = returnQuantity;
        
        for(const record of activeBorrows) { // activeBorrows is already camelCase here
            if(remainingToReturn <= 0) break;

            if(record.quantity <= remainingToReturn) {
                // Fully return this record
                const returnPayload = {
                    status: 'returned',
                    returnedAt: new Date().toISOString()
                };

                await supabase 
                    .from('borrows')
                    .update(keysToSnake(returnPayload)) 
                    .eq('id', record.id);
                
                remainingToReturn -= record.quantity;
            } else {
                // Partial return
                const partialPayload = { 
                    quantity: record.quantity - remainingToReturn
                };

                await supabase
                    .from('borrows') 
                    .update(keysToSnake(partialPayload)) // Translate update payload
                    .eq('id', record.id);

                remainingToReturn = 0;
            }
        }
    }
};