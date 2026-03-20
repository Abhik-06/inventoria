import { supabase } from "./supabase";
import type { ComponentItem } from '../types';

export const inventoryService = {
    async getAllComponents(): Promise<ComponentItem[]> {
        const {data, error} = await supabase
            .from('components')
            .select('*')
            .order('name', { ascending : true });
        
        if( error ) {
            console.log("Error encountered at getAllComponents ", error.message);
            throw new Error('Could not load the inventory. Please try again.');
        }

        return ( data || [] ) as ComponentItem[];
    },

    async getComponentById(id: string): Promise<ComponentItem | null> {
        const {data, error} = await supabase
            .from('components')
            .select('*')
            .eq('id', id)
            .single();

        if( error ) {
            console.log(`Error at getComponentById - id: ${id} `, error.message);
            return null
        }

        return data as ComponentItem;
    }
};